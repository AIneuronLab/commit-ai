import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { CycleWord } from '../components/CycleWord';
import { Magnetic } from '../components/Magnetic';
import { Showcase } from '../components/Showcase';
import { EASE_OUT } from '../motion';
import { useApp } from '../i18n';

/** One screen: the promise, two ways to act, who already trusts us, and real work on the right. Always dark. */
export function Hero({ onStart }: { onStart: () => void }) {
  const { t } = useApp();
  const reduce = useReducedMotion();
  /** Slides up but never starts invisible: the first paint must already show the text (speed). */
  const rise = (delay: number) => ({ initial: reduce ? false : { y: 16 }, animate: { y: 0 }, transition: { duration: 0.7, delay, ease: EASE_OUT } } as const);

  return (
    <section id="top" className="force-dark relative isolate overflow-hidden bg-[#0a0a0b] text-fg">
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_60%_at_78%_35%,rgba(201,162,74,.16),transparent_70%)]" />
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-4 pt-10 pb-16 sm:px-6 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:py-16">
        <div className="flex min-w-0 flex-col gap-7">
          <motion.p {...rise(0)} className="m-0 inline-flex items-center gap-2.5 self-start rounded-full border border-line bg-card/60 px-3.5 py-1.5 text-[13px] font-medium text-soft">
            <span className="relative flex size-2"><span className="absolute inset-0 animate-ping rounded-full bg-ok/60 motion-reduce:hidden" /><span className="relative size-2 rounded-full bg-ok" /></span>
            {t.hero.availability}
          </motion.p>
          <motion.h1 {...rise(0.05)} className="m-0 font-serif text-[52px] leading-[0.98] font-normal tracking-[-0.015em] sm:text-[72px] xl:text-[84px]">
            <span className="block">{t.hero.titleA} <CycleWord words={t.hero.words} className="text-accent italic" /></span>
            <span className="block">{t.hero.titleB}</span>
          </motion.h1>
          <motion.p {...rise(0.15)} className="m-0 max-w-[540px] text-[17px] leading-relaxed text-soft sm:text-[19px]">{t.hero.lead}</motion.p>
          <motion.div {...rise(0.25)} className="flex flex-col gap-3 sm:flex-row">
            <Magnetic>
              <button onClick={onStart} className="group btn-primary inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-md px-6 font-medium whitespace-nowrap transition">
                {t.hero.primary} <ArrowRight className="size-5 transition group-hover:translate-x-1" />
              </button>
            </Magnetic>
            <Magnetic>
              <a href="#projects" className="inline-flex min-h-13 w-full items-center justify-center rounded-md border border-line-strong px-6 font-medium whitespace-nowrap text-fg transition hover:border-brand-azure">
                {t.hero.secondary}
              </a>
            </Magnetic>
          </motion.div>
          <motion.ul {...rise(0.35)} className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-[14px] text-muted">
            {t.hero.facts.map((f) => <li key={f} className="inline-flex items-center gap-1.5"><Check className="size-4 text-accent" />{f}</li>)}
          </motion.ul>
          <div className="mt-2 flex flex-col gap-3 border-t border-line pt-6">
            <span className="text-[13px] text-muted">{t.hero.trusted}</span>
            <ul className="m-0 flex list-none flex-wrap items-center gap-x-6 gap-y-2 p-0">
              {t.hero.delivered.map((n) => <li key={n} className="font-display text-[17px] font-semibold tracking-tight text-soft">{n}</li>)}
            </ul>
          </div>
        </div>
        <motion.div initial={reduce ? false : { y: 24 }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT }}>
          <Showcase />
        </motion.div>
      </div>
    </section>
  );
}
