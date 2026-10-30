import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Bundles of thin blue light lines that sweep across the hero, pinch into a bright knot and open up again.
 * Canvas 2D with additive blending; the knot leans slightly towards the pointer on desktop.
 * Paused while off screen, a single still frame with reduced motion.
 */
export function Ribbons({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;

    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const draw = (t: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      const strands = w < 640 ? 26 : 52;
      const steps = 56;
      const knot = 0.64 + pointer.x * 0.04;           // where along the sweep the bundle pinches
      const cy = h * 0.5 + pointer.y * h * 0.04;
      const bundles = [
        { lift: 0, speed: 0.00028, scale: 1, hue: 205, alpha: 1 },
        { lift: 0.07, speed: -0.0002, scale: 0.78, hue: 192, alpha: 0.7 },
      ];

      for (const b of bundles) {
        for (let i = 0; i < strands; i++) {
          const d = (i / (strands - 1)) * 2 - 1;
          const core = 1 - Math.abs(d);
          const path: [number, number][] = [];
          for (let k = 0; k <= steps; k++) {
            const u = k / steps;
            const x = -w * 0.08 + u * w * 1.16;
            const sweep = Math.sin(u * 3.1 + t * b.speed) * h * 0.2 * (0.35 + u) - (u - 0.55) * h * 0.12;
            const thickness = (0.05 + 0.95 * Math.abs(Math.sin((u - knot) * Math.PI * 0.95))) * h * 0.2 * b.scale;
            const twist = Math.cos(u * 6.5 + t * b.speed * 1.8 + i * 0.04);
            const y = cy + b.lift * h + sweep + d * thickness * twist + Math.sin(u * 4 + d * 2.4 + t * b.speed * 1.4) * h * 0.025;
            path.push([x, y]);
          }
          const trace = () => { ctx.beginPath(); path.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); };
          // soft glow pass, then the crisp line
          trace(); ctx.lineWidth = 3.2; ctx.strokeStyle = `hsla(${b.hue}, 100%, 60%, ${0.035 * b.alpha})`; ctx.stroke();
          trace(); ctx.lineWidth = 1; ctx.strokeStyle = `hsla(${b.hue}, 95%, ${64 + core * 22}%, ${(0.07 + 0.3 * core * core) * b.alpha})`; ctx.stroke();
        }
      }

      // bright knot
      const kx = -w * 0.08 + knot * w * 1.16;
      const g = ctx.createRadialGradient(kx, cy, 0, kx, cy, h * 0.28);
      g.addColorStop(0, 'rgba(160,220,255,0.35)'); g.addColorStop(0.4, 'rgba(33,150,243,0.12)'); g.addColorStop(1, 'rgba(33,150,243,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    };

    resize();
    const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(cv);

    if (reduce) {
      draw(5000);
    } else {
      window.addEventListener('pointermove', onMove, { passive: true });
      const tick = (t: number) => { if (visible) draw(t); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    }
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); ro.disconnect(); io.disconnect(); };
  }, [reduce]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
