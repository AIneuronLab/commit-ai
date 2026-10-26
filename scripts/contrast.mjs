// Checks WCAG contrast of every text token on every surface token, for both themes.
// Usage: node scripts/contrast.mjs   (reads the token values straight from src/index.css)
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
const block = (re) => Object.fromEntries([...css.match(re)[1].matchAll(/--ca-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(([, k, v]) => [k, v]));
const themes = { dark: block(/:root\s*\{([^}]*)\}/), light: block(/\.light\s*\{([^}]*)\}/) };
const brand = { brand: '#2196f3', 'brand-deep': '#1565c0', white: '#ffffff' };

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const TEXT = ['fg', 'soft', 'muted', 'accent', 'ok', 'warn'];
const SURFACES = ['bg', 'bg-alt', 'card', 'card-alt', 'accent-soft'];
let failures = 0;

for (const [name, t] of Object.entries(themes)) {
  console.log(`\n== ${name} ==`);
  for (const tx of TEXT) {
    const row = SURFACES.map((s) => {
      const r = ratio(t[tx], t[s]);
      if (r < 4.5) failures++;
      return `${s}:${r.toFixed(1)}${r < 4.5 ? '  FAIL' : ''}`;
    });
    console.log(tx.padEnd(6), row.join('  '));
  }
}
// white text on the blue buttons (same in both themes)
for (const [k, v] of Object.entries(brand)) if (k !== 'white') {
  const r = ratio('#ffffff', v);
  console.log(`\nwhite on ${k}: ${r.toFixed(2)}${r < 4.5 ? '  (large/bold text only)' : ''}`);
}
console.log(failures ? `\n${failures} failing pair(s)` : '\nAll text tokens pass 4.5:1 on every surface.');
process.exit(failures ? 1 : 0);
