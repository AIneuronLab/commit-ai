import { Check, Lock } from 'lucide-react';
import { SITE_ACTIVITY } from '../data/projects';
import { useApp } from '../i18n';

/** Hero picture made of real work: the ActivityConnect site in a browser, plus two facts from client projects. */
export function Showcase() {
  const { t } = useApp();
  const h = t.hero;
  return (
    <div className="relative mx-auto w-full max-w-[560px] pb-10 lg:pb-0">
      <figure className="m-0 overflow-hidden rounded-xl border border-line-strong bg-card shadow-[0_40px_90px_-30px_rgba(0,0,0,.8)]">
        <div className="flex h-9 items-center gap-1.5 border-b border-line bg-card-alt px-3">
          <span className="size-2.5 rounded-full bg-coral/80" />
          <span className="size-2.5 rounded-full bg-amber/80" />
          <span className="size-2.5 rounded-full bg-mint/80" />
          <span className="ml-3 flex h-6 flex-1 items-center gap-1.5 truncate rounded-md border border-line bg-card px-2 font-mono text-[11px] text-muted">
            <Lock className="size-3 shrink-0" /> {SITE_ACTIVITY.host}
          </span>
        </div>
        <img src="/activityconnect.webp" alt={h.showcaseAlt} width={765} height={575} fetchPriority="high" className="block h-auto w-full" />
      </figure>

      <div className="absolute -bottom-2 -left-2 w-[62%] rounded-lg border border-line-strong bg-card/95 p-4 shadow-[0_24px_50px_-20px_rgba(0,0,0,.8)] backdrop-blur sm:-left-8 lg:-bottom-8">
        <p className="m-0 flex items-baseline gap-2">
          <b className="font-display text-[34px] leading-none font-semibold tracking-tight text-accent">{h.statValue}</b>
          <span className="text-[14px] font-medium text-fg">{h.statUnit}</span>
        </p>
        <p className="m-0 mt-1.5 text-[13px] leading-snug text-muted">{h.statLabel}</p>
      </div>

      <p className="absolute top-14 -right-2 m-0 hidden items-center gap-2 rounded-md border border-line-strong bg-card/95 px-3 py-2 text-[13px] font-medium text-fg shadow-[0_18px_40px_-18px_rgba(0,0,0,.8)] backdrop-blur sm:inline-flex lg:-right-8">
        <Check className="size-4 text-ok" /> {h.chip}
      </p>
    </div>
  );
}
