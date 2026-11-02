import { Container, TwoTone } from '../components/ui';
import { Reveal } from '../motion';
import { useApp } from '../i18n';

/** Four real figures in a ruled strip, then one short statement. */
export function Proof() {
  const { t } = useApp();
  return (
    <section className="border-y border-line bg-bg-alt">
      <Container>
        <dl className="m-0 grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
          {t.metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-1 bg-bg-alt py-8 pr-4 pl-0 odd:pr-6 even:pl-6 lg:pl-8 lg:first:pl-0">
              <dt className="order-2 text-[14px] text-muted">{m.label}</dt>
              <dd className="m-0 text-[32px] font-medium tracking-[-0.03em] text-fg tabular-nums sm:text-[40px]">{m.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
      <div className="border-t border-line bg-bg">
        <Container className="py-20 lg:py-28">
          <Reveal>
            <TwoTone a={t.statement.a} b={t.statement.b} as="h2" className="max-w-[1000px] text-[28px] leading-[1.2] sm:text-[36px] lg:text-[42px]" />
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
