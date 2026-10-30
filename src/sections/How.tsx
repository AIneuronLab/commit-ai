import { SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

/** Three steps side by side, each under a large serif numeral and a gold rule. */
export function How() {
  const { t } = useApp();
  return (
    <section className="border-t border-line bg-bg-alt/70">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-14 px-4 py-20 sm:px-6 lg:py-32">
        <SectionHead index="02" kicker={t.how.kicker} title={t.how.title} lead={t.how.lead} />
        <ol className="m-0 grid list-none gap-12 p-0 md:grid-cols-3 md:gap-10">
          {t.how.steps.map((s, i) => (
            <li key={s.t}>
              <Reveal delay={i * 0.12} className="flex flex-col gap-4 border-t border-brand/60 pt-8">
                <span className="font-serif text-[64px] leading-none text-accent italic">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[12px] font-medium tracking-[0.2em] text-muted uppercase">{s.tag}</span>
                <h3 className="m-0 font-serif text-[28px] leading-tight font-normal">{s.t}</h3>
                <p className="m-0 text-[16px] leading-relaxed text-muted">{s.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
