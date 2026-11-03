import { Plus } from 'lucide-react';
import { Container, Kinetic, Measure } from '../components/ui';
import { useApp } from '../i18n';

/** 06 / FAQ: a giant title on the left, ruled native disclosure widgets on the right (no script needed). */
export function Faq() {
  const { t } = useApp();
  const f = t.faq;
  return (
    <section id="faq" className="scroll-mt-20 py-24 lg:py-36">
      <Container className="flex flex-col gap-14">
        <div className="flex items-baseline justify-between gap-6 border-t border-line pt-4">
          <Measure>06 / {f.kicker}</Measure>
          <Measure className="hidden text-right sm:inline">{t.navSub.faq}</Measure>
        </div>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
            <Kinetic text={f.title} lines className="display-2 text-fg" />
            <p className="m-0 text-[16.5px] text-muted">{f.lead} <a href="#contact" className="font-semibold text-accent hover:underline">{t.nav.contact} ↗</a></p>
          </div>
          <div>
            {f.items.map(([q, a]) => (
              <details key={q} className="group border-t border-line last:border-b">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[19px] font-semibold tracking-[-0.01em] text-fg transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                  {q}
                  <Plus className="size-5 shrink-0 text-accent transition-transform duration-500 ease-[var(--ease-lens)] group-open:rotate-45" strokeWidth={1.5} aria-hidden="true" />
                </summary>
                <p className="m-0 max-w-[640px] pb-7 text-[16.5px] leading-[1.65] text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
