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
  <h2 className={`m-0 font-serif text-[38px] leading-[1.02] font-normal tracking-[-0.01em] text-balance sm:text-[48px] lg:text-[60px] ${className}`}>{typeof children === 'string' ? <RevealText parts={[{ text: children }]} /> : children}</h2>
);

export const SectionHead = ({ index, kicker, title, lead, stacked = false }: { index: string; kicker: string; title: string; lead: string; stacked?: boolean }) => (
  <div className={`flex flex-col gap-5 ${stacked ? '' : 'md:flex-row md:items-end md:justify-between'}`}>
    <div className="flex max-w-[640px] flex-col gap-4"><Kicker index={index}>{kicker}</Kicker><H2>{title}</H2></div>
    <p className="m-0 max-w-[400px] text-[17px] text-muted">{lead}</p>
  </div>
);
