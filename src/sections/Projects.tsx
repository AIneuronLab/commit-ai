import { ArrowUpRight } from 'lucide-react';
import { Container, SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { CLIENT_PROJECTS, SITE_ACTIVITY } from '../data/projects';
import { useApp } from '../i18n';

/** Delivered projects as uniform cards: where it was built, the result in one line, then the details. */
export function Projects() {
  const { t } = useApp();
  const p = t.projects;
  return (
    <section id="projects" className="scroll-mt-16 border-t border-line bg-bg-alt">
      <Container className="flex flex-col gap-12 py-20 lg:gap-16 lg:py-28">
        <SectionHead eyebrow={p.kicker} a={p.title} b={p.titleB} />
        <div className="grid gap-4 md:grid-cols-2">
          {CLIENT_PROJECTS.map((c, i) => {
            const item = p.items[c.id];
            const live = c.id === 'activity';
            return (
              <Reveal key={c.id} delay={(i % 2) * 0.06} className="flex">
                <article className="flex w-full flex-col gap-5 rounded-2xl border border-line bg-card p-7 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[12px] text-muted">{c.relation === 'employer' ? `${p.builtAt} ${c.client}` : `${p.client} · ${c.client}`}</span>
                    <span className="font-mono text-[12px] text-muted tabular-nums">{c.year}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="m-0 text-[15px] font-medium text-accent">{item.title}</h3>
                    <p className="m-0 text-[24px] leading-tight font-medium tracking-[-0.02em] text-fg sm:text-[26px]">{item.result}</p>
                  </div>
                  <p className="m-0 text-[15.5px] leading-relaxed text-muted">{item.desc}</p>
                  {live && (
                    <a href={SITE_ACTIVITY.url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1 self-start text-[15px] font-medium text-accent hover:underline hover:underline-offset-4">
                      {p.visit} <ArrowUpRight className="size-4" />
                    </a>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
