import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { H2, Kicker } from '../components/ui';
import { Portrait } from '../components/Portrait';
import { Reveal } from '../motion';
import { SITE, waLink } from '../data/site';
import { useGithub } from '../lib/github';
import { GitHubIcon } from '../components/BrandIcons';
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
        className="absolute inset-0 size-full scale-110 object-cover object-[50%_18%] mix-blend-luminosity opacity-60"
        style={reduce ? undefined : { y }}
      />
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
      <figcaption className="absolute bottom-3 left-4 font-mono text-[11px] tracking-[0.12em] text-white uppercase sm:bottom-4 sm:left-6">{t.journey.strip}</figcaption>
    </figure>
  );
}

/** "Qui nous sommes": a short, factual story, the founder's photo and the career timeline. */
export function Journey() {
  const { t, lang } = useApp();
  const j = t.journey;
  const host = useRef<HTMLElement>(null);
  const near = useInView(host, { once: true, margin: '600px 0px' });
  const { data } = useGithub(near);
  return (
    <section id="journey" ref={host} className="border-t border-line bg-bg-alt/70">
      <div className="mx-auto max-w-[1200px] px-4 pt-16 sm:px-6 lg:pt-24"><DakarStrip /></div>
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-24">
        <div className="flex min-w-0 flex-col gap-5">
          <Kicker index="04">{j.kicker}</Kicker>
          <H2>{j.title}</H2>
          {j.about.map((p) => <p key={p} className="m-0 max-w-[520px] text-[17px] leading-relaxed text-soft">{p}</p>)}
          <a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-12 items-center gap-2 self-start rounded-md border border-line-strong px-5 font-medium transition hover:border-brand-azure">
            {t.contact.whatsapp} <ArrowUpRight className="size-4.5" />
          </a>
          <span className="sr-only">{SITE.whatsapp.display}</span>
          <a href={SITE.github.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 self-start text-[15px] text-muted transition-colors hover:text-accent">
            <GitHubIcon className="size-4" /> <b className="font-semibold text-fg tabular-nums">{data.contributions.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}</b> {j.github}
          </a>
        </div>
        <div className="min-w-0">
          <Portrait />
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
      </div>
    </section>
  );
}
