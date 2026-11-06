import { useRef } from 'react';
import { useInView } from 'motion/react';
import { GitHubIcon } from '../components/BrandIcons';
import { Container, Kinetic, Measure } from '../components/ui';
import { Reveal } from '../motion';
import { ExperienceGlobe } from '../components/ExperienceGlobe';
import { StackCards } from '../components/StackCards';
import { SITE } from '../data/site';
import { useGithub } from '../lib/github';
import { useApp } from '../i18n';

/** 04 / About: the career on a turning globe, then the profile (portrait, name, bio), then the stack cards. */
export function Journey() {
  const { t, lang } = useApp();
  const j = t.journey;
  const host = useRef<HTMLElement>(null);
  const near = useInView(host, { once: true, margin: '600px 0px' });
  const { data } = useGithub(near);
  return (
    <section id="journey" ref={host} className="scroll-mt-20 bg-bg-alt">
      <Container className="pt-24 pb-4 lg:pt-36">
        <div className="flex items-baseline justify-between gap-6 border-t border-line pt-4">
          <Measure>04 / {j.kicker}</Measure>
          <Measure className="hidden text-right sm:inline">{t.navSub.journey}</Measure>
        </div>
      </Container>
      <ExperienceGlobe />
      <Container className="flex flex-col gap-24 py-24 lg:gap-32 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-20">
          <Reveal className="relative self-start">
            <img src="/portrait.jpg" alt={j.portraitAlt} width={540} height={660} loading="lazy" className="block aspect-[4/5] w-full object-cover object-[50%_15%] grayscale transition duration-700 hover:grayscale-0" />
            <Measure className="mt-3 block">{j.role}</Measure>
          </Reveal>
          <div className="flex min-w-0 flex-col gap-7">
            <Measure>{t.hero.by}</Measure>
            <Kinetic text={SITE.owner} lines className="display-2 -mt-4 text-fg" />
            <Kinetic as="p" text={j.title} className="display-4 text-accent" />
            {j.about.map((para) => <p key={para} className="m-0 max-w-[620px] text-[18px] leading-[1.6] text-soft">{para}</p>)}
            <a href={SITE.github.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 self-start text-[15px] text-muted transition-colors hover:text-fg">
              <GitHubIcon className="size-4" /> <b className="font-semibold text-fg tabular-nums">{data.contributions.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}</b> {j.github}
            </a>
          </div>
        </div>
        <StackCards />
      </Container>
    </section>
  );
}
