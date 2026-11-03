import { Container, Measure, SectionHead } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

/** 04 / Process: three numbered steps under a giant title, each with its duration. */
export function How() {
  const { t } = useApp();
  return (
    <section id="process" className="scroll-mt-20 py-24 lg:py-36">
      <Container className="flex flex-col gap-16 lg:gap-20">
        <SectionHead index="04" kicker={t.how.kicker} aside={t.navSub.process} title={t.how.title} lead={t.how.titleB} />
        <ol className="m-0 grid list-none gap-x-10 gap-y-12 p-0 md:grid-cols-3">
          {t.how.steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.08} className="flex">
              <li className="flex w-full flex-col gap-4 border-t border-line pt-5">
                <Measure>0{i + 1} / {s.tag}</Measure>
                <h3 className="display-3 m-0 text-fg">{s.t}</h3>
                <p className="m-0 max-w-[360px] text-[16.5px] leading-[1.6] text-muted">{s.d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
