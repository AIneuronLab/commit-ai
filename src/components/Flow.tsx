import { Ticks } from './ui';

/** Small vertical pipeline: source → step → output, with a packet dropping through each link. */
export function Flow({ nodes, label }: { nodes: readonly (readonly string[])[]; label: string }) {
  return (
    <div role="img" aria-label={label} className="relative mx-auto flex w-full max-w-[340px] flex-col items-stretch rounded-lg border border-line bg-card-alt p-5">
      <Ticks />
      {nodes.map(([tag, text], i) => (
        <div key={tag} className="flex flex-col items-stretch">
          {i > 0 && (
            <span aria-hidden="true" className="relative mx-auto h-9 w-px overflow-visible bg-line-strong">
              <i className="flow-packet absolute -left-[2.5px] block size-[6px] rounded-full bg-brand-azure shadow-[0_0_8px_2px_rgba(79,195,247,.6)]" style={{ animationDelay: `${i * 0.5}s` }} />
            </span>
          )}
          <div className={`flex flex-col gap-1 rounded-md border px-4 py-3 ${i === 1 ? 'border-line-strong bg-accent-soft' : 'border-line bg-card'}`}>
            <span className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">{tag}</span>
            <span className="text-[15px] font-medium text-fg">{text}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
