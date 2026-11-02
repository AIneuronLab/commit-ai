import type { ReactNode } from 'react';

/** Small blue label above a section title. */
export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="m-0 text-[14px] font-medium text-accent">{children}</p>
);

/** Section title in two tones: the statement in ink, the explanation in grey, as one sentence. */
export const TwoTone = ({ a, b, as: Tag = 'h2', className = '' }: { a: string; b?: string; as?: 'h1' | 'h2'; className?: string }) => (
  <Tag className={`m-0 font-display font-medium tracking-[-0.025em] text-balance text-fg ${className}`}>
    {a}{b && <> <span className="text-muted">{b}</span></>}
  </Tag>
);

export const SectionHead = ({ eyebrow, a, b }: { eyebrow: string; a: string; b?: string }) => (
  <div className="flex max-w-[860px] flex-col gap-4">
    <Eyebrow>{eyebrow}</Eyebrow>
    <TwoTone a={a} b={b} className="text-[30px] leading-[1.15] sm:text-[38px] lg:text-[44px]" />
  </div>
);

/** Page width wrapper used by every section. */
export const Container = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 ${className}`}>{children}</div>
);
