import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { fr, type Dict } from './fr';
import { en } from './en';

export type Lang = 'fr' | 'en';
export type Mode = 'dark' | 'light';

type Ctx = { t: Dict; lang: Lang; mode: Mode; toggleLang: () => void; toggleMode: () => void };
const AppCtx = createContext<Ctx | null>(null);

const read = (key: string) => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const write = (key: string, value: string) => {
  try { localStorage.setItem(key, value); } catch { /* storage can be blocked: the app still works */ }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const q = new URLSearchParams(location.search).get('lang');
    const saved = q ?? read('ca-lang');
    return saved === 'en' ? 'en' : 'fr';
  });
  const [mode, setMode] = useState<Mode>(() => {
    const q = new URLSearchParams(location.search).get('theme');
    const saved = q ?? read('ca-theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('light', mode === 'light');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'light' ? '#ffffff' : '#070b12');
  }, [mode]);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const toggleLang = useCallback(() => setLang((l) => { const n = l === 'fr' ? 'en' : 'fr'; write('ca-lang', n); return n; }), []);
  const toggleMode = useCallback(() => setMode((m) => { const n = m === 'dark' ? 'light' : 'dark'; write('ca-theme', n); return n; }), []);

  const value = useMemo<Ctx>(() => ({ t: lang === 'en' ? en : fr, lang, mode, toggleLang, toggleMode }), [lang, mode, toggleLang, toggleMode]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const v = useContext(AppCtx);
  if (!v) throw new Error('useApp must be used inside <AppProvider>');
  return v;
}
