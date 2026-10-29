import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { LOGO_DARK, LOGO_LIGHT } from './logoData';

type Variant = 'dark' | 'light';

type MarkProps = {
  /** px size (the mark is square) */
  size?: number;
  /** 'dark' = for dark backgrounds, 'light' = for white backgrounds */
  variant?: Variant;
  /** blocks assemble ring by ring + the cyan core breathes */
  animated?: boolean;
  className?: string;
  title?: string;
};

/**
 * Commit·AI symbol — the blue blocks "C" with the glowing cyan core.
 * Pure SVG + React (no image file), animated with `motion`.
 */
export function LogoMark({ size = 40, variant = 'dark', animated = false, className, title = 'Commit·AI' }: MarkProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const reduce = useReducedMotion();
  const data = variant === 'dark' ? LOGO_DARK : LOGO_LIGHT;
  const anim = animated && !reduce;

  return (
    <svg
      viewBox="10 10 180 180"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        <filter id={`${uid}g`} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id={`${uid}h`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id={`${uid}b`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#000" floodOpacity={data.shadowOpacity} />
        </filter>
        <linearGradient id={`${uid}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={data.core[0]} />
          <stop offset="1" stopColor={data.core[1]} />
        </linearGradient>
        {data.blocks.map(([, , , , a, b], i) => (
          <linearGradient key={i} id={`${uid}q${i}`} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        ))}
      </defs>

      {variant === 'dark' && <circle cx="100" cy="100" r="62" fill="#2196F3" opacity={0.1} filter={`url(#${uid}h)`} />}

      {data.blocks.map(([x, y, w, rx], i) => {
        const ring = i < 14 ? 0 : i < 26 ? 1 : 2;
        return (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={w}
            rx={rx}
            fill={`url(#${uid}q${i})`}
            filter={`url(#${uid}b)`}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={anim ? { opacity: 0, scale: 0.3 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: ring * 0.18 + (i % 14) * 0.025, ease: [0.2, 0.7, 0.2, 1] }}
          />
        );
      })}

      {/* glowing core */}
      <motion.rect
        x="86.5" y="86.5" width="27" height="27" rx="6.9"
        fill="#67E8F9"
        filter={`url(#${uid}g)`}
        initial={{ opacity: variant === 'dark' ? 0.75 : 0.3 }}
        animate={anim ? { opacity: variant === 'dark' ? [0.45, 0.9, 0.45] : [0.2, 0.45, 0.2] } : undefined}
        transition={anim ? { duration: 3, repeat: Infinity, ease: [0.65, 0, 0.35, 1] } : undefined}
      />
      <motion.rect
        x="88.5" y="88.5" width="23" height="23" rx="6"
        fill={`url(#${uid}c)`}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        initial={anim ? { opacity: 0, scale: 0.2 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
      />
      <rect x="91" y="90.5" width="18" height="4.6" rx="2.4" fill="#fff" opacity={0.35} />
    </svg>
  );
}

/** Symbol + "Commit·AI" wordmark. "·AI" is always brand blue #2196F3. */
export function Logo({ size = 36, variant = 'dark', animated = false, className = '' }: MarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} variant={variant} animated={animated} />
      <span
        className={`font-logo font-bold tracking-tight ${variant === 'dark' ? 'text-white' : 'text-ink'}`}
        style={{ fontSize: size * 0.56 }}
      >
        Commit<span className="text-brand">·AI</span>
      </span>
    </span>
  );
}
