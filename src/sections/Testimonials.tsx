import { H2, Kicker } from '../components/ui';
import { Reveal } from '../motion';
import { TESTIMONIALS } from '../data/testimonials';
import { useApp } from '../i18n';

export function Testimonials() {
  const { t, lang } = useApp();
  if (!TESTIMONIALS.length) return null;
  return (
    <section className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-col gap-3"><Kicker>{t.testimonials.kicker}</Kicker><H2 className="lg:text-[44px]">{t.testimonials.title}</H2></div>
        <ul className="m-0 grid list-none gap-8 p-0 md:grid-cols-2">
          {TESTIMONIALS.map((q) => (
            <li key={q.name}>
              <Reveal>
                <blockquote className="m-0 border-l-2 border-line-strong pl-5">
                  <p className="m-0 text-[19px] leading-relaxed text-fg">« {q.quote[lang]} »</p>
                  <footer className="mt-3 text-[15px] text-muted"><b className="text-soft">{q.name}</b> · {q.role}</footer>
                </blockquote>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
