import { ArrowUpRight, Lock } from 'lucide-react';
import { SITE_ACTIVITY } from '../data/projects';
import { useApp } from '../i18n';

/** Hero picture: one real project, the ActivityConnect site in a browser window, with a plain caption under it. */
export function Showcase() {
  const { t } = useApp();
  const h = t.hero;
  return (
    <figure className="m-0 mx-auto w-full max-w-[580px]">
      <a href={SITE_ACTIVITY.url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-xl border border-line-strong bg-card shadow-[0_40px_90px_-30px_rgba(0,0,0,.8)]">
        <div className="flex h-9 items-center gap-1.5 border-b border-line bg-card-alt px-3">
          <span className="size-2.5 rounded-full bg-coral/80" />
          <span className="size-2.5 rounded-full bg-amber/80" />
          <span className="size-2.5 rounded-full bg-mint/80" />
          <span className="ml-3 flex h-6 flex-1 items-center gap-1.5 truncate rounded-md border border-line bg-card px-2 font-mono text-[11px] text-muted">
            <Lock className="size-3 shrink-0" /> {SITE_ACTIVITY.host}
          </span>
        </div>
        <img src="/activityconnect.webp" alt={h.showcaseAlt} width={765} height={575} fetchPriority="high" className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]" />
      </a>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[14px] text-muted">
        <span><b className="font-semibold text-fg">ActivityConnect</b> · {h.showcaseCaption}</span>
        <a href={SITE_ACTIVITY.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-accent hover:underline">
          {t.projects.visit} <ArrowUpRight className="size-4" />
        </a>
      </figcaption>
    </figure>
  );
}
