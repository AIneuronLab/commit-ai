import { STACK } from '../data/site';

/** Slim band of technologies drifting sideways, edges faded. Static (wrapped) with reduced motion, see index.css. */
export function Marquee({ label, title }: { label: string; title: string }) {
  return (
    <div className="marquee border-y border-line bg-bg-alt" role="group" aria-label={label}>
      <div className="mx-auto flex max-w-[1200px] items-center gap-6 px-4 sm:px-6">
        <span className="hidden shrink-0 border-r border-line pr-6 font-mono text-[12px] tracking-[0.18em] text-accent uppercase sm:block">{title}</span>
        <div className="marquee-mask min-w-0 flex-1 overflow-hidden">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <ul key={k} aria-hidden={k === 1 ? 'true' : undefined} className="m-0 flex list-none items-center p-0">
                {STACK.map((s) => (
                  <li key={s} className="flex items-center text-[13px] font-medium tracking-[0.16em] text-soft uppercase">
                    {s}
                    <i aria-hidden="true" className="mx-7 block h-3.5 w-px bg-line-strong" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
