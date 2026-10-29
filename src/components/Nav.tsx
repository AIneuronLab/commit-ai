import { useEffect, useState } from 'react';
import { motion, useScroll } from 'motion/react';
import { Magnetic } from './Magnetic';
import { FolderKanban, GitBranch, House, Layers, MessageCircle, Moon, Sun } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { useApp } from '../i18n';

const SECTIONS = ['top', 'services', 'projects', 'lab', 'contact'] as const;
type Section = (typeof SECTIONS)[number];

/** Which section is currently under the top third of the screen. */
function useActiveSection(): Section {
  const [active, setActive] = useState<Section>('top');
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id as Section)),
      { rootMargin: '-35% 0px -55% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

const buzz = () => { try { navigator.vibrate?.(8); } catch { /* not supported */ } };

export function TopBar({ onStart }: { onStart: () => void }) {
  const { t, lang, mode, toggleLang, toggleMode } = useApp();
  const { scrollYProgress } = useScroll();
  const links: [string, string][] = [['#services', t.nav.services], ['#projects', t.nav.projects], ['#lab', t.nav.lab], ['#journey', t.nav.journey], ['#contact', t.nav.contact]];
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-nav pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6" aria-label={t.a11y.menu}>
        <a href="#top" aria-label="Commit·AI"><Logo size={34} variant={mode} /></a>
        <div className="hidden items-center gap-5 font-mono text-[11.5px] tracking-[0.08em] whitespace-nowrap uppercase md:flex lg:gap-7 lg:text-[12.5px]">
          {links.map(([h, l]) => <a key={h} href={h} className="text-soft transition-colors hover:text-accent">{l}</a>)}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleLang} aria-label={t.a11y.switchLang} className="flex h-11 min-w-11 items-center justify-center rounded-md border border-line px-3 font-mono text-[13px] font-medium text-soft transition hover:border-line-strong">
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button onClick={toggleMode} aria-label={mode === 'dark' ? t.a11y.toLight : t.a11y.toDark} className="flex size-11 items-center justify-center rounded-md border border-line text-soft transition hover:border-line-strong">
            {mode === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <div className="hidden lg:block"><Magnetic className="inline-flex"><button onClick={onStart} className="min-h-11 rounded-md bg-brand-deep px-5 text-[14px] font-medium whitespace-nowrap text-white transition hover:bg-brand">{t.nav.cta}</button></Magnetic></div>
        </div>
      </nav>
      <motion.span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
    </header>
  );
}

const TABS: { id: Section; icon: typeof House; key: 'home' | 'services' | 'projects' | 'lab' | 'contact' }[] = [
  { id: 'top', icon: House, key: 'home' },
  { id: 'services', icon: Layers, key: 'services' },
  { id: 'projects', icon: FolderKanban, key: 'projects' },
  { id: 'lab', icon: GitBranch, key: 'lab' },
  { id: 'contact', icon: MessageCircle, key: 'contact' },
];

/** App-style bottom tab bar, phones only. */
export function TabBar() {
  const { t } = useApp();
  const active = useActiveSection();
  return (
    <nav aria-label={t.a11y.menu} className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 md:hidden">
      <ul className="m-0 flex list-none items-center justify-between rounded-xl border border-line-strong bg-nav p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,.65)] backdrop-blur-xl">
        {TABS.map(({ id, icon: Icon, key }) => {
          const on = active === id;
          return (
            <li key={id} className="flex-1">
              <a
                href={`#${id}`}
                onClick={buzz}
                aria-current={on ? 'true' : undefined}
                className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg text-[12px] font-medium transition-colors ${on ? 'text-white' : 'text-soft'}`}
              >
                {on && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-lg bg-brand-deep" transition={{ type: 'spring', damping: 28, stiffness: 400 }} />}
                <Icon className="relative size-5" aria-hidden="true" />
                <span className="relative">{t.tabs[key]}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
