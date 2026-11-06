import { useEffect, useRef } from 'react';
import { Logo } from '../brand/Logo';
import { useApp } from '../i18n';

/**
 * The opening scene: the 3D logo assembling itself (see three/logoScene.ts). three.js is loaded only after the
 * page has appeared; until then, or if WebGL is unavailable, the 2D logo sits in the middle of the screen.
 */
export function LogoScene() {
  const { t } = useApp();
  const host = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;
    import('../three/logoScene')
      .then(({ startLogoScene }) => {
        if (cancelled || !host.current || !canvas.current || !hint.current) return;
        try {
          stop = startLogoScene(host.current, canvas.current, hint.current);
          canvas.current.classList.remove('opacity-0');
        } catch {
          /* no WebGL: the 2D logo stays */
        }
      })
      .catch(() => {});
    return () => { cancelled = true; stop?.(); };
  }, []);

  return (
    <section id="top" ref={host} aria-label="Commit·AI" className="force-dark relative h-[100svh] min-h-[480px] cursor-pointer touch-pan-y overflow-hidden bg-night">
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center"><Logo size={88} variant="dark" animated /></div>
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 block size-full opacity-0 transition-opacity duration-500" />
      <div ref={hint} aria-hidden="true" className="logo-hint">
        <i />{t.hero.scroll}
      </div>
    </section>
  );
}
