import { Container, SectionHead } from '../components/ui';
import { AppCard, BookingCard, CodePanel, RunLog } from '../components/Vignettes';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

const VISUAL = { automation: RunLog, web: BookingCard, mobile: AppCard, api: CodePanel } as const;

/** Four services as a grid of panels, each with a small interface showing what we build. */
export function Services() {
  const { t } = useApp();
  const s = t.services;
  return (
    <section id="services" className="scroll-mt-16">
      <Container className="flex flex-col gap-12 py-20 lg:gap-16 lg:py-28">
        <SectionHead eyebrow={s.kicker} a={s.title} b={s.titleB} />
        <div className="grid gap-4 md:grid-cols-2">
          {s.items.map((it, i) => {
            const Visual = VISUAL[it.id as keyof typeof VISUAL];
            return (
              <Reveal key={it.id} delay={(i % 2) * 0.06} className="flex">
                <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-card">
                  <div className="flex flex-col gap-2 p-7 sm:p-8 md:min-h-[190px]">
                    <h3 className="m-0 text-[20px] font-semibold tracking-[-0.015em] text-fg">{it.title}</h3>
                    <p className="m-0 max-w-[460px] text-[15.5px] leading-relaxed text-muted">{it.desc}</p>
                    <p className="m-0 mt-2 font-mono text-[12px] text-muted">{it.tags.join('  ·  ')}</p>
                  </div>
                  <div className="mt-auto flex min-h-[290px] items-center justify-center border-t border-line bg-bg-alt px-6 py-8 sm:px-10">
                    {it.id === 'mobile' ? <Visual /> : <Visual className="w-full max-w-[420px]" />}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
