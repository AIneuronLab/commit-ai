import { useCallback, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { AppProvider, useApp } from './i18n';
import { TabBar, TopBar } from './components/Nav';
import { useSmoothScroll } from './lib/useSmoothScroll';
import { Hero } from './sections/Hero';
import { Intro } from './sections/Intro';
import { How } from './sections/How';
import { Services } from './sections/Services';
import { Projects } from './sections/Projects';
import { Journey } from './sections/Journey';
import { Testimonials } from './sections/Testimonials';
import { Contact, ContactSheet } from './sections/Contact';
import { Faq } from './sections/Faq';
import { Footer } from './sections/Footer';
import { WhatsAppFab } from './components/WhatsAppFab';

function Shell() {
  const { t } = useApp();
  useSmoothScroll();
  const [sheet, setSheet] = useState(false);
  const open = useCallback(() => setSheet(true), []);
  const close = useCallback(() => setSheet(false), []);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand focus:text-[#0c0b09] focus:px-4 focus:py-2 focus:text-white">{t.a11y.skip}</a>
      <TopBar onStart={open} />
      <main id="main">
        <Hero onStart={open} />
        <Intro />
        <Services />
        <How />
        <Projects />
        <Testimonials />
        <Journey />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
      <TabBar />
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
