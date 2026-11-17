/**
 * The home page: a solid navy header, blue for every action and amber for what to notice, flat white cards,
 * sentence-case titles, the Dakar photo and the 3D logo in the hero. Light only for now. On phones the long lists
 * (projects, services, method, stack) become rows you swipe sideways.
 * Colours and the few shared classes (c-btn, c-card, c-swipe…) are in home.css; its own copy in content.ts.
 */
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { sendMessage, type Status } from '../sections/Contact';
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarClock, Check, ChevronDown, FileText, Layers, Mail, MapPin, MonitorSmartphone, PhoneCall, Rocket, ServerCog, Smartphone, Workflow } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { GitHubIcon, WhatsAppIcon } from '../components/BrandIcons';
import { SITE, waLink } from '../data/site';
import { SERVICE_ORDER, SERVICES_TEXT } from '../services/content';
import { STACK, stackInitials, type StackGroup } from '../data/stack';
import { pathFor, servicePath, type ServiceId } from '../lib/route';
import { useApp } from '../i18n';
import github from '../data/github.json';
import { COPY, useCases, type Case } from './content';
import './home.css';

type Start = { onStart: () => void };

const SERVICE_ICON: Record<ServiceId, typeof Check> = { web: MonitorSmartphone, automation: Workflow, mobile: Smartphone, api: ServerCog };
/** The short label of the header button on phones. */
const START = { fr: 'Démarrer', en: 'Start' } as const;

/** Under a row that swipes sideways on phones: tells the visitor there is more to the right. Hidden on wider screens. */
function SwipeHint() {
  const { lang } = useApp();
  return <p aria-hidden="true" className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted md:hidden">{lang === 'fr' ? 'Faites glisser pour voir la suite' : 'Swipe to see more'}<ArrowRight className="size-3.5" /></p>;
}

/** Section opening: a small blue label, the title, an optional line under it. */
function Head({ kicker, title, lead }: { kicker: string; title: string; lead?: ReactNode }) {
  return (
    <div className="mb-7 flex max-w-[680px] flex-col gap-2 lg:mb-9">
      <span className="c-kicker">{kicker}</span>
      <h2 className="text-[clamp(1.6rem,2.8vw,2.15rem)] leading-[1.15]">{title}</h2>
      {lead && <p className="text-[16.5px] text-soft">{lead}</p>}
    </div>
  );
}

function Header({ onStart }: Start) {
  const { t, lang, toggleLang } = useApp();
  return (
    <header className="sticky top-0 z-40 bg-[var(--c-nav)] pt-[env(safe-area-inset-top,0px)] text-white">
      <div className="c-wrap flex h-16 items-center gap-2 lg:h-[72px] lg:gap-3">
        <a href="#top" aria-label="Commit·AI" className="mr-auto shrink-0"><Logo size={30} variant="dark" /></a>
        <button type="button" onClick={toggleLang} aria-label={t.a11y.switchLang} className="flex h-10 items-center rounded-lg px-2.5 text-[14px] font-semibold text-[var(--c-on-nav-2)] hover:bg-white/10 hover:text-white">{lang === 'fr' ? 'EN' : 'FR'}</button>
        <a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-onnav c-btn-sm max-md:hidden"><WhatsAppIcon className="size-4" />WhatsApp</a>
        <button type="button" onClick={onStart} className="c-btn c-btn-primary c-btn-sm">
          <span className="sm:hidden">{START[lang]}</span><span className="max-sm:hidden">{t.nav.cta}</span>
        </button>
      </div>
    </header>
  );
}

