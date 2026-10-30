import type { ReactNode } from 'react';
import { RevealText } from './RevealText';

/** Small-caps label in gold with a short rule, used above every section title. */
export const Kicker = ({ children, index }: { children: ReactNode; index?: string }) => (
  <p className="m-0 flex items-center gap-3 text-[12px] font-medium tracking-[0.22em] text-accent uppercase">
    {index && <span className="font-serif text-[15px] tracking-normal text-muted italic normal-case">{index}</span>}
    <span>{children}</span>
    <span aria-hidden="true" className="h-px w-10 bg-brand/50" />
  </p>
);

export const H2 = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h2 className={`m-0 font-serif text-[40px] leading-[1.02] font-normal tracking-[-0.01em] text-balance sm:text-[52px] lg:text-[64px] ${className}`}>{typeof children === 'string' ? <RevealText parts={[{ text: children }]} /> : children}</h2>
);

export const SectionHead = ({ index, kicker, title, lead, stacked = false }: { index: string; kicker: string; title: string; lead: string; stacked?: boolean }) => (
  <div className={`flex flex-col gap-6 ${stacked ? '' : 'lg:flex-row lg:items-end lg:justify-between'}`}>
    <div className="flex max-w-[720px] flex-col gap-5"><Kicker index={index}>{kicker}</Kicker><H2>{title}</H2></div>
    <p className="m-0 max-w-[380px] text-[17px] leading-relaxed text-muted">{lead}</p>
  </div>
);

/** Text link with a gold underline that grows on hover. */
export const UnderLink = ({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) => (
  <a
    href={href}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className="group inline-flex items-center gap-2 font-medium text-fg"
  >
    <span className="bg-[linear-gradient(var(--color-brand),var(--color-brand))] bg-[length:100%_1px] bg-bottom bg-no-repeat pb-1 transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">{children}</span>
    <span aria-hidden="true" className="text-accent transition-transform group-hover:translate-x-1">→</span>
  </a>
);
