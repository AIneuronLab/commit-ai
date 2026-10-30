import { Check, Globe, Server, Smartphone, Workflow } from 'lucide-react';
import { HeroFlow } from '../components/HeroFlow';
import { SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

const ICONS = [Workflow, Globe, Smartphone, Server];

/** Four services as equal cards (what it solves, what you receive), then the diagram of how everything connects. */
export function Services() {
  const { t } = useApp();
  const s = t.services;
  return (
    <section id="services" className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 sm:px-6 lg:gap-12 lg:py-24">
        <SectionHead index="01" kicker={s.kicker} title={s.title} lead={s.lead} />
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
          {s.items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <li key={it.title} className="flex">
                <Reveal delay={(i % 2) * 0.07} className="flex w-full">
                  <article className="flex w-full flex-col gap-5 rounded-xl border border-line bg-card p-6 transition-colors hover:border-line-strong sm:p-8">
                    <div className="flex items-center gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand text-[#0c0b09]"><Icon className="size-6" aria-hidden="true" /></span>
                      <h3 className="m-0 font-display text-[22px] leading-tight font-semibold tracking-tight sm:text-[24px]">{it.title}</h3>
                    </div>
                    <p className="m-0 text-[17px] leading-relaxed text-soft">{it.desc}</p>
                    <div>
                      <p className="m-0 mb-3 text-[13px] font-medium text-muted">{s.deliver}</p>
                      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                        {it.deliver.map((d) => <li key={d} className="flex items-start gap-2.5 text-[15px] text-fg"><Check className="mt-0.5 size-4.5 shrink-0 text-accent" aria-hidden="true" />{d}</li>)}
                      </ul>
                    </div>
                    <ul className="m-0 mt-auto flex list-none flex-wrap gap-2 border-t border-line p-0 pt-5">
                      {it.tags.map((tag) => <li key={tag} className="rounded-md bg-accent-soft px-2.5 py-1 font-mono text-[12px] text-accent">{tag}</li>)}
                    </ul>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <Reveal className="mt-4 flex flex-col gap-6">
          <div className="flex max-w-[640px] flex-col gap-2">
            <h3 className="m-0 font-serif text-[30px] font-normal sm:text-[36px]">{s.flowTitle}</h3>
            <p className="m-0 text-[16px] text-muted">{s.flowLead}</p>
          </div>
          <div className="force-dark rounded-xl bg-[#0a0a0b] p-3 text-fg sm:p-4"><HeroFlow /></div>
        </Reveal>
      </div>
    </section>
  );
}
