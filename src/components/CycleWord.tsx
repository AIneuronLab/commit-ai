import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EASE_OUT } from '../motion';

/**
 * A word that changes every couple of seconds. All words share one grid cell so the line never jumps,
 * and the first word is already visible on first paint. Reduced motion: the first word only.
 */
export function CycleWord({ words, className = '' }: { words: readonly string[]; className?: string }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [reduce, words.length]);
  return (
    <>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true" className={`inline-grid overflow-hidden py-[0.2em] align-bottom -my-[0.2em] ${className}`}>
        {words.map((w, k) => (
          <motion.span
            key={w}
            className="col-start-1 row-start-1"
            initial={false}
            animate={reduce ? { y: k === 0 ? '0%' : '150%' } : { y: k === i ? '0%' : k === (i + words.length - 1) % words.length ? '-150%' : '150%' }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            {w}
          </motion.span>
        ))}
      </span>
    </>
  );
}
