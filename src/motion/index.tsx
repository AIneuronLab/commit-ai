/**
 * Motion primitives built on `motion` (motion.dev, ex Framer Motion).
 * All respect prefers-reduced-motion.
 */
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

export const EASE_OUT = [0.2, 0.7, 0.2, 1] as const;
export const EASE_LOOP = [0.65, 0, 0.35, 1] as const;

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

/** Gentle vertical float, forever. */
export function Float({ children, className, distance = 8, duration = 6, delay = 0 }: { children: ReactNode; className?: string; distance?: number; duration?: number; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} animate={reduce ? undefined : { y: [0, -distance, 0] }} transition={{ duration, delay, repeat: Infinity, ease: EASE_LOOP }}>
      {children}
    </motion.div>
  );
}

/** Continuous rotation (dotted orbits). */
export function Orbit({ className, duration = 60, reverse = false, children }: { className?: string; duration?: number; reverse?: boolean; children?: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} animate={reduce ? undefined : { rotate: reverse ? -360 : 360 }} transition={{ duration, repeat: Infinity, ease: 'linear' }}>
      {children}
    </motion.div>
  );
}

/** Gradient text with a moving light sweep ("intelligente."). */
export function ShineText({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={`bg-[linear-gradient(100deg,#2196F3_0%,#67E8F9_25%,#4FC3F7_45%,#2196F3_70%,#67E8F9_100%)] bg-[length:220%_100%] bg-clip-text text-transparent light:bg-[linear-gradient(100deg,#1565C0_0%,#2196F3_25%,#0E7490_45%,#1565C0_70%,#2196F3_100%)] ${className}`}
      animate={reduce ? undefined : { backgroundPositionX: ['100%', '-120%'] }}
      transition={{ duration: 6, delay: 1, repeat: Infinity, ease: 'linear' }}
    >
      {children}
    </motion.span>
  );
}

/** Dashed arrow whose dashes travel forward (need → solution → result). */
export function FlowArrow({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 40 24" fill="none" aria-hidden="true" className={className}>
      <motion.path
        d="M2 12h32M26 4l8 8-8 8"
        className="stroke-accent"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 6"
        animate={reduce ? undefined : { strokeDashoffset: [0, -40] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  );
}

/** Bars grow + trend line draws, on loop. */
export function GrowBars({ values = [38, 52, 44, 66, 58, 74, 62, 88, 70, 96, 84, 100], className = '' }: { values?: number[]; className?: string }) {
  const reduce = useReducedMotion();
  const W = 320, H = 124, base = H - 4, step = W / values.length, bw = step * 0.6;
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${(i * step + step / 2).toFixed(1)} ${(base - v * 0.66 - 10).toFixed(1)}`).join(' ');
  const loop = { duration: 5, repeat: Infinity, ease: EASE_OUT, times: [0, 0.3, 0.85, 1] };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gbA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4FC3F7" />
          <stop offset="1" stopColor="#1565C0" />
        </linearGradient>
      </defs>
      {values.map((v, i) => (
        <motion.rect
          key={i}
          x={i * step + (step - bw) / 2}
          y={base - v}
          width={bw}
          height={v}
          rx={3}
          fill="url(#gbA)"
          opacity={0.55 + 0.45 * (i / (values.length - 1))}
          style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
          animate={reduce ? undefined : { scaleY: [0, 1, 1, 0] }}
          transition={{ ...loop, delay: i * 0.06 }}
        />
      ))}
      <motion.path
        d={line}
        fill="none"
        stroke="#67E8F9"
        strokeWidth={2}
        strokeLinecap="round"
        initial={false}
        animate={reduce ? undefined : { pathLength: [0, 1, 1, 0] }}
        transition={loop}
      />
    </svg>
  );
}

/* ---------------- Typing terminal ---------------- */
export type Seg = { text: string; className?: string };
export type Step = { kind: 'cmd' | 'out'; segs: Seg[] };

const segLen = (s: Seg[]) => s.reduce((n, x) => n + x.text.length, 0);
function slice(segs: Seg[], n: number) {
  const out: Seg[] = [];
  for (const s of segs) {
    if (n <= 0) break;
    out.push({ ...s, text: s.text.slice(0, n) });
    n -= s.text.length;
  }
  return out;
}

/** Commands typed letter by letter, outputs line by line, looping. */
export function TypingTerminal({ script, title = '~/parcours', label, typeMs = 65, lineMs = 300, holdMs = 6000, className = '' }: { script: Step[]; title?: string; label: string; typeMs?: number; lineMs?: number; holdMs?: number; className?: string }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState(0);
  const done = reduce || step >= script.length;

  useEffect(() => {
    if (reduce) return;
    let t: ReturnType<typeof setTimeout>;
    if (step >= script.length) t = setTimeout(() => { setStep(0); setChars(0); }, holdMs);
    else if (script[step].kind === 'out') t = setTimeout(() => setStep((s) => s + 1), lineMs);
    else if (chars < segLen(script[step].segs)) t = setTimeout(() => setChars((c) => c + 1), chars === 0 ? 400 : typeMs);
    else t = setTimeout(() => { setStep((s) => s + 1); setChars(0); }, 450);
    return () => clearTimeout(t);
  }, [reduce, step, chars, script, typeMs, lineMs, holdMs]);

  const lines = useMemo(() => (done ? script : script.slice(0, step + 1)), [done, script, step]);

  return (
    <figure className={`m-0 w-full max-w-[420px] overflow-hidden rounded-2xl border border-line bg-card-alt ${className}`} aria-label={label}>
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="size-2.5 rounded-full bg-brand" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="ml-2 font-mono text-xs text-muted">{title}</span>
      </div>
      <div className="flex min-h-[300px] flex-col gap-2 px-4 pt-4 pb-5 font-mono text-[12.5px] leading-normal">
        {lines.map((l, i) => {
          const current = !done && i === step;
          if (l.kind === 'out') {
            if (current) return null;
            return (
              <motion.div key={i} className="truncate whitespace-nowrap text-fg" initial={reduce ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                {l.segs.map((s, j) => <span key={j} className={s.className}>{s.text}</span>)}
              </motion.div>
            );
          }
          const segs = current ? slice(l.segs, chars) : l.segs;
          return (
            <div key={i} className="flex items-center whitespace-nowrap text-fg">
              <span className="text-ok">$&nbsp;</span>
              {segs.map((s, j) => <span key={j} className={s.className}>{s.text}</span>)}
              {current && <motion.span className="ml-1 inline-block h-4 w-2 bg-brand" animate={{ opacity: [1, 1, 0, 0] }} transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.5, 0.5, 1] }} />}
            </div>
          );
        })}
      </div>
    </figure>
  );
}
