import { SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

const ROMAN = ['I', 'II', 'III', 'IV'];

/** Four services as numbered editorial rows: numeral, name and promise, then what you receive. */
export function Services() {
  const { t } = useApp();
  const s = t.services;
  return (
    <section id="services">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-14 px-4 py-20 sm:px-6 lg:py-32">
        <SectionHead index="01" kicker={s.kicker} title={s.title} lead={s.lead} />
        <ol className="m-0 list-none border-b border-line p-0">
          {s.items.map((it, i) => (
            <li key={it.title} className="border-t border-line">
              <Reveal className="group grid gap-6 py-10 transition-colors lg:grid-cols-[110px_1.1fr_1fr] lg:gap-10 lg:py-14">
                <span className="font-serif text-[44px] leading-none text-accent italic lg:text-[56px]">{ROMAN[i]}</span>
                <div className="flex flex-col gap-3">
                  <h3 className="m-0 font-serif text-[34px] leading-[1.05] font-normal sm:text-[42px]">{it.title}</h3>
                  <p className="m-0 max-w-[460px] text-[17px] leading-relaxed text-muted">{it.desc}</p>
                </div>
                <div className="flex flex-col gap-5">
                  <ul className="m-0 flex list-none flex-col p-0">
                    {it.deliver.map((d) => (
                      <li key={d} className="flex items-baseline gap-4 border-b border-line py-3 text-[16px] text-soft last:border-b-0">
                        <span aria-hidden="true" className="text-accent">—</span>{d}
                      </li>
                    ))}
                  </ul>
                  <p className="m-0 text-[12px] tracking-[0.18em] text-muted uppercase">{it.tags.join(' · ')}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
