/**
 * Projects shown on the site.
 *  - FEATURED_REPOS is a whitelist of PUBLIC GitHub repos; live details (language, stars, description) are
 *    read from the GitHub API in the visitor's browser, with `fallback` used if the API is unreachable.
 *    Edit this list to choose what the "Labo GitHub" section shows.
 */
/** The live ActivityConnect booking site, linked from its card. */
export const SITE_ACTIVITY = { host: 'activityconnect.commitai.dev', url: 'https://activityconnect.commitai.dev' };

export type RepoFallback = { language: string | null; pushedAt: string };

export const FEATURED_REPOS: { name: string; fallback: RepoFallback }[] = [
  { name: 'api_utilisateur', fallback: { language: 'Python', pushedAt: '2026-01-02T21:13:26Z' } },
  { name: 'cr_meet', fallback: { language: 'Python', pushedAt: '2026-04-29T16:58:25Z' } },
  { name: 'n8n', fallback: { language: null, pushedAt: '2026-06-09T11:03:33Z' } },
  { name: 'web_scraping', fallback: { language: 'Jupyter Notebook', pushedAt: '2026-01-14T20:50:14Z' } },
  { name: 'BrainCancerDetection', fallback: { language: 'Jupyter Notebook', pushedAt: '2026-01-17T22:37:25Z' } },
];

/** Shown if the GitHub endpoints cannot be reached (last known values). */
export const GITHUB_SNAPSHOT = { publicRepos: 11, contributions: 983 };
