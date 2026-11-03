import { Fragment, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

/** Small monospace uppercase label: `01 / Welcome`. */
export const Measure = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`measure ${className}`}>{children}</span>
);

/** Eyebrow kept for older call sites: a monospace label. */
export const Eyebrow = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <p className={`measure m-0 ${className}`}>{children}</p>
);

/**
 * A heading whose letters rise into place one after another when it scrolls into view.
 * Screen readers get the plain sentence; the animated letters are hidden from them.
 * `lines` puts each word on its own line, for the stacked poster titles.
 */
export function Kinetic({ text, as: Tag = 'h2', className = '', lines = false }: { text: string; as?: 'h1' | 'h2' | 'h3' | 'p'; className?: string; lines?: boolean }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  let n = 0;
  return (
    <Tag className={`m-0 ${lines ? '' : 'text-balance'} ${className}`}>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden="true" initial={reduce ? false : 'hidden'} whileInView="shown" viewport={{ once: true, margin: '-40px' }}>
        {words.map((w, wi) => (
          <Fragment key={wi}>
            <span className={`${lines ? 'block' : 'inline-block'} whitespace-nowrap`}>
              {[...w].map((ch) => {
                const i = n++;
                return (
                  <motion.span
                    key={i}
                    className="inline-block"
                    variants={{ hidden: { opacity: 0, y: '0.6em' }, shown: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.8, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
            {/* the space sits between the word boxes: inside one, the browser would trim it */}
            {wi < words.length - 1 && ' '}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Two-part title kept for older call sites: the second part in grey. */
export const TwoTone = ({ a, b, as: Tag = 'h2', className = '' }: { a: string; b?: string; as?: 'h1' | 'h2' | 'h3'; className?: string }) => (
  <Tag className={`m-0 text-balance ${className}`}>
    {a}{b && <> <span className="text-muted">{b}</span></>}
  </Tag>
);

/**
 * Section opening: a ruled row with `01 / Kicker` on the left and a short aside on the right,
 * then a giant poster title (one word per line when `stacked`) and an optional lead.
 */
export function SectionHead({ index, kicker, aside, title, lead, stacked = false, className = '' }: { index?: string; kicker?: string; aside?: ReactNode; title: string; lead?: ReactNode; stacked?: boolean; className?: string }) {
  return (
    <div className={`flex flex-col gap-10 ${className}`}>
      {(kicker || aside) && (
        <div className="flex items-baseline justify-between gap-6 border-t border-line pt-4">
          <Measure>{index && <>{index} / </>}{kicker}</Measure>
          {aside && <Measure className="hidden text-right sm:inline">{aside}</Measure>}
        </div>
      )}
      <Kinetic text={title} lines={stacked} className="display-2 max-w-[1100px] text-fg" />
      {lead && <div className="max-w-[560px] text-[18px] leading-[1.6] text-muted">{lead}</div>}
    </div>
  );
}

/** The house button: a square blue block (or a line) with the label left and an arrow right. */
export function Btn({ children, tone = 'glow', href, onClick, external, className = '' }: { children: ReactNode; tone?: 'glow' | 'line'; href?: string; onClick?: () => void; external?: boolean; className?: string }) {
  const cls = `btn btn-${tone} ${className}`;
  const inner = <>{children}<ArrowUpRight className="size-5" strokeWidth={1.5} aria-hidden="true" /></>;
  if (href) return <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>;
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

/** Page width wrapper used by every section. */
export const Container = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-[1360px] px-5 sm:px-10 ${className}`}>{children}</div>
);
