import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { CycleWord } from '../components/CycleWord';
import { HeroFlow } from '../components/HeroFlow';
import { Magnetic } from '../components/Magnetic';
import { EASE_OUT } from '../motion';
import { SITE } from '../data/site';
import { useApp } from '../i18n';

const stat = (id: string) => SITE.stats.find((s) => s.id === id)!;

export function Hero({ onStart }: { onStart: () => void }) {
  const { t } = useApp();
  const reduce = useReducedMotion();
  /** Slides up but never starts invisible: the first paint must already show the text (speed). */
  const rise = (delay: number) => ({ initial: reduce ? false : { y: 16 }, animate: { y: 0 }, transition: { duration: 0.7, delay, ease: EASE_OUT } } as const);
  const prod = stat('prod');
  const countries = stat('countries');

  return (
    <section id="top" className="force-dark relative isolate overflow-hidden bg-[#050a14] text-fg">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[620px] overflow-hidden sm:h-[760px]">
        <img
          src="/hero-fiber.webp"
          srcSet="/hero-fiber-900.webp 900w, /hero-fiber.webp 2200w"
          sizes="100vw"
          alt=""
          width={2200}
          height={1467}
          fetchPriority="high"
          decoding="async"
          className="size-full -scale-x-100 object-cover object-[75%_45%]"
        />
        <span className="absolute inset-0 bg-gradient-to-r from-[#050a14] via-[#050a14]/70 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-[#050a14]" />
      </div>
      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-10 px-4 pt-8 pb-14 sm:px-6 lg:gap-14 lg:pt-20 lg:pb-24">
        <div className="flex min-w-0 flex-col gap-6">
          <motion.p {...rise(0)} className="m-0 inline-flex items-center gap-2.5 self-start rounded-md border border-line bg-card/60 px-3 py-1.5 font-mono text-[12px] tracking-[0.08em] text-soft uppercase">
            <span className="size-2 rounded-full bg-ok" />
            {t.hero.availability}
          </motion.p>
          <motion.h1 {...rise(0.05)} className="m-0 font-display text-[44px] leading-[1.02] font-semibold tracking-[-0.045em] sm:text-[72px] xl:text-[96px]">
            <span className="block">{t.hero.titleA} <CycleWord words={t.hero.words} className="text-accent" /></span>
            <span className="block">{t.hero.titleB}</span>
          </motion.h1>
          <div className="grid items-end gap-8 xl:grid-cols-[1.2fr_.8fr]">
            <motion.p {...rise(0.2)} className="m-0 max-w-[620px] text-[17px] leading-relaxed text-soft sm:text-[19px]">{t.hero.lead}</motion.p>
            <motion.div {...rise(0.3)} className="flex flex-col gap-3 sm:flex-row xl:justify-end">
              <Magnetic>
                <button onClick={onStart} className="group inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-md bg-brand-deep whitespace-nowrap px-6 font-medium text-white transition hover:bg-brand">
                  {t.hero.primary} <ArrowRight className="size-5 transition group-hover:translate-x-1" />
                </button>
              </Magnetic>
              <Magnetic>
                <a href="#projects" className="inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-md whitespace-nowrap border border-line-strong px-5 font-medium text-fg transition hover:border-brand-azure">
                  <FolderKanban className="size-5" /> {t.hero.secondary}
                </a>
              </Magnetic>
            </motion.div>
          </div>
        </div>

        <motion.div {...rise(0.4)}>
          <HeroFlow />
        </motion.div>

        <dl className="m-0 grid grid-cols-2 border-y border-line sm:grid-cols-4">
          <div className="flex flex-col gap-1 border-r border-line py-4 pr-4">
            <dt className="order-2 font-mono text-[12px] tracking-[0.1em] text-muted uppercase">{t.stats.prod}</dt>
            <dd className="m-0 font-display text-3xl font-semibold tabular-nums"><CountUp to={prod.to} suffix={prod.suffix} /></dd>
          </div>
          <div className="flex flex-col gap-1 py-4 pl-4 sm:border-r sm:border-line sm:pr-4">
            <dt className="order-2 font-mono text-[12px] tracking-[0.1em] text-muted uppercase">{t.stats.countries}</dt>
            <dd className="m-0 font-display text-3xl font-semibold tabular-nums"><CountUp to={countries.to} /></dd>
          </div>
          <div className="flex flex-col gap-1 border-t border-r border-line py-4 pr-4 sm:border-t-0 sm:pl-4">
            <dt className="order-2 font-mono text-[12px] tracking-[0.1em] text-muted uppercase">{t.stats.quote}</dt>
            <dd className="m-0 font-display text-3xl font-semibold tabular-nums">48 h</dd>
          </div>
          <div className="flex flex-col gap-1 border-t border-line py-4 pl-4 sm:border-t-0">
            <dt className="order-2 font-mono text-[12px] tracking-[0.1em] text-muted uppercase">{t.stats.call}</dt>
            <dd className="m-0 font-display text-3xl font-semibold tabular-nums">30 min</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
