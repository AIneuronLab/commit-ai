import { ArrowRight, MessageCircle } from 'lucide-react';
import { Magnetic } from '../components/Magnetic';
import { Reveal } from '../motion';
import { waLink } from '../data/site';
import { useApp } from '../i18n';

/** A solid blue band before the contact section: one sentence, two ways to start. */
export function CtaBand({ onStart }: { onStart: () => void }) {
  const { t } = useApp();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1565c0] via-[#1258b0] to-[#0d47a1] text-white">
      <img src="/hero-fiber-900.webp" alt="" aria-hidden="true" width={900} height={600} loading="lazy" className="pointer-events-none absolute inset-0 size-full object-cover opacity-20 mix-blend-luminosity" />
      <Reveal className="relative mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div className="flex max-w-[680px] flex-col gap-3">
          <h2 className="m-0 font-display text-[34px] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-[48px]">{t.cta.title}</h2>
          <p className="m-0 text-[17px] leading-relaxed text-white/90 sm:text-[19px]">{t.cta.text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Magnetic>
            <button onClick={onStart} className="group inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-md bg-white px-6 font-semibold whitespace-nowrap text-[#0d47a1] transition hover:bg-[#e3f2fd]">
              {t.cta.primary} <ArrowRight className="size-5 transition group-hover:translate-x-1" />
            </button>
          </Magnetic>
          <Magnetic>
            <a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-md border border-white/60 px-6 font-medium whitespace-nowrap text-white transition hover:bg-white/10">
              <MessageCircle className="size-5" /> {t.contact.whatsapp}
            </a>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}
