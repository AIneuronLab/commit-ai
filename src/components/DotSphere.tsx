import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useApp } from '../i18n';

/**
 * A slowly turning sphere of dots, drawn on a 2D canvas (a few KB, no WebGL).
 * It sits behind the portrait, so only its rim and back half show: a halo around the photo.
 * Pauses off screen; one still frame with reduced motion; tilts a little toward the mouse.
 */
export function DotSphere({ className = '' }: { className?: string }) {
  const { mode } = useApp();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const small = window.matchMedia('(max-width: 640px)').matches;
    const N = small ? 480 : 820;
    const pts: [number, number, number][] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = golden * i;
      pts.push([Math.cos(a) * r, y, Math.sin(a) * r]);
    }

    const dark = mode === 'dark';
    const rgb = dark ? '102,208,251' : '21,101,192';
    let w = 0, h = 0, dpr = 1;
    let visible = true;
    let raf = 0;
    let tiltX = 0, tiltY = 0, targetX = 0, targetY = 0;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const draw = (t: number) => {
      tiltX += (targetX - tiltX) * 0.06;
      tiltY += (targetY - tiltY) * 0.06;
      const ay = (reduce ? 0.6 : t * 0.00012) + tiltY * 0.5;
      const ax = 0.38 + tiltX * 0.35;
      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
      const R = Math.min(w, h) * 0.46;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const [px, py, pz] of pts) {
        const x1 = px * cy + pz * sy;
        const z1 = -px * sy + pz * cy;
        const y2 = py * cx - z1 * sx;
        const z2 = py * sx + z1 * cx;
        const depth = (z2 + 1) / 2;
        ctx.globalAlpha = 0.12 + depth * 0.7;
        ctx.fillStyle = `rgb(${rgb})`;
        ctx.beginPath();
        ctx.arc(w / 2 + x1 * R, h / 2 + y2 * R, (small ? 0.7 : 0.8) + depth * 1.35, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => { if (visible) draw(t); raf = requestAnimationFrame(loop); };

    size();
    const ro = new ResizeObserver(() => { size(); if (reduce) draw(0); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    const onMove = (e: PointerEvent) => {
      targetY = (e.clientX / window.innerWidth - 0.5) * 2;
      targetX = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (reduce) draw(0);
    else {
      raf = requestAnimationFrame(loop);
      window.addEventListener('pointermove', onMove, { passive: true });
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener('pointermove', onMove); };
  }, [mode, reduce]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
