import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Check } from 'lucide-react';
import { H2, Kicker, SectionHead } from '../components/ui';
import { serviceIcons } from '../icons/ServiceIcons';
import { BayKatDemo } from '../mockups/BayKatDemo';
import { BrowserFrame, ChatMock, DashboardMock } from '../mockups/Mockups';
import { CLIENT_PROJECTS, type ClientProjectId } from '../data/projects';
import { DESKTOP_MOTION, useMedia } from '../lib/useMedia';
import { useApp } from '../i18n';

function Text({ id, kicker }: { id: ClientProjectId; kicker: string }) {
  const { t } = useApp();
  const p = t.projects.items[id];
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[13px] text-accent">{kicker}</span>
      <h3 className="m-0 font-display text-[26px] leading-tight font-bold tracking-tight sm:text-[32px]">{p.title}</h3>
      <p className="m-0 text-[17px] text-muted">{p.desc}</p>
      <p className="tint-ok m-0 mt-1 inline-flex items-center gap-2 self-start rounded-full border px-3.5 py-2 text-[15px] text-ok"><Check className="size-4" />{p.result}</p>
      {p.note && <p className="m-0 text-[14px] text-muted">{p.note}</p>}
    </div>
  );
}

/** Same card in both layouts: stacked on phones, text beside the visual on large screens. */
function Card({ id, kicker, tone, children }: { id: ClientProjectId; kicker: string; tone: string; children: ReactNode }) {
  return (
    <article className={`${tone} flex w-[90%] shrink-0 flex-col gap-7 rounded-[28px] border border-line p-6 sm:w-[78%] sm:p-9 lg:grid lg:h-[min(620px,calc(100vh-9rem))] lg:w-[min(960px,72vw)] lg:grid-cols-[300px_1fr] lg:items-center lg:gap-10`}>
      <Text id={id} kicker={kicker} />
      <div className="flex shrink-0 items-center justify-center lg:min-h-0 lg:shrink">{children}</div>
    </article>
  );
}

function useCards() {
  const { mode } = useApp();
  const meta = Object.fromEntries(CLIENT_PROJECTS.map((p) => [p.id, `${p.client} · ${p.year}`])) as Record<ClientProjectId, string>;
  const WebApp = serviceIcons.webApp;
  return [
    <Card key="tenders" id="tenders" kicker={meta.tenders} tone="grad-card-a">
      <BrowserFrame url="veille.ashia-group.com" className="h-[360px] w-full lg:h-[min(420px,100%)]"><DashboardMock /></BrowserFrame>
    </Card>,
    <Card key="hrbot" id="hrbot" kicker={meta.hrbot} tone="grad-card-a">
      <BrowserFrame url="rh.ashia-group.com/assistant" className="h-[360px] w-full lg:h-[min(420px,100%)]"><ChatMock /></BrowserFrame>
    </Card>,
    <Card key="baykat" id="baykat" kicker={meta.baykat} tone="grad-card-b">
      <BayKatDemo frameClass="lg:h-[min(520px,calc(100vh-15rem))] lg:w-auto" />
    </Card>,
    <Card key="activity" id="activity" kicker={meta.activity} tone="grad-card-a">
      <span className="flex size-32 items-center justify-center rounded-[36px] border border-line-strong bg-card-alt sm:size-40">
        <WebApp className="size-24 sm:size-28" ink={mode === 'dark' ? '#EEF5FD' : '#0B1730'} soft="rgba(79,195,247,.22)" />
      </span>
    </Card>,
  ];
}

/** Large screens with a mouse: the section is pinned and vertical scroll slides the cards sideways. */
function Pinned({ cards }: { cards: ReactNode[] }) {
  const { t } = useApp();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDist(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  return (
    <section id="projects" ref={section} className="relative border-t border-line bg-[radial-gradient(ellipse_50%_40%_at_80%_10%,var(--ca-hero-glow),transparent_70%)]" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-center gap-8 px-[max(1.5rem,calc((100vw-1200px)/2))]">
          <div className="flex w-[360px] shrink-0 flex-col gap-4 pr-6">
            <Kicker>{t.projects.kicker}</Kicker>
            <H2 className="lg:text-[44px]">{t.projects.title}</H2>
            <p className="m-0 text-[17px] text-muted">{t.projects.lead}</p>
            <p className="m-0 text-[13px] text-muted">{t.projects.disclaimer}</p>
          </div>
          {cards}
        </motion.div>
        <div aria-hidden="true" className="absolute inset-x-[max(1.5rem,calc((100vw-1200px)/2))] bottom-8 h-[2px] bg-line">
          <motion.span className="block h-full origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  const { t } = useApp();
  const desktop = useMedia(DESKTOP_MOTION);
  const cards = useCards();
  if (desktop) return <Pinned cards={cards} />;
  return (
    <section id="projects" className="overflow-hidden border-t border-line bg-[radial-gradient(ellipse_50%_40%_at_80%_10%,var(--ca-hero-glow),transparent_70%)]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-14 sm:px-6 lg:py-20">
        <SectionHead kicker={t.projects.kicker} title={t.projects.title} lead={t.projects.lead} />
        <div className="hrow">{cards}</div>
        <p className="m-0 text-[13px] text-muted">{t.projects.disclaimer}</p>
      </div>
    </section>
  );
}
