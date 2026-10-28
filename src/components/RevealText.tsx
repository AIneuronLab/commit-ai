import { motion, useReducedMotion } from 'motion/react';
import { EASE_OUT } from '../motion';

type Part = { text: string; className?: string };

/**
 * Title that rises word by word out of a clipped line. Real text stays in the DOM for screen readers,
 * and nothing moves when the system asks for reduced motion.
 * `immediate`: play on load (hero) instead of when scrolled into view.
 */
export function RevealText({ parts, immediate = false, delay = 0 }: { parts: Part[]; immediate?: boolean; delay?: number }) {
  const reduce = useReducedMotion();
  const label = parts.map((p) => p.text).join(' ').replace(/\s+/g, ' ').trim();
  if (reduce) return <>{parts.map((p, i) => <span key={i} className={p.className}>{i > 0 ? ' ' : ''}{p.text}</span>)}</>;

  let n = 0;
  return (
    <>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">
      {parts.map((p, pi) =>
        p.text.trim().split(/\s+/).map((w, wi) => {
          const i = n++;
          const motionProps = immediate
            ? { animate: { y: 0 } }
            : { whileInView: { y: 0 }, viewport: { once: true, margin: '-8% 0px' } };
          return (
            <span key={`${pi}-${wi}`} className={p.className}>
              <span className="inline-block overflow-hidden pb-[0.14em] align-bottom -mb-[0.14em]">
                <motion.span
                  className="inline-block"
                  initial={{ y: '115%' }}
                  {...motionProps}
                  transition={{ duration: 0.75, delay: delay + i * 0.04, ease: EASE_OUT }}
                >
                  {w}
                </motion.span>
              </span>{' '}
            </span>
          );
        }),
      )}
      </span>
    </>
  );
}
