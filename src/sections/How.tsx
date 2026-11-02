import { SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

/** Three steps side by side, each with a numbered badge. */
export function How() {
  const { t } = useApp();
  return (
    <section className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 py-20 sm:px-6 lg:py-28">
        <SectionHead index="02" kicker={t.how.kicker} title={t.how.title} lead={t.how.lead} />
        <ol className="m-0 grid list-none gap-10 p-0 md:grid-cols-3 md:gap-8">
          {t.how.steps.map((s, i) => (
            <li key={s.t}>
              <Reveal delay={i * 0.1} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand text-[15px] font-semibold text-white tabular-nums">{i + 1}</span>
                  <span className="text-[13px] font-semibold tracking-[0.06em] text-muted uppercase">{s.tag}</span>
                </div>
                <h3 className="m-0 mt-2 text-[20px] leading-snug font-semibold tracking-[-0.01em]">{s.t}</h3>
                <p className="m-0 text-[16px] leading-relaxed text-muted">{s.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
