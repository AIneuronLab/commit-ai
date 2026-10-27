import { Check } from 'lucide-react';
import { SectionHead } from '../components/ui';
import { serviceIcons, type ServiceIconKey } from '../icons/ServiceIcons';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

const ICONS: ServiceIconKey[] = ['chatbot', 'api', 'automation', 'dashboard', 'aiModel', 'webApp'];

export function Services() {
  const { t, mode } = useApp();
  const ink = mode === 'dark' ? '#EEF5FD' : '#0B1730';
  const soft = mode === 'dark' ? 'rgba(79,195,247,.22)' : 'rgba(33,150,243,.18)';
  return (
    <section id="services" className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-14 sm:px-6 lg:gap-10 lg:py-24">
        <SectionHead kicker={t.services.kicker} title={t.services.title} lead={t.services.lead} />
        <ul className="m-0 grid list-none gap-x-14 p-0 md:grid-cols-2">
          {t.services.items.map((s, i) => {
            const Icon = serviceIcons[ICONS[i]];
            return (
              <li key={s.title} className="border-t border-line">
                <Reveal delay={(i % 2) * 0.06} className="flex gap-5 py-7">
                  <Icon className="size-14 shrink-0" ink={ink} soft={soft} />
                  <div className="flex min-w-0 flex-col gap-2">
                    <p className="m-0 text-[14px] text-muted">{s.need}</p>
                    <h3 className="m-0 font-display text-[22px] leading-snug font-semibold">{s.title}</h3>
                    <p className="m-0 text-[16px] leading-relaxed text-soft">{s.desc}</p>
                    <p className="m-0 mt-1 flex items-start gap-2 text-[15px]"><Check className="mt-0.5 size-4.5 shrink-0 text-ok" />{s.proof}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
