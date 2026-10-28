import { motion, useReducedMotion } from 'motion/react';
import { LogoMark } from '../brand/Logo';
import { DotSphere } from './DotSphere';
import { EASE_OUT } from '../motion';
import { SITE } from '../data/site';
import { useApp } from '../i18n';

/** A round photo inside a turning halo of dots. */
export function HeroPortrait() {
  const { t, mode } = useApp();
  const reduce = useReducedMotion();
  return (
    <motion.figure
      className="m-0 mx-auto w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[400px]"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <div className="relative">
        <DotSphere className="pointer-events-none absolute -inset-[15%] z-0 size-[130%]" />
        <img
          src="/portrait.jpg"
          alt={t.hero.portraitAlt}
          width={540}
          height={660}
          fetchPriority="high"
          className="relative z-10 aspect-square w-full rounded-full border-2 border-line-strong object-cover object-[50%_8%] shadow-[0_30px_60px_-30px_rgba(0,0,0,.55)]"
        />
      </div>
      <figcaption className="mt-14 flex items-center justify-center gap-3">
        <LogoMark size={34} variant={mode} />
        <span className="flex flex-col leading-tight">
          <b className="text-[15px]">{SITE.owner}</b>
          <span className="text-[14px] text-muted">{t.hero.role} · Commit<span className="text-accent">·AI</span></span>
        </span>
      </figcaption>
    </motion.figure>
  );
}
