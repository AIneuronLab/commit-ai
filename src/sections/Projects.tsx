import { ArrowUpRight } from 'lucide-react';
import { SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { CLIENT_PROJECTS, SITE_ACTIVITY, type ClientProjectId } from '../data/projects';
import { useApp } from '../i18n';

/** Optional picture shown at the end of a row. */
const THUMBS: Partial<Record<ClientProjectId, { src: string; pos: string }>> = {
  baykat: { src: '/baykat-farm.webp', pos: 'object-[50%_35%]' },
  activity: { src: '/activityconnect.webp', pos: 'object-[50%_30%]' },
};

/** The four delivered projects as a plain list: name, what it does, result, and a picture when we have one. */
export function Projects() {
  const { t } = useApp();
  return (
    <section id="projects" className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-14 sm:px-6 lg:gap-12 lg:py-24">
        <SectionHead index="03" kicker={t.projects.kicker} title={t.projects.title} lead={t.projects.lead} />
        <ol className="m-0 list-none border-b border-line p-0">
          {CLIENT_PROJECTS.map((p, i) => {
            const item = t.projects.items[p.id];
            const thumb = THUMBS[p.id];
            const alt = p.id === 'baykat' ? t.projects.baykatAlt : t.projects.activityAlt;
            const live = p.id === 'activity';
            return (
              <li key={p.id} className="border-t border-line">
                <Reveal className="grid gap-5 py-8 lg:grid-cols-[56px_minmax(0,1.3fr)_minmax(0,1fr)_240px] lg:items-start lg:gap-8 lg:py-10">
                  <span className="font-mono text-[13px] tracking-[0.14em] text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex flex-col gap-2.5">
                    <h3 className="m-0 font-display text-[26px] leading-tight font-semibold tracking-[-0.025em] sm:text-[30px]">{item.title}</h3>
                    <p className="m-0 max-w-[520px] text-[16px] leading-relaxed text-muted">{item.desc}</p>
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <p className="m-0 font-mono text-[12px] tracking-[0.12em] text-accent uppercase">{p.client} · {p.year}</p>
                    <p className="tint-ok m-0 rounded-md border px-3 py-1.5 font-mono text-[13px] text-ok">{item.result}</p>
                    {item.note && <p className="m-0 text-[14px] text-muted">{item.note}</p>}
                    {live && (
                      <a href={SITE_ACTIVITY.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[15px] font-medium text-accent hover:underline">
                        {t.projects.visit} <ArrowUpRight className="size-4" />
                      </a>
                    )}
                  </div>
                  {thumb ? (
                    live ? (
                      <a href={SITE_ACTIVITY.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} — ${t.projects.visit}`} className="block">
                        <img src={thumb.src} alt={alt} width={765} height={575} loading="lazy" className={`h-44 w-full rounded-lg border border-line object-cover transition hover:border-brand-azure lg:h-36 ${thumb.pos}`} />
                      </a>
                    ) : (
                      <img src={thumb.src} alt={alt} width={900} height={600} loading="lazy" className={`h-44 w-full rounded-lg border border-line object-cover lg:h-36 ${thumb.pos}`} />
                    )
                  ) : <span aria-hidden="true" className="hidden lg:block" />}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
