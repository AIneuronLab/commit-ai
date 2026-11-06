import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Container, Measure } from './ui';
import { CAREER_PLACES, GLOBE_SPIN_SPEED } from '../data/career';
import { useMedia } from '../lib/useMedia';
import { useApp } from '../i18n';

/**
 * The career on a globe (see three/globeScene.ts): the roles as cards, alternating left and right of a turning
 * Earth on wide screens; on phones the globe stays pinned in a strip at the top while the cards scroll under it.
 * three.js is loaded only when this band comes near the screen.
 */
export function ExperienceGlobe() {
  const { t, lang } = useApp();
  const j = t.journey;
  const touch = useMedia('(hover: none)');
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const glc = useRef<HTMLCanvasElement>(null);
  const fxc = useRef<HTMLCanvasElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const gap = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLElement[]>([]);

  const items = j.timeline.map(([when, role, org], i) => {
    const p = CAREER_PLACES[i];
    return { when, role, company: org.split(' · ')[0], place: p ? `${p.city}, ${p.country[lang]}` : '', side: i % 2 ? 'right' : 'left', i };
  });

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    // start once the band is within a screen of the viewport
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      import('../three/globeScene').then(({ startGlobe }) => {
        if (cancelled || !stage.current || !glc.current || !fxc.current || !label.current || !gap.current) return;
        try {
          stop = startGlobe({
            section: el, stage: stage.current, glc: glc.current, fxc: fxc.current, label: label.current, gap: gap.current,
            cards: cards.current.slice(0, items.length), places: CAREER_PLACES.slice(0, items.length), labels: items.map((x) => x.place), spinSpeed: GLOBE_SPIN_SPEED,
          });
        } catch {
          /* no WebGL: the cards still read as a plain list */
        }
      }).catch(() => {});
    }, { rootMargin: '100% 0px' });
    io.observe(el);
    return () => { cancelled = true; io.disconnect(); stop?.(); };
    // restarted when the language changes, so the city labels follow it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const card = (x: (typeof items)[number]) => (
    <li key={x.i} style={{ order: x.i }}>
      <article
        ref={(n) => { if (n) cards.current[x.i] = n; }}
        tabIndex={0}
        data-side={x.side}
        className={`globe-card relative cursor-pointer border border-line bg-card/85 p-6 backdrop-blur-md transition duration-300 outline-none focus-visible:outline-2 focus-visible:outline-glow max-lg:bg-card max-lg:backdrop-blur-none ${x.side === 'left' ? 'lg:[&.on]:translate-x-2' : 'lg:[&.on]:-translate-x-2'}`}
      >
        <Measure className="text-glow">{x.when}</Measure>
        <h3 className="display-4 m-0 mt-3 text-bone">{x.role}</h3>
        <p className="m-0 mt-1 text-[15.5px] text-soft">{x.company}</p>
        {x.place && <p className="m-0 mt-3 inline-flex items-center gap-1.5 text-[13.5px] text-muted"><MapPin className="size-3.5" aria-hidden="true" />{x.place}</p>}
      </article>
    </li>
  );

  return (
    <div ref={section} className="force-dark relative bg-night text-bone">
      <div ref={stage} aria-hidden="true" className="pointer-events-none z-0 max-lg:sticky max-lg:top-18 max-lg:z-[2] max-lg:h-[46svh] max-lg:border-b max-lg:border-line max-lg:bg-night lg:absolute lg:inset-0">
        <canvas ref={glc} className="absolute inset-0 block size-full" />
        <canvas ref={fxc} className="absolute inset-0 block size-full" />
        <div ref={label} className="globe-label" />
      </div>
      <Container className="relative z-[1] py-20 lg:py-28">
        <div className="flex flex-col items-center gap-3 text-center">
          <Measure>{j.timelineTitle}</Measure>
          <p className="m-0 max-w-[520px] text-[17px] leading-[1.6] text-soft">{touch ? j.globeHintTouch : j.globeHint}</p>
        </div>
        <div className="mt-10 grid items-center gap-6 max-lg:flex max-lg:flex-col max-lg:pb-[40vh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)]">
          <ul className="m-0 flex list-none flex-col gap-5 p-0 max-lg:contents">{items.filter((x) => x.side === 'left').map(card)}</ul>
          <div ref={gap} className="min-h-[min(80vh,720px)] max-lg:hidden" />
          <ul className="m-0 flex list-none flex-col gap-5 p-0 max-lg:contents">{items.filter((x) => x.side === 'right').map(card)}</ul>
        </div>
      </Container>
    </div>
  );
}
