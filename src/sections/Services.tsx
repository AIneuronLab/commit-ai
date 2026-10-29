import { Check, Globe, Server, Smartphone, Workflow } from 'lucide-react';
import { SectionHead, Ticks, spotProps } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

const ICONS = [Workflow, Globe, Smartphone, Server];
/** Bento: the first and last cards are wide on large screens. */
const SPAN = ['lg:col-span-4', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-4'];

export function Services() {
  const { t } = useApp();
  return (
    <section id="services" className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-14 sm:px-6 lg:gap-12 lg:py-24">
        <SectionHead index="02" kicker={t.services.kicker} title={t.services.title} lead={t.services.lead} />
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-6">
          {t.services.items.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <li key={s.title} className={`flex ${SPAN[i]}`}>
                <Reveal delay={(i % 2) * 0.07} className="flex w-full">
                  <article {...spotProps} className="spot group relative flex w-full flex-col gap-4 rounded-lg border border-line bg-card/70 p-6 transition-colors hover:border-line-strong sm:p-7">
                    <Ticks />
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex size-12 items-center justify-center rounded-md border border-line-strong bg-accent-soft text-accent"><Icon className="size-6" aria-hidden="true" /></span>
                      <span className="font-mono text-[12px] tracking-[0.14em] text-muted">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="m-0 font-display text-[24px] leading-tight font-semibold tracking-tight sm:text-[28px]">{s.title}</h3>
                    <p className="m-0 max-w-[560px] text-[16px] leading-relaxed text-soft">{s.desc}</p>
                    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                      {s.tags.map((tag) => <li key={tag} className="rounded-md border border-line px-2.5 py-1 font-mono text-[12px] text-soft">{tag}</li>)}
                    </ul>
                    <p className="m-0 mt-auto flex items-start gap-2 border-t border-line pt-4 text-[15px] text-muted"><Check className="mt-0.5 size-4.5 shrink-0 text-ok" aria-hidden="true" />{s.proof}</p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
