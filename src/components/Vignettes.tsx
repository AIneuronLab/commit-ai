/**
 * Small, static product interfaces used as illustrations (no images, sharp at any size).
 * Code and log panels are always dark, like terminal windows; the rest follows the theme.
 */
import { CalendarDays, Check, Lock, Users, WifiOff } from 'lucide-react';
import { SITE_ACTIVITY } from '../data/projects';
import { useApp } from '../i18n';

const Dots = () => (
  <span className="flex gap-1.5" aria-hidden="true">
    <i className="size-2.5 rounded-full bg-[#2b3a55]" /><i className="size-2.5 rounded-full bg-[#2b3a55]" /><i className="size-2.5 rounded-full bg-[#2b3a55]" />
  </span>
);

/** A scheduled workflow run, as a job log. */
export function RunLog({ className = '' }: { className?: string }) {
  const { t } = useApp();
  const r = t.hero.run;
  return (
    <div className={`flex flex-col overflow-hidden rounded-xl border border-[#1e2a40] bg-[#0b1322] font-mono text-[12.5px] text-[#c9d4e5] ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-[#1e2a40] px-4 py-3">
        <Dots />
        <span className="truncate text-[#8b9ab2]">{r.title}</span>
        <span className="rounded-md bg-[#0f2f22] px-2 py-0.5 text-[11px] text-[#4fd08f]">{r.status}</span>
      </div>
      <div className="flex flex-1 flex-col px-4 py-4">
        <p className="m-0 mb-3 text-[#8b9ab2]">{r.when}</p>
        <ol className="m-0 flex list-none flex-col p-0">
          {r.steps.map(([time, label]) => (
            <li key={time} className="flex items-center gap-3 border-t border-[#162238] py-2.5 first:border-t-0">
              <span className="text-[#8796ad] tabular-nums">{time}</span>
              <Check className="size-3.5 shrink-0 text-[#4fd08f]" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </li>
          ))}
        </ol>
        <p className="m-0 mt-auto border-t border-[#162238] pt-3 text-[#8796ad]">{r.next}</p>
      </div>
    </div>
  );
}

/** A REST call and its JSON answer. */
export function CodePanel({ className = '' }: { className?: string }) {
  const k = 'text-[#7cb0ff]', s = 'text-[#a5d6a7]', n = 'text-[#f3c552]', m = 'text-[#8796ad]';
  return (
    <div className={`overflow-hidden rounded-xl border border-[#1e2a40] bg-[#0b1322] font-mono text-[12.5px] leading-[1.7] text-[#c9d4e5] ${className}`}>
      <div className="flex items-center gap-3 border-b border-[#1e2a40] px-4 py-3"><Dots /><span className="text-[#8b9ab2]">REST API</span></div>
      <pre className="m-0 overflow-x-auto px-4 py-4"><code>
        <span className="text-[#4fd08f]">GET</span> /v1/offres?pertinent=true{'\n'}
        <span className={m}>Authorization: Bearer ••••••••</span>{'\n\n'}
        <span className={m}>200 OK · 84 ms</span>{'\n'}
        {'{'}{'\n'}
        {'  '}<span className={k}>"total"</span>: <span className={n}>58</span>,{'\n'}
        {'  '}<span className={k}>"items"</span>: [{'{'}{'\n'}
        {'    '}<span className={k}>"titre"</span>: <span className={s}>"Système d’information RH"</span>,{'\n'}
        {'    '}<span className={k}>"source"</span>: <span className={s}>"portail public"</span>,{'\n'}
        {'    '}<span className={k}>"score"</span>: <span className={n}>0.91</span>{'\n'}
        {'  '}{'}'}, …]{'\n'}
        {'}'}
      </code></pre>
    </div>
  );
}

/** A booking widget, in the style of the ActivityConnect site. */
export function BookingCard({ className = '' }: { className?: string }) {
  const { t } = useApp();
  const b = t.services.ui.booking;
  return (
    <div className={`overflow-hidden rounded-xl border border-line bg-card shadow-[0_12px_30px_-18px_rgba(10,22,40,.35)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-line bg-card-alt px-3 py-2 text-[12px] text-muted">
        <Lock className="size-3" aria-hidden="true" /> {SITE_ACTIVITY.host}
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div>
          <p className="m-0 text-[12px] font-medium text-muted">{b.site}</p>
          <p className="m-0 mt-1 text-[18px] font-semibold tracking-[-0.01em] text-fg">{b.event}</p>
        </div>
        <p className="m-0 flex items-center gap-2 text-[14px] text-soft"><CalendarDays className="size-4 text-muted" aria-hidden="true" />{b.date}</p>
        <p className="m-0 flex items-center justify-between rounded-lg border border-line px-3 py-2 text-[14px]">
          <span className="flex items-center gap-2 text-soft"><Users className="size-4 text-muted" aria-hidden="true" />{b.seats}</span>
          <span className="font-medium text-ok">{b.left}</span>
        </p>
        <span className="flex h-10 items-center justify-center rounded-lg bg-brand text-[14px] font-semibold text-white">{b.pay}</span>
      </div>
    </div>
  );
}

/** A mobile screen showing a diagnosis result, in the style of BayKat. */
export function AppCard({ className = '' }: { className?: string }) {
  const { t } = useApp();
  const a = t.services.ui.app;
  return (
    <div className={`mx-auto w-[230px] rounded-[28px] border border-line-strong bg-card p-2 shadow-[0_12px_30px_-18px_rgba(10,22,40,.4)] ${className}`}>
      <div className="flex flex-col gap-3 rounded-[22px] bg-card-alt p-4">
        <span className="mx-auto h-1.5 w-12 rounded-full bg-line-strong" aria-hidden="true" />
        <p className="m-0 text-[12px] font-medium text-muted">{a.title}</p>
        <p className="m-0 text-[16px] font-semibold text-fg">{a.disease}</p>
        <div>
          <p className="m-0 flex justify-between text-[12px] text-muted"><span>{a.confidence}</span><span className="font-medium text-fg tabular-nums">92 %</span></p>
          <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-line"><i className="block h-full w-[92%] rounded-full bg-brand" /></span>
        </div>
        <p className="m-0 rounded-lg border border-line bg-card px-3 py-2 text-[13px] text-soft">{a.advice}</p>
        <p className="m-0 flex items-center gap-1.5 text-[12px] text-muted"><WifiOff className="size-3.5" aria-hidden="true" />{a.offline}</p>
      </div>
    </div>
  );
}
