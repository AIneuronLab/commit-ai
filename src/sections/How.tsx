import { H2 } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

export function How() {
  const { t } = useApp();
  return (
    <section className="border-t border-line bg-bg-alt">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex max-w-[640px] flex-col gap-3">
          <H2 className="lg:text-[44px]">{t.how.title}</H2>
          <p className="m-0 text-[17px] text-muted">{t.how.lead}</p>
        </div>
        <ol className="m-0 grid list-none gap-x-10 gap-y-9 p-0 md:grid-cols-3">
          {t.how.steps.map((s, i) => (
            <li key={s.t}>
              <Reveal delay={i * 0.08} className="flex h-full flex-col gap-3 border-t-2 border-line-strong pt-5">
                <span className="font-display text-4xl font-bold text-accent tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="m-0 font-display text-[22px] leading-snug font-semibold">{s.t}</h3>
                <p className="m-0 text-[16px] leading-relaxed text-muted">{s.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
