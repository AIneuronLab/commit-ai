import { Container, Measure } from '../components/ui';
import { Logo } from '../brand/Logo';
import { SITE, waLink } from '../data/site';
import { pathFor } from '../lib/route';
import { useApp } from '../i18n';

const link = 'text-[15px] text-bone/85 transition-colors hover:text-glow';

/**
 * Night footer: the logo (mark and wordmark) and the tagline, chapters and contact columns, then the bottom line
 * with the copyright and the links to the legal notice and the privacy policy. `base` is '' on the home page and
 * '/' elsewhere, so the section links lead back to the home page.
 */
export function Footer({ base = '' }: { base?: string }) {
  const { t, lang } = useApp();
  const f = t.footer;
  const ids = ['services', 'process', 'journey', 'faq', 'contact'] as const;
  const social: [string, string][] = [['LinkedIn', SITE.linkedin.url], ['GitHub', SITE.github.url], ['WhatsApp', waLink(t.contact.waText)]];
  return (
    <footer className="force-dark border-t border-line bg-night text-bone">
      <Container className="grid gap-14 pt-20 pb-14 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div className="flex flex-col gap-6">
          <a href={base || '#top'} aria-label="Commit·AI" className="self-start"><Logo size={72} variant="dark" animated /></a>
          <p className="m-0 max-w-[360px] text-[15.5px] leading-relaxed text-bone/70">{f.tagline}</p>
          <Measure>{t.hero.by} {SITE.owner}</Measure>
        </div>
        <nav aria-label={f.explore} className="flex flex-col gap-4">
          <Measure>{f.explore}</Measure>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">{ids.map((id, i) => <li key={id}><a href={`${base}#${id}`} className={link}><span className="measure mr-3">0{i + 1}</span>{t.nav[id]}</a></li>)}</ul>
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
        <nav aria-label={`${t.legal.notice} · ${t.legal.privacy}`} className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href={pathFor('legal', lang)} className="transition-colors hover:text-glow">{t.legal.notice}</a>
          <a href={pathFor('privacy', lang)} className="transition-colors hover:text-glow">{t.legal.privacy}</a>
          <a href="#top" onClick={base ? (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); } : undefined} className="transition-colors hover:text-glow">{f.top} ↑</a>
        </nav>
      </Container>
    </footer>
  );
}
