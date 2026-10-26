import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { HeroPortrait } from '../components/HeroPortrait';
import { CountUp } from '../components/CountUp';
import { EASE_OUT, Reveal, ShineText } from '../motion';
import { SITE } from '../data/site';
import { useApp } from '../i18n';

export function Hero({ onStart }: { onStart: () => void }) {
  const { t } = useApp();
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative overflow-hidden bg-[radial-gradient(ellipse_60%_55%_at_75%_40%,var(--ca-hero-glow),transparent_70%)]">
      <span aria-hidden="true" className="grid-bg absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-10 px-4 pt-8 pb-14 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:pt-16 lg:pb-20">
        <div className="flex min-w-0 flex-col gap-6">
          <Reveal className="inline-flex items-center gap-2.5 self-start rounded-full border border-line bg-glass px-3.5 py-2 font-mono text-[13px] text-soft backdrop-blur">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2.5 rounded-full bg-ok" />
            </span>
            {t.hero.availability}
          </Reveal>
          <motion.h1
            className="m-0 font-display text-[42px] leading-[.98] font-bold tracking-[-0.04em] text-balance sm:text-[64px] xl:text-[84px]"
            initial={reduce ? false : { y: 22 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            {t.hero.titleA} <ShineText>{t.hero.titleB}</ShineText>
          </motion.h1>
          <p className="m-0 max-w-[580px] text-[17px] text-soft sm:text-[19px]">{t.hero.lead}</p>
          <Reveal delay={0.2} className="flex flex-col gap-3 sm:flex-row">
            <button onClick={onStart} className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-[#1976d2] to-brand-deep px-7 font-semibold text-white shadow-[0_14px_30px_-12px_rgba(33,150,243,.7)] transition hover:-translate-y-0.5">
              {t.hero.primary} <ArrowRight className="size-5 transition group-hover:translate-x-1" />
            </button>
            <a href="#projects" className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full border border-line-strong bg-glass px-6 font-medium text-fg backdrop-blur transition hover:-translate-y-0.5">
              <FolderKanban className="size-5" /> {t.hero.secondary}
            </a>
          </Reveal>
          <Reveal delay={0.3}>
            <dl className="m-0 grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-glass backdrop-blur sm:grid-cols-4">
              {SITE.stats.map((s, i) => (
                <div key={s.id} className={`flex flex-col-reverse gap-0.5 border-line px-4 py-4 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b' : ''} sm:border-b-0 sm:border-r sm:last:border-r-0`}>
                  <dt className="text-[13px] leading-snug text-muted">{t.stats[s.id]}</dt>
                  <dd className="m-0 font-display text-3xl font-bold tracking-tight tabular-nums"><CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} /></dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <HeroPortrait />
      </div>
    </section>
  );
}
