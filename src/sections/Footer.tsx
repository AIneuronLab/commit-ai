import { Container, Measure } from '../components/ui';
import { Logo } from '../brand/Logo';
import { SITE, waLink } from '../data/site';
import { useApp } from '../i18n';

const link = 'text-[15px] text-bone/85 transition-colors hover:text-glow';

/** Night footer: the logo (mark and wordmark) and the tagline, chapters and contact columns, credits, legal line. */
export function Footer() {
  const { t } = useApp();
  const f = t.footer;
  const ids = ['services', 'projects', 'process', 'journey', 'faq', 'contact'] as const;
  const social: [string, string][] = [['LinkedIn', SITE.linkedin.url], ['GitHub', SITE.github.url], ['WhatsApp', waLink(t.contact.waText)]];
  return (
    <footer className="force-dark border-t border-line bg-night text-bone">
      <Container className="grid gap-14 pt-20 pb-14 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div className="flex flex-col gap-6">
          <a href="#top" aria-label="Commit·AI" className="self-start"><Logo size={72} variant="dark" animated /></a>
          <p className="m-0 max-w-[360px] text-[15.5px] leading-relaxed text-bone/70">{f.tagline}</p>
          <Measure>{t.hero.by} {SITE.owner}</Measure>
        </div>
        <nav aria-label={f.explore} className="flex flex-col gap-4">
          <Measure>{f.explore}</Measure>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">{ids.map((id, i) => <li key={id}><a href={`#${id}`} className={link}><span className="measure mr-3">0{i + 1}</span>{t.nav[id]}</a></li>)}</ul>
        </nav>
        <div className="flex flex-col gap-4">
          <Measure>{f.reach}</Measure>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li><a href={`mailto:${SITE.email}`} className={link}>{SITE.email}</a></li>
            <li><a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" className={link}>{SITE.whatsapp.display}</a></li>
            <li className="text-[15px] text-bone/60">{f.location} · 14°41′ N 17°26′ W</li>
            {social.map(([l, h]) => <li key={l}><a href={h} target="_blank" rel="noopener noreferrer" className={link}>{l}</a></li>)}
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-3 border-t border-line pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] text-[13px] text-bone/55 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0">{f.copy} · {t.photoCredit}</p>
        <a href="#top" className="transition-colors hover:text-glow">{f.top} ↑</a>
      </Container>
    </footer>
  );
}
