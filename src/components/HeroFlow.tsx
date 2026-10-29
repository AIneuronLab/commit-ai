import { useReducedMotion } from 'motion/react';
import { Ticks } from './ui';
import { useApp } from '../i18n';

const W = 1000;
const H = 372;
const NODE_W = 212;
const NODE_H = 44;
const HUB = { x: 410, y: 138, w: 180, h: 108 };
const CY = H / 2 + 12;
const spread = (n: number, gap: number) => Array.from({ length: n }, (_, i) => CY + (i - (n - 1) / 2) * gap);

const CYCLE = 3.2;

/**
 * The hero picture: what comes in (messages, documents, forms, payments) goes through Commit·AI and comes out as
 * a website, an app, an API or an automatic report. Wide screens get an SVG with data packets travelling along the
 * lines; phones get the same story stacked vertically. Packets are left out with reduced motion.
 */
export function HeroFlow() {
  const { t } = useApp();
  const reduce = useReducedMotion();
  const f = t.hero.flow;
  const ins = spread(f.inputs.length, 62);
  const outs = spread(f.outputs.length, 78);

  const inPath = (y: number) => `M${NODE_W} ${y} C 310 ${y}, 300 ${CY}, ${HUB.x} ${CY}`;
  const outPath = (y: number) => `M${HUB.x + HUB.w} ${CY} C 700 ${CY}, 700 ${y}, ${W - NODE_W} ${y}`;

  return (
    <figure role="img" aria-label={f.label} className="relative m-0 rounded-lg border border-line bg-card/60 p-4 backdrop-blur-sm sm:p-6">
      <Ticks />

      {/* wide screens */}
      <svg viewBox={`0 0 ${W} ${H}`} className="hidden h-auto w-full md:block" aria-hidden="true">
        <g className="font-mono" fontSize="11" letterSpacing="1.6">
          <text x="0" y="14" className="fill-muted">{f.inLabel.toUpperCase()}</text>
          <text x={W} y="14" textAnchor="end" className="fill-muted">{f.outLabel.toUpperCase()}</text>
        </g>

        {ins.map((y, i) => <path key={`pi${i}`} d={inPath(y)} fill="none" className="flow-dash stroke-line-strong" strokeWidth="1.25" />)}
        {outs.map((y, i) => <path key={`po${i}`} d={outPath(y)} fill="none" className="flow-dash stroke-line-strong" strokeWidth="1.25" />)}

        {!reduce && ins.map((y, i) => (
          <circle key={`ci${i}`} r="3.5" className="fill-brand-azure" opacity="0">
            <animateMotion dur={`${CYCLE}s`} begin={`${i * 0.42}s`} repeatCount="indefinite" path={inPath(y)} keyPoints="0;1;1" keyTimes="0;0.5;1" calcMode="linear" />
            <animate attributeName="opacity" dur={`${CYCLE}s`} begin={`${i * 0.42}s`} repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;0.05;0.48;0.5;1" />
          </circle>
        ))}
        {!reduce && outs.map((y, i) => (
          <circle key={`co${i}`} r="3.5" className="fill-brand-azure" opacity="0">
            <animateMotion dur={`${CYCLE}s`} begin={`${0.9 + i * 0.5}s`} repeatCount="indefinite" path={outPath(y)} keyPoints="0;0;1" keyTimes="0;0.5;1" calcMode="linear" />
            <animate attributeName="opacity" dur={`${CYCLE}s`} begin={`${0.9 + i * 0.5}s`} repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.5;0.55;0.97;1" />
          </circle>
        ))}

        {ins.map((y, i) => (
          <g key={`ni${i}`}>
            <rect x="0" y={y - NODE_H / 2} width={NODE_W} height={NODE_H} rx="6" className="fill-card stroke-line" />
            <rect x="0" y={y - NODE_H / 2 + 10} width="3" height={NODE_H - 20} rx="1.5" className="fill-brand-azure" />
            <text x="20" y={y + 4.5} fontSize="13.5" className="fill-fg font-mono">{f.inputs[i]}</text>
          </g>
        ))}

        <rect x={HUB.x - 10} y={HUB.y - 10} width={HUB.w + 20} height={HUB.h + 20} rx="14" fill="none" className="stroke-brand/40" strokeDasharray="2 5" />
        <rect x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx="10" className="fill-brand-deep stroke-brand-azure" strokeWidth="1.25" />
        <text x={HUB.x + HUB.w / 2} y={CY - 2} textAnchor="middle" fontSize="22" fontWeight="600" fill="#fff">{f.hub}</text>
        <text x={HUB.x + HUB.w / 2} y={CY + 22} textAnchor="middle" fontSize="11.5" letterSpacing="1.2" fill="#e8f4ff" className="font-mono">{f.hubSub.toUpperCase()}</text>
        <circle cx={HUB.x + 16} cy={HUB.y + 16} r="3.5" className="fill-ok">{!reduce && <animate attributeName="opacity" values="1;.25;1" dur="2s" repeatCount="indefinite" />}</circle>

        {outs.map((y, i) => (
          <g key={`no${i}`}>
            <rect x={W - NODE_W} y={y - NODE_H / 2} width={NODE_W} height={NODE_H} rx="6" className="fill-card stroke-line-strong" />
            <rect x={W - 3} y={y - NODE_H / 2 + 10} width="3" height={NODE_H - 20} rx="1.5" className="fill-ok" />
            <text x={W - NODE_W + 20} y={y + 4.5} fontSize="13.5" className="fill-fg font-mono">{f.outputs[i]}</text>
          </g>
        ))}
      </svg>

      {/* phones: same story, stacked */}
      <div className="flex flex-col items-stretch gap-0 md:hidden" aria-hidden="true">
        <p className="m-0 mb-2 font-mono text-[11px] tracking-[0.16em] text-muted uppercase">{f.inLabel}</p>
        <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0">
          {f.inputs.map((s, i) => (
            <li key={s} className={`rounded-md border border-line bg-card px-3 py-2.5 font-mono text-[13px] ${i === f.inputs.length - 1 && f.inputs.length % 2 ? 'col-span-2' : ''}`}>{s}</li>
          ))}
        </ul>
        <Link delay={0} />
        <div className="rounded-lg border border-brand-azure bg-brand-deep px-4 py-4 text-center text-white">
          <b className="block text-xl font-semibold">{f.hub}</b>
          <span className="font-mono text-[11px] tracking-[0.12em] text-[#e8f4ff] uppercase">{f.hubSub}</span>
        </div>
        <Link delay={0.7} />
        <p className="m-0 mb-2 font-mono text-[11px] tracking-[0.16em] text-muted uppercase">{f.outLabel}</p>
        <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0">
          {f.outputs.map((s) => <li key={s} className="rounded-md border border-line-strong bg-card px-3 py-2.5 font-mono text-[13px]">{s}</li>)}
        </ul>
      </div>
    </figure>
  );
}

function Link({ delay }: { delay: number }) {
  return (
    <span className="relative mx-auto my-1 block h-9 w-px bg-line-strong">
      <i className="flow-packet absolute -left-[2.5px] block size-[6px] rounded-full bg-brand-azure shadow-[0_0_8px_2px_rgba(79,195,247,.6)]" style={{ animationDelay: `${delay}s` }} />
    </span>
  );
}
