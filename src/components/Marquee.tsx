import { STACK } from '../data/site';

/** A band of technologies drifting sideways. Static (wrapped) with reduced motion, see index.css. */
export function Marquee({ label }: { label: string }) {
  const row = STACK.flatMap((s) => [s, '■']);
  return (
    <div className="marquee border-y border-line bg-bg-alt" role="group" aria-label={label}>
      <div className="marquee-track font-display text-[26px] font-semibold tracking-tight text-soft sm:text-[34px]">
        {[0, 1].map((k) => (
          <ul key={k} aria-hidden={k === 1 ? 'true' : undefined} className="m-0 flex list-none items-center gap-8 p-0 pr-8 sm:gap-12 sm:pr-12">
            {row.map((s, i) => <li key={i} className={s === '■' ? 'text-[12px] text-accent' : ''}>{s}</li>)}
          </ul>
        ))}
      </div>
    </div>
  );
}
