import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Container, Measure } from '../components/ui';
import { RunLog } from '../components/Vignettes';
import { CLIENT_PROJECTS, SITE_ACTIVITY, type ClientProjectId } from '../data/projects';
import { useMedia, DESKTOP_MOTION } from '../lib/useMedia';
import { useApp } from '../i18n';

const ORDER: ClientProjectId[] = ['activity', 'baykat', 'tenders', 'hrbot'];

/**
 * 02 / Work, as "case files": full-screen panels. On large screens with a mouse the section is pinned and the
 * panels slide sideways as the page scrolls down, with a progress line at the bottom; elsewhere they stack.
 */
export function Projects() {
  const { t } = useApp();
  const p = t.projects;
  const pinned = useMedia(DESKTOP_MOTION);
  const host = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: host, offset: ['start start', 'end end'] });
  const n = ORDER.length;
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${((n - 1) / n) * 100}%`]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const backdrop: Record<ClientProjectId, ReactNode> = {
    activity: <img src="/activityconnect.webp" alt={t.hero.showcaseAlt} loading="lazy" className="absolute inset-0 size-full object-cover object-[50%_30%]" />,
    baykat: <img src="/baykat-farm.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />,
    tenders: <div className="absolute inset-0 grid place-items-center bg-[#0b1322] p-10 lg:justify-end lg:pr-[12%]"><RunLog className="w-[460px] max-w-full scale-110" /></div>,
    hrbot: (
      <div className="absolute inset-0 flex items-center justify-end overflow-hidden pr-[6%]" aria-hidden="true">
        <span className="font-display text-[min(52vw,46rem)] leading-none text-glow/15">88</span>
      </div>
    ),
  };

  const panel = (id: ClientProjectId, i: number) => {
    const c = CLIENT_PROJECTS.find((x) => x.id === id)!;
    const item = p.items[id];
    return (
      <article key={id} className="grain relative h-full w-full shrink-0 overflow-hidden">
        {backdrop[id]}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-night via-night/75 to-night/10" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night to-transparent" />
        <Container className="relative flex h-full flex-col justify-end pt-36 pb-24 lg:pb-28">
          <Measure className="text-bone/70">{p.file} 0{i + 1} / {c.relation === 'employer' ? `${p.builtAt} ${c.client}` : `${p.client} · ${c.client}`} · {c.year}</Measure>
          <h3 className="display-2 m-0 mt-4 max-w-[800px] text-bone">{item.title}</h3>
          <p className="m-0 mt-5 max-w-[520px] font-display text-[clamp(1.4rem,2.2vw,2rem)] leading-tight text-glow uppercase">{item.result}</p>
          <p className="m-0 mt-4 max-w-[520px] text-[16.5px] leading-[1.6] text-bone/75">{item.desc}</p>
          {id === 'activity' && (
            <a href={SITE_ACTIVITY.url} target="_blank" rel="noopener noreferrer" className="btn btn-glow mt-7 self-start">{p.visit}<ArrowUpRight className="size-5" strokeWidth={1.5} /></a>
          )}
        </Container>
      </article>
    );
  };

  const head = (
    <Container className="absolute inset-x-0 top-0 z-10 pt-28">
      <div className="flex items-baseline justify-between gap-6 border-t border-bone/15 pt-4">
        <Measure className="text-bone/70">02 / {p.kicker}</Measure>
        <Measure className="hidden items-center gap-2 text-glow sm:inline-flex">{p.hint} <ArrowRight className="size-3.5" /></Measure>
      </div>
    </Container>
  );

  if (!pinned) {
    return (
      <section id="projects" className="force-dark relative bg-night text-bone">
        <div className="relative">{head}</div>
        {ORDER.map((id, i) => <div key={id} className="h-[88svh] min-h-[600px]">{panel(id, i)}</div>)}
      </section>
    );
  }
  return (
    <section id="projects" ref={host} className="force-dark relative bg-night text-bone" style={{ height: `${n * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {head}
        <motion.div style={{ x, width: `${n * 100}%` }} className="flex h-full">
          {ORDER.map((id, i) => <div key={id} className="h-full" style={{ width: `${100 / n}%` }}>{panel(id, i)}</div>)}
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-bone/15"><motion.div style={{ width: bar }} className="h-full bg-glow" /></div>
      </div>
    </section>
  );
}
