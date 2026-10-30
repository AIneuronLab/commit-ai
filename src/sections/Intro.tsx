import { Kicker } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

/** A short statement of how we work, set large like an editorial lede. */
export function Intro() {
  const { t } = useApp();
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-[1200px] items-start gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[260px_1fr] lg:gap-16 lg:py-32">
        <div className="lg:pt-5"><Kicker>{t.intro.kicker}</Kicker></div>
        <Reveal className="flex flex-col gap-8">
          <p className="m-0 font-serif text-[30px] leading-[1.18] text-fg sm:text-[42px] lg:text-[52px]">{t.intro.text}</p>
          <p className="m-0 font-serif text-[22px] text-accent italic sm:text-[26px]">{t.intro.sign}</p>
        </Reveal>
      </div>
    </section>
  );
}
