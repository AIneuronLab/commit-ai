import { useCallback, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { AppProvider, useApp } from './i18n';
import { TopBar } from './components/Nav';
import { useSmoothScroll } from './lib/useSmoothScroll';
import { Hero } from './sections/Hero';
import { LogoScene } from './sections/LogoScene';
import { Welcome } from './sections/Proof';
import { How } from './sections/How';
import { Services } from './sections/Services';
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
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white">{t.a11y.skip}</a>
      <TopBar onStart={open} />
      <main id="main">
        <LogoScene />
        <Hero onStart={open} />
        <Welcome />
        <Services onStart={open} />
        <How />
        <Testimonials />
        <Journey />
        <Faq />
        <Contact onStart={open} />
      </main>
      <Footer />
      <WhatsAppFab />
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
