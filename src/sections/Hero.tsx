import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Magnetic } from '../components/Magnetic';
import { UnderLink } from '../components/ui';
import { EASE_OUT } from '../motion';
import { useApp } from '../i18n';

/** A full-screen title page: one statement set large in serif, two actions, and the delivered projects along the bottom. */
export function Hero({ onStart }: { onStart: () => void }) {
  const { t } = useApp();
  const h = t.hero;
  const reduce = useReducedMotion();
  /** Slides up but never starts invisible: the first paint must already show the text (speed). */
  const rise = (delay: number) => ({ initial: reduce ? false : { y: 18 }, animate: { y: 0 }, transition: { duration: 0.9, delay, ease: EASE_OUT } } as const);

  return (
    <section id="top" className="force-dark relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden bg-[#0a0a0b] text-fg">
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(201,162,74,.20),transparent_70%)]" />
      <span aria-hidden="true" className="grain absolute inset-0 -z-10" />
      <span aria-hidden="true" className="absolute inset-y-0 left-[max(1rem,calc((100vw-1200px)/2))] -z-10 hidden w-px bg-gradient-to-b from-transparent via-brand/25 to-transparent lg:block" />
      <span aria-hidden="true" className="absolute inset-y-0 right-[max(1rem,calc((100vw-1200px)/2))] -z-10 hidden w-px bg-gradient-to-b from-transparent via-brand/25 to-transparent lg:block" />

      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <motion.p {...rise(0)} className="m-0 text-[12px] font-medium tracking-[0.3em] text-accent uppercase">{h.eyebrow}</motion.p>
        <motion.h1 {...rise(0.08)} className="m-0 mt-8 font-serif text-[64px] leading-[0.92] font-normal tracking-[-0.02em] sm:text-[104px] xl:text-[132px]">
          <span className="block">{h.lineA}</span>
          <span className="block text-accent italic">{h.lineB}</span>
        </motion.h1>
        <motion.p {...rise(0.18)} className="m-0 mt-8 max-w-[620px] text-[17px] leading-relaxed text-soft sm:text-[19px]">{h.lead}</motion.p>
        <motion.div {...rise(0.28)} className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
          <Magnetic>
            <button onClick={onStart} className="group btn-primary inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full px-8 font-medium whitespace-nowrap transition">
              {h.primary} <ArrowRight className="size-5 transition group-hover:translate-x-1" />
            </button>
          </Magnetic>
          <UnderLink href="#projects">{h.secondary}</UnderLink>
        </motion.div>
        <motion.ul {...rise(0.38)} className="m-0 mt-10 flex list-none flex-col items-center justify-center gap-x-4 gap-y-2 p-0 text-[14px] text-muted sm:flex-row sm:flex-wrap">
          {h.facts.map((f, i) => (
            <li key={f} className="inline-flex items-center gap-4">{i > 0 && <span aria-hidden="true" className="hidden size-1 rounded-full bg-brand sm:inline-block" />}{f}</li>
          ))}
        </motion.ul>
      </div>

      <div className="border-t border-brand/20">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3 px-4 py-6 sm:px-6 md:flex-row md:justify-between">
          <span className="text-[11px] font-medium tracking-[0.24em] text-muted uppercase">{h.trusted}</span>
          <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-x-8 gap-y-2 p-0">
            {h.delivered.map((n) => <li key={n} className="font-serif text-[20px] text-soft italic">{n}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
