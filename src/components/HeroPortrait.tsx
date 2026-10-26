/**
 * Hero portrait as a piece of glass:
 *  - the photo sits in a frosted frame whose edge is lit by a light that travels around it
 *  - a soft sheen sweeps across the glass every few seconds
 *  - two glass plates and three tech chips float at different depths
 *  - the whole stack tilts in 3D with the pointer / finger (and drifts gently on its own)
 * Only transforms and opacity move, nothing covers the face, and reduced motion freezes it all.
 */
import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { Braces, Cpu, Leaf, Sparkles } from 'lucide-react';
import { LogoMark } from '../brand/Logo';
import { EASE_LOOP, EASE_OUT } from '../motion';
import { SITE } from '../data/site';
import { useApp } from '../i18n';

const NODES: [number, number][] = [[40, 90], [120, 40], [470, 60], [510, 200], [30, 300], [500, 420], [60, 560], [440, 610], [270, 640], [150, 600]];
const LINKS: [number, number][] = [[0, 1], [1, 2], [2, 3], [0, 4], [3, 5], [4, 6], [5, 7], [6, 9], [9, 8], [8, 7]];

function Network() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 540 660" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
      {LINKS.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]}
          className="stroke-accent"
          strokeWidth="1.2"
          strokeOpacity="0.35"
          strokeDasharray="4 7"
          animate={reduce ? undefined : { strokeDashoffset: [0, -44] }}
          transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {NODES.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x} cy={y} r="3.4"
          className="fill-brand-azure light:fill-brand-deep"
          animate={reduce ? undefined : { opacity: [0.35, 1, 0.35], scale: [1, 1.6, 1] }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          transition={{ duration: 3.2, delay: i * 0.35, repeat: Infinity, ease: EASE_LOOP }}
        />
      ))}
    </svg>
  );
}

function Chip({ icon, children, className, delay, depth, float }: { icon: ReactNode; children: ReactNode; className: string; delay: number; depth: number; float: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ z: depth }}
      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
    >
      <motion.div
        className="flex items-center gap-2 rounded-2xl border border-white/25 bg-glass px-3 py-2 font-mono text-[12px] text-fg shadow-[0_18px_40px_-16px_rgba(0,0,0,.6),inset_0_1px_0_rgb(255_255_255/.22)] backdrop-blur-xl sm:text-[13px] light:border-brand/25"
        animate={reduce ? undefined : { y: [0, -float, 0] }}
        transition={{ duration: 4 + float / 3, delay, repeat: Infinity, ease: EASE_LOOP }}
      >
        <span className="flex size-6 items-center justify-center rounded-lg bg-brand/20 text-accent">{icon}</span>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HeroPortrait() {
  const { t, mode } = useApp();
  const reduce = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);

  // pointer in -0.5..0.5, eased by a spring; "drift" keeps it alive when nobody touches it
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 110, damping: 16 });
  const sy = useSpring(py, { stiffness: 110, damping: 16 });
  const drift = useMotionValue(0);
  useEffect(() => {
    if (reduce) return;
    const c = animate(drift, [-1, 1], { duration: 7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' });
    return () => c.stop();
  }, [reduce, drift]);
  const rotateY = useTransform([sx, drift], ([x, d]: number[]) => x * 18 + d * 4);
  const rotateX = useTransform([sy, drift], ([y, d]: number[]) => -y * 14 + d * 1.6);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || !host.current) return;
    const r = host.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => { px.set(0); py.set(0); };

  return (
    <div
      ref={host}
      onPointerMove={move}
      onPointerLeave={leave}
      onPointerCancel={leave}
      className="relative mx-auto aspect-[54/66] w-full max-w-[340px] touch-pan-y [perspective:1100px] sm:max-w-[460px] lg:max-w-[540px]"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-[14%] inset-y-[10%] rounded-full bg-brand/35 blur-3xl"
        animate={reduce ? undefined : { opacity: [0.5, 0.95, 0.5], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: EASE_LOOP }}
      />

      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={reduce ? undefined : { rotateX, rotateY }}>
        <motion.div className="absolute inset-0" style={{ z: -70 }}><Network /></motion.div>

        {/* satellite orbit */}
        <motion.div className="absolute inset-[-3%] rounded-full border border-line-strong/60" style={{ z: -40 }} animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: 'linear' }} aria-hidden="true">
          <span className="absolute top-0 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-core shadow-[0_0_18px_6px_rgba(103,232,249,.7)]" />
        </motion.div>

        {/* glass plates behind the photo */}
        <motion.span aria-hidden="true" className="absolute top-[3%] left-[16%] h-[84%] w-[74%] -rotate-6 rounded-[38px] border border-white/20 bg-glass backdrop-blur-md light:border-brand/20" style={{ z: -20 }} />
        <motion.span aria-hidden="true" className="absolute top-[9%] left-[9%] h-[84%] w-[74%] rotate-[5deg] rounded-[38px] border border-white/15 bg-gradient-to-br from-brand-azure/30 via-brand/20 to-brand-navy/30 backdrop-blur-sm" style={{ z: -8 }} />

        {/* the photo: light travels around the frame, a sheen sweeps over the glass */}
        <motion.div
          className="absolute top-[5%] left-[12%] h-[86%] w-[76%]"
          style={{ z: 24 }}
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT }}
        >
          <div className="glass-border size-full rounded-[40px] bg-white/10 p-[2px] shadow-[0_50px_90px_-40px_rgba(0,0,0,.85)]">
            <div className="relative size-full overflow-hidden rounded-[38px]">
              <img
                src="/portrait.jpg"
                alt={t.hero.portraitAlt}
                width={540}
                height={660}
                fetchPriority="high"
                className="size-full object-cover object-[50%_12%]"
              />
              <span aria-hidden="true" className="absolute inset-0 rounded-[38px] shadow-[inset_0_1px_0_rgb(255_255_255/.35),inset_0_0_40px_rgb(103_232_249/.12)]" />
              <span aria-hidden="true" className="sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </motion.div>

        <Chip icon={<Braces className="size-4" />} className="top-[7%] right-[3%] sm:-right-[3%]" delay={0.9} depth={70} float={7}>FastAPI · NestJS</Chip>
        <Chip icon={<Leaf className="size-4" />} className="top-[56%] right-[3%] sm:-right-[4%]" delay={1.0} depth={78} float={8}>Spring Boot</Chip>
        <Chip icon={<Sparkles className="size-4" />} className="top-[44%] left-0 sm:-left-[5%]" delay={1.1} depth={85} float={9}>RAG · LLM</Chip>
        <Chip icon={<Cpu className="size-4" />} className="bottom-[16%] left-0 sm:-left-[2%]" delay={1.3} depth={60} float={6}>Data · ML</Chip>

        <motion.div
          className="absolute right-[3%] bottom-[2%] flex sm:right-[-2%] items-center gap-3 rounded-2xl border border-white/25 bg-glass py-2.5 pr-4 pl-2.5 shadow-[0_30px_60px_-25px_rgba(0,0,0,.6),inset_0_1px_0_rgb(255_255_255/.22)] backdrop-blur-xl light:border-brand/25"
          style={{ z: 90 }}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1, ease: EASE_OUT }}
        >
          <LogoMark size={38} variant={mode} />
          <span className="flex flex-col leading-tight">
            <b className="text-[14.5px]">{SITE.owner}</b>
            <span className="text-[13px] text-muted">{t.hero.role} · Commit<span className="text-brand-azure light:text-brand-deep">·AI</span></span>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
