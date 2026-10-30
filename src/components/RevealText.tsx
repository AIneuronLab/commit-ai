import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE_OUT } from '../motion';

type Part = { text: string; className?: string };

/**
 * Title that rises word by word out of a clipped line. Real text stays in the DOM for screen readers,
 * and nothing moves when the system asks for reduced motion.
 * `immediate`: play on load (hero) instead of when scrolled into view.
 */
export function RevealText({ parts, immediate = false, delay = 0 }: { parts: Part[]; immediate?: boolean; delay?: number }) {
  const reduce = useReducedMotion();
  // watch the (unclipped) wrapper: the words sit translated out of their clipping boxes, so they never count as visible themselves
  const box = useRef<HTMLSpanElement>(null);
  const seen = useInView(box, { once: true, margin: '-8% 0px' });
  const label = parts.map((p) => p.text).join(' ').replace(/\s+/g, ' ').trim();
  if (reduce) return <>{parts.map((p, i) => <span key={i} className={p.className}>{i > 0 ? ' ' : ''}{p.text}</span>)}</>;

  let n = 0;
  return (
    <>
      <span className="sr-only">{label}</span>
      <span ref={box} aria-hidden="true">
      {parts.map((p, pi) =>
        p.text.trim().split(/\s+/).map((w, wi) => {
          const i = n++;
          const motionProps = { animate: immediate || seen ? { y: 0 } : { y: '115%' } };
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
