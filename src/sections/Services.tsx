import { Check } from 'lucide-react';
import { SectionHead } from '../components/ui';
import { serviceIcons, type ServiceIconKey } from '../icons/ServiceIcons';
import { Float, Reveal } from '../motion';
import { useApp } from '../i18n';

const ICONS: ServiceIconKey[] = ['chatbot', 'api', 'automation', 'dashboard', 'aiModel', 'webApp'];

export function Services() {
  const { t, mode } = useApp();
  const ink = mode === 'dark' ? '#EEF5FD' : '#0B1730';
  const soft = mode === 'dark' ? 'rgba(79,195,247,.22)' : 'rgba(33,150,243,.18)';
  return (
    <section id="services" className="border-t border-line bg-bg-alt">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-14 sm:px-6 lg:gap-12 lg:py-24">
        <SectionHead kicker={t.services.kicker} title={t.services.title} lead={t.services.lead} />
        <ul className="snap-row m-0 list-none p-0 lg:grid-cols-3 lg:gap-5">
          {t.services.items.map((s, i) => {
            const Icon = serviceIcons[ICONS[i]];
            return (
              <li key={s.title} className="flex w-[84%] sm:w-[46%] lg:w-auto">
                <Reveal delay={(i % 3) * 0.08} className="group flex w-full flex-col gap-4 rounded-[20px] border border-line bg-card p-6 transition hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_18px_40px_-18px_rgba(33,150,243,.45)] sm:p-7">
                  <span className="flex size-19 items-center justify-center rounded-[22px] border border-line-strong bg-[radial-gradient(circle_at_30%_25%,var(--ca-accent-soft),var(--ca-card-alt)_75%)] transition group-hover:-rotate-6 group-hover:scale-105">
                    <Float distance={4} duration={3.2} delay={i * 0.3}><Icon className="size-16" ink={ink} soft={soft} /></Float>
                  </span>
                  <p className="m-0 rounded-[10px] border-l-[3px] border-brand-core bg-card-alt px-3 py-2.5 text-[15px] text-soft light:border-brand-deep">
                    <span className="mb-0.5 block font-mono text-[12px] text-accent">{t.services.need}</span>{s.need}
                  </p>
                  <h3 className="m-0 font-display text-[22px] leading-snug font-semibold">{s.title}</h3>
                  <p className="m-0 text-[16px] text-muted">{s.desc}</p>
                  <p className="m-0 mt-auto flex items-start gap-2.5 border-t border-line pt-3.5 text-[15px]"><Check className="mt-0.5 size-5 shrink-0 text-ok" />{s.proof}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
