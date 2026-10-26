import { motion, useReducedMotion } from 'motion/react';
import { EASE_LOOP, EASE_OUT, FlowArrow, GrowBars, Reveal } from '../motion';
import { H2 } from '../components/ui';
import { useApp } from '../i18n';

function IllusNeed() {
  const reduce = useReducedMotion();
  return (
    <svg width="150" height="110" viewBox="0 0 150 110" fill="none" aria-hidden="true">
      <rect x="18" y="30" width="44" height="56" rx="6" className="fill-line" transform="rotate(-10 40 58)" />
      <rect x="40" y="22" width="44" height="56" rx="6" className="fill-accent-soft" transform="rotate(6 62 50)" />
      <rect x="62" y="34" width="44" height="56" rx="6" className="fill-line" transform="rotate(-4 84 62)" />
      <path d="M70 50h28M70 58h22M70 66h26" className="stroke-muted" strokeWidth="2.4" strokeLinecap="round" />
      <motion.g animate={reduce ? undefined : { y: [0, -6, 0], rotate: [0, 6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: EASE_LOOP }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <path d="M104 18c10-8 26-2 24 10-1 8-10 9-12 15" className="stroke-warn" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        <circle cx="116" cy="52" r="2.6" className="fill-warn" />
      </motion.g>
    </svg>
  );
}

function IllusBuild() {
  const reduce = useReducedMotion();
  const cells: [number, number, string][] = [[30, 20, '#4FC3F7'], [62, 20, '#67E8F9'], [94, 20, '#1565C0'], [30, 52, '#1565C0'], [62, 52, '#67E8F9'], [94, 52, '#2196F3']];
  return (
    <svg width="150" height="110" viewBox="0 0 150 110" fill="none" aria-hidden="true">
      {cells.map(([x, y, c], i) => (
        <motion.rect key={i} x={x} y={y} width="26" height="26" rx="6" fill={c} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={reduce ? undefined : { opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 0.9] }}
          transition={{ duration: 4, delay: i * 0.15, repeat: Infinity, times: [0.08, 0.18, 0.85, 1], ease: EASE_OUT }} />
      ))}
      <path d="M36 94h78" className="stroke-line-strong" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 94h52" stroke="#4FC3F7" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function How() {
  const { t } = useApp();
  const ills = [<IllusNeed key="n" />, <IllusBuild key="b" />, <GrowBars key="g" className="h-[90px] w-[150px]" values={[22, 32, 44, 56]} />];
  const tones = ['text-warn', 'text-accent', 'text-ok'];
  return (
    <section className="grad-section border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-9 px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <H2 className="max-w-[640px] lg:text-[44px]">{t.how.title}</H2>
          <p className="m-0 max-w-[360px] text-muted">{t.how.lead}</p>
        </div>
        <ol className="m-0 grid list-none items-stretch gap-1 p-0 lg:grid-cols-[1fr_56px_1fr_56px_1fr] lg:gap-0">
          {t.how.steps.map((s, i) => (
            <li key={s.k} className="contents">
              {i > 0 && <div aria-hidden="true" className="flex h-11 items-center justify-center max-lg:rotate-90 lg:h-auto"><FlowArrow className="h-6 w-10" /></div>}
              <Reveal delay={i * 0.12} className={`flex flex-col gap-3 rounded-[22px] border p-6 ${i === 1 ? 'tint-accent border-line-strong' : 'border-line bg-card-alt'}`}>
                {ills[i]}
                <span className={`font-mono text-[13px] ${tones[i]}`}>{s.k}</span>
                <h3 className="m-0 font-display text-[23px] leading-tight font-semibold">{s.t}</h3>
                <p className="m-0 text-[16px] text-muted">{s.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
