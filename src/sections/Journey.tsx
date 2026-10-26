import { useMemo } from 'react';
import { H2, Kicker } from '../components/ui';
import { Reveal, TypingTerminal, type Step } from '../motion';
import { useApp } from '../i18n';

const HASHES = ['a3f9c1e', '7b21d04', '4c8e2aa', '19d7f3b', 'e05b6c9', '0a1b2c3'];

export function Journey() {
  const { t } = useApp();
  const j = t.journey;
  const script = useMemo<Step[]>(() => [
    { kind: 'cmd', segs: [{ text: 'git log --oneline', className: 'text-muted' }] },
    ...j.term.rows.map((m, i): Step => ({ kind: 'out', segs: [{ text: '*  ', className: 'text-brand' }, { text: `${HASHES[i]}  `, className: 'text-accent' }, { text: m }] })),
    { kind: 'cmd', segs: [{ text: 'git commit -m "' }, { text: j.term.commit, className: 'text-accent' }, { text: '"' }] },
    { kind: 'out', segs: [{ text: '[main 9f2e7d1]  ', className: 'text-muted' }, { text: j.term.commit }] },
    { kind: 'out', segs: [{ text: j.term.done, className: 'text-ok' }] },
    { kind: 'cmd', segs: [{ text: 'git push origin main' }] },
    { kind: 'out', segs: [{ text: '→  ', className: 'text-accent' }, { text: `${j.term.shipped} ` }, { text: '●', className: 'text-ok' }] },
  ], [j]);

  return (
    <section id="journey" className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 py-14 sm:px-6 lg:flex-row lg:py-24">
        <div className="flex min-w-0 flex-col gap-4 lg:w-[420px] lg:shrink-0">
          <Kicker>{j.kicker}</Kicker>
          <H2>{j.title}</H2>
          <p className="m-0 text-muted">{j.lead}</p>
          <TypingTerminal className="mt-3" script={script} label={j.term.label} />
        </div>
        <ol className="m-0 flex min-w-0 flex-1 list-none flex-col p-0">
          {j.timeline.map(([p, r, o], i) => (
            <li key={r + p}>
              <Reveal delay={i * 0.06} className="flex gap-5">
                <div className="flex w-4 shrink-0 flex-col items-center"><span className={`mt-1.5 size-3.5 rounded-full ${i === 0 ? 'bg-brand shadow-[0_0_0_4px_var(--ca-accent-soft)]' : 'bg-brand-azure'}`} /><span className="w-px flex-1 bg-line" /></div>
                <div className="flex flex-col gap-1 pb-8">
                  <span className="font-mono text-[13px] text-muted">{p}</span>
                  <h3 className="m-0 font-display text-xl font-semibold">{r}</h3>
                  <span className="text-[15px] font-medium text-accent">{o}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
