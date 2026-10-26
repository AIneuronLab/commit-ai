/**
 * Product mock-ups (illustrations of delivered projects), pure Tailwind.
 * Fluid: they use container queries (@container) so they adapt to any column width.
 * Illustration text is never smaller than 11px and uses the same contrast-checked tokens as the page.
 */
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, FileText, Lock } from 'lucide-react';
import { GrowBars, EASE_OUT } from '../motion';
import { useApp } from '../i18n';

export function BrowserFrame({ url, children, className = '' }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={`@container flex flex-col overflow-hidden rounded-xl border border-line bg-card shadow-[0_40px_80px_-30px_rgba(0,0,0,.55)] ${className}`}>
      <div className="flex h-9 shrink-0 items-center gap-1.5 border-b border-line bg-card-alt px-3">
        <span className="size-2.5 rounded-full bg-coral" />
        <span className="size-2.5 rounded-full bg-amber" />
        <span className="size-2.5 rounded-full bg-mint" />
        <span className="ml-3 flex h-6 max-w-[300px] flex-1 items-center gap-1.5 truncate rounded-md border border-line bg-card px-2 font-mono text-[11px] text-muted">
          <Lock className="size-3 shrink-0" /> {url}
        </span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

function Kpi({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-lg border border-line bg-card-alt px-3 py-2.5">
      <span className="truncate text-[11px] text-muted">{label}</span>
      <b className="font-display text-xl text-fg @lg:text-[22px]">{value}</b>
      <span className={`truncate text-[11px] ${tone}`}>{note}</span>
    </div>
  );
}

const TONES = ['text-ok', 'text-ok', 'text-warn', 'text-accent'];

/** "Tender monitoring" dashboard. */
export function DashboardMock() {
  const { t } = useApp();
  const d = t.mock.dash;
  return (
    <div className="flex h-full text-fg">
      <div className="hidden w-13 shrink-0 flex-col items-center gap-3.5 border-r border-line bg-card-alt pt-3.5 @md:flex">
        <span className="size-6.5 rounded-md bg-gradient-to-br from-brand-azure to-brand-deep" />
        {[0, 1, 0, 0].map((on, i) => <span key={i} className={`h-1 w-5.5 rounded ${on ? 'bg-brand' : 'bg-line'}`} />)}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3.5 @lg:p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <b className="font-display text-[15px]">{d.title}</b>
          <span className="font-mono text-[11px] text-ok">● {d.updated}</span>
        </div>
        <div className="flex gap-2.5">
          <Kpi label={d.collected} value="1 248" note={`▲ 37 ${d.today}`} tone="text-ok" />
          <Kpi label={d.relevant} value="112" note={d.filtered} tone="text-accent" />
          <div className="hidden min-w-0 flex-1 @md:flex"><Kpi label={d.saved} value="-6 h" note={d.perWeek} tone="text-accent" /></div>
        </div>
        <div className="rounded-lg border border-line bg-card-alt px-3 pt-2.5 pb-1.5">
          <span className="text-[11px] text-muted">{d.perMonth}</span>
          <GrowBars className="h-24 w-full @lg:h-26" />
        </div>
        <div className="overflow-hidden rounded-lg border border-line bg-card-alt">
          <div className="px-2.5 py-1.5 text-[11px] text-muted">{d.latest}</div>
          {d.rows.map(([title, who, status], i) => (
            <div key={title} className="grid grid-cols-[1fr_auto] items-center gap-2 border-t border-line px-2.5 py-1.5 text-[12px] @md:grid-cols-[1fr_120px_82px]">
              <span className="truncate">{title}</span>
              <span className="hidden text-muted @md:block">{who}</span>
              <span className={`tint-fg justify-self-start rounded px-1.5 text-[11px] ${TONES[i]}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Messages appear one after the other and the conversation loops. */
function LoopMsg({ children, delay, className }: { children: ReactNode; delay: number; className: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={reduce ? undefined : { opacity: [0, 1, 1, 0], y: [10, 0, 0, 0] }}
      transition={{ duration: 9, delay, repeat: Infinity, times: [0, 0.08, 0.88, 1], ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/** HR chatbot with sources (RAG). */
export function ChatMock() {
  const { t } = useApp();
  const c = t.mock.chat;
  return (
    <div className="flex h-full text-fg">
      <div className="hidden w-38 shrink-0 flex-col gap-2 border-r border-line bg-card-alt p-3 text-[12px] text-muted @md:flex">
        <span className="font-mono text-[11px] text-accent">{c.sources}</span>
        <span className="flex items-center gap-1.5 rounded-md bg-accent-soft px-2 py-1.5 text-fg"><FileText className="size-3.5" />{c.guide}</span>
        <span className="flex items-center gap-1.5 px-2 py-1.5"><FileText className="size-3.5" />{c.procedures}</span>
        <span className="flex items-center gap-1.5 px-2 py-1.5"><FileText className="size-3.5" />{c.contracts}</span>
        <span className="mt-auto flex items-center gap-1.5 text-[11px] text-ok"><span className="size-1.5 rounded-full bg-ok" />{c.synced}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between text-xs">
          <b className="font-display text-sm">{c.title}</b>
          <span className="font-mono text-[11px] text-muted">RAG · Mistral</span>
        </div>
        <LoopMsg delay={0.4} className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-brand-deep px-3 py-2 text-[13px] leading-snug text-white">
          {c.q}
        </LoopMsg>
        <LoopMsg delay={1.8} className="max-w-[88%] self-start rounded-2xl rounded-bl-sm border border-line bg-card-alt px-3 py-2.5 text-[13px] leading-relaxed text-soft">
          {c.a1} <b className="text-fg">{c.a2}</b> {c.a3}
          <span className="mt-1.5 flex gap-1.5">
            <span className="rounded bg-accent-soft px-1.5 font-mono text-[11px] text-accent">{c.page}</span>
            <span className="rounded bg-accent-soft px-1.5 font-mono text-[11px] text-accent">art. 4.2</span>
          </span>
        </LoopMsg>
        <div className="mt-auto flex items-center gap-2 rounded-xl border border-line bg-card-alt py-2 pr-2 pl-3 text-xs text-muted">
          {c.ask}
          <span className="ml-auto flex size-6.5 items-center justify-center rounded-lg bg-brand-deep text-white"><ArrowRight className="size-3.5" /></span>
        </div>
      </div>
    </div>
  );
}

export function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`aspect-[250/520] w-full max-w-[250px] rounded-[42px] grad-phone p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,.6)] ${className}`}>
      <div className="relative h-full overflow-hidden rounded-[33px] bg-bg">
        <span className="absolute top-2 left-1/2 z-10 h-5.5 w-21 -translate-x-1/2 rounded-xl bg-black" />
        {children}
      </div>
    </div>
  );
}
