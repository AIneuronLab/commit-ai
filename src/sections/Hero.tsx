import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, Lock } from 'lucide-react';
import { UnderLink } from '../components/ui';
import { EASE_OUT } from '../motion';
import { SITE_ACTIVITY } from '../data/projects';
import { useApp } from '../i18n';

/** Opening screen: what we do in one sentence, two actions, our guarantees, and one real project on the right. */
export function Hero({ onStart }: { onStart: () => void }) {
  const { t } = useApp();
  const h = t.hero;
  const reduce = useReducedMotion();
  /** Slides up but never starts invisible: the first paint must already show the text (speed). */
  const rise = (delay: number) => ({ initial: reduce ? false : { y: 14 }, animate: { y: 0 }, transition: { duration: 0.7, delay, ease: EASE_OUT } } as const);

  return (
    <section id="top" className="relative overflow-hidden border-b border-line bg-[linear-gradient(180deg,var(--ca-bg-alt),var(--ca-bg))]">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:pt-24 lg:pb-28">
        <div className="flex min-w-0 flex-col gap-7">
          <motion.p {...rise(0)} className="m-0 inline-flex items-center gap-2 self-start rounded-full border border-line bg-card px-3 py-1.5 text-[13px] font-medium text-soft">
            <span className="size-2 rounded-full bg-ok" />{h.availability}
          </motion.p>
          <motion.h1 {...rise(0.05)} className="m-0 font-display text-[40px] leading-[1.06] font-bold tracking-[-0.035em] text-balance sm:text-[54px] xl:text-[62px]">
            {h.lineA} <span className="text-accent">{h.lineB}</span>
          </motion.h1>
          <motion.p {...rise(0.12)} className="m-0 max-w-[560px] text-[18px] leading-relaxed text-muted">{h.lead}</motion.p>
          <motion.div {...rise(0.2)} className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
            <button onClick={onStart} className="group btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-6 font-semibold whitespace-nowrap transition">
              {h.primary} <ArrowRight className="size-4.5 transition group-hover:translate-x-0.5" />
            </button>
            <UnderLink href="#projects">{h.secondary}</UnderLink>
          </motion.div>
          <motion.ul {...rise(0.28)} className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] text-soft sm:flex-row sm:flex-wrap sm:gap-x-6">
            {h.facts.map((f) => <li key={f} className="inline-flex items-center gap-2"><Check className="size-4 text-accent" />{f}</li>)}
          </motion.ul>
        </div>

        <motion.figure {...rise(0.15)} className="m-0">
          <a href={SITE_ACTIVITY.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-line bg-card shadow-[0_24px_60px_-24px_rgba(11,21,38,.35)]">
            <div className="flex h-9 items-center gap-1.5 border-b border-line bg-card-alt px-3">
              <span className="size-2.5 rounded-full bg-line-strong" /><span className="size-2.5 rounded-full bg-line-strong" /><span className="size-2.5 rounded-full bg-line-strong" />
              <span className="ml-3 flex h-6 flex-1 items-center gap-1.5 truncate rounded-md border border-line bg-card px-2 text-[12px] text-muted"><Lock className="size-3 shrink-0" /> {SITE_ACTIVITY.host}</span>
            </div>
            <img src="/activityconnect.webp" alt={h.showcaseAlt} width={765} height={575} fetchPriority="high" className="block h-auto w-full" />
          </a>
          <figcaption className="mt-3 text-[14px] text-muted"><b className="font-semibold text-fg">ActivityConnect</b> · {h.showcaseCaption}</figcaption>
        </motion.figure>
      </div>

      <div className="border-t border-line bg-card">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between">
          <span className="text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">{h.trusted}</span>
          <ul className="m-0 flex list-none flex-wrap items-center gap-x-8 gap-y-2 p-0">
            {h.delivered.map((n) => <li key={n} className="text-[16px] font-semibold text-soft">{n}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