/** The chapters of the page as one row of links under the header; it scrolls sideways on phones. */
function Chapters() {
  const { t, lang } = useApp();
  const items: [string, string, typeof Check][] = [
    ['work', COPY[lang].work.kicker, Rocket],
    ['services', t.nav.services, MonitorSmartphone],
    ['process', t.nav.process, CalendarClock],
    ['journey', t.nav.journey, BadgeCheck],
    ['stack', t.stack.title, Layers],
    ['faq', t.nav.faq, FileText],
    ['contact', t.nav.contact, PhoneCall],
  ];
  return (
    <nav aria-label={t.a11y.menu} className="border-b border-line bg-bg">
      <ul className="c-wrap flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map(([id, label, Icon]) => (
          <li key={id} className="shrink-0">
            <a href={`#${id}`} className="inline-flex items-center gap-2 border-b-[3px] border-transparent px-3 pt-3.5 pb-3 text-[14.5px] font-semibold whitespace-nowrap text-soft transition-colors hover:border-[var(--c-amber)] hover:text-fg">
              <Icon className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />{label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * The 3D logo (three/logoScene.ts, the same scene as today's opening screen) drawn without its background, so it
 * sits over the hero photo. three.js loads only after the page has rendered; without WebGL the 2D logo shows.
 */
function Logo3D({ className = '' }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;
    import('../three/logoScene')
      .then(({ startLogoScene }) => {
        if (cancelled || !host.current || !canvas.current || !hint.current) return;
        try { stop = startLogoScene(host.current, canvas.current, hint.current, { transparent: true }); } catch { if (!cancelled) setFailed(true); }
      })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; stop?.(); };
  }, []);
  return (
    <div ref={host} aria-hidden="true" className={`relative cursor-pointer touch-pan-y ${className}`}>
      {failed && <div className="absolute inset-0 grid place-items-center"><Logo size={72} variant="dark" animated /></div>}
      <canvas ref={canvas} className={`absolute inset-0 block size-full ${failed ? 'hidden' : ''}`} />
      <div ref={hint} hidden />
    </div>
  );
}

/** The words of the hero headline shown in amber, in each language. */
const HIGHLIGHT = { fr: 'sur mesure', en: 'custom software' } as const;

/** `text` with `words` (if it contains them) in amber. */
function Highlight({ text, words }: { text: string; words: string }) {
  const at = text.indexOf(words);
  if (at < 0) return <>{text}</>;
  return <>{text.slice(0, at)}<span className="text-[var(--c-amber)]">{words}</span>{text.slice(at + words.length)}</>;
}

/**
 * The opening: the Dakar photo from today's page under a navy veil, the presentation of Commit·AI on the left,
 * the 3D logo on the right (under the buttons on phones).
 */
function Hero({ onStart }: Start) {
  const { t, lang } = useApp();
  const h = t.hero;
  return (
    <section className="relative isolate overflow-hidden bg-[var(--c-nav)] text-white">
      <picture className="absolute inset-0 -z-10 block">
        <source media="(max-width: 767px)" srcSet="/dakar-hero-portrait.webp" />
        <img src="/dakar-hero-1920.webp" alt="" fetchPriority="high" className="size-full object-cover object-[50%_40%]" />
      </picture>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(10_23_48/0.94)_0%,rgb(10_23_48/0.82)_45%,rgb(10_23_48/0.55)_100%)] max-lg:bg-[linear-gradient(180deg,rgb(10_23_48/0.9)_0%,rgb(10_23_48/0.86)_100%)]" />
      <div className="c-wrap grid items-center gap-6 py-12 lg:min-h-[620px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10 lg:py-16">
        <div className="flex flex-col items-start gap-5">
          <p className="inline-flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.08em] text-[var(--c-amber)] uppercase">Commit·AI · {h.eyebrow}</p>
          <h1 className="text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.06] text-white"><Highlight text={h.titleA} words={HIGHLIGHT[lang]} /></h1>
          <p className="max-w-[540px] text-[17.5px] leading-[1.6] text-[var(--c-on-nav-2)]">{h.titleB} {t.statement.b}</p>
          <div className="flex w-full flex-wrap gap-3 pt-1">
            <button type="button" onClick={onStart} className="c-btn c-btn-primary c-btn-lg max-sm:flex-1">{h.primary}<ArrowRight className="size-[18px]" aria-hidden="true" /></button>
            <a href="#work" className="c-btn c-btn-alt c-btn-lg max-sm:flex-1">{h.secondary}</a>
          </div>
          <span className="inline-flex items-center gap-2 text-[13.5px] text-[var(--c-on-nav-2)]"><i className="size-2 rounded-full bg-mint" aria-hidden="true" />{h.availability}</span>
        </div>
        <Logo3D className="h-[280px] sm:h-[340px] lg:h-[520px]" />
      </div>
    </section>
  );
}

