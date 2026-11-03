import { useState, type ReactNode } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { Container, Measure, SectionHead } from '../components/ui';
import { CodePanel, RunLog } from '../components/Vignettes';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

type Panel = { id: string; title: string; desc: string; tags: string[]; visual: ReactNode; action?: ReactNode };

const Photo = ({ src, alt, pos = '50% 50%' }: { src: string; alt: string; pos?: string }) => (
  <img src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" style={{ objectPosition: pos }} />
);
const Centered = ({ children }: { children: ReactNode }) => (
  <div className="absolute inset-x-0 top-0 flex h-[62%] items-center justify-center p-6">{children}</div>
);

/**
 * The services as a fan of panels. On wide screens the panel under the pointer (or keyboard focus) takes the
 * room, 3.4 to 1, with a slow settle; the others turn grey and show their title sideways. On phones the panels
 * stack and open one at a time.
 */
export function Services({ onStart }: { onStart: () => void }) {
  const { t } = useApp();
  const s = t.services;
  const [active, setActive] = useState(0);

  const visuals: Record<string, ReactNode> = {
    web: <Photo src="/activityconnect.webp" alt={t.hero.showcaseAlt} pos="50% 30%" />,
    mobile: <Photo src="/baykat-farm.webp" alt="" />,
    automation: <Centered><RunLog className="w-[380px] max-w-full shadow-[0_30px_60px_-30px_rgb(18_18_20/0.45)]" /></Centered>,
    api: <Centered><CodePanel className="w-[380px] max-w-full shadow-[0_30px_60px_-30px_rgb(18_18_20/0.45)]" /></Centered>,
  };
  const order = ['web', 'automation', 'mobile', 'api'];
  const panels: Panel[] = [
    ...order.map((id) => {
      const it = s.items.find((x) => x.id === id)!;
      return { id, title: it.title, desc: it.desc, tags: it.tags, visual: visuals[id] };
    }),
    {
      id: 'more', title: s.moreHint, desc: s.more, tags: [],
      visual: <img src="/dakar-hero-1920.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover object-[50%_40%]" />,
      action: <button type="button" onClick={onStart} className="btn btn-glow mt-2 self-start">{t.nav.cta}<ArrowUpRight className="size-5" strokeWidth={1.5} /></button>,
    },
  ];

  return (
    <section id="services" className="scroll-mt-20 py-24 lg:py-36">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <SectionHead index="03" kicker={s.kicker} aside={t.navSub.services} title={s.title} lead={s.titleB} />
        <Reveal>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 md:h-[34rem] md:flex-row">
            {panels.map((p, i) => {
              const open = active === i;
              return (
                <li
                  key={p.id}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  style={{ flexGrow: open ? 3.4 : 1 }}
                  className={`group relative overflow-hidden rounded-[var(--radius-media)] border border-line bg-card-alt transition-[flex-grow,min-height] duration-700 ease-[var(--ease-lens)] min-h-[4.25rem] md:min-h-0 md:basis-0`}
                >
                  {/* the visual: full colour when open, grey and faded when closed. On phones it sits in the flow under the header row */}
                  <div className={`absolute inset-0 transition-[opacity,filter] duration-700 ease-[var(--ease-lens)] max-md:relative max-md:mt-[4.25rem] max-md:h-60 max-md:overflow-hidden ${open ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale max-md:hidden'}`}>
                    {p.visual}
                    <div className="absolute inset-0 bg-gradient-to-t from-card-alt from-30% via-card-alt/90 via-50% to-transparent to-80% max-md:from-0% max-md:via-transparent" />
                  </div>

                  {/* closed, wide screens: number at the top, title written sideways */}
                  <span aria-hidden="true" className={`pointer-events-none absolute top-7 bottom-7 left-6 z-[6] hidden transition-[opacity,transform] duration-300 ease-[var(--ease-lens)] md:block ${open ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100 delay-200'}`}>
                    <span className="measure block">0{i + 1}</span>
                    <span className="display-4 absolute bottom-0 left-0 rotate-180 whitespace-nowrap text-fg [writing-mode:vertical-rl]">{p.title}</span>
                  </span>

                  {/* phones: a header row that opens the panel */}
                  <button type="button" onClick={() => setActive(i)} aria-expanded={open} aria-controls={`svc-${p.id}`} className="absolute inset-x-0 top-0 z-10 flex h-[4.25rem] w-full items-center justify-between bg-card-alt px-5 text-left md:hidden">
                    <span className="flex items-baseline gap-3"><Measure>0{i + 1}</Measure><span className="display-4 text-fg">{p.title}</span></span>
                    <span className={`grid size-8 place-items-center rounded-full bg-bg text-fg transition-transform duration-500 ${open ? 'rotate-45' : ''}`} aria-hidden="true"><Plus className="size-4" /></span>
                  </button>

                  {/* open: the text, held at a fixed width so it does not reflow while the panel grows */}
                  <div id={`svc-${p.id}`} className={`relative z-[5] flex h-full flex-col justify-end p-5 pt-4 transition-opacity duration-500 ease-[var(--ease-lens)] md:p-7 ${open ? 'opacity-100 delay-200' : 'pointer-events-none opacity-0 max-md:hidden'}`}>
                    <div className="flex w-full flex-col gap-3 md:w-[24rem]">
                      <Measure className="max-md:hidden">0{i + 1}</Measure>
                      <h3 className="display-3 m-0 text-fg max-md:hidden">{p.title}</h3>
                      <p className="m-0 text-[16px] leading-relaxed text-soft">{p.desc}</p>
                      {p.tags.length > 0 && <p className="measure m-0">{p.tags.join(' · ')}</p>}
                      {p.action}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
