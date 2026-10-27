import { ArrowUpRight } from 'lucide-react';
import { H2, Kicker } from '../components/ui';
import { Reveal } from '../motion';
import { SITE, waLink } from '../data/site';
import { useApp } from '../i18n';

/** "Qui nous sommes": a short, factual story next to the career timeline. */
export function Journey() {
  const { t } = useApp();
  const j = t.journey;
  return (
    <section id="journey" className="border-t border-line bg-bg-alt">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-24">
        <div className="flex min-w-0 flex-col gap-5">
          <Kicker>{j.kicker}</Kicker>
          <H2 className="lg:text-[44px]">{j.title}</H2>
          {j.about.map((p) => <p key={p} className="m-0 max-w-[520px] text-[17px] leading-relaxed text-soft">{p}</p>)}
          <a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-line-strong px-6 font-medium transition hover:border-brand-azure">
            {t.contact.whatsapp} <ArrowUpRight className="size-4.5" />
          </a>
          <span className="sr-only">{SITE.whatsapp.display}</span>
        </div>
        <ol className="m-0 flex min-w-0 list-none flex-col p-0">
          {j.timeline.map(([p, r, o], i) => (
            <li key={r + p}>
              <Reveal delay={i * 0.05} className="flex gap-5">
                <div className="flex w-4 shrink-0 flex-col items-center"><span className={`mt-1.5 size-3.5 rounded-full ${i === 0 ? 'bg-brand shadow-[0_0_0_4px_var(--ca-accent-soft)]' : 'bg-brand-azure'}`} /><span className="w-px flex-1 bg-line" /></div>
                <div className="flex flex-col gap-1 pb-8">
                  <span className="font-mono text-[13px] text-muted">{p}</span>
                  <h3 className="m-0 font-display text-xl font-semibold">{r}</h3>
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
