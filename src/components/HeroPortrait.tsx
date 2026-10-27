import { motion, useReducedMotion } from 'motion/react';
import { LogoMark } from '../brand/Logo';
import { EASE_OUT } from '../motion';
import { SITE } from '../data/site';
import { useApp } from '../i18n';

/** A plain photo, no decoration around it. */
export function HeroPortrait() {
  const { t, mode } = useApp();
  const reduce = useReducedMotion();
  return (
    <motion.figure
      className="m-0 mx-auto w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px]"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <img
        src="/portrait.jpg"
        alt={t.hero.portraitAlt}
        width={540}
        height={660}
        fetchPriority="high"
        className="aspect-[54/66] w-full rounded-[28px] border border-line object-cover object-[50%_12%] shadow-[0_30px_60px_-30px_rgba(0,0,0,.55)]"
      />
      <figcaption className="mt-4 flex items-center gap-3">
        <LogoMark size={34} variant={mode} />
        <span className="flex flex-col leading-tight">
          <b className="text-[15px]">{SITE.owner}</b>
          <span className="text-[14px] text-muted">{t.hero.role} · Commit<span className="text-accent">·AI</span></span>
        </span>
      </figcaption>
    </motion.figure>
  );
}
