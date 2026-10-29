import { LogoMark } from '../brand/Logo';
import { DotSphere } from './DotSphere';
import { Reveal } from '../motion';
import { SITE } from '../data/site';
import { useApp } from '../i18n';

/** The founder's round photo inside a turning halo of dots ("Qui nous sommes"). */
export function Portrait() {
  const { t, mode } = useApp();
  return (
    <Reveal className="m-0 mx-auto w-full max-w-[280px] sm:max-w-[320px]">
      <figure className="m-0">
        <div className="relative">
          <DotSphere className="pointer-events-none absolute -inset-[15%] z-0 size-[130%]" />
          <img
            src="/portrait.jpg"
            alt={t.journey.portraitAlt}
            width={540}
            height={660}
            loading="lazy"
            className="relative z-10 aspect-square w-full rounded-full border-2 border-line-strong object-cover object-[50%_8%] shadow-[0_30px_60px_-30px_rgba(0,0,0,.55)]"
          />
        </div>
        <figcaption className="mt-14 flex items-center justify-center gap-3">
          <LogoMark size={34} variant={mode} />
          <span className="flex flex-col leading-tight">
            <b className="text-[15px]">{SITE.owner}</b>
            <span className="font-mono text-[12px] tracking-[0.06em] text-muted uppercase">{t.journey.role} · Commit<span className="text-accent">·AI</span></span>
          </span>
        </figcaption>
      </figure>
    </Reveal>
  );
}
