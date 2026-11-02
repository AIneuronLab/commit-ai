import { Kicker } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

/** A short statement of how we work. */
export function Intro() {
  const { t } = useApp();
  return (
    <section>
      <div className="mx-auto grid max-w-[1200px] items-start gap-6 px-4 py-20 sm:px-6 lg:grid-cols-[240px_1fr] lg:gap-16 lg:py-28">
        <div className="lg:pt-2"><Kicker>{t.intro.kicker}</Kicker></div>
        <Reveal className="flex flex-col gap-6">
          <p className="m-0 text-[26px] leading-[1.35] font-medium tracking-[-0.015em] text-fg sm:text-[32px]">{t.intro.text}</p>
          <p className="m-0 text-[18px] font-semibold text-accent">{t.intro.sign}</p>
        </Reveal>
      </div>
    </section>
  );
}
