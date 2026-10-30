import { WhatsAppIcon } from './BrandIcons';
import { waLink } from '../data/site';
import { useApp } from '../i18n';

/** Round WhatsApp button pinned to the corner of the screen; opens the chat in a new tab. */
export function WhatsAppFab() {
  const { t } = useApp();
  return (
    <a
      href={waLink(t.contact.waText)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.contact.whatsapp}
      title={t.contact.whatsapp}
      className="fixed right-4 bottom-[calc(6.25rem+env(safe-area-inset-bottom,0px))] z-40 flex size-14 items-center justify-center rounded-full bg-[#1fa855] text-white shadow-[0_10px_28px_-8px_rgba(0,0,0,.55)] transition hover:-translate-y-0.5 hover:bg-[#25b862] md:right-6 md:bottom-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
