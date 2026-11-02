/** A faint neural-network drawing (layers of nodes and links) behind the hero. Static SVG, no image file. */
const LAYERS = [4, 6, 7, 6, 4];
const W = 1200, H = 520;

export function NeuralBackdrop({ className = '' }: { className?: string }) {
  const cols = LAYERS.map((n, i) => {
    const x = 80 + (i * (W - 160)) / (LAYERS.length - 1);
    return Array.from({ length: n }, (_, j) => ({ x, y: 60 + ((j + 0.5) * (H - 120)) / n }));
  });
  const links = cols.slice(0, -1).flatMap((col, i) => col.flatMap((a) => cols[i + 1].map((b) => [a, b] as const)));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={`pointer-events-none ${className}`}>
      <g className="stroke-brand" strokeWidth="0.8" opacity="0.18">
        {links.map(([a, b], k) => <line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />)}
      </g>
      <g>
        {cols.flat().map((p, k) => (
          <g key={k}>
            <circle cx={p.x} cy={p.y} r="9" className="fill-brand" opacity="0.08" />
            <circle cx={p.x} cy={p.y} r="3.5" className="fill-brand" opacity="0.45" />
          </g>
        ))}
      </g>
    </svg>
  );
}
