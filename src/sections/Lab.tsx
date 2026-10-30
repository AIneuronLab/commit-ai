import { useRef } from 'react';
import { useInView } from 'motion/react';
import { ArrowUpRight, Star } from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { SITE } from '../data/site';
import { useGithub, type Day } from '../lib/github';
import { useApp } from '../i18n';

const LEVEL_OPACITY = [0, 0.3, 0.5, 0.75, 1];

function Heat({ days, label, on }: { days: Day[]; label: string; on: string }) {
  return (
    <div role="img" aria-label={label} className="grid grid-flow-col grid-rows-7 gap-[2px] sm:gap-[3px]">
      {days.map((d) => (
        <span
          key={d.date}
          title={`${d.count} ${on} ${d.date}`}
          className="aspect-square min-w-0 rounded-[3px] bg-line"
          style={d.level > 0 ? { background: `color-mix(in srgb, var(--color-brand-azure) ${LEVEL_OPACITY[Math.min(d.level, 4)] * 100}%, var(--ca-line))` } : undefined}
        />
      ))}
    </div>
  );
}

export function Lab() {
  const { t } = useApp();
  const host = useRef<HTMLElement>(null);
  const near = useInView(host, { once: true, margin: '600px 0px' });
  const { data, live, loading } = useGithub(near);
  return (
    <section id="lab" ref={host} className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 sm:px-6 lg:gap-12 lg:py-24">
        <SectionHead index="04" kicker={t.lab.kicker} title={t.lab.title} lead={t.lab.lead} />

        <Reveal className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-5">
            <div className="flex flex-col gap-1 rounded-lg border border-line bg-card p-5">
              <b className="font-display text-4xl tabular-nums sm:text-5xl"><CountUp to={data.publicRepos} /></b>
              <span className="text-[14px] text-muted">{t.lab.repos}</span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-line bg-card p-5">
              <b className="font-display text-4xl text-accent tabular-nums sm:text-5xl"><CountUp to={data.contributions} /></b>
              <span className="text-[14px] text-muted">{t.lab.contributions}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-lg border border-line bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[15px] font-medium">{t.lab.heat}</span>
              <span className={`inline-flex items-center gap-2 font-mono text-[12px] ${live ? 'text-ok' : 'text-muted'}`}>
                <span className={`size-2 rounded-full ${live ? 'bg-ok' : 'bg-muted'} ${loading ? 'animate-pulse' : ''}`} />
                {live ? t.lab.live : t.lab.cached}
              </span>
            </div>
            <Heat days={data.days} label={`${t.lab.heat}: ${data.contributions}`} on={t.lab.contribOn} />
            <div className="flex items-center justify-end gap-1.5 text-[12px] text-muted">
              {t.lab.less}
              {LEVEL_OPACITY.map((o, i) => <span key={i} aria-hidden="true" className="size-3 rounded-[3px] bg-line" style={i ? { background: `color-mix(in srgb, var(--color-brand-azure) ${o * 100}%, var(--ca-line))` } : undefined} />)}
              {t.lab.more}
            </div>
          </div>
        </Reveal>

        <ul className="snap-row m-0 list-none p-0 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:gap-5">
          {data.repos.map((r, i) => (
            <li key={r.name} className="flex w-[78%] sm:w-[45%] lg:w-auto">
              <Reveal delay={(i % 3) * 0.07} className="w-full">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex h-full min-h-36 flex-col gap-3 rounded-lg border border-line bg-card p-5 transition hover:-translate-y-1 hover:border-line-strong">
                  <span className="flex items-start justify-between gap-3">
                    <b className="font-mono text-[15px] break-all">{r.name}</b>
                    <ArrowUpRight className="size-5 shrink-0 text-muted transition group-hover:text-accent" aria-hidden="true" />
                  </span>
                  <span className="text-[15px] text-muted">{r.description ?? t.lab.noDesc}</span>
                  <span className="mt-auto flex items-center gap-4 text-[13px] text-soft">
                    {r.language && <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-brand-azure" />{r.language}</span>}
                    {r.stars > 0 && <span className="inline-flex items-center gap-1"><Star className="size-3.5" />{r.stars}</span>}
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>

        <a href={SITE.github.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 self-start rounded-md border border-line-strong px-5 font-medium text-fg transition hover:-translate-y-0.5 hover:border-brand-azure">
          {t.lab.viewAll} <ArrowUpRight className="size-4.5" />
        </a>
      </div>
    </section>
  );
}
