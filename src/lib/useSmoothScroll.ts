import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useReducedMotion } from 'motion/react';
import { useMedia, DESKTOP_MOTION } from './useMedia';

/** Inertial scrolling + eased anchor jumps, large screens with a mouse only (phones keep native scrolling). */
export function useSmoothScroll() {
  const desktop = useMedia(DESKTOP_MOTION);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!desktop || reduce) return;
    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto'; // the CSS smooth-scroll would fight Lenis
    const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      const id = a?.getAttribute('href');
      if (!a || !id || id === '#') return;
      const el = document.querySelector(id) as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: id === '#top' ? 0 : -64, duration: 1.4 });
    };
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('click', onClick); cancelAnimationFrame(raf); lenis.destroy(); root.style.scrollBehavior = prevBehavior; };
  }, [desktop, reduce]);
}
