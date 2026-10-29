import type { ReactNode } from 'react';
import { RevealText } from './RevealText';

/** Mono section label with its index, e.g. "02 / Services", followed by a hairline. */
export const Kicker = ({ children, index }: { children: ReactNode; index?: string }) => (
  <p className="m-0 flex items-center gap-3 font-mono text-[12px] tracking-[0.14em] text-accent uppercase">
    {index && <span className="text-muted">{index}</span>}
    <span>{children}</span>
    <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
  </p>
);

export const H2 = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h2 className={`m-0 font-display text-[32px] leading-[1.04] font-semibold tracking-[-0.03em] text-balance sm:text-[40px] lg:text-[52px] ${className}`}>{typeof children === 'string' ? <RevealText parts={[{ text: children }]} /> : children}</h2>
);

export const SectionHead = ({ index, kicker, title, lead }: { index: string; kicker: string; title: string; lead: string }) => (
  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
    <div className="flex max-w-[640px] flex-col gap-4"><Kicker index={index}>{kicker}</Kicker><H2>{title}</H2></div>
    <p className="m-0 max-w-[400px] text-[17px] text-muted">{lead}</p>
  </div>
);

/** Four corner marks, like registration marks on a blueprint. Place inside a `relative` box. */
export const Ticks = ({ className = 'border-line-strong' }: { className?: string }) => (
  <>
    <span aria-hidden="true" className={`pointer-events-none absolute -top-px -left-px size-2.5 border-t border-l ${className}`} />
    <span aria-hidden="true" className={`pointer-events-none absolute -top-px -right-px size-2.5 border-t border-r ${className}`} />
    <span aria-hidden="true" className={`pointer-events-none absolute -bottom-px -left-px size-2.5 border-b border-l ${className}`} />
    <span aria-hidden="true" className={`pointer-events-none absolute -right-px -bottom-px size-2.5 border-r border-b ${className}`} />
  </>
);

/** Props that make a `.spot` card light up under the pointer. */
export const spotProps = {
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  },
};
