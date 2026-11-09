import { SITE } from '../data/site';

/**
 * Points the address bar, the tab title, the description and the canonical / share links at the current page.
 * index.html carries the home page's values, and every path is served from it, so each other page sets its own.
 */
export function setPageMeta({ path, title, description }: { path: string; title: string; description: string }) {
  if (location.pathname !== path) history.replaceState(null, '', path + location.search + location.hash);
  const full = `${title} · ${SITE.brand}`;
  document.title = full;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', SITE.url + path);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', SITE.url + path);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', full);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
}
