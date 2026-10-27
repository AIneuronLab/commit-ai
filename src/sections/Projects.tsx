import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { SectionHead } from '../components/ui';
import { serviceIcons } from '../icons/ServiceIcons';
import { Reveal } from '../motion';
import { BayKatDemo } from '../mockups/BayKatDemo';
import { BrowserFrame, ChatMock, DashboardMock } from '../mockups/Mockups';
import { CLIENT_PROJECTS, type ClientProjectId } from '../data/projects';
import { useApp } from '../i18n';

function Text({ id, kicker }: { id: ClientProjectId; kicker: string }) {
  const { t } = useApp();
  const p = t.projects.items[id];
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[13px] text-accent">{kicker}</span>
      <h3 className="m-0 font-display text-[26px] leading-tight font-bold tracking-tight sm:text-[32px]">{p.title}</h3>
      <p className="m-0 text-[17px] text-muted">{p.desc}</p>
      <p className="tint-ok m-0 mt-1 inline-flex items-center gap-2 self-start rounded-full border px-3.5 py-2 text-[15px] text-ok"><Check className="size-4" />{p.result}</p>
      {p.note && <p className="m-0 text-[14px] text-muted">{p.note}</p>}
    </div>
  );
}

const Slot = ({ className = '', children }: { className?: string; children: ReactNode }) => (
  <li className={`flex ${className}`}>{children}</li>
);

export function Projects() {
  const { t, mode } = useApp();
  const meta = Object.fromEntries(CLIENT_PROJECTS.map((p) => [p.id, `${p.client} · ${p.year}`])) as Record<ClientProjectId, string>;
  const WebApp = serviceIcons.webApp;
  return (
    <section id="projects" className="overflow-hidden border-t border-line bg-[radial-gradient(ellipse_50%_40%_at_80%_10%,var(--ca-hero-glow),transparent_70%)]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-14 sm:px-6 lg:gap-12 lg:py-24">
        <SectionHead kicker={t.projects.kicker} title={t.projects.title} lead={t.projects.lead} />
        <ul className="snap-row m-0 list-none p-0 lg:grid-cols-2 lg:gap-7">
          <Slot className="w-[90%] sm:w-[78%] lg:col-span-2 lg:w-auto">
            <Reveal className="w-full">
              <article className="grad-card-a grid gap-8 rounded-[28px] border border-line p-6 sm:p-9 lg:grid-cols-[340px_1fr] lg:items-center lg:gap-12">
                <Text id="tenders" kicker={meta.tenders} />
                <BrowserFrame url="veille.ashia-group.com" className="h-[400px] sm:h-[480px]"><DashboardMock /></BrowserFrame>
              </article>
            </Reveal>
          </Slot>
          <Slot className="w-[90%] sm:w-[78%] lg:w-auto">
            <Reveal className="w-full">
              <article className="grad-card-a flex h-full flex-col gap-7 rounded-[28px] border border-line p-6 sm:p-9">
                <Text id="hrbot" kicker={meta.hrbot} />
                <BrowserFrame url="rh.ashia-group.com/assistant" className="my-auto h-[360px]"><ChatMock /></BrowserFrame>
              </article>
            </Reveal>
          </Slot>
          <Slot className="w-[90%] sm:w-[78%] lg:w-auto">
            <Reveal className="w-full" delay={0.08}>
              <article className="grad-card-b flex h-full flex-col gap-7 rounded-[28px] border border-line p-6 sm:p-9">
                <Text id="baykat" kicker={meta.baykat} />
                <div className="mt-auto flex justify-center"><BayKatDemo /></div>
              </article>
            </Reveal>
          </Slot>
          <Slot className="w-[90%] sm:w-[78%] lg:col-span-2 lg:w-auto">
            <Reveal className="w-full">
              <article className="grad-card-a flex flex-col items-start gap-6 rounded-[28px] border border-line p-6 sm:p-9 lg:flex-row lg:items-center lg:gap-12">
                <span className="flex size-24 shrink-0 items-center justify-center rounded-[28px] border border-line-strong bg-card-alt">
                  <WebApp className="size-18" ink={mode === 'dark' ? '#EEF5FD' : '#0B1730'} soft="rgba(79,195,247,.22)" />
                </span>
                <Text id="activity" kicker={meta.activity} />
              </article>
            </Reveal>
          </Slot>
        </ul>
        <p className="m-0 text-[13px] text-muted">{t.projects.disclaimer}</p>
      </div>
    </section>
  );
}
