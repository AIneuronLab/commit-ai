import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EASE_OUT } from '../motion';

/**
 * A word that changes every couple of seconds with a short cross-fade. All words share one grid cell so the line
 * never jumps, and the first word is already visible on first paint. Reduced motion: the first word only.
 */
export function CycleWord({ words, className = '' }: { words: readonly string[]; className?: string }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [reduce, words.length]);
  const prev = (i + words.length - 1) % words.length;
  return (
    <>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true" className={`inline-grid ${className}`}>
        {words.map((w, k) => {
          const on = reduce ? k === 0 : k === i;
          return (
            <motion.span
              key={w}
              className="col-start-1 row-start-1"
              initial={false}
              animate={{ opacity: on ? 1 : 0, y: on ? 0 : k === prev ? -10 : 10, filter: on ? 'blur(0px)' : 'blur(6px)' }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
            >
              {w}
            </motion.span>
          );
        })}
      </span>
    </>
  );
}
