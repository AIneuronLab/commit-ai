import { useRef } from 'react';
import { useInView } from 'motion/react';
import { GitHubIcon } from '../components/BrandIcons';
import { Container, Eyebrow, TwoTone } from '../components/ui';
import { Reveal } from '../motion';
import { SITE } from '../data/site';
import { useGithub } from '../lib/github';
import { useApp } from '../i18n';

/** About: the founder's photo and short bio, then the career as a table. */
export function Journey() {
  const { t, lang } = useApp();
  const j = t.journey;
  const host = useRef<HTMLElement>(null);
  const near = useInView(host, { once: true, margin: '600px 0px' });
  const { data } = useGithub(near);
  return (
    <section id="journey" ref={host} className="scroll-mt-16 border-t border-line bg-bg-alt">
      <Container className="grid gap-12 py-20 lg:grid-cols-[360px_1fr] lg:gap-20 lg:py-28">
        <Reveal className="flex flex-col gap-4">
          <img src="/portrait.jpg" alt={j.portraitAlt} width={540} height={660} loading="lazy" className="block aspect-[4/5] w-full max-w-[360px] rounded-2xl border border-line object-cover object-[50%_15%]" />
          <div>
            <p className="m-0 text-[17px] font-semibold text-fg">{SITE.owner}</p>
            <p className="m-0 text-[14px] text-muted">{j.role}</p>
          </div>
        </Reveal>
        <div className="flex min-w-0 flex-col gap-6">
          <Eyebrow>{j.kicker}</Eyebrow>
          <TwoTone a={j.title} className="text-[30px] leading-[1.15] sm:text-[38px] lg:text-[44px]" />
          {j.about.map((para) => <p key={para} className="m-0 max-w-[620px] text-[17px] leading-relaxed text-soft">{para}</p>)}
          <a href={SITE.github.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 self-start text-[15px] text-muted transition-colors hover:text-accent">
            <GitHubIcon className="size-4" /> <b className="font-semibold text-fg tabular-nums">{data.contributions.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}</b> {j.github}
          </a>
          <div className="mt-4">
            <h3 className="m-0 mb-3 text-[14px] font-medium text-fg">{j.timelineTitle}</h3>
            <ol className="m-0 list-none overflow-hidden rounded-xl border border-line bg-card p-0">
              {j.timeline.map(([period, role, org]) => (
                <li key={role + period} className="grid gap-1 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[130px_1fr_auto] sm:items-baseline sm:gap-6">
                  <span className="font-mono text-[12.5px] text-muted">{period}</span>
                  <span className="text-[15px] font-medium text-fg">{role}</span>
                  <span className="text-[14px] text-muted">{org}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
