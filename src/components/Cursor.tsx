import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'motion/react';
import { useMedia, DESKTOP_MOTION } from '../lib/useMedia';

/** A small dot that follows the mouse and swells over links and buttons. Large screens with a mouse only. */
export function Cursor() {
  const on = useMedia(DESKTOP_MOTION);
  const reduce = useReducedMotion();
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!on || reduce) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      setHover(!!(e.target as Element | null)?.closest?.('a, button, [role="button"], input, textarea, label'));
    };
    const leave = () => { x.set(-100); y.set(-100); };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => { window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave); };
  }, [on, reduce, x, y]);

  if (!on || reduce) return null;
  return (
    <motion.span aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[70] -mt-[3px] -ml-[3px] size-1.5 rounded-full bg-accent" style={{ x, y }} animate={{ scale: hover ? 2.6 : 1 }} transition={{ duration: 0.2 }} />
  );
}
