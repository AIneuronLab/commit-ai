/**
 * BayKat demo: a small app flow that plays while it is on screen, then loops.
 *   0. Aim       — the leaf drifts and focuses, a finger taps the shutter
 *   1. Scan      — flash, frame snaps onto the leaf, a scan line sweeps it
 *   2. Detect    — boxes are drawn around the lesions, a result sheet slides up (diagnosis + confidence)
 *   3. Action    — the sheet grows with the irrigation card, the tank fills
 * With reduced motion the final state is shown at once.
 */
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { Droplet } from 'lucide-react';
import { EASE_OUT } from '../motion';
import { PhoneFrame } from './Mockups';
import { useApp } from '../i18n';

const CIRC = 2 * Math.PI * 22;

/** Detection boxes around the three lesions, in the leaf's own 200×190 coordinates. */
const BOXES = [
  { x: 60, y: 76, w: 36, h: 32 },
  { x: 110, y: 64, w: 28, h: 28 },
  { x: 94, y: 110, w: 30, h: 28 },
];

function Ring({ active, reduce }: { active: boolean; reduce: boolean | null }) {
  const [v, setV] = useState(reduce ? 92 : 0);
  useEffect(() => {
    if (reduce) { setV(92); return; }
    if (!active) { setV(0); return; }
    const c = animate(0, 92, { duration: 1.1, delay: 0.35, ease: EASE_OUT, onUpdate: (x) => setV(Math.round(x)) });
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

function Leaf({ detected }: { detected: boolean }) {
  return (
    <svg viewBox="0 0 200 190" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="bk-leaf" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#86efac" />
          <stop offset="0.55" stopColor="#22a363" />
          <stop offset="1" stopColor="#0b5d3b" />
        </linearGradient>
        <filter id="bk-blur"><feGaussianBlur stdDeviation="3.2" /></filter>
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
      {BOXES.map((b, i) => (
        <g key={i}>
          <motion.rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="5"
            fill="#fbbf24"
            stroke="#fbbf24"
            strokeWidth="2"
            initial={false}
            animate={detected ? { pathLength: 1, fillOpacity: 0.16, opacity: 1 } : { pathLength: 0, fillOpacity: 0, opacity: 0 }}
            transition={{ duration: 0.55, delay: detected ? i * 0.22 : 0, ease: EASE_OUT }}
          />
          <motion.g
            initial={false}
            animate={{ opacity: detected ? 1 : 0, scale: detected ? 1 : 0.3 }}
            transition={{ duration: 0.3, delay: detected ? 0.35 + i * 0.22 : 0, ease: EASE_OUT }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <circle cx={b.x} cy={b.y} r="6.5" fill="#fbbf24" />
            <text x={b.x} y={b.y + 2.6} textAnchor="middle" fontSize="8" fontWeight="700" fill="#1c1200" fontFamily="inherit">{i + 1}</text>
          </motion.g>
        </g>
      ))}
    </svg>
  );
}

const Corner = ({ className }: { className: string }) => <span aria-hidden="true" className={`absolute size-4 border-brand-core ${className}`} />;

export function BayKatDemo({ frameClass = '' }: { frameClass?: string }) {
  const { t } = useApp();
  const reduce = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const inView = useInView(host, { amount: 0.35 });
  const [phase, setPhase] = useState(reduce ? 3 : 0);
  const [cycle, setCycle] = useState(0); // remounts the camera and shutter so their intro replays on every loop

  useEffect(() => {
    if (reduce) { setPhase(3); return; }
    if (!inView) return;
    let alive = true;
    const ids: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setCycle((c) => c + 1);
      setPhase(0);
      ids.push(
        setTimeout(() => setPhase(1), 1900),
        setTimeout(() => setPhase(2), 3900),
        setTimeout(() => setPhase(3), 6000),
        setTimeout(() => alive && run(), 10800),
      );
    };
    run();
    return () => { alive = false; ids.forEach(clearTimeout); };
  }, [inView, reduce]);

  const step = phase === 0 ? 0 : phase <= 2 ? 1 : 2;
  const hint = phase === 0 ? t.baykat.aim : phase === 1 ? t.baykat.analysing : t.baykat.detected;
  const tight = phase >= 1;

  return (
    <div ref={host} className="flex w-full flex-col items-center">
      <PhoneFrame className={frameClass}>
        <div role="img" aria-label={t.baykat.label} className="relative flex h-full flex-col px-3.5 pt-10 pb-3 text-fg">
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

          <div className="relative mt-2 h-[40%] shrink-0 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_40%,#12392b,#04100b)]">
            <motion.div
              key={cycle}
              className="absolute inset-[12%]"
              initial={reduce ? false : { filter: 'blur(5px)', scale: 0.94, rotate: -3 }}
              animate={{ filter: 'blur(0px)', scale: phase === 0 ? 1.04 : 1, rotate: phase === 0 ? 2 : 0 }}
              transition={{ duration: phase === 0 ? 1.9 : 0.5, ease: EASE_OUT }}
            >
              <Leaf detected={phase >= 2} />
            </motion.div>

            <motion.div
              aria-hidden="true"
              className="absolute"
              initial={false}
              animate={{ top: tight ? 16 : 8, left: tight ? 16 : 8, right: tight ? 16 : 8, bottom: tight ? 16 : 8 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              <Corner className="top-0 left-0 rounded-tl-md border-t-2 border-l-2" />
              <Corner className="top-0 right-0 rounded-tr-md border-t-2 border-r-2" />
              <Corner className="bottom-0 left-0 rounded-bl-md border-b-2 border-l-2" />
              <Corner className="right-0 bottom-0 rounded-br-md border-r-2 border-b-2" />
            </motion.div>

            {phase === 1 && !reduce && (
              <>
                <motion.span
                  key="flash"
                  aria-hidden="true"
                  className="absolute inset-0 bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.9, 0] }}
                  transition={{ duration: 0.4, times: [0, 0.2, 1] }}
                />
                <motion.span
                  key="scan"
                  aria-hidden="true"
                  className="absolute inset-x-3 h-0.5 rounded-full bg-brand-core shadow-[0_0_14px_3px_rgba(103,232,249,.7)]"
                  initial={{ top: '8%', opacity: 0 }}
                  animate={{ top: ['8%', '92%', '8%'], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.7, delay: 0.3, times: [0, 0.5, 1], ease: 'easeInOut' }}
                />
              </>
            )}

            <motion.span
              key={phase === 0 ? 'a' : phase === 1 ? 'b' : 'c'}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] whitespace-nowrap text-white"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {hint}
            </motion.span>
          </div>

          <div key={`shutter-${cycle}`} aria-hidden="true" className="relative mx-auto mt-3 flex size-12 items-center justify-center rounded-full border-2 border-fg/70">
            <motion.span
              className="size-9 rounded-full bg-fg"
              initial={false}
              animate={reduce ? undefined : { scale: [1, 1, 0.82, 1] }}
              transition={{ duration: 1.7, times: [0, 0.74, 0.84, 1] }}
            />
            {!reduce && (
              <motion.span
                className="absolute size-9 rounded-full border border-white/70 bg-white/35 shadow-lg backdrop-blur-[1px]"
                initial={{ x: 46, y: 38, opacity: 0, scale: 1 }}
                animate={{ x: [46, 0, 0, 0], y: [38, 0, 0, 0], opacity: [0, 1, 1, 0], scale: [1, 1, 0.8, 1] }}
                transition={{ duration: 1.7, times: [0, 0.55, 0.84, 1], ease: 'easeOut' }}
              />
            )}
          </div>

          <motion.div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-line-strong bg-card px-3 pt-2 pb-4 shadow-[0_-18px_40px_-18px_rgba(0,0,0,.55)]"
            initial={false}
            animate={{ y: phase >= 2 ? '0%' : '105%' }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <span aria-hidden="true" className="mx-auto mb-2 block h-1 w-9 rounded-full bg-line-strong" />
            <div className="flex items-center gap-3">
              <Ring active={phase >= 2} reduce={reduce} />
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[11px] font-medium text-warn">{t.baykat.diagnosis}</span>
                <b className="text-[13px] leading-tight">{t.baykat.disease}</b>
                <span className="text-[11px] leading-snug text-muted">{t.baykat.advice}</span>
              </div>
            </div>

            <motion.div
              className="overflow-hidden"
              initial={false}
              animate={{ height: phase >= 3 ? 'auto' : 0, opacity: phase >= 3 ? 1 : 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              <div className="mt-2.5 flex items-center gap-3 rounded-2xl border border-line-strong bg-accent-soft p-2.5">
                <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line-strong bg-card">
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 bg-brand-azure/55"
                    initial={false}
                    animate={{ height: phase >= 3 ? '88%' : '0%' }}
                    transition={{ duration: 1.3, delay: 0.35, ease: EASE_OUT }}
                  />
                  <Droplet className="relative size-5 fill-brand-azure text-brand-azure" />
                </span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="text-[11px] text-muted">{t.baykat.irrigation}</span>
                  <b className="text-[12.5px] leading-tight">{t.baykat.irrigationValue}</b>
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </PhoneFrame>
    </div>
  );
}
