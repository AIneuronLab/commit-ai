import { ArrowUpRight } from 'lucide-react';
import { SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { CLIENT_PROJECTS, SITE_ACTIVITY, type ClientProjectId } from '../data/projects';
import { useApp } from '../i18n';

/** Display order: strongest proof first. */
const ORDER: ClientProjectId[] = ['tenders', 'activity', 'hrbot', 'baykat'];

/** Left or right column of a case: a real picture when we have one, otherwise the key number set large. */
function Visual({ id }: { id: ClientProjectId }) {
  const { t } = useApp();
  const p = t.projects;
  const item = p.items[id];
  if (id === 'activity') {
    return (
      <a href={SITE_ACTIVITY.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} — ${p.visit}`} className="group block overflow-hidden rounded-xl border border-line bg-card">
        <img src="/activityconnect.webp" alt={p.activityAlt} width={765} height={575} loading="lazy" className="block aspect-[4/3] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
      </a>
    );
  }
  if (id === 'baykat') {
    return <img src="/baykat-farm.webp" alt={p.baykatAlt} width={900} height={600} loading="lazy" className="block aspect-[4/3] w-full rounded-xl border border-line object-cover" />;
  }
  return (
    <div className="force-dark relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl bg-[#050a14] p-8 text-fg sm:p-10">
      <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_80%_20%,rgba(33,150,243,.35),transparent_70%)]" />
      <p className="relative m-0 flex items-baseline gap-3">
        <b className="font-display text-[72px] leading-none font-semibold tracking-[-0.04em] text-accent sm:text-[96px]">{item.statValue}</b>
        <span className="text-[18px] font-medium text-fg sm:text-[20px]">{item.statUnit}</span>
      </p>
      <p className="relative m-0 mt-3 text-[15px] text-soft">{item.statLabel}</p>
    </div>
  );
}

/** Four delivered projects told as short case studies: the need, what we built, the result. */
export function Projects() {
  const { t } = useApp();
  const p = t.projects;
  const meta = Object.fromEntries(CLIENT_PROJECTS.map((c) => [c.id, `${c.client} · ${c.year}`])) as Record<ClientProjectId, string>;
  return (
    <section id="projects" className="border-t border-line bg-bg-alt/70">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 py-16 sm:px-6 lg:gap-20 lg:py-24">
        <SectionHead index="03" kicker={p.kicker} title={p.title} lead={p.lead} />
        {ORDER.map((id, i) => {
          const item = p.items[id];
          return (
            <Reveal key={id}>
              <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <div className={i % 2 ? 'lg:order-2' : ''}><Visual id={id} /></div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[12px] tracking-[0.12em] text-accent uppercase">{meta[id]}</span>
                    <h3 className="m-0 font-display text-[28px] leading-tight font-semibold tracking-[-0.03em] sm:text-[36px]">{item.title}</h3>
                  </div>
                  <dl className="m-0 grid gap-5">
                    <div><dt className="mb-1 text-[13px] font-medium text-muted">{p.problem}</dt><dd className="m-0 text-[16px] leading-relaxed text-soft">{item.problem}</dd></div>
                    <div><dt className="mb-1 text-[13px] font-medium text-muted">{p.solution}</dt><dd className="m-0 text-[16px] leading-relaxed text-soft">{item.solution}</dd></div>
                    <div>
                      <dt className="mb-2 text-[13px] font-medium text-muted">{p.result}</dt>
                      <dd className="m-0">
                        <ul className="m-0 flex list-none flex-col gap-2 p-0">
                          {item.results.map((r) => <li key={r} className="flex items-start gap-2.5 text-[16px] font-medium text-fg"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-ok" />{r}</li>)}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                  {id === 'activity' && (
                    <a href={SITE_ACTIVITY.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 self-start text-[15px] font-medium text-accent hover:underline">
                      {p.visit} <ArrowUpRight className="size-4" />
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
