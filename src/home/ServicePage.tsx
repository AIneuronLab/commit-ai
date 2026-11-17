/**
 * One service explained, in the home page's look: a navy opening with the title, the introduction, the two
 * actions and the tools used; then what we build, the real projects of this service, how working together goes
 * (with the code-ownership and maintenance promises), the contact block with the message form, and a link to the next service.
 * On phones the cards become rows you swipe sideways, as on the home page.
 */
import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { WhatsAppIcon } from '../components/BrandIcons';
import { STACK, stackInitials } from '../data/stack';
import { waLink } from '../data/site';
import { SERVICES_TEXT, SERVICE_ORDER, SERVICE_TOOLS } from '../services/content';
import { servicePath, type ServiceId } from '../lib/route';
import { setPageMeta } from '../lib/meta';
import { useApp } from '../i18n';
import { useCases } from './content';
import { CaseCard, Cta, Footer, Head, Header, SERVICE_ICON, Steps, SwipeHint, useLightTheme } from './Home';
import './home.css';

/** Extra labels of the service pages, in both languages. */
const LABELS = {
  fr: { tools: 'Les outils', buildsTitle: 'Concrètement, nous construisons :', examplesTitle: 'Des projets réels, en production ou livrés.' },
  en: { tools: 'The tools', buildsTitle: 'In practice, we build:', examplesTitle: 'Real projects, live or delivered.' },
} as const;

export function ServicePage({ id, onStart }: { id: ServiceId; onStart: () => void }) {
  const { t, lang } = useApp();
  useLightTheme();
  const ui = t.serviceUi;
  const L = LABELS[lang];
  const card = t.services.items.find((x) => x.id === id)!;
  const text = SERVICES_TEXT[lang][id];
  const i = SERVICE_ORDER.indexOf(id);
  const next = SERVICE_ORDER[(i + 1) % SERVICE_ORDER.length];
  const nextCard = t.services.items.find((x) => x.id === next)!;
  const tools = SERVICE_TOOLS[id].map((name) => STACK.find((s) => s.name === name)).filter((s) => s !== undefined);
  const cases = useCases().filter((c) => c.service === id);
  const Icon = SERVICE_ICON[id];
  const NextIcon = SERVICE_ICON[next];

  useEffect(() => setPageMeta({ path: servicePath(id, lang), title: card.title, description: card.desc }), [id, lang, card.title, card.desc]);

  return (
    <div id="top" className="clean font-sans">
      <Header onStart={onStart} base="/" />
      <main id="main">
        {/* opening: the service, what it is, the two ways to start, the tools */}
        <section className="bg-[var(--c-nav)] text-white">
          <div className="c-wrap grid gap-10 py-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:py-16">
            <div className="flex flex-col items-start gap-5">
              <a href="/#services" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--c-on-nav-2)] hover:text-white"><ArrowLeft className="size-4" aria-hidden="true" />{ui.back}</a>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--c-primary)] text-white"><Icon className="size-[22px]" strokeWidth={1.8} aria-hidden="true" /></span>
                <span className="text-[13px] font-semibold tracking-[0.08em] text-[var(--c-amber)] uppercase">{ui.kicker} 0{i + 1}</span>
              </div>
              <h1 className="text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.08] text-white">{card.title}</h1>
              <p className="max-w-[620px] text-[17.5px] leading-[1.6] text-[var(--c-on-nav-2)]">{text.intro}</p>
              <div className="flex w-full flex-wrap gap-3 pt-1">
                <button type="button" onClick={onStart} className="c-btn c-btn-primary c-btn-lg max-sm:flex-1">{t.nav.cta}<ArrowRight className="size-[18px]" aria-hidden="true" /></button>
                <a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-onnav c-btn-lg max-sm:flex-1"><WhatsAppIcon className="size-[18px]" />WhatsApp</a>
              </div>
            </div>
            <div className="rounded-[16px] bg-white/[0.06] p-5 ring-1 ring-white/10 sm:p-6">
              <p className="mb-4 text-[13px] font-semibold tracking-[0.06em] text-[var(--c-amber)] uppercase">{L.tools}</p>
              <ul className="grid grid-cols-2 gap-2.5">
                {tools.map((x) => (
                  <li key={x.name} className="flex items-center gap-2.5 rounded-[12px] bg-white/[0.06] p-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f5fb]">
                      {x.icon ? <img src={`/stack/${x.icon}.svg`} alt="" width={22} height={22} loading="lazy" className="size-[22px]" /> : <span className="text-[12px] font-bold text-[#14304f]">{stackInitials(x.name)}</span>}
                    </span>
                    <span className="truncate text-[14.5px] font-semibold">{x.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* what we build */}
        <section className="c-wrap py-12 lg:py-16">
          <Head kicker={ui.builds} title={L.buildsTitle} />
          <ul className="c-swipe md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {text.builds.map((b, k) => (
              <li key={b.t} className="c-card flex flex-col gap-3 p-5">
                <span className="self-start rounded-md bg-[var(--c-amber)] px-1.5 py-px text-[12px] font-bold text-[var(--c-nav)] tabular-nums">0{k + 1}</span>
                <h3 className="text-[18px] leading-[1.25]">{b.t}</h3>
                <p className="text-[15px] leading-[1.6] text-soft">{b.d}</p>
              </li>
            ))}
          </ul>
          <SwipeHint />
        </section>

        {/* the real projects of this service */}
        {cases.length > 0 && (
          <section className="border-y border-line bg-bg-alt">
            <div className="c-wrap py-12 lg:py-16">
              <Head kicker={ui.examples} title={L.examplesTitle} />
              {cases.length === 1 ? (
                <CaseCard c={cases[0]} lead />
              ) : (
                <>
                  <ul className="c-swipe md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                    {cases.map((c) => <li key={c.key}><CaseCard c={c} /></li>)}
                  </ul>
                  <SwipeHint />
                </>
              )}
            </div>
          </section>
        )}

        {/* how working together goes, then the two promises the steps do not already say */}
        <section className="c-wrap py-12 lg:py-16">
          <Head kicker={ui.how} title={t.how.title} lead={t.how.titleB} />
          <Steps />
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {ui.getItems.slice(3).map((g) => (
              <li key={g} className="flex items-start gap-2.5 rounded-[12px] bg-bg-alt px-4 py-3 text-[15px] leading-[1.5] font-medium"><Check className="mt-0.5 size-4 shrink-0 text-[var(--c-primary)]" strokeWidth={2.5} aria-hidden="true" />{g}</li>
            ))}
          </ul>
        </section>

        <Cta />

        {/* the next service */}
        <section className="c-wrap pb-12 lg:pb-16">
          <a href={servicePath(next, lang)} className="c-card group flex items-center gap-4 p-5 transition hover:border-line-strong hover:shadow-[var(--c-sh-2)] sm:p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"><NextIcon className="size-6" strokeWidth={1.8} aria-hidden="true" /></span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[13px] font-semibold tracking-[0.06em] text-muted uppercase">{ui.next}</span>
              <span className="font-logo text-[clamp(1.25rem,2.4vw,1.6rem)] leading-tight font-bold tracking-[-0.02em]">{nextCard.title}</span>
            </span>
            <ArrowRight className="size-6 shrink-0 text-accent transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </section>
      </main>
      <Footer base="/" />
    </div>
  );
}
