import { useEffect, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Container, Measure } from '../components/ui';
import { LEGAL, PRIVACY, UPDATED, type Block } from '../legal/content';
import { pathFor } from '../lib/route';
import { SITE } from '../data/site';
import { useApp } from '../i18n';

/** The legal notice or the privacy policy: a title, the date of the last update, then numbered sections. */
export function LegalPage({ page }: { page: 'legal' | 'privacy' }) {
  const { t, lang } = useApp();
  const doc = (page === 'legal' ? LEGAL : PRIVACY)[lang];

  // the address, title, description and canonical link follow the page and its language
  // (index.html carries the home page's, and every path is served from it)
  useEffect(() => {
    const path = pathFor(page, lang);
    if (location.pathname !== path) history.replaceState(null, '', path + location.search + location.hash);
    document.title = `${doc.title} · ${SITE.brand}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', doc.lead);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', SITE.url + path);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', SITE.url + path);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${doc.title} · ${SITE.brand}`);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', doc.lead);
  }, [page, lang, doc.title, doc.lead]);

  // `{privacy}` in a text becomes a link to the privacy policy
  const text = (s: string): ReactNode => {
    const [before, after] = s.split('{privacy}');
    return after === undefined ? s : <>{before}<a href={pathFor('privacy', lang)} className="text-accent underline underline-offset-4">{t.legal.privacyLink}</a>{after}</>;
  };
  const block = (b: Block, k: number) => Array.isArray(b)
    ? <ul key={k} className="m-0 flex list-disc flex-col gap-2 pl-5 marker:text-accent">{b.map((li) => <li key={li}>{text(li)}</li>)}</ul>
    : <p key={k} className="m-0">{text(b)}</p>;

  return (
    <main id="main" className="pt-32 pb-24 lg:pt-40 lg:pb-32">
      <Container className="max-w-[920px]">
        <a href="/" className="measure inline-flex items-center gap-2 transition-colors hover:text-fg"><ArrowLeft className="size-3.5" aria-hidden="true" />{t.legal.back}</a>
        <h1 className="display-2 m-0 mt-10 text-fg">{doc.title}</h1>
        <p className="m-0 mt-6 max-w-[620px] text-[18px] leading-[1.6] text-soft">{doc.lead}</p>
        <Measure className="mt-6 block">{t.legal.updated}{lang === 'fr' ? ' : ' : ': '}{UPDATED[lang]}</Measure>
        <div className="mt-14 flex flex-col">
          {doc.sections.map((s, i) => (
            <section key={s.h} className="grid gap-4 border-t border-line py-8 md:grid-cols-[220px_1fr] md:gap-10">
              <h2 className="m-0 flex gap-3 text-[17px] leading-snug font-semibold text-fg"><span className="measure pt-1">0{i + 1}</span>{s.h}</h2>
              <div className="flex flex-col gap-4 text-[16px] leading-[1.7] text-soft">{s.body.map(block)}</div>
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
