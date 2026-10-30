/**
 * Motion primitives built on `motion` (motion.dev, ex Framer Motion).
 * All respect prefers-reduced-motion.
 */
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

export const EASE_OUT = [0.2, 0.7, 0.2, 1] as const;

/** Fade + rise when the element scrolls into view. */
export function Reveal({ children, delay = 0, y = 28, className, ...rest }: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
