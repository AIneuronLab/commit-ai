import { Container, SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { TESTIMONIALS } from '../data/testimonials';
import { useApp } from '../i18n';

/** Client quotes. Hidden until real, approved quotes are added to data/testimonials.ts. */
export function Testimonials() {
  const { t, lang } = useApp();
  if (!TESTIMONIALS.length) return null;
  return (
    <section className="border-t border-line">
      <Container className="flex flex-col gap-12 py-20 lg:py-28">
        <SectionHead eyebrow={t.testimonials.kicker} a={t.testimonials.title} />
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
          {TESTIMONIALS.map((q) => (
            <li key={q.name}>
              <Reveal>
                <blockquote className="m-0 rounded-2xl border border-line bg-card p-8">
                  <p className="m-0 text-[18px] leading-relaxed text-fg">« {q.quote[lang]} »</p>
                  <footer className="mt-4 text-[14px] text-muted"><b className="font-medium text-fg">{q.name}</b> · {q.role}</footer>
                </blockquote>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
