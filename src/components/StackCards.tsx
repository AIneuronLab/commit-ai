import { useState, type PointerEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Measure } from './ui';
import { STACK, type StackGroup } from '../data/stack';
import { useMedia } from '../lib/useMedia';
import { useApp } from '../i18n';

/** Two letters for a card without a logo: one from each of the first two words, or the first two of a single word. */
const initials = (n: string) => {
  const w = n.replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
  return (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 2)).toUpperCase();
};

/**
 * The stack as cards: a filter per category, then one card per tool with its logo, what it is used for and a
 * five-dot level. With a mouse, a card tilts toward the pointer and a soft light follows it. Cards rise in as
 * they scroll into view, and again when the filter changes.
 */
export function StackCards() {
  const { t, lang } = useApp();
  const s = t.stack;
  const reduce = useReducedMotion();
  const tilt = useMedia('(hover: hover) and (pointer: fine)') && !reduce;
  const [group, setGroup] = useState<StackGroup | 'all'>('all');
  const groups = [...new Set(STACK.map((x) => x.group))];
  const shown = STACK.filter((x) => group === 'all' || x.group === group);

  const move = (e: PointerEvent<HTMLElement>) => {
    if (!tilt) return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`); el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    el.style.setProperty('--ry', `${((x - 0.5) * 14).toFixed(2)}deg`); el.style.setProperty('--rx', `${((0.5 - y) * 12).toFixed(2)}deg`);
  };
  const leave = (e: PointerEvent<HTMLElement>) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); };

  const tab = (id: StackGroup | 'all', label: string) => (
    <li key={id}>
      <button type="button" aria-pressed={group === id} onClick={() => setGroup(id)}
        className="rounded-full border border-line px-4 py-2.5 text-[14px] font-medium text-soft transition hover:border-glow hover:text-fg aria-pressed:border-glow aria-pressed:bg-glow aria-pressed:text-night">
        {label}
      </button>
    </li>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <Measure>{s.title}</Measure>
        <p className="m-0 max-w-[520px] text-[17px] leading-[1.6] text-soft">{s.lead}</p>
      </div>
      <ul aria-label={s.filter} className="m-0 flex list-none flex-wrap justify-center gap-2 p-0">
        {tab('all', s.all)}
        {groups.map((g) => tab(g, s.groups[g]))}
      </ul>
      <ul key={group} className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 p-0 [perspective:1000px]">
        {shown.map((x, i) => {
          const lv = Math.max(1, Math.min(5, x.level));
          return (
            <motion.li
              key={x.name}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <article tabIndex={0} onPointerMove={move} onPointerLeave={leave} className="stack-card">
                <div className="flex items-center justify-between gap-3">
                  <div className="stack-logo">
                    {x.icon ? <img src={`/stack/${x.icon}.svg`} alt="" width={34} height={34} loading="lazy" /> : <span>{initials(x.name)}</span>}
                  </div>
                  <span className="rounded-full border border-line px-2.5 py-1 text-[12px] whitespace-nowrap text-accent">{s.groups[x.group]}</span>
                </div>
                <h3 className="m-0 text-[18px] leading-tight font-bold text-fg">{x.name}</h3>
                <p className="m-0 -mt-2 text-[14px] leading-relaxed text-soft">{x.use[lang]}</p>
                <div className="mt-auto flex items-center gap-2.5 text-[13px] text-muted" aria-label={`${s.level} : ${s.levels[lv]}`}>
                  <span className="flex gap-1" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((d) => <i key={d} className={`size-2.5 rounded-[3px] ${d <= lv ? 'bg-gradient-to-b from-[#6ee2fa] to-[#2196f3] shadow-[0_0_8px_rgb(110_226_250/0.45)]' : 'bg-line'}`} />)}
                  </span>
                  <span aria-hidden="true">{s.levels[lv]}</span>
                </div>
              </article>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
