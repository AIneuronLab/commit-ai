import { useEffect, useRef, useState } from 'react';
import { Logo } from '../brand/Logo';
import { useApp } from '../i18n';

/**
 * The opening scene: the 3D logo assembling itself (see three/logoScene.ts), played once when the page opens.
 * While three.js loads the screen stays night-blue, so the animation is seen only once; the 2D logo appears
 * only if the 3D scene cannot run (no WebGL, or the code failed to load).
 */
export function LogoScene() {
  const { t } = useApp();
  const host = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;
    import('../three/logoScene')
      .then(({ startLogoScene }) => {
        if (cancelled || !host.current || !canvas.current || !hint.current) return;
        try {
          stop = startLogoScene(host.current, canvas.current, hint.current);
        } catch {
          if (!cancelled) setFailed(true); // no WebGL
        }
      })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; stop?.(); };
  }, []);

  return (
    <section id="top" ref={host} aria-label="Commit·AI" className="force-dark relative h-[100svh] min-h-[480px] cursor-pointer touch-pan-y overflow-hidden bg-night">
      {failed && <div aria-hidden="true" className="absolute inset-0 grid place-items-center"><Logo size={88} variant="dark" animated /></div>}
      <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 block size-full ${failed ? 'hidden' : ''}`} />
      <div ref={hint} aria-hidden="true" className="logo-hint">
        <i />{t.hero.scroll}
      </div>
    </section>
  );
}
