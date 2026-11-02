import { Check, Globe, Server, Smartphone, Workflow } from 'lucide-react';
import { SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

const ICONS = [Workflow, Globe, Smartphone, Server];

/** Four services as equal cards: what it solves, what you receive, the tools we use. */
export function Services() {
  const { t } = useApp();
  const s = t.services;
  return (
    <section id="services" className="border-t border-line bg-bg-alt">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 py-20 sm:px-6 lg:py-28">
        <SectionHead index="01" kicker={s.kicker} title={s.title} lead={s.lead} />
        <ul className="m-0 grid list-none gap-5 p-0 md:grid-cols-2">
          {s.items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <li key={it.title} className="flex">
                <Reveal delay={(i % 2) * 0.06} className="flex w-full">
                  <article className="flex w-full flex-col gap-5 rounded-xl border border-line bg-card p-7 shadow-[0_1px_2px_rgba(11,21,38,.04)] transition hover:border-line-strong hover:shadow-[0_12px_30px_-16px_rgba(11,21,38,.25)] sm:p-8">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-accent-soft text-accent"><Icon className="size-5.5" aria-hidden="true" /></span>
                    <div className="flex flex-col gap-2">
                      <h3 className="m-0 text-[21px] leading-tight font-semibold tracking-[-0.015em]">{it.title}</h3>
                      <p className="m-0 text-[16px] leading-relaxed text-muted">{it.desc}</p>
                    </div>
                    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                      {it.deliver.map((d) => <li key={d} className="flex items-start gap-2.5 text-[15px] text-soft"><Check className="mt-0.5 size-4.5 shrink-0 text-accent" aria-hidden="true" />{d}</li>)}
                    </ul>
                    <p className="m-0 mt-auto border-t border-line pt-4 text-[13px] text-muted">{it.tags.join(' · ')}</p>
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
