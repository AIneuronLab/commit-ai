import { ArrowUp } from 'lucide-react';
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from '../components/BrandIcons';
import { Logo } from '../brand/Logo';
import { SITE, waLink } from '../data/site';
import { useApp } from '../i18n';

const colTitle = 'm-0 mb-4 font-mono text-[12px] tracking-[0.14em] text-muted uppercase';
const link = 'inline-flex items-center gap-1.5 text-[15px] text-soft transition-colors hover:text-accent';

/** Site footer: brand and contact on the left, three link columns, a quiet bottom bar. Always dark. */
export function Footer() {
  const { t } = useApp();
  const f = t.footer;
  const social = [
    { label: 'WhatsApp', href: waLink(t.contact.waText), Icon: WhatsAppIcon },
    { label: 'LinkedIn', href: SITE.linkedin.url, Icon: LinkedInIcon },
    { label: 'GitHub', href: SITE.github.url, Icon: GitHubIcon },
  ];
  const nav: [string, string][] = [['#services', t.nav.services], ['#projects', t.nav.projects], ['#lab', t.nav.lab], ['#journey', t.nav.journey], ['#contact', t.nav.contact]];
  return (
    <footer className="force-dark border-t border-line bg-[#050a14] text-fg">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 pt-16 pb-10 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr_1.2fr] lg:gap-10">
        <div className="flex max-w-[360px] flex-col gap-5">
          <a href="#top" aria-label="Commit·AI"><Logo size={36} variant="dark" /></a>
          <p className="m-0 text-[15px] leading-relaxed text-muted">{f.tagline}</p>
          <p className="m-0 inline-flex items-center gap-2.5 self-start rounded-md border border-line px-3 py-1.5 font-mono text-[12px] tracking-[0.08em] text-soft uppercase">
            <span className="size-2 rounded-full bg-ok" />{t.hero.availability}
          </p>
        </div>

        <nav aria-label={f.explore}>
          <h2 className={colTitle}>{f.explore}</h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {nav.map(([h, l]) => <li key={h}><a href={h} className={link}>{l}</a></li>)}
          </ul>
        </nav>

        <div>
          <h2 className={colTitle}>{f.offer}</h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {t.services.items.map((s) => <li key={s.title}><a href="#services" className={link}>{s.title}</a></li>)}
          </ul>
        </div>

        <div>
          <h2 className={colTitle}>{f.reach}</h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li><a href={`mailto:${SITE.email}`} className={link}>{SITE.email}</a></li>
            <li className="text-[15px] text-muted">{f.location}</li>
          </ul>
          <ul className="m-0 mt-5 flex list-none gap-2.5 p-0">
            {social.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="flex size-11 items-center justify-center rounded-md border border-line text-soft transition-colors hover:border-brand-azure hover:text-accent">
                  <Icon className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 pt-6 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] text-[13px] text-muted sm:px-6 md:flex-row md:items-center md:justify-between md:pb-6">
          <p className="m-0">{f.copy}</p>
          <p className="m-0 max-w-[560px] text-[12px] md:text-right">{f.photos}</p>
          <a href="#top" className="inline-flex items-center gap-1.5 self-start font-mono text-[12px] tracking-[0.1em] text-soft uppercase transition-colors hover:text-accent md:mr-14 md:self-auto">
            {f.top} <ArrowUp className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
