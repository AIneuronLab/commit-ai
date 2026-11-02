import { ArrowUpRight } from 'lucide-react';
import { SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { CLIENT_PROJECTS, SITE_ACTIVITY, type ClientProjectId } from '../data/projects';
import { useApp } from '../i18n';

const FEATURED: { id: ClientProjectId; src: string; w: number; h: number; pos: string }[] = [
  { id: 'activity', src: '/activityconnect.webp', w: 765, h: 575, pos: 'object-[30%_30%]' },
  { id: 'baykat', src: '/baykat-farm.webp', w: 900, h: 600, pos: 'object-[50%_35%]' },
];

/** Two featured projects as large picture panels, then every project in a quiet index table. */
export function Projects() {
  const { t } = useApp();
  const p = t.projects;
  const byId = Object.fromEntries(CLIENT_PROJECTS.map((c) => [c.id, c])) as Record<ClientProjectId, (typeof CLIENT_PROJECTS)[number]>;
  const context = (id: ClientProjectId) => (byId[id].relation === 'employer' ? `${p.builtAt} ${byId[id].client}` : `${p.client} · ${byId[id].client}`);
  const alt = (id: ClientProjectId) => (id === 'activity' ? p.activityAlt : p.baykatAlt);

  return (
    <section id="projects" className="border-t border-line bg-bg-alt">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-14 px-4 py-20 sm:px-6 lg:py-28">
        <SectionHead index="03" kicker={p.kicker} title={p.title} lead={p.lead} />

        <div className="grid gap-6 lg:grid-cols-2">
          {FEATURED.map((f, i) => {
            const item = p.items[f.id];
            const live = f.id === 'activity';
            const Tag = live ? 'a' : 'div';
            return (
              <Reveal key={f.id} delay={i * 0.1}>
                <Tag
                  {...(live ? { href: SITE_ACTIVITY.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="force-dark group relative block aspect-[4/5] overflow-hidden rounded-xl bg-[#0a1120] text-fg sm:aspect-[4/3] lg:aspect-[5/6]"
                >
                  <img src={f.src} alt={alt(f.id)} width={f.w} height={f.h} loading="lazy" className={`absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04] ${f.pos}`} />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0a1120] via-[#0a1120]/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-7 sm:p-9">
                    <span className="text-[12px] font-semibold tracking-[0.08em] text-accent uppercase">{context(f.id)} · {byId[f.id].year}</span>
                    <h3 className="m-0 text-[26px] leading-tight font-semibold tracking-[-0.02em] sm:text-[32px]">{item.title}</h3>
                    <p className="m-0 max-w-[460px] text-[16px] leading-relaxed text-soft">{item.solution}</p>
                    {live && <span className="mt-1 inline-flex items-center gap-1.5 text-[14px] font-medium text-accent">{p.visit} <ArrowUpRight className="size-4" /></span>}
                  </div>
                </Tag>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="flex flex-col gap-6">
          <h3 className="m-0 text-[20px] font-semibold tracking-[-0.01em]">{p.indexTitle}</h3>
          <div className="overflow-hidden rounded-xl border border-line bg-card">
            <div className="hidden grid-cols-[90px_1.3fr_1fr_1.4fr] gap-8 border-b border-line bg-card-alt px-6 py-3 text-[12px] font-semibold tracking-[0.06em] text-muted uppercase md:grid">
              {p.cols.map((c) => <span key={c}>{c}</span>)}
            </div>
            {(['tenders', 'hrbot', 'baykat', 'activity'] as ClientProjectId[]).map((id) => {
              const item = p.items[id];
              return (
                <article key={id} className="grid gap-2 border-b border-line px-6 py-6 last:border-b-0 md:grid-cols-[90px_1.3fr_1fr_1.4fr] md:items-baseline md:gap-8">
                  <span className="text-[15px] text-muted tabular-nums">{byId[id].year}</span>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[17px] leading-snug font-semibold">{item.title}</span>
                    <span className="text-[15px] leading-relaxed text-muted">{item.problem}</span>
                  </div>
                  <span className="text-[14px] font-medium text-accent">{context(id)}</span>
                  <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                    {item.results.map((r) => <li key={r} className="text-[15px] leading-relaxed text-soft">{r}</li>)}
                  </ul>
                </article>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
