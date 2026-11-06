import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, MapPin, Moon, Sun } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { SITE } from '../data/site';
import { useApp } from '../i18n';

/**
 * Top bar over the hero: the logo, then a blue "start a project" block and a MENU toggle. Transparent at the
 * top of the page, solid once scrolled. The menu covers the screen: numbered chapters with a line each, the
 * main action, and where we are.
 */
export function TopBar({ onStart }: { onStart: () => void }) {
  const { t, lang, mode, toggleLang, toggleMode } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open]);
  const ids = ['services', 'process', 'journey', 'faq', 'contact'] as const;
  const icon = 'flex size-9 items-center justify-center text-bone/80 transition hover:text-bone sm:size-10';

  return (
    <header className={`force-dark fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top,0px)] text-bone transition-[background-color,backdrop-filter] duration-500 ${scrolled && !open ? 'bg-[rgb(7_11_18/0.8)] backdrop-blur-xl' : 'bg-transparent'}`}>
      <nav className={`mx-auto flex max-w-[1360px] items-center justify-between gap-3 px-5 transition-[height] duration-500 sm:px-10 ${scrolled ? 'h-18' : 'h-24'}`} aria-label={t.a11y.menu}>
        <a href="#top" aria-label="Commit·AI" onClick={() => setOpen(false)} className="shrink-0"><Logo size={30} variant="dark" /></a>
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={toggleLang} aria-label={t.a11y.switchLang} className={`${icon} w-auto px-2 font-mono text-[12px] tracking-[0.14em]`}>{lang === 'fr' ? 'EN' : 'FR'}</button>
          <button onClick={toggleMode} aria-label={mode === 'dark' ? t.a11y.toLight : t.a11y.toDark} className={icon}>{mode === 'dark' ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}</button>
          <button onClick={onStart} className="btn btn-glow ml-2 hidden h-12 gap-10 sm:inline-flex">{t.nav.cta}<ArrowUpRight className="size-5" strokeWidth={1.5} /></button>
          <button onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="site-menu" aria-label={open ? t.a11y.close : t.a11y.openMenu} className="ml-1 flex h-12 items-center gap-3 px-1 font-mono sm:ml-2 text-[12px] tracking-[0.14em] text-bone">
            <span className="relative block h-2.5 w-7" aria-hidden="true">
              <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-lens)] ${open ? 'top-1/2 rotate-[20deg]' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-lens)] ${open ? 'top-1/2 -rotate-[20deg]' : 'bottom-0'}`} />
            </span>
            <span className="hidden sm:inline">{open ? t.a11y.close.toUpperCase() : 'MENU'}</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            data-lenis-prevent
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 -z-10 overflow-y-auto bg-night pt-28 pb-10"
          >
            <div className="mx-auto grid max-w-[1360px] gap-12 px-5 sm:px-10 lg:grid-cols-[1.4fr_1fr]">
              <ol className="m-0 list-none p-0">
                {ids.map((id, i) => (
                  <motion.li key={id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }} className="border-b border-white/10">
                    <a href={`#${id}`} onClick={() => setOpen(false)} className="group flex items-baseline gap-5 py-4 sm:gap-8">
                      <span className="measure w-6">0{i + 1}</span>
                      <span className="flex flex-col">
                        <span className="display-3 text-bone transition-colors group-hover:text-glow">{t.nav[id]}</span>
                        <span className="text-[14px] text-bone/60">{t.navSub[id]}</span>
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ol>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col gap-6 lg:justify-end">
                <button onClick={() => { setOpen(false); onStart(); }} className="btn btn-glow w-full max-w-[380px]">{t.nav.cta}<ArrowUpRight className="size-5" strokeWidth={1.5} /></button>
                <div className="flex flex-col gap-1">
                  <span className="measure">{t.welcome.aside}</span>
                  <span className="inline-flex items-center gap-2 text-[16px] text-bone"><MapPin className="size-4 text-glow" />{t.footer.location}</span>
                  <a href={`mailto:${SITE.email}`} className="text-[16px] text-bone/80 hover:text-glow">{SITE.email}</a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
