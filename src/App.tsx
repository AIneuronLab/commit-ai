import { useCallback, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { AppProvider, useApp } from './i18n';
import { TopBar } from './components/Nav';
import { useSmoothScroll } from './lib/useSmoothScroll';
import { Home } from './home/Home';
import { ContactSheet } from './sections/Contact';
import { Footer } from './sections/Footer';
import { WhatsAppFab } from './components/WhatsAppFab';
import { LegalPage } from './sections/LegalPage';
import { ServicePage } from './sections/ServicePage';
import { pageFor, serviceFor } from './lib/route';

// the page is chosen once from the address: links between pages are ordinary page loads
const PAGE = pageFor(location.pathname);
const SERVICE = serviceFor(location.pathname);

function Shell() {
  const { t } = useApp();
  useSmoothScroll();
  const [sheet, setSheet] = useState(false);
  const open = useCallback(() => setSheet(true), []);
  const close = useCallback(() => setSheet(false), []);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white">{t.a11y.skip}</a>
      {PAGE === 'home' ? (
        <Home onStart={open} />
      ) : (
        <>
          <TopBar onStart={open} base="/" />
          {PAGE === 'service' ? SERVICE && <ServicePage id={SERVICE} onStart={open} /> : <LegalPage page={PAGE} />}
          <Footer base="/" />
        </>
      )}
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
