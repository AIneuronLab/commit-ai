import type { ReactNode } from 'react';
import { RevealText } from './RevealText';

/** Small uppercase label in blue, used above every section title. */
export const Kicker = ({ children, index }: { children: ReactNode; index?: string }) => (
  <p className="m-0 flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.08em] text-accent uppercase">
    {index && <span className="text-muted tabular-nums">{index}</span>}
    <span>{children}</span>
  </p>
);

export const H2 = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h2 className={`m-0 font-display text-[32px] leading-[1.1] font-semibold tracking-[-0.025em] text-balance sm:text-[40px] lg:text-[46px] ${className}`}>{typeof children === 'string' ? <RevealText parts={[{ text: children }]} /> : children}</h2>
);

export const SectionHead = ({ index, kicker, title, lead, stacked = false }: { index: string; kicker: string; title: string; lead: string; stacked?: boolean }) => (
  <div className={`flex flex-col gap-5 ${stacked ? '' : 'lg:flex-row lg:items-end lg:justify-between'}`}>
    <div className="flex max-w-[680px] flex-col gap-4"><Kicker index={index}>{kicker}</Kicker><H2>{title}</H2></div>
    <p className="m-0 max-w-[400px] text-[17px] leading-relaxed text-muted">{lead}</p>
  </div>
);

/** Plain text link with an arrow, for secondary actions. */
export const UnderLink = ({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) => (
  <a
    href={href}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className="group inline-flex items-center gap-1.5 font-semibold text-accent hover:underline hover:underline-offset-4"
  >
    {children}
    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
  </a>
);
