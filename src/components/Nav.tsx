import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { useApp } from '../i18n';

/** Sticky top bar: logo, section links, language and theme, primary action. A drop-down menu on phones. */
export function TopBar({ onStart }: { onStart: () => void }) {
  const { t, lang, mode, toggleLang, toggleMode } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const links: [string, string][] = [['#services', t.nav.services], ['#projects', t.nav.projects], ['#process', t.nav.process], ['#journey', t.nav.journey], ['#faq', t.nav.faq]];
  const iconBtn = 'flex size-9 items-center justify-center rounded-lg text-soft transition hover:bg-bg-alt hover:text-fg';

  return (
    <header className={`sticky top-0 z-40 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl transition-colors ${scrolled || open ? 'border-b border-line bg-nav' : 'border-b border-transparent bg-transparent'}`}>
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-8" aria-label={t.a11y.menu}>
        <a href="#top" aria-label="Commit·AI" onClick={() => setOpen(false)}><Logo size={30} variant={mode} /></a>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map(([h, l]) => <a key={h} href={h} className="rounded-lg px-3 py-2 text-[14.5px] text-soft transition hover:bg-bg-alt hover:text-fg">{l}</a>)}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={toggleLang} aria-label={t.a11y.switchLang} className={`${iconBtn} w-auto px-2.5 text-[13px] font-medium`}>{lang === 'fr' ? 'EN' : 'FR'}</button>
          <button onClick={toggleMode} aria-label={mode === 'dark' ? t.a11y.toLight : t.a11y.toDark} className={iconBtn}>{mode === 'dark' ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}</button>
          <a href="#contact" className="ml-1 hidden rounded-lg px-3 py-2 text-[14.5px] text-soft transition hover:bg-bg-alt hover:text-fg sm:inline-block">{t.nav.contact}</a>
          <button onClick={onStart} className="btn-primary ml-1 hidden h-9 items-center rounded-lg px-4 text-[14px] font-medium transition sm:inline-flex">{t.nav.cta}</button>
          <button onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? t.a11y.close : t.a11y.openMenu} className={`${iconBtn} lg:hidden`}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line lg:hidden"
          >
            <div className="mx-auto flex max-w-[1200px] flex-col px-5 py-3 sm:px-8">
              {[...links, ['#contact', t.nav.contact] as [string, string]].map(([h, l]) => (
                <a key={h} href={h} onClick={() => setOpen(false)} className="border-b border-line py-3.5 text-[16px] text-fg last:border-b-0">{l}</a>
              ))}
              <button onClick={() => { setOpen(false); onStart(); }} className="btn-primary mt-3 mb-2 inline-flex h-11 items-center justify-center rounded-lg text-[15px] font-medium sm:hidden">{t.nav.cta}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
