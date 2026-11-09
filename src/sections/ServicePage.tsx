import { useEffect, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react';
import { Btn, Container, Measure } from '../components/ui';
import { AppCard, BookingCard, CodePanel, RunLog } from '../components/Vignettes';
import { Reveal } from '../motion';
import { STACK, stackInitials } from '../data/stack';
import { waLink } from '../data/site';
import { SERVICES_TEXT, SERVICE_ORDER, SERVICE_TOOLS } from '../services/content';
import { servicePath, type ServiceId } from '../lib/route';
import { setPageMeta } from '../lib/meta';
import { useApp } from '../i18n';

const VISUAL: Record<ServiceId, () => ReactNode> = {
  automation: () => <RunLog className="w-full max-w-[440px]" />,
  web: () => <BookingCard className="w-full max-w-[380px]" />,
  mobile: () => <AppCard />,
  api: () => <CodePanel className="w-full max-w-[440px]" />,
};

/** A section of the page: a ruled row with its number and title on the left, the content on the right. */
function Part({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line py-12 md:grid-cols-[260px_1fr] md:gap-12 lg:py-16">
      <h2 className="m-0 flex gap-3 text-[19px] leading-snug font-semibold text-fg"><span className="measure pt-1.5">0{n}</span>{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/**
 * One service explained: a night header with the title, the introduction, the two actions and a small product
 * view; then what we build, real examples, how working together goes, the tools, what you get, and a link to the
 * next service.
 */
export function ServicePage({ id, onStart }: { id: ServiceId; onStart: () => void }) {
  const { t, lang } = useApp();
  const ui = t.serviceUi;
  const card = t.services.items.find((x) => x.id === id)!;
  const text = SERVICES_TEXT[lang][id];
  const i = SERVICE_ORDER.indexOf(id);
  const next = SERVICE_ORDER[(i + 1) % SERVICE_ORDER.length];
  const nextCard = t.services.items.find((x) => x.id === next)!;
  const tools = SERVICE_TOOLS[id].map((name) => STACK.find((s) => s.name === name)).filter((s) => s !== undefined);

  useEffect(() => setPageMeta({ path: servicePath(id, lang), title: card.title, description: card.desc }), [id, lang, card.title, card.desc]);

  let n = 0;
  return (
    <main id="main">
      <section className="force-dark relative overflow-hidden bg-night text-bone">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_60%_at_75%_45%,color-mix(in_srgb,var(--color-glow)_16%,transparent),transparent_70%)]" />
        <Container className="relative grid gap-14 pt-32 pb-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16 lg:pt-40 lg:pb-28">
          <div className="flex flex-col">
            <a href="/#services" className="measure inline-flex items-center gap-2 self-start text-bone/70 transition-colors hover:text-bone"><ArrowLeft className="size-3.5" aria-hidden="true" />{ui.back}</a>
            <Measure className="mt-10 text-glow">{ui.kicker} 0{i + 1} / {card.tags.join(' · ')}</Measure>
            <h1 className="display-2 m-0 mt-4 text-bone">{card.title}</h1>
            <p className="m-0 mt-6 max-w-[580px] text-[19px] leading-[1.6] text-bone/80">{text.intro}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Btn onClick={onStart} className="min-w-[260px]">{t.nav.cta}</Btn>
              <a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" className="btn btn-line min-w-[200px] border-bone/30 text-bone hover:border-bone">WhatsApp<MessageCircle className="size-5" strokeWidth={1.5} aria-hidden="true" /></a>
            </div>
          </div>
          <Reveal className="flex justify-center [&>*]:shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]">{VISUAL[id]()}</Reveal>
        </Container>
      </section>

      <Container className="py-8 lg:py-12">
        <Part n={++n} title={ui.builds}>
          <ul className="m-0 grid list-none gap-x-10 gap-y-8 p-0 sm:grid-cols-2">
            {text.builds.map((b) => (
              <li key={b.t} className="flex flex-col gap-2">
                <h3 className="display-4 m-0 text-fg">{b.t}</h3>
                <p className="m-0 text-[16px] leading-[1.65] text-soft">{b.d}</p>
              </li>
            ))}
          </ul>
        </Part>

        {text.examples.length > 0 && (
          <Part n={++n} title={ui.examples}>
            <div className="flex flex-col gap-4">
              {text.examples.map((x) => (
                <article key={x.title} className="flex flex-col gap-3 border border-line bg-card p-6 sm:p-8">
                  <Measure>{x.client}</Measure>
                  <h3 className="m-0 text-[20px] font-semibold text-fg">{x.title}</h3>
                  <p className="m-0 font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-tight text-accent uppercase">{x.result}</p>
                  <p className="m-0 text-[16px] leading-[1.65] text-soft">{x.desc}</p>
                  {x.url && <a href={x.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 self-start text-[15px] font-medium text-accent hover:underline">{ui.visit}<ArrowUpRight className="size-4" aria-hidden="true" /></a>}
                </article>
              ))}
            </div>
          </Part>
        )}

        <Part n={++n} title={ui.how}>
          <ol className="m-0 grid list-none gap-8 p-0 md:grid-cols-3">
            {t.how.steps.map((s, k) => (
              <li key={s.t} className="flex flex-col gap-2">
                <Measure>0{k + 1} / {s.tag}</Measure>
                <h3 className="m-0 text-[18px] font-semibold text-fg">{s.t}</h3>
                <p className="m-0 text-[15.5px] leading-[1.6] text-soft">{s.d}</p>
              </li>
            ))}
          </ol>
        </Part>

        <Part n={++n} title={ui.tools}>
          <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
            {tools.map((x) => (
              <li key={x.name} className="flex items-center gap-3 rounded-full border border-line bg-card py-1.5 pr-4 pl-1.5">
                <span className="grid size-9 place-items-center rounded-full bg-[#f3f7fc]">
                  {x.icon ? <img src={`/stack/${x.icon}.svg`} alt="" width={22} height={22} loading="lazy" /> : <span className="text-[12px] font-bold text-[#14304f]">{stackInitials(x.name)}</span>}
                </span>
                <span className="text-[15px] font-medium text-fg">{x.name}</span>
              </li>
            ))}
          </ul>
        </Part>

        <Part n={++n} title={ui.get}>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {ui.getItems.map((g) => (
              <li key={g} className="flex gap-3 text-[16px] leading-[1.6] text-soft"><ArrowRight className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />{g}</li>
            ))}
          </ul>
        </Part>

        <a href={servicePath(next, lang)} className="group flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-10 pb-6">
          <Measure>{ui.next}</Measure>
          <span className="display-3 flex items-center gap-4 text-fg transition-colors group-hover:text-accent">{nextCard.title}<ArrowRight className="size-8 transition-transform group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" /></span>
        </a>
      </Container>
    </main>
  );
}