/** The real figures in one card. */
function Metrics() {
  const { t } = useApp();
  return (
    <section aria-label={t.metricsKicker} className="c-wrap pt-10 lg:pt-12">
      <dl className="c-card m-0 grid grid-cols-3 overflow-hidden">
        {t.metrics.map((m, i) => (
          <div key={m.label} className={`flex flex-col gap-1.5 border-line p-3.5 sm:p-5 lg:p-6 ${i ? 'border-l' : ''}`}>
            <dd className="m-0 flex flex-col gap-3 font-logo text-[clamp(1.8rem,3vw,2.4rem)] leading-none font-bold tracking-[-0.03em] tabular-nums"><i className="h-1 w-8 rounded-full bg-[var(--c-amber)]" aria-hidden="true" />{m.value}</dd>
            <dt className="order-last text-[13px] leading-snug text-muted sm:text-[14.5px]">{m.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/**
 * One project as a card, words only: its service icon and who it was for, the title, the result in an amber
 * badge, what it does, and its links (the service page, the live site). `lead` is the first project, set larger.
 */
function CaseCard({ c, lead = false }: { c: Case; lead?: boolean }) {
  const { t, lang } = useApp();
  const Icon = SERVICE_ICON[c.service];
  return (
    <article className={`c-card flex h-full flex-col gap-3 p-5 transition duration-200 hover:border-line-strong hover:shadow-[var(--c-sh-2)] lg:p-6 ${lead ? 'lg:gap-4 lg:p-8' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent" title={c.serviceTitle}><Icon className="size-[18px]" strokeWidth={1.8} aria-hidden="true" /></span>
        <span className="text-[12.5px] font-semibold tracking-[0.04em] text-muted uppercase">{c.client}</span>
      </div>
      <h3 className={`mt-1 leading-[1.15] ${lead ? 'text-[clamp(1.6rem,2.6vw,2.2rem)]' : 'text-[21px]'}`}>{c.title}</h3>
      <span className="c-badge self-start bg-[var(--c-amber)] text-[var(--c-nav)]"><BadgeCheck className="size-3.5 shrink-0" aria-hidden="true" />{c.result}</span>
      <p className={`leading-[1.6] text-soft ${lead ? 'max-w-[620px] text-[16.5px]' : 'text-[15px]'}`}>{c.desc}</p>
      <p className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-2 text-[14.5px] font-semibold">
        <a href={servicePath(c.service, lang)} className="inline-flex items-center gap-1 text-accent hover:underline">{c.serviceTitle}<ArrowRight className="size-4" aria-hidden="true" /></a>
        {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-soft hover:text-fg hover:underline">{t.serviceUi.visit}<ArrowUpRight className="size-4" aria-hidden="true" /></a>}
      </p>
    </article>
  );
}

/**
 * Work: the projects as word-only cards; the first (ActivityConnect, a client's live site) is twice as wide.
 * On phones they sit in one row you swipe sideways, so the section stays about a screen long.
 */
function Work() {
  const { lang } = useApp();
  const w = COPY[lang].work;
  const cases = useCases();
  return (
    <section id="work" className="c-wrap scroll-mt-20 py-12 lg:py-16">
      <Head kicker={w.kicker} title={w.title} lead={w.lead} />
      {/* phones: one row you swipe sideways, the next card peeking in; wider screens: a grid */}
      <ul className="c-swipe md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {cases.map((c, i) => (
          <li key={c.key} className={i === 0 ? 'md:col-span-2' : ''}><CaseCard c={c} lead={i === 0} /></li>
        ))}
      </ul>
      <SwipeHint />
    </section>
  );
}

/**
 * Services: what we build, as one ruled list. Each row: the service and its short description on the left, the
 * four kinds of things it covers on the right. No pictures and no project names: those are in Work.
 */
function Services({ onStart }: Start) {
  const { t, lang } = useApp();
  const s = t.services;
  return (
    <section id="services" className="scroll-mt-20 border-y border-line bg-bg-alt">
      <div className="c-wrap py-12 lg:py-16">
        <Head kicker={s.kicker} title={s.title} lead={s.titleB} />
        <ul className="c-swipe md:divide-y md:divide-line md:overflow-hidden md:rounded-[16px] md:border md:border-line md:bg-bg">
          {SERVICE_ORDER.map((id, i) => {
            const item = s.items.find((x) => x.id === id)!;
            const Icon = SERVICE_ICON[id];
            return (
              <li key={id} className="flex max-md:rounded-[16px] max-md:border max-md:border-line max-md:bg-bg">
                <a href={servicePath(id, lang)} className="group grid w-full content-start gap-3 p-5 transition-colors sm:gap-5 hover:bg-bg-alt lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_auto] lg:items-center lg:gap-10 lg:p-7">
                  <div className="flex gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--c-primary)] text-[var(--c-on-primary)]"><Icon className="size-6" strokeWidth={1.8} aria-hidden="true" /></span>
                    <div className="flex flex-col gap-1.5">
                      <span className="self-start rounded-md bg-[var(--c-amber)] px-1.5 py-px text-[12px] font-bold text-[var(--c-nav)] tabular-nums">0{i + 1}</span>
                      <h3 className="text-[20px] leading-[1.2]">{item.title}</h3>
                      <p className="text-[15px] leading-[1.55] text-soft">{item.desc}</p>
                    </div>
                  </div>
                  <ul aria-label={t.serviceUi.builds} className="grid gap-x-6 gap-y-2.5 max-sm:hidden sm:grid-cols-2">
                    {SERVICES_TEXT[lang][id].builds.map((b) => (
                      <li key={b.t} className="flex items-start gap-2 text-[14.5px] font-medium leading-[1.4]"><Check className="mt-0.5 size-4 shrink-0 text-[var(--c-primary)]" strokeWidth={2.5} aria-hidden="true" />{b.t}</li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1 text-[14.5px] font-semibold whitespace-nowrap text-accent group-hover:underline">{t.serviceUi.more}<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
                </a>
              </li>
            );
          })}
        </ul>
        <SwipeHint />
        <p className="mt-6 text-[15.5px] text-soft">{s.more} <button type="button" onClick={onStart} className="cursor-pointer font-semibold text-accent hover:underline">{s.moreHint}</button></p>
      </div>
    </section>
  );
}

function Method() {
  const { t } = useApp();
  const h = t.how;
  return (
    <section id="process" className="scroll-mt-20">
      <div className="c-wrap py-12 lg:py-16">
        <Head kicker={h.kicker} title={h.title} lead={h.titleB} />
        <ol className="c-swipe md:grid md:gap-4 lg:grid-cols-3">
          {h.steps.map((s, i) => (
            <li key={s.t} className="c-card flex flex-col gap-3 p-5 lg:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-[var(--c-amber)] font-logo text-[15px] font-bold text-[var(--c-nav)]" aria-hidden="true">{i + 1}</span>
                <span className="c-badge bg-[var(--c-amber)] text-[var(--c-nav)]">{s.tag.split(' · ').pop()}</span>
              </div>
              <h3 className="text-[19px] leading-[1.25]">{s.t}</h3>
              <p className="text-[15px] leading-[1.6] text-soft">{s.d}</p>
            </li>
          ))}
        </ol>
        <SwipeHint />
      </div>
    </section>
  );
}

/** About: who builds, and the career as a plain list (no globe, so the 3D library is never downloaded). */
function About() {
  const { t, lang } = useApp();
  const j = t.journey;
  return (
    <section id="journey" className="c-wrap scroll-mt-20 py-12 lg:py-16">
      <Head kicker={j.kicker} title={j.title} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <article className="c-card flex flex-col gap-5 p-5 sm:flex-row lg:p-6">
          <img src="/portrait.jpg" alt={j.portraitAlt} width={703} height={1080} loading="lazy" className="aspect-[4/5] w-full max-w-[190px] shrink-0 self-start rounded-xl object-cover object-[50%_15%] max-sm:hidden" />
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center gap-3.5">
              <img src="/portrait.jpg" alt="" width={703} height={1080} loading="lazy" className="size-16 shrink-0 rounded-full object-cover object-[50%_15%] sm:hidden" />
              <div>
                <h3 className="text-[21px] leading-[1.2]">{SITE.owner}</h3>
                <p className="text-[14.5px] font-medium text-accent">{j.role}</p>
              </div>
            </div>
            {j.about.map((p) => <p key={p} className="text-[15.5px] leading-[1.6] text-soft">{p}</p>)}
            <a href={SITE.github.url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 pt-1 text-[14.5px] text-soft hover:text-fg">
              <GitHubIcon className="size-4 shrink-0" /><span><b className="font-semibold text-fg tabular-nums">{github.contributions.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}</b> {j.github}</span>
            </a>
          </div>
        </article>
        <article className="c-card p-5 lg:p-6">
          <h3 className="mb-3 text-[17px]">{j.timelineTitle}</h3>
          <ol className="divide-y divide-line">
            {j.timeline.map(([when, role, place]) => (
              <li key={when + role} className="relative grid grid-cols-[96px_1fr] gap-3 py-3 pl-4 first:pt-0 last:pb-0 before:absolute before:top-[1.15rem] before:left-0 before:size-2 before:rounded-full before:bg-[var(--c-amber)] first:before:top-[0.4rem]">
                <span className="pt-px text-[13.5px] font-medium text-muted tabular-nums">{when}</span>
                <span className="flex flex-col"><b className="text-[15px] font-semibold">{role}</b><span className="text-[14px] text-muted">{place}</span></span>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}

/**
 * The stack: the same tools, category filter and five-step levels as today's page, as flat cards
 * (no tilt and no glow under the pointer). On phones, two rows of small cards (name and level) that swipe sideways.
 */
function Stack() {
  const { t, lang } = useApp();
  const s = t.stack;
  const [group, setGroup] = useState<StackGroup | 'all'>('all');
  const groups = [...new Set(STACK.map((x) => x.group))];
  const shown = STACK.filter((x) => group === 'all' || x.group === group);
  const tab = (id: StackGroup | 'all', label: string) => (
    <li key={id}>
      <button type="button" aria-pressed={group === id} onClick={() => setGroup(id)}
        className="cursor-pointer rounded-full border border-line-strong bg-bg px-3.5 py-2 text-[14px] font-semibold text-soft transition-colors hover:border-[var(--c-primary)] hover:text-fg aria-pressed:border-[var(--c-primary)] aria-pressed:bg-[var(--c-primary)] aria-pressed:text-[var(--c-on-primary)]">
        {label}
      </button>
    </li>
  );
  return (
    <section id="stack" className="c-wrap scroll-mt-20 pb-12 lg:pb-16">
      <Head kicker={s.title} title={s.lead} />
      <ul aria-label={s.filter} className="mb-5 flex flex-wrap gap-2">
        {tab('all', s.all)}
        {groups.map((g) => tab(g, s.groups[g]))}
      </ul>
      <ul className="grid gap-2.5 max-sm:-mx-4 max-sm:auto-cols-[44%] max-sm:grid-flow-col max-sm:grid-rows-2 max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto max-sm:scroll-px-4 max-sm:px-4 max-sm:pb-2 max-sm:[scrollbar-width:none] sm:grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] sm:gap-4">
        {shown.map((x) => {
          const lv = Math.max(1, Math.min(5, x.level));
          return (
            <li key={x.name} className="c-card flex snap-start items-center gap-2.5 p-3 sm:items-stretch sm:gap-3.5 sm:p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg-alt sm:size-11 sm:rounded-xl">
                {x.icon ? <img src={`/stack/${x.icon}.svg`} alt="" width={26} height={26} loading="lazy" className="size-[26px]" /> : <span className="text-[14px] font-bold text-brand-navy">{stackInitials(x.name)}</span>}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="truncate text-[15px] leading-tight sm:text-[16.5px]">{x.name}</h3>
                  <span className="shrink-0 text-[12.5px] font-medium text-muted max-sm:hidden">{s.groups[x.group]}</span>
                </div>
                <p className="text-[14px] leading-[1.5] text-soft max-sm:hidden">{x.use[lang]}</p>
                <div className="mt-auto flex items-center gap-2 pt-1 text-[12.5px] text-muted sm:pt-1.5" aria-label={`${s.level} : ${s.levels[lv]}`}>
                  <span className="flex gap-1" aria-hidden="true">{[1, 2, 3, 4, 5].map((d) => <i key={d} className={`size-2.5 rounded-[3px] ${d <= lv ? 'bg-[var(--c-amber)]' : 'bg-card-alt'}`} />)}</span>
                  <span aria-hidden="true" className="max-sm:hidden">{s.levels[lv]}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <SwipeHint />
    </section>
  );
}

function Faq() {
  const { t } = useApp();
  const f = t.faq;
  return (
    <section id="faq" className="scroll-mt-20 border-y border-line bg-bg-alt">
      <div className="c-wrap grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-14 lg:py-16">
        <div className="flex flex-col gap-2 lg:sticky lg:top-24 lg:self-start">
          <span className="c-kicker">{f.kicker}</span>
          <h2 className="text-[clamp(1.6rem,2.8vw,2.15rem)] leading-[1.15]">{f.title}</h2>
          <p className="text-[16px] text-soft">{f.lead} <a href="#contact" className="font-semibold text-accent hover:underline">{t.nav.contact}</a></p>
        </div>
        <div className="c-card divide-y divide-line overflow-hidden">
          {f.items.map(([q, a]) => (
            <details key={q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16.5px] font-semibold transition-colors hover:bg-bg-alt [&::-webkit-details-marker]:hidden">
                {q}<ChevronDown className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 text-[15.5px] leading-[1.65] text-soft">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The call to action: a navy block with the two ways to start and the contact details. */
/** The message form of the contact block. Sending works as on today's page (sendMessage in sections/Contact). */
function MessageForm() {
  const { t, lang } = useApp();
  const f = t.contact.form;
  const [status, setStatus] = useState<Status>('idle');
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setStatus(await sendMessage(e.currentTarget));
  }
  const input = 'min-h-[46px] w-full rounded-[10px] border border-line-strong bg-bg px-3.5 text-[16px] text-fg outline-none transition placeholder:text-muted focus:border-[var(--c-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--c-primary)_20%,transparent)]';
  const label = 'flex flex-col gap-1.5 text-[14px] font-semibold text-fg';
  return (
    <form id="message" onSubmit={onSubmit} className="flex scroll-mt-24 flex-col gap-4 rounded-[16px] bg-bg p-5 text-fg sm:p-7">
      <h3 className="text-[20px]">{f.title}</h3>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>{f.name}<input name="name" required autoComplete="name" className={input} /></label>
        <label className={label}>{f.email}<input name="email" type="email" required autoComplete="email" inputMode="email" className={input} /></label>
      </div>
      <label className={label}>{f.message}<textarea name="message" required rows={4} placeholder={f.placeholder} className={`${input} resize-y py-3`} /></label>
      {/* required: the form cannot be sent until the visitor agrees to be contacted back */}
      <label className="flex cursor-pointer items-start gap-2.5 text-[13.5px] leading-[1.5] text-soft">
        <input type="checkbox" name="consent" required className="mt-0.5 size-[18px] shrink-0 cursor-pointer accent-[var(--c-primary)]" />
        <span>{COPY[lang].consent} <a href={pathFor('privacy', lang)} className="text-accent underline underline-offset-4">{t.legal.privacyLink}</a>.</span>
      </label>
      <button type="submit" disabled={status === 'sending'} className="c-btn c-btn-primary c-btn-lg self-start disabled:opacity-60 max-sm:w-full">{status === 'sending' ? f.sending : f.send}<ArrowRight className="size-[18px]" aria-hidden="true" /></button>
      <p role="status" aria-live="polite" className={`min-h-5 text-[14px] font-medium ${status === 'error' ? 'text-warn' : 'text-ok'}`}>
        {status === 'sent' && <span className="inline-flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{f.sent}</span>}
        {status === 'mailto' && f.mailto}
        {status === 'error' && f.error}
      </p>
    </form>
  );
}

/** The contact block: on navy, the invitation and the direct ways to reach us on the left, the message form on the right. */
function Cta() {
  const { t } = useApp();
  const row = 'inline-flex items-center gap-2';
  return (
    <section id="contact" className="c-wrap scroll-mt-20 py-12 lg:py-16">
      <div className="grid gap-8 rounded-[20px] bg-[var(--c-nav)] p-5 text-white sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-12 lg:p-12">
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.06em] text-[var(--c-amber)] uppercase">{t.nav.contact}</span>
          <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.12]">{t.cta.title}</h2>
          <p className="text-[16.5px] text-[var(--c-on-nav-2)]">{t.contact.lead}</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-[15px] text-[var(--c-on-nav-2)]">
            <li><a href={`mailto:${SITE.email}`} className={`${row} hover:text-white`}><Mail className="size-4" aria-hidden="true" />{SITE.email}</a></li>
            <li><a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" className={`${row} hover:text-white`}><WhatsAppIcon className="size-4" />{SITE.whatsapp.display}</a></li>
            <li className={row}><MapPin className="size-4" aria-hidden="true" />{t.footer.location}</li>
          </ul>
          <a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-onnav c-btn-lg mt-5 self-start max-sm:w-full"><WhatsAppIcon className="size-[18px]" />{t.contact.whatsapp}</a>
        </div>
        <MessageForm />
      </div>
    </section>
  );
}

function Footer() {
  const { t, lang } = useApp();
  const f = t.footer;
  const link = 'text-[14.5px] text-soft hover:text-fg hover:underline';
  const col = 'flex flex-col gap-2.5';
  const title = 'text-[13px] font-semibold tracking-[0.06em] text-fg uppercase';
  const chapters = ['services', 'process', 'journey', 'faq'] as const;
  return (
    <footer className="border-t border-line bg-bg-alt">
      <div className="c-wrap grid grid-cols-2 gap-8 py-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:py-12">
        <div className="flex flex-col items-start gap-3 max-sm:col-span-2">
          <Logo size={30} variant="light" />
          <p className="max-w-[320px] text-[14.5px] text-soft">{f.tagline}</p>
        </div>
        <nav aria-label={f.offer} className={col}>
          <span className={title}>{f.offer}</span>
          {SERVICE_ORDER.map((id) => <a key={id} href={servicePath(id, lang)} className={link}>{t.services.items.find((x) => x.id === id)!.title}</a>)}
        </nav>
        <nav aria-label={f.explore} className={col}>
          <span className={title}>{f.explore}</span>
          <a href="#work" className={link}>{COPY[lang].work.kicker}</a>
          {chapters.map((id) => <a key={id} href={`#${id}`} className={link}>{t.nav[id]}</a>)}
        </nav>
        <div className={`${col} max-sm:col-span-2`}>
          <span className={title}>{f.reach}</span>
          <a href={`mailto:${SITE.email}`} className={link}>{SITE.email}</a>
          <a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" className={link}>{SITE.whatsapp.display}</a>
          <a href={SITE.linkedin.url} target="_blank" rel="noopener noreferrer" className={link}>LinkedIn</a>
          <a href={SITE.github.url} target="_blank" rel="noopener noreferrer" className={link}>GitHub</a>
        </div>
      </div>
      <div className="c-wrap">
        <div className="flex flex-col gap-2 border-t border-line pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{f.copy}</p>
          <nav aria-label={`${t.legal.notice} · ${t.legal.privacy}`} className="flex flex-wrap gap-x-5 gap-y-1">
            <a href={pathFor('legal', lang)} className="hover:text-fg hover:underline">{t.legal.notice}</a>
            <a href={pathFor('privacy', lang)} className="hover:text-fg hover:underline">{t.legal.privacy}</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function Home({ onStart }: Start) {
  // this page is light only for now: the light theme is on while it is shown (so the contact sheet matches),
  // and the visitor's own choice comes back when they leave it
  useEffect(() => {
    const el = document.documentElement;
    const had = el.classList.contains('light');
    el.classList.add('light');
    return () => { if (!had) el.classList.remove('light'); };
  }, []);
  return (
    <div id="top" className="clean font-sans">
      <Header onStart={onStart} />
      <Chapters />
      <main id="main">
        <Hero onStart={onStart} />
        <Metrics />
        <Work />
        <Services onStart={onStart} />
        <Method />
        <About />
        <Stack />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
