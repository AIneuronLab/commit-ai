import { Plus } from 'lucide-react';
import { Container, Eyebrow, TwoTone } from '../components/ui';
import { useApp } from '../i18n';

/** Common questions as native disclosure widgets: keyboard and screen-reader friendly, no script needed. */
export function Faq() {
  const { t } = useApp();
  const f = t.faq;
  return (
    <section id="faq" className="scroll-mt-16 border-t border-line">
      <Container className="grid gap-10 py-20 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:py-28">
        <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>{f.kicker}</Eyebrow>
          <TwoTone a={f.title} className="text-[30px] leading-[1.15] sm:text-[38px]" />
          <p className="m-0 text-[16px] text-muted">{f.lead} <a href="#contact" className="font-medium text-accent hover:underline">{t.nav.contact} →</a></p>
        </div>
        <div className="border-t border-line">
          {f.items.map(([q, a]) => (
            <details key={q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16.5px] font-medium text-fg [&::-webkit-details-marker]:hidden">
                {q}
                <Plus className="size-4.5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="m-0 max-w-[640px] pb-6 text-[15.5px] leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
