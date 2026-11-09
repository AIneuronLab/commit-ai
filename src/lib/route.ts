/**
 * The site's pages and their addresses. The host serves index.html for every path, so the app picks the page
 * from the path itself. Each page has a French and an English address; both work in either language.
 */
export type Page = 'home' | 'legal' | 'privacy' | 'service';
export type ServiceId = 'automation' | 'web' | 'mobile' | 'api';
type Paths = { fr: string; en: string };

const PATHS: Record<Exclude<Page, 'service'>, Paths> = {
  home: { fr: '/', en: '/' },
  legal: { fr: '/mentions-legales', en: '/legal-notice' },
  privacy: { fr: '/confidentialite', en: '/privacy' },
};

const SERVICES: Record<ServiceId, Paths> = {
  automation: { fr: '/services/automatisation-ia', en: '/services/automation-ai' },
  web: { fr: '/services/sites-web', en: '/services/websites' },
  mobile: { fr: '/services/applications-mobiles', en: '/services/mobile-apps' },
  api: { fr: '/services/backend-api', en: '/services/backend-api' },
};

const clean = (pathname: string) => ('/' + pathname.replace(/^\/+|\/+$/g, '')).toLowerCase();

/** Every address with what it leads to, home excluded. */
const ENTRIES: { paths: Paths; page: Page; service?: ServiceId }[] = [
  { paths: PATHS.legal, page: 'legal' },
  { paths: PATHS.privacy, page: 'privacy' },
  ...(Object.keys(SERVICES) as ServiceId[]).map((id) => ({ paths: SERVICES[id], page: 'service' as const, service: id })),
];
const entryFor = (pathname: string) => {
  const p = clean(pathname);
  return ENTRIES.find((e) => e.paths.fr === p || e.paths.en === p);
};

/** Which page a path shows; any unknown path shows the home page. */
export function pageFor(pathname: string): Page {
  return entryFor(pathname)?.page ?? 'home';
}

/** Which service a path shows, or null if it is not a service page. */
export function serviceFor(pathname: string): ServiceId | null {
  return entryFor(pathname)?.service ?? null;
}

/**
 * The language a page's address is written in (so /privacy opens in English), or null for the home page and
 * for addresses shared by both languages.
 */
export function langFor(pathname: string): 'fr' | 'en' | null {
  const e = entryFor(pathname);
  if (!e || e.paths.fr === e.paths.en) return null;
  return e.paths.fr === clean(pathname) ? 'fr' : 'en';
}

/** The address of a page in the reader's language. */
export function pathFor(page: Exclude<Page, 'service'>, lang: 'fr' | 'en'): string {
  return PATHS[page][lang];
}

/** The address of a service page in the reader's language. */
export function servicePath(id: ServiceId, lang: 'fr' | 'en'): string {
  return SERVICES[id][lang];
}
