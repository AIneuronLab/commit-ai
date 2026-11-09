// Fetches the GitHub contribution count once, at build time, and stores it in src/data/github.json.
// Visitors' browsers then contact no third party for it. If the service is unreachable, the build keeps
// the last stored value instead of failing.
// Usage: node scripts/github-snapshot.mjs   (run automatically before `npm run build`)
import { readFileSync, writeFileSync } from 'node:fs';

const USER = 'AIneuronLab'; // same as SITE.github.user in src/data/site.ts (a plain script cannot import the .ts file)
const URL_CONTRIB = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`;
const FILE = new URL('../src/data/github.json', import.meta.url);

/** The last-year total from the contributions service's answer, or null if it has none. */
export function contributionsFrom(json) {
  const total = json && json.total ? Object.values(json.total)[0] : undefined;
  return Number.isFinite(total) ? total : null;
}

/** The stored snapshot, or an empty one if the file is missing or unreadable (so the build never fails on it). */
export function readSnapshot(text) {
  try {
    const s = JSON.parse(text);
    if (Number.isFinite(s?.contributions)) return s;
  } catch { /* fall through */ }
  return { contributions: 0, fetchedAt: null };
}

/** The snapshot to store: the fresh total with its date, or the previous snapshot if the fetch failed. */
export function nextSnapshot(prev, fresh, now) {
  return fresh === null ? prev : { contributions: fresh, fetchedAt: now.toISOString() };
}

async function main() {
  let text = null;
  try { text = readFileSync(FILE, 'utf8'); } catch { /* missing: start empty */ }
  const prev = readSnapshot(text);
  let fresh = null;
  try {
    const res = await fetch(URL_CONTRIB, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
    if (res.ok) fresh = contributionsFrom(await res.json());
  } catch { /* offline: keep the stored value */ }
  const next = nextSnapshot(prev, fresh, new Date());
  if (next !== prev || text === null) writeFileSync(FILE, JSON.stringify(next, null, 2) + '\n');
  console.log(fresh === null ? `github: kept ${prev.contributions} (service unreachable)` : `github: ${fresh} contributions`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
