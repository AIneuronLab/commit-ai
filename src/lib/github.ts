import { useEffect, useState } from 'react';
import { SITE } from '../data/site';
import { FEATURED_REPOS, GITHUB_SNAPSHOT, type RepoFallback } from '../data/projects';

export type RepoInfo = { name: string; description: string | null; language: string | null; stars: number; pushedAt: string; url: string };
export type Day = { date: string; count: number; level: number };
export type GhData = { publicRepos: number; contributions: number; days: Day[]; repos: RepoInfo[] };
export type GhState = { data: GhData; live: boolean; loading: boolean };

const KEY = 'ca-gh-v2';
const TTL = 60 * 60 * 1000; // one hour: the public API allows 60 requests/hour/IP, the cache keeps us far below it
const API = 'https://api.github.com';
const CONTRIB = `https://github-contributions-api.jogruber.de/v4/${SITE.github.user}?y=last`;

const repoUrl = (name: string) => `${SITE.github.url}/${name}`;
const fallbackRepo = (name: string, f: RepoFallback): RepoInfo => ({ name, description: null, language: f.language, stars: 0, pushedAt: f.pushedAt, url: repoUrl(name) });

/** Quiet synthetic week grid used only when the contributions service is unreachable. */
const emptyDays = (): Day[] => {
  const out: Day[] = [];
  const d = new Date();
  d.setDate(d.getDate() - 181);
  for (let i = 0; i < 182; i++) { out.push({ date: d.toISOString().slice(0, 10), count: 0, level: 0 }); d.setDate(d.getDate() + 1); }
  return out;
};

export const SNAPSHOT: GhData = {
  publicRepos: GITHUB_SNAPSHOT.publicRepos,
  contributions: GITHUB_SNAPSHOT.contributions,
  days: emptyDays(),
  repos: FEATURED_REPOS.map((r) => fallbackRepo(r.name, r.fallback)),
};

async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(String(res.status));
  return res.json() as Promise<T>;
}

async function fetchLive(signal: AbortSignal): Promise<GhData> {
  const [user, repos, contrib] = await Promise.allSettled([
    getJson<{ public_repos: number }>(`${API}/users/${SITE.github.user}`, signal),
    getJson<{ name: string; description: string | null; language: string | null; stargazers_count: number; pushed_at: string; html_url: string; fork: boolean }[]>(`${API}/users/${SITE.github.user}/repos?per_page=100`, signal),
    getJson<{ total: Record<string, number>; contributions: Day[] }>(CONTRIB, signal),
  ]);
  if (user.status === 'rejected' && repos.status === 'rejected' && contrib.status === 'rejected') throw new Error('offline');

  const byName = new Map(repos.status === 'fulfilled' ? repos.value.map((r) => [r.name, r]) : []);
  const days = contrib.status === 'fulfilled' ? contrib.value.contributions.slice(-182) : SNAPSHOT.days;
  return {
    publicRepos: user.status === 'fulfilled' ? user.value.public_repos : SNAPSHOT.publicRepos,
    contributions: contrib.status === 'fulfilled' ? Object.values(contrib.value.total)[0] ?? SNAPSHOT.contributions : SNAPSHOT.contributions,
    days,
    repos: FEATURED_REPOS.map((f) => {
      const r = byName.get(f.name);
      return r ? { name: r.name, description: r.description, language: r.language, stars: r.stargazers_count, pushedAt: r.pushed_at, url: r.html_url } : fallbackRepo(f.name, f.fallback);
    }),
  };
}

const readCache = (): { at: number; data: GhData } | null => {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
};

/** Reads GitHub in the visitor's browser (cached 1 h). Falls back to the cache, then to a snapshot. */
export function useGithub(enabled: boolean): GhState {
  const cached = readCache();
  const [state, setState] = useState<GhState>({ data: cached?.data ?? SNAPSHOT, live: !!cached, loading: !cached || Date.now() - cached.at > TTL });

  useEffect(() => {
    if (!enabled || !state.loading) return;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    fetchLive(ctrl.signal)
      .then((data) => {
        try { localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), data })); } catch { /* ignore */ }
        setState({ data, live: true, loading: false });
      })
      .catch(() => setState((s) => ({ ...s, live: false, loading: false })))
      .finally(() => clearTimeout(timer));
    return () => { ctrl.abort(); clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return state;
}
