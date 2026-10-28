import { useCallback, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { AppProvider, useApp } from './i18n';
import { TabBar, TopBar } from './components/Nav';
import { Cursor } from './components/Cursor';
import { Marquee } from './components/Marquee';
import { useSmoothScroll } from './lib/useSmoothScroll';
import { Hero } from './sections/Hero';
import { How } from './sections/How';
import { Services } from './sections/Services';
import { Projects } from './sections/Projects';
import { Lab } from './sections/Lab';
import { Journey } from './sections/Journey';
import { Testimonials } from './sections/Testimonials';
import { Contact, ContactSheet } from './sections/Contact';

function Shell() {
  const { t } = useApp();
  useSmoothScroll();
  const [sheet, setSheet] = useState(false);
  const open = useCallback(() => setSheet(true), []);
  const close = useCallback(() => setSheet(false), []);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand-deep focus:px-4 focus:py-2 focus:text-white">{t.a11y.skip}</a>
      <TopBar onStart={open} />
      <main id="main">
        <Hero onStart={open} />
        <Marquee label={t.hero.stackLabel} title={t.hero.stackTitle} />
        <How />
        <Services />
        <Projects />
        <Testimonials />
        <Lab />
        <Journey />
        <Contact />
      </main>
      <TabBar />
      <Cursor />
      <ContactSheet open={sheet} onClose={close} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MotionConfig reducedMotion="user">
        <Shell />
      </MotionConfig>
    </AppProvider>
  );
}
