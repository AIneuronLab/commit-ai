import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, Mail, MapPin, MessageCircle, PenLine } from 'lucide-react';
import { Sheet } from '../components/Sheet';
import { Container, TwoTone } from '../components/ui';
import { LinkedInIcon, WhatsAppIcon } from '../components/BrandIcons';
import { Reveal } from '../motion';
import { SITE, waLink } from '../data/site';
import { useApp } from '../i18n';

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

/** Public by design (Web3Forms: it only maps to your email address). Set VITE_WEB3FORMS_KEY at build time. */
const FORM_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

const field = 'h-11 w-full rounded-lg border border-line-strong bg-card px-3.5 text-[15px] text-fg placeholder:text-muted outline-none transition focus:border-brand focus:ring-3 focus:ring-brand/15';

function Form() {
  const { t } = useApp();
  const f = t.contact.form;
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '');
    const email = String(data.get('email') ?? '');
    const message = String(data.get('message') ?? '');
    if (data.get('botcheck')) { form.reset(); setStatus('sent'); return; } // a bot ticked the hidden box: pretend, send nothing

    if (!FORM_KEY) {
      // no key configured (local dev, or not set yet): let the visitor's own mail app send it
      const body = `${message}\n\n— ${name} (${email})`;
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`${SITE.brand} — ${name}`)}&body=${encodeURIComponent(body)}`;
      setStatus('mailto');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: FORM_KEY, subject: `Nouveau message depuis ${SITE.url.replace('https://', '')}`, from_name: SITE.brand, name, email, message, botcheck: false }),
      });
      const json = (await res.json()) as { success?: boolean };
      if (!res.ok || !json.success) throw new Error(String(res.status));
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form id="message" onSubmit={onSubmit} className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-6 sm:p-8">
      <h3 className="m-0 text-[18px] font-semibold tracking-[-0.01em] text-fg">{f.title}</h3>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-[13.5px] font-medium text-soft">{f.name}
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="flex flex-col gap-1.5 text-[13.5px] font-medium text-soft">{f.email}
          <input name="email" type="email" required autoComplete="email" inputMode="email" className={field} />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-[13.5px] font-medium text-soft">{f.message}
        <textarea name="message" required rows={5} placeholder={f.placeholder} className={`${field} h-auto resize-y py-3`} />
      </label>
      <button disabled={status === 'sending'} className="btn-primary mt-1 inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg px-5 text-[15px] font-medium transition disabled:opacity-60">
        {status === 'sending' ? f.sending : f.send}
      </button>
      <p role="status" aria-live="polite" className={`m-0 min-h-5 text-[14px] ${status === 'error' ? 'text-warn' : 'text-ok'}`}>
        {status === 'sent' && <span className="inline-flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0" />{f.sent}</span>}
        {status === 'mailto' && f.mailto}
        {status === 'error' && f.error}
      </p>
    </form>
  );
}

/** Closing call to action on a dark panel, then the contact details next to the form. */
export function Contact({ onStart }: { onStart: () => void }) {
  const { t } = useApp();
  const c = t.contact;
  const rows = [
    { Icon: Mail, label: c.email, value: SITE.email, href: `mailto:${SITE.email}` },
    { Icon: WhatsAppIcon, label: 'WhatsApp', value: SITE.whatsapp.display, href: waLink(c.waText) },
    { Icon: LinkedInIcon, label: c.linkedin, value: SITE.linkedin.handle, href: SITE.linkedin.url },
    { Icon: MapPin, label: c.location, value: t.footer.location, href: '' },
  ];
  return (
    <section id="contact" className="scroll-mt-16 border-t border-line">
      <Container className="py-20 lg:py-28">
        <div className="force-dark flex flex-col gap-8 rounded-2xl bg-[#0b1322] px-7 py-12 text-fg sm:px-12 lg:flex-row lg:items-end lg:justify-between lg:py-16">
          <TwoTone a={t.cta.title} b={t.cta.titleB} className="max-w-[640px] text-[28px] leading-[1.15] sm:text-[36px]" />
          <div className="flex shrink-0 flex-wrap gap-3">
            <button onClick={onStart} className="group btn-primary inline-flex h-11 items-center gap-2 rounded-lg px-5 text-[15px] font-medium transition">
              {t.nav.cta} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </button>
            <a href={waLink(c.waText)} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-lg border border-line-strong px-5 text-[15px] font-medium text-fg transition hover:bg-white/5">
              <MessageCircle className="size-4" /> {c.whatsapp}
            </a>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <TwoTone a={c.title} b={c.lead} className="text-[26px] leading-[1.2] sm:text-[30px]" />
            <ul className="m-0 flex list-none flex-col p-0">
              {rows.map(({ Icon, label, value, href }) => {
                const inner = (
                  <>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line text-soft"><Icon className="size-4" /></span>
                    <span className="flex min-w-0 flex-col"><span className="text-[13px] text-muted">{label}</span><span className="truncate text-[15px] font-medium text-fg">{value}</span></span>
                  </>
                );
                return (
                  <li key={label} className="border-b border-line last:border-b-0">
                    {href ? (
                      <a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="flex items-center gap-4 py-4 transition hover:opacity-80">{inner}</a>
                    ) : (
                      <div className="flex items-center gap-4 py-4">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <Reveal><Form /></Reveal>
        </div>
      </Container>
    </section>
  );
}

/** "Start a project" sheet: the three quickest ways to reach out. */
export function ContactSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useApp();
  const s = t.contact.sheet;
  return (
    <Sheet open={open} onClose={onClose} title={s.title}>
      <p className="m-0 mb-4 text-[16px] text-muted">{s.lead}</p>
      <div className="flex flex-col gap-3">
        <a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" onClick={onClose} className="flex min-h-16 items-center gap-3.5 btn-primary rounded-lg px-4 py-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/15"><MessageCircle className="size-5" /></span>
          <span className="flex flex-col leading-tight"><b>{t.contact.whatsapp}</b><span className="text-[14px] text-white/85">{t.contact.whatsappHint}</span></span>
        </a>
        <a href={`mailto:${SITE.email}`} onClick={onClose} className="flex min-h-16 items-center gap-3.5 rounded-lg border border-line bg-card-alt px-4 py-3">
          <span className="flex size-11 items-center justify-center rounded-md bg-accent-soft text-accent"><Mail className="size-5" /></span>
          <span className="flex min-w-0 flex-col leading-tight"><b>{t.contact.email}</b><span className="truncate text-[14px] text-muted">{SITE.email}</span></span>
        </a>
        <a href="#message" onClick={onClose} className="flex min-h-16 items-center gap-3.5 rounded-lg border border-line bg-card-alt px-4 py-3">
          <span className="flex size-11 items-center justify-center rounded-md bg-accent-soft text-accent"><PenLine className="size-5" /></span>
          <b>{s.form}</b>
        </a>
      </div>
    </Sheet>
  );
}
