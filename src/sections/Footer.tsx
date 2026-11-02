import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from '../components/BrandIcons';
import { Container } from '../components/ui';
import { Logo } from '../brand/Logo';
import { SITE, waLink } from '../data/site';
import { useApp } from '../i18n';

const colTitle = 'm-0 mb-4 text-[13.5px] font-medium text-fg';
const link = 'text-[14.5px] text-muted transition-colors hover:text-fg';

/** Footer: brand and social links, three link columns, legal line. */
export function Footer() {
  const { t, mode } = useApp();
  const f = t.footer;
  const social = [
    { label: 'WhatsApp', href: waLink(t.contact.waText), Icon: WhatsAppIcon },
    { label: 'LinkedIn', href: SITE.linkedin.url, Icon: LinkedInIcon },
    { label: 'GitHub', href: SITE.github.url, Icon: GitHubIcon },
  ];
  const company: [string, string][] = [['#projects', t.nav.projects], ['#process', t.nav.process], ['#journey', t.nav.journey], ['#faq', t.nav.faq]];
  return (
    <footer className="border-t border-line bg-bg-alt">
      <Container className="grid gap-12 pt-16 pb-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
        <div className="flex max-w-[340px] flex-col gap-5">
          <a href="#top" aria-label="Commit·AI"><Logo size={30} variant={mode} /></a>
          <p className="m-0 text-[14.5px] leading-relaxed text-muted">{f.tagline}</p>
          <ul className="m-0 flex list-none gap-1 p-0">
            {social.map(({ label, href, Icon }) => (
              <li key={label}><a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="flex size-9 items-center justify-center rounded-lg text-muted transition hover:bg-bg hover:text-fg"><Icon className="size-4.5" /></a></li>
            ))}
          </ul>
        </div>
        <nav aria-label={f.explore}>
          <h2 className={colTitle}>{f.explore}</h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">{company.map(([h, l]) => <li key={h}><a href={h} className={link}>{l}</a></li>)}</ul>
        </nav>
        <div>
          <h2 className={colTitle}>{f.offer}</h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">{t.services.items.map((s) => <li key={s.id}><a href="#services" className={link}>{s.title}</a></li>)}</ul>
        </div>
        <div>
          <h2 className={colTitle}>{f.reach}</h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            <li><a href={`mailto:${SITE.email}`} className={link}>{SITE.email}</a></li>
            <li><a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" className={link}>{SITE.whatsapp.display}</a></li>
            <li className="text-[14.5px] text-muted">{f.location}</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-3 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">{f.copy}</p>
          <a href="#top" className="transition-colors hover:text-fg">{f.top} ↑</a>
        </Container>
      </div>
    </footer>
  );
}
