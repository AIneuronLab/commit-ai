import { motion, useReducedMotion } from 'motion/react';
import { Kicker, H2 } from '../components/ui';
import { Reveal, EASE_OUT } from '../motion';
import { useApp } from '../i18n';

/** Three steps on a line that draws itself when the section comes into view. */
export function How() {
  const { t } = useApp();
  const reduce = useReducedMotion();
  return (
    <section className="border-t border-line bg-bg-alt/70">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex max-w-[640px] flex-col gap-4">
          <Kicker index="01">{t.how.kicker}</Kicker>
          <H2 className="lg:text-[44px]">{t.how.title}</H2>
          <p className="m-0 text-[17px] text-muted">{t.how.lead}</p>
        </div>
        <ol className="relative m-0 grid list-none gap-10 p-0 md:grid-cols-3 md:gap-8">
          <motion.span
            aria-hidden="true"
            className="absolute top-[7px] right-0 left-0 hidden h-px origin-left bg-line-strong md:block"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
          />
          {t.how.steps.map((s, i) => (
            <li key={s.t} className="relative">
              <Reveal delay={i * 0.12} className="flex h-full flex-col gap-3 md:pt-9">
                <span aria-hidden="true" className="absolute top-0 left-0 hidden size-[15px] rounded-[3px] border border-brand-azure bg-bg md:block"><i className="absolute inset-[3px] rounded-[1px] bg-brand-azure" /></span>
                <span className="font-mono text-[12px] tracking-[0.14em] text-accent uppercase">{String(i + 1).padStart(2, '0')} · {s.tag}</span>
                <h3 className="m-0 font-display text-[22px] leading-snug font-semibold tracking-tight">{s.t}</h3>
                <p className="m-0 text-[16px] leading-relaxed text-muted">{s.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
