import { Plus } from 'lucide-react';
import { SectionHead } from '../components/ui';
import { useApp } from '../i18n';

/** Common questions as native disclosure widgets: keyboard and screen-reader friendly, no script needed. */
export function Faq() {
  const { t } = useApp();
  const f = t.faq;
  return (
    <section id="faq" className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-20 sm:px-6 lg:grid lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:py-32">
        <div className="lg:sticky lg:top-28 lg:self-start"><SectionHead index="05" kicker={f.kicker} title={f.title} lead={f.lead} stacked /></div>
        <div className="border-t border-line">
          {f.items.map(([q, a]) => (
            <details key={q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-serif text-[22px] leading-snug text-fg sm:text-[26px] [&::-webkit-details-marker]:hidden">
                {q}
                <Plus className="size-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="m-0 max-w-[620px] pb-7 text-[16px] leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
