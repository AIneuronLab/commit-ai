import { ArrowRight, Lock } from 'lucide-react';
import { Container, Eyebrow, TwoTone } from '../components/ui';
import { RunLog } from '../components/Vignettes';
import { SITE_ACTIVITY } from '../data/projects';
import { useApp } from '../i18n';

/** Headline in two tones, two actions, then real work: a live client site next to a production job log. */
export function Hero({ onStart }: { onStart: () => void }) {
  const { t } = useApp();
  const h = t.hero;
  return (
    <section id="top" className="relative overflow-hidden">
      <span aria-hidden="true" className="hero-grid pointer-events-none absolute inset-x-0 top-0 h-[560px]" />
      <Container className="relative pt-16 pb-16 lg:pt-28 lg:pb-24">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Eyebrow>{h.eyebrow}</Eyebrow>
            <span className="inline-flex items-center gap-2 text-[14px] text-muted"><span className="size-1.5 rounded-full bg-ok" />{h.availability}</span>
          </div>
          <TwoTone as="h1" a={h.titleA} b={h.titleB} className="max-w-[980px] text-[38px] leading-[1.08] sm:text-[52px] lg:text-[64px] lg:leading-[1.04] lg:tracking-[-0.032em]" />
        </div>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button onClick={onStart} className="group btn-primary inline-flex h-11 items-center gap-2 rounded-lg px-5 text-[15px] font-medium transition">
            {h.primary} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </button>
          <a href="#projects" className="inline-flex h-11 items-center rounded-lg border border-line-strong bg-card px-5 text-[15px] font-medium text-fg transition hover:bg-bg-alt">{h.secondary}</a>
        </div>

        <div className="mt-16 grid gap-4 lg:mt-20 lg:grid-cols-[1.6fr_1fr]">
          <figure className="m-0 flex flex-col gap-3">
            <a href={SITE_ACTIVITY.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-line bg-card shadow-[0_30px_60px_-30px_rgba(10,22,40,.35)]">
              <div className="flex h-9 items-center gap-2 border-b border-line bg-card-alt px-3 text-[12px] text-muted">
                <span className="flex gap-1.5" aria-hidden="true"><i className="size-2.5 rounded-full bg-line-strong" /><i className="size-2.5 rounded-full bg-line-strong" /><i className="size-2.5 rounded-full bg-line-strong" /></span>
                <span className="ml-2 inline-flex items-center gap-1.5 truncate"><Lock className="size-3" aria-hidden="true" />{SITE_ACTIVITY.host}</span>
              </div>
              <img src="/activityconnect.webp" alt={h.showcaseAlt} width={765} height={575} fetchPriority="high" className="block aspect-[16/10] w-full object-cover object-[50%_30%]" />
            </a>
            <figcaption className="text-[13px] text-muted">{h.showcaseCaption}</figcaption>
          </figure>
          <figure className="m-0 flex flex-col gap-3">
            <RunLog className="h-full min-h-[300px]" />
            <figcaption className="text-[13px] text-muted">{h.run.caption}</figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
