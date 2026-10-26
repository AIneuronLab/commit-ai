import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

/** Counts from 0 to `to` the first time it scrolls into view (final value straight away with reduced motion). */
export function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);

  useEffect(() => {
    if (reduce) { setV(to); return; }
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: [0.2, 0.7, 0.2, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, reduce]);

  return <span ref={ref}>{prefix}{v}{suffix}</span>;
}
