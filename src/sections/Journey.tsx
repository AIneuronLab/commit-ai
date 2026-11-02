import { useRef } from 'react';
import { useInView } from 'motion/react';
import { GitHubIcon } from '../components/BrandIcons';
import { H2, Kicker, UnderLink } from '../components/ui';
import { Reveal } from '../motion';
import { SITE, waLink } from '../data/site';
import { useGithub } from '../lib/github';
import { useApp } from '../i18n';

/** "Qui nous sommes": the founder's portrait large, the story beside it, then the career as a quiet list. */
export function Journey() {
  const { t, lang } = useApp();
  const j = t.journey;
  const host = useRef<HTMLElement>(null);
  const near = useInView(host, { once: true, margin: '600px 0px' });
  const { data } = useGithub(near);
  return (
    <section id="journey" ref={host} className="border-t border-line">
      <div className="mx-auto grid max-w-[1200px] gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:py-28">
        <Reveal className="relative mx-auto w-full max-w-[460px] lg:mx-0">
          <img src="/portrait.jpg" alt={j.portraitAlt} width={540} height={660} loading="lazy" className="block aspect-[4/5] w-full rounded-xl border border-line object-cover object-[50%_15%]" />
          <p className="m-0 mt-5 flex flex-col gap-0.5">
            <span className="text-[18px] font-semibold">{SITE.owner}</span>
            <span className="text-[14px] text-muted">{j.role} · Commit<span className="text-accent">·AI</span> · {t.footer.location}</span>
          </p>
        </Reveal>
        <div className="flex min-w-0 flex-col gap-6">
          <Kicker index="04">{j.kicker}</Kicker>
          <H2>{j.title}</H2>
          {j.about.map((para) => <p key={para} className="m-0 max-w-[560px] text-[17px] leading-relaxed text-soft">{para}</p>)}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <UnderLink href={waLink(t.contact.waText)} external>{t.contact.whatsapp}</UnderLink>
            <a href={SITE.github.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[15px] text-muted transition-colors hover:text-accent">
              <GitHubIcon className="size-4" /> <b className="font-semibold text-fg tabular-nums">{data.contributions.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}</b> {j.github}
            </a>
          </div>
          <ol className="m-0 mt-6 list-none border-t border-line p-0">
            {j.timeline.map(([period, role, org]) => (
              <li key={role + period} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[150px_1fr] sm:gap-6">
                <span className="text-[14px] text-muted tabular-nums">{period}</span>
                <span className="text-[16px] text-fg"><b className="font-semibold">{role}</b> <span className="text-muted">· {org}</span></span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
