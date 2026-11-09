/**
 * The site's few pages and their addresses. The host serves index.html for every path, so the app picks the
 * page from the path itself. Each page has a French and an English address; both work in either language.
 */
export type Page = 'home' | 'legal' | 'privacy';

const PATHS: Record<Page, { fr: string; en: string }> = {
  home: { fr: '/', en: '/' },
  legal: { fr: '/mentions-legales', en: '/legal-notice' },
  privacy: { fr: '/confidentialite', en: '/privacy' },
};

const clean = (pathname: string) => ('/' + pathname.replace(/^\/+|\/+$/g, '')).toLowerCase();

/** Which page a path shows; any unknown path shows the home page. */
export function pageFor(pathname: string): Page {
  const p = clean(pathname);
  for (const page of Object.keys(PATHS) as Page[]) {
    if (page !== 'home' && (PATHS[page].fr === p || PATHS[page].en === p)) return page;
  }
  return 'home';
}

/** The language a page's address is written in (so /privacy opens in English), or null for the home page. */
export function langFor(pathname: string): 'fr' | 'en' | null {
  const p = clean(pathname);
  for (const page of Object.keys(PATHS) as Page[]) {
    if (page === 'home') continue;
    if (PATHS[page].fr === p) return 'fr';
    if (PATHS[page].en === p) return 'en';
  }
  return null;
}

/** The address of a page in the reader's language. */
export function pathFor(page: Page, lang: 'fr' | 'en'): string {
  return PATHS[page][lang];
}
