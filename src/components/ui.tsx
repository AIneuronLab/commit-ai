import type { ReactNode } from 'react';

export const Kicker = ({ children }: { children: ReactNode }) => <p className="m-0 font-mono text-sm text-accent">{children}</p>;

export const H2 = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h2 className={`m-0 font-display text-[32px] leading-[1.05] font-bold tracking-tight text-balance sm:text-[40px] lg:text-[52px] ${className}`}>{children}</h2>
);

export const SectionHead = ({ kicker, title, lead }: { kicker: string; title: string; lead: string }) => (
  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
    <div className="flex max-w-[640px] flex-col gap-3"><Kicker>{kicker}</Kicker><H2>{title}</H2></div>
    <p className="m-0 max-w-[400px] text-[17px] text-muted">{lead}</p>
  </div>
);
