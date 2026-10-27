import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { HeroPortrait } from '../components/HeroPortrait';
import { EASE_OUT, Reveal } from '../motion';
import { SITE } from '../data/site';
import { useApp } from '../i18n';

const stat = (id: string) => SITE.stats.find((s) => s.id === id)!;

export function Hero({ onStart }: { onStart: () => void }) {
  const { t } = useApp();
  const reduce = useReducedMotion();
  const prod = stat('prod');
  const countries = stat('countries');
  return (
    <section id="top" className="relative overflow-hidden bg-[radial-gradient(ellipse_60%_50%_at_80%_30%,var(--ca-hero-glow),transparent_70%)]">
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-4 pt-8 pb-14 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:gap-14 lg:pt-16 lg:pb-20">
        <div className="flex min-w-0 flex-col gap-6">
          <Reveal className="inline-flex items-center gap-2.5 self-start rounded-full border border-line px-3.5 py-2 font-mono text-[13px] text-soft">
            <span className="size-2.5 rounded-full bg-ok" />
            {t.hero.availability}
          </Reveal>
          <motion.h1
            className="m-0 font-display text-[38px] leading-[1.02] font-bold tracking-[-0.035em] text-balance sm:text-[54px] xl:text-[68px]"
            initial={reduce ? false : { y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            {t.hero.titleA} <span className="text-accent">{t.hero.titleB}</span>
          </motion.h1>
          <p className="m-0 max-w-[600px] text-[17px] leading-relaxed text-soft sm:text-[19px]">{t.hero.lead}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={onStart} className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-brand-deep px-7 font-semibold text-white transition hover:bg-brand">
              {t.hero.primary} <ArrowRight className="size-5 transition group-hover:translate-x-1" />
            </button>
            <a href="#projects" className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full border border-line-strong px-6 font-medium text-fg transition hover:border-brand-azure">
              <FolderKanban className="size-5" /> {t.hero.secondary}
            </a>
          </div>
          <p className="m-0 flex flex-wrap gap-x-5 gap-y-1 text-[15px] text-muted">
            <span><b className="text-fg"><CountUp to={prod.to} suffix={prod.suffix} /></b> {t.stats.prod}</span>
            <span><b className="text-fg"><CountUp to={countries.to} /></b> {t.stats.countries}</span>
            <span>{t.hero.pay}</span>
          </p>
        </div>
        <HeroPortrait />
      </div>
    </section>
  );
}
