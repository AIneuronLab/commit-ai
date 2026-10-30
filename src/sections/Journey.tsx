import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { H2, Kicker } from '../components/ui';
import { Portrait } from '../components/Portrait';
import { Reveal } from '../motion';
import { SITE, waLink } from '../data/site';
import { useApp } from '../i18n';

/** A wide photo of Dakar in the brand blue; the picture drifts a little as the page scrolls. */
function DakarStrip() {
  const { t } = useApp();
  const reduce = useReducedMotion();
  const box = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: box, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);
  return (
    <figure ref={box} className="relative m-0 h-44 overflow-hidden rounded-lg border border-line bg-[#0b1f3d] sm:h-60 lg:h-72">
      <motion.img
        src="/dakar-bridge.webp"
        alt={t.journey.stripAlt}
        width={1400}
        height={800}
        loading="lazy"
        className="absolute inset-0 size-full scale-125 object-cover object-[50%_58%] mix-blend-luminosity opacity-60"
        style={reduce ? undefined : { y }}
      />
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
      <figcaption className="absolute bottom-3 left-4 font-mono text-[11px] tracking-[0.12em] text-white uppercase sm:bottom-4 sm:left-6">{t.journey.strip}</figcaption>
    </figure>
  );
}

/** "Qui nous sommes": a short, factual story, the founder's photo and the career timeline. */
export function Journey() {
  const { t } = useApp();
  const j = t.journey;
  return (
    <section id="journey" className="border-t border-line bg-bg-alt/70">
      <div className="mx-auto max-w-[1200px] px-4 pt-14 sm:px-6 lg:pt-20"><DakarStrip /></div>
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-20">
        <div className="flex min-w-0 flex-col gap-5">
          <Kicker index="05">{j.kicker}</Kicker>
          <H2 className="lg:text-[44px]">{j.title}</H2>
          {j.about.map((p) => <p key={p} className="m-0 max-w-[520px] text-[17px] leading-relaxed text-soft">{p}</p>)}
          <a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-12 items-center gap-2 self-start rounded-md border border-line-strong px-5 font-medium transition hover:border-brand-azure">
            {t.contact.whatsapp} <ArrowUpRight className="size-4.5" />
          </a>
          <span className="sr-only">{SITE.whatsapp.display}</span>
          <div className="mt-8 lg:mt-12"><Portrait /></div>
        </div>
        <ol className="m-0 flex min-w-0 list-none flex-col p-0">
          {j.timeline.map(([p, r, o], i) => (
            <li key={r + p}>
              <Reveal delay={i * 0.05} className="flex gap-5">
                <div className="flex w-4 shrink-0 flex-col items-center"><span className={`mt-1.5 size-3 rounded-[3px] ${i === 0 ? 'bg-brand shadow-[0_0_0_4px_var(--ca-accent-soft)]' : 'bg-brand-azure'}`} /><span className="w-px flex-1 bg-line" /></div>
                <div className="flex flex-col gap-1 pb-8">
                  <span className="font-mono text-[12px] tracking-[0.06em] text-muted uppercase">{p}</span>
                  <h3 className="m-0 font-display text-xl font-semibold tracking-tight">{r}</h3>
                  <span className="text-[15px] font-medium text-accent">{o}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
