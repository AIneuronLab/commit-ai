import { Container, SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

/** Three steps in one ruled row. */
export function How() {
  const { t } = useApp();
  return (
    <section id="process" className="scroll-mt-16 border-t border-line">
      <Container className="flex flex-col gap-12 py-20 lg:gap-16 lg:py-28">
        <SectionHead eyebrow={t.how.kicker} a={t.how.title} b={t.how.titleB} />
        <Reveal>
          <ol className="m-0 grid list-none overflow-hidden rounded-2xl border border-line p-0 md:grid-cols-3">
            {t.how.steps.map((s, i) => (
              <li key={s.t} className={`flex flex-col gap-3 p-7 sm:p-8 ${i > 0 ? 'border-t border-line md:border-t-0 md:border-l' : ''}`}>
                <span className="font-mono text-[12px] text-accent">{s.tag}</span>
                <h3 className="m-0 text-[20px] font-semibold tracking-[-0.015em] text-fg">{s.t}</h3>
                <p className="m-0 text-[15.5px] leading-relaxed text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
