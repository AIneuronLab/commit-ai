/**
 * BayKat demo: a one-shot, three-step story that plays when it scrolls into view.
 *   1. Photo     — viewfinder, shutter flash
 *   2. Diagnosis — heat-map blooms on the lesions, confidence ring fills, result card slides up
 *   3. Action    — irrigation card fills like a tank
 * It does not loop: "Replay" restarts it. With reduced motion the final state is shown at once.
 */
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { Droplet, RotateCcw } from 'lucide-react';
import { EASE_OUT } from '../motion';
import { PhoneFrame } from './Mockups';
import { useApp } from '../i18n';

const CIRC = 2 * Math.PI * 22;

function Ring({ active, reduce }: { active: boolean; reduce: boolean | null }) {
  const [v, setV] = useState(reduce ? 92 : 0);
  useEffect(() => {
    if (reduce) { setV(92); return; }
    if (!active) { setV(0); return; }
    const c = animate(0, 92, { duration: 1.1, ease: EASE_OUT, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [active, reduce]);
  return (
    <div className="relative size-14 shrink-0">
      <svg viewBox="0 0 56 56" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="28" cy="28" r="22" fill="none" strokeWidth="5" className="stroke-line" />
        <circle cx="28" cy="28" r="22" fill="none" strokeWidth="5" strokeLinecap="round" className="stroke-warn" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - v / 100)} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-[15px] font-bold tabular-nums">{v}%</span>
    </div>
  );
}

function Leaf({ heat }: { heat: boolean }) {
  return (
    <svg viewBox="0 0 200 190" className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <linearGradient id="bk-leaf" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#86efac" />
          <stop offset="0.55" stopColor="#22a363" />
          <stop offset="1" stopColor="#0b5d3b" />
        </linearGradient>
        <filter id="bk-blur"><feGaussianBlur stdDeviation="3.2" /></filter>
        <radialGradient id="bk-heat"><stop offset="0" stopColor="#f87171" stopOpacity=".95" /><stop offset=".55" stopColor="#fbbf24" stopOpacity=".5" /><stop offset="1" stopColor="#fbbf24" stopOpacity="0" /></radialGradient>
      </defs>
      <path d="M100 8 C 158 36, 184 100, 100 172 C 16 100, 42 36, 100 8 Z" fill="url(#bk-leaf)" />
      <path d="M100 172 L100 188" stroke="#0b5d3b" strokeWidth="5" strokeLinecap="round" />
      <g stroke="#bbf7d0" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M100 168 L100 18" />
        <path d="M100 130 C 80 120, 66 108, 56 90 M100 130 C 120 120, 134 108, 144 90" />
        <path d="M100 98 C 84 90, 74 78, 68 62 M100 98 C 116 90, 126 78, 132 62" />
        <path d="M100 66 C 90 60, 86 50, 86 40 M100 66 C 110 60, 114 50, 114 40" />
      </g>
      <g filter="url(#bk-blur)">
        <ellipse cx="78" cy="92" rx="11" ry="9" fill="#a16207" opacity=".85" />
        <ellipse cx="124" cy="78" rx="8" ry="7" fill="#92400e" opacity=".8" />
        <ellipse cx="108" cy="124" rx="9" ry="7" fill="#b45309" opacity=".75" />
      </g>
      {[[78, 92, 30], [124, 78, 24], [108, 124, 26]].map(([x, y, r], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          fill="url(#bk-heat)"
          style={{ mixBlendMode: 'screen', transformBox: 'fill-box', transformOrigin: 'center' }}
          initial={false}
          animate={{ opacity: heat ? 1 : 0, scale: heat ? 1 : 0.2 }}
          transition={{ duration: 0.7, delay: heat ? i * 0.18 : 0, ease: EASE_OUT }}
        />
      ))}
    </svg>
  );
}

const Corner = ({ className }: { className: string }) => <span aria-hidden="true" className={`absolute size-5 border-brand-core ${className}`} />;

export function BayKatDemo() {
  const { t } = useApp();
  const reduce = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const inView = useInView(host, { once: true, amount: 0.5 });
  const [phase, setPhase] = useState(reduce ? 3 : 0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduce) { setPhase(3); return; }
    if (!inView) return;
    setPhase(0);
    const ids = [setTimeout(() => setPhase(1), 1200), setTimeout(() => setPhase(2), 2100), setTimeout(() => setPhase(3), 3900)];
    return () => ids.forEach(clearTimeout);
  }, [inView, run, reduce]);

  const step = phase >= 3 ? 2 : phase === 2 ? 1 : 0;
  const hint = phase === 0 ? t.baykat.aim : phase === 1 ? t.baykat.analysing : t.baykat.captured;

  return (
    <div ref={host} className="flex flex-col items-center gap-4">
      <PhoneFrame>
        <div role="img" aria-label={t.baykat.label} className="flex h-full flex-col px-3.5 pt-10 pb-3 text-fg">
          <div className="flex items-center justify-between">
            <b className="font-display text-[17px]">BayKat</b>
            <span className="tint-ok rounded-full border px-2 py-0.5 text-[11px] text-ok">{t.baykat.online}</span>
          </div>

          <ol className="m-0 mt-2.5 flex list-none gap-1 p-0" aria-hidden="true">
            {t.baykat.steps.map((s, i) => (
              <li key={s} className="flex-1">
                <span className={`block h-1 rounded-full transition-colors duration-500 ${i <= step ? 'bg-brand-azure' : 'bg-line'}`} />
                <span className={`mt-1 block text-[11px] transition-colors duration-500 ${i === step ? 'font-semibold text-fg' : 'text-muted'}`}>{s}</span>
              </li>
            ))}
          </ol>

          <div className="relative mt-2 h-[36%] shrink-0 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_40%,#12392b,#04100b)]">
            <Leaf heat={phase >= 2} />
            <Corner className="top-2.5 left-2.5 rounded-tl-md border-t-2 border-l-2" />
            <Corner className="top-2.5 right-2.5 rounded-tr-md border-t-2 border-r-2" />
            <Corner className="bottom-2.5 left-2.5 rounded-bl-md border-b-2 border-l-2" />
            <Corner className="right-2.5 bottom-2.5 rounded-br-md border-r-2 border-b-2" />
            <motion.span
              key={`${run}-${phase === 0 ? 'a' : phase === 1 ? 'b' : 'c'}`}
              className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] whitespace-nowrap text-white"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {hint}
            </motion.span>
            {phase === 1 && !reduce && (
              <motion.span
                key={`flash-${run}`}
                aria-hidden="true"
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.95, 0] }}
                transition={{ duration: 0.45, times: [0, 0.2, 1] }}
              />
            )}
          </div>

          <motion.div
            className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-card p-3"
            initial={false}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 18 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            <Ring active={phase >= 2} reduce={reduce} />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[11px] font-medium text-warn">{t.baykat.diagnosis}</span>
              <b className="text-[13px] leading-tight">{t.baykat.disease}</b>
              <span className="text-[11px] leading-snug text-muted">{t.baykat.advice}</span>
            </div>
          </motion.div>

          <motion.div
            className="mt-2.5 flex items-center gap-3 rounded-2xl border border-line-strong bg-accent-soft p-3"
            initial={false}
            animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 18 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line-strong bg-card">
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 bg-brand-azure/55"
                initial={false}
                animate={{ height: phase >= 3 ? '88%' : '0%' }}
                transition={{ duration: 1.3, delay: 0.25, ease: EASE_OUT }}
              />
              <Droplet className="relative size-5 fill-brand-azure text-brand-azure" />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-[11px] text-muted">{t.baykat.irrigation}</span>
              <b className="text-[12.5px] leading-tight">{t.baykat.irrigationValue}</b>
            </span>
          </motion.div>
        </div>
      </PhoneFrame>

      <button
        onClick={() => { setPhase(0); setRun((r) => r + 1); }}
        disabled={phase < 3}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-[14px] font-medium text-soft transition hover:border-brand-azure hover:text-fg disabled:pointer-events-none disabled:opacity-0"
      >
        <RotateCcw className="size-4" /> {t.baykat.replay}
      </button>
    </div>
  );
}
