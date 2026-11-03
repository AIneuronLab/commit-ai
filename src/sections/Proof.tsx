import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { Container, Kinetic, Measure } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

/** A figure like "10+" or "50–60" whose last number counts up from zero when it scrolls into view. */
function CountUp({ value }: { value: string }) {
  const host = useRef<HTMLSpanElement>(null);
  const seen = useInView(host, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const m = value.match(/^(.*?)(\d+)(\D*)$/);
  const target = m ? Number(m[2]) : 0;
  const counts = !!m;
  const [n, setN] = useState(reduce || !counts ? target : 0);
  useEffect(() => {
    if (!seen || reduce || !counts) return;
    const c = animate(0, target, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [seen, reduce, target, counts]);
  return <span ref={host}>{m ? `${m[1]}${n}${m[3]}` : value}</span>;
}

/**
 * 01 / Welcome: the one-line promise set as a giant poster title, a photo, the explanation,
 * and the four real figures counting up.
 */
export function Welcome() {
  const { t } = useApp();
  const s = t.statement;
  return (
    <section id="welcome" className="py-24 lg:py-36">
      <Container className="flex flex-col gap-14 lg:gap-20">
        <div className="flex items-baseline justify-between gap-6 border-t border-line pt-4">
          <Measure>01 / {t.welcome.kicker}</Measure>
          <Measure className="hidden text-right sm:inline">{t.welcome.aside}</Measure>
        </div>
        <Kinetic text={s.a} className="display-2 max-w-[1150px] text-fg" />
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal className="relative">
            <img src="/activityconnect.webp" alt={t.hero.showcaseAlt} width={765} height={575} loading="lazy" className="block aspect-[4/3] w-full object-cover grayscale-[35%]" />
            <Measure className="mt-3 block">{t.hero.showcaseCaption}</Measure>
          </Reveal>
          <div className="flex flex-col gap-12">
            <Reveal><p className="m-0 max-w-[560px] text-[19px] leading-[1.6] text-soft">{s.b}</p></Reveal>
            <dl className="m-0 grid grid-cols-2 gap-x-8 gap-y-10">
              {t.metrics.map((m, i) => (
                <Reveal key={m.label} delay={i * 0.06} className="flex flex-col gap-2 border-t border-line pt-4">
                  <dd className="m-0 font-display text-[clamp(3rem,6vw,5.5rem)] leading-none text-fg tabular-nums"><CountUp value={m.value} /></dd>
                  <dt className="order-last text-[15px] text-muted">{m.label}</dt>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
