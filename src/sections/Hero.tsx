import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, Asterisk } from 'lucide-react';
import { Btn, Container, Measure } from '../components/ui';
import { SITE } from '../data/site';
import { useApp } from '../i18n';

/**
 * The hero title: three short promises taking turns, each set on two giant lines, its first sentence in white
 * and its second in the logo's blue. Letters rise in one after another, hold, then lift away. The box keeps a
 * fixed two-line height, so nothing below it jumps between promises.
 */
function Rotator({ lines }: { lines: string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % lines.length), 4200);
    return () => clearInterval(id);
  }, [lines.length]);
  const sentences = lines[i].split(/(?<=\.)\s+/);
  let k = 0;
  return (
    <span aria-hidden="true" className="relative block h-[1.95em] overflow-hidden font-display text-[clamp(2.6rem,12vw,9rem)] leading-[0.95] uppercase">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={lines[i]} className="absolute inset-x-0 bottom-0 block" exit={reduce ? { opacity: 0 } : { opacity: 0, y: '-0.4em', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}>
          {sentences.map((sentence, si) => (
            <span key={si} className={`block whitespace-nowrap ${si === 0 ? 'text-bone' : 'text-glow'}`}>
              {[...sentence].map((ch) => {
                const n = k++;
                return (
                  <motion.span
                    key={n}
                    className="inline-block whitespace-pre"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: '0.7em' }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: reduce ? 0 : n * 0.025, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * Full-screen opening: the African Renaissance Monument over Dakar at dusk, with film grain and drifting fog.
 * The photo slowly zooms and darkens as the page scrolls. The name small, then rotating promises as the giant title,
 * the coordinates written sideways on the right, a round scroll button, then a ticker of short promises.
 */
export function Hero({ onStart }: { onStart: () => void }) {
  const { t } = useApp();
  const h = t.hero;
  const reduce = useReducedMotion();
  const host = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: host, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, reduce ? 1.04 : 1.25]);
  const dim = useTransform(scrollYProgress, [0, 1], [0.12, 0.8]);
  const lift = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-30%']);
  const ticker = [...t.ticker, ...t.services.items.map((s) => s.title)];

  return (
    <>
      <section id="top" ref={host} className="force-dark grain relative h-[100svh] min-h-[620px] overflow-hidden bg-night text-bone">
        <motion.picture style={{ scale }} className="absolute inset-0 block">
          <source media="(max-width: 767px)" srcSet="/dakar-hero-portrait.webp" />
          <img src="/dakar-hero-1920.webp" srcSet="/dakar-hero-1920.webp 1920w, /dakar-hero-4k.webp 3840w" sizes="100vw" alt="" fetchPriority="high" className="size-full object-cover object-[50%_40%]" />
        </motion.picture>
        {/* a night grade over the dusk photo: cooler, darker at the edges and at the bottom */}
        <div aria-hidden="true" className="absolute inset-0 bg-[#16335e] mix-blend-color opacity-60" />
        <motion.div aria-hidden="true" style={{ opacity: dim }} className="absolute inset-0 bg-night" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_40%,rgb(7_11_18/0.85)_100%)]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-night via-night/60 to-transparent" />
        <div aria-hidden="true" className="fog" />
        <div aria-hidden="true" className="fog fog-2" />

        <span aria-hidden="true" className="measure absolute top-1/2 right-5 hidden -translate-y-1/2 text-bone/70 [writing-mode:vertical-rl] sm:right-10 md:block">14°41′ N &nbsp; 17°26′ W</span>

        <motion.div style={{ y: lift }} className="relative flex h-full flex-col justify-end">
          <Container className="pb-10 sm:pb-14">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="measure m-0 text-bone/80">
              <span className="text-bone">Commit<span className="text-glow">·</span>AI</span> &nbsp;·&nbsp; {h.eyebrow}
            </motion.p>
            {/* the page heading: the name and the pitch for search engines and screen readers, the promises on screen */}
            <h1 className="m-0 mt-4">
              <span className="sr-only">Commit·AI — {h.titleA} {h.rotate.join(' ')}</span>
              <Rotator lines={h.rotate} />
            </h1>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7 }} className="mt-6 grid gap-6 border-t border-bone/20 pt-5 md:grid-cols-[1fr_auto] md:items-end">
              <div className="flex flex-col gap-2">
                <Measure className="text-bone/60">{h.by} {SITE.owner}</Measure>
                <p className="m-0 max-w-[560px] text-[17px] leading-[1.55] text-bone/85">{h.titleA} {h.titleB}</p>
              </div>
              <div className="flex items-center gap-4">
                <Btn onClick={onStart} className="gap-10">{h.primary}</Btn>
                <a href="#welcome" aria-label={h.scroll} className="grid size-14 shrink-0 place-items-center rounded-full border border-bone/30 text-bone transition hover:border-glow hover:text-glow">
                  <ArrowDown className="size-5 motion-safe:animate-bounce" strokeWidth={1.5} />
                </a>
              </div>
            </motion.div>
          </Container>
        </motion.div>
      </section>

      <div className="force-dark overflow-hidden border-y border-line bg-night py-5 text-bone" aria-hidden="true">
        <div className="marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {ticker.map((p) => (
                <span key={p + k} className="flex items-center">
                  <span className="display-4 px-8 whitespace-nowrap">{p}</span>
                  <Asterisk className="size-5 text-glow" strokeWidth={2.5} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
