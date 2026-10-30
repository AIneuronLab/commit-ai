import { Check, Globe, Server, Smartphone, Workflow } from 'lucide-react';
import { SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

const ICONS = [Workflow, Globe, Smartphone, Server];
const PHOTOS = [
  { src: '/svc-automation.webp', pos: 'object-[50%_22%]' },
  { src: '/svc-web.webp', pos: 'object-[50%_55%]' },
  { src: '/svc-mobile.webp', pos: 'object-[50%_28%]' },
  { src: '/svc-backend.webp', pos: 'object-[50%_50%]' },
];
/** Bento: the first and last cards are wide on large screens. */
const SPAN = ['lg:col-span-4', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-4'];

export function Services() {
  const { t } = useApp();
  return (
    <section id="services" className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-14 sm:px-6 lg:gap-12 lg:py-24">
        <SectionHead index="02" kicker={t.services.kicker} title={t.services.title} lead={t.services.lead} />
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-6">
          {t.services.items.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <li key={s.title} className={`flex ${SPAN[i]}`}>
                <Reveal delay={(i % 2) * 0.07} className="flex w-full">
                  <article className="group flex w-full flex-col overflow-hidden rounded-lg border border-line bg-card transition-colors hover:border-brand-azure">
                    <div className="relative h-44 shrink-0 overflow-hidden">
                      <img src={PHOTOS[i].src} alt="" aria-hidden="true" width={1000} height={600} loading="lazy" className={`size-full object-cover transition-transform duration-700 group-hover:scale-105 ${PHOTOS[i].pos}`} />
                      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                      <span className="absolute bottom-3 left-5 flex size-11 items-center justify-center rounded-md bg-brand-deep text-white shadow-lg sm:left-6"><Icon className="size-5.5" aria-hidden="true" /></span>
                      <span className="absolute right-5 bottom-4 font-mono text-[12px] tracking-[0.14em] text-white/90 sm:right-6">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                    <h3 className="m-0 font-display text-[24px] leading-tight font-semibold tracking-tight sm:text-[28px]">{s.title}</h3>
                    <p className="m-0 max-w-[560px] text-[16px] leading-relaxed text-soft">{s.desc}</p>
                    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                      {s.tags.map((tag) => <li key={tag} className="rounded-md border border-line px-2.5 py-1 font-mono text-[12px] text-soft">{tag}</li>)}
                    </ul>
                    <p className="m-0 mt-auto flex items-start gap-2 border-t border-line pt-4 text-[15px] text-muted"><Check className="mt-0.5 size-4.5 shrink-0 text-ok" aria-hidden="true" />{s.proof}</p>
                    </div>
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
