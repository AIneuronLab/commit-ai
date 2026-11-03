import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Mail, MapPin, MessageCircle, PenLine } from 'lucide-react';
import { Sheet } from '../components/Sheet';
import { Btn, Container, Kinetic, Measure } from '../components/ui';
import { LinkedInIcon, WhatsAppIcon } from '../components/BrandIcons';
import { Reveal } from '../motion';
import { SITE, waLink } from '../data/site';
import { useApp } from '../i18n';

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

/** Public by design (Web3Forms: it only maps to your email address). Set VITE_WEB3FORMS_KEY at build time. */
const FORM_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

const field = 'h-12 w-full border-0 border-b border-line-strong bg-transparent px-0 text-[17px] text-fg placeholder:text-muted outline-none transition focus:border-fg';
const label = 'measure flex flex-col gap-1';

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
    <form id="message" onSubmit={onSubmit} className="flex flex-col gap-7 border border-line bg-card p-7 sm:p-10">
      <h3 className="display-4 m-0 text-fg">{f.title}</h3>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>{f.name}
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className={label}>{f.email}
          <input name="email" type="email" required autoComplete="email" inputMode="email" className={field} />
        </label>
      </div>
      <label className={label}>{f.message}
        <textarea name="message" required rows={5} placeholder={f.placeholder} className={`${field} h-auto resize-y py-3`} />
      </label>
      <button disabled={status === 'sending'} className="btn btn-glow self-start disabled:opacity-60">
        {status === 'sending' ? f.sending : f.send}<ArrowUpRight className="size-5" strokeWidth={1.5} aria-hidden="true" />
      </button>
      <p role="status" aria-live="polite" className={`m-0 min-h-5 text-[14px] ${status === 'error' ? 'text-warn' : 'text-ok'}`}>
        {status === 'sent' && <span className="inline-flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0" />{f.sent}</span>}
        {status === 'mailto' && f.mailto}
        {status === 'error' && f.error}
      </p>
    </form>
  );
}

/** 07 / Contact: a full-width night photo with a giant stacked call to action, then the details and the form. */
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
    <section id="contact" className="scroll-mt-20">
      <div className="force-dark grain relative overflow-hidden bg-night text-bone">
        <img src="/dakar-hero-1920.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover object-[50%_45%] opacity-45" />
        <div aria-hidden="true" className="absolute inset-0 bg-[#16335e] mix-blend-color opacity-60" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-night via-night/70 to-transparent" />
        <div aria-hidden="true" className="fog fog-2" />
        <Container className="relative flex flex-col gap-10 py-28 lg:py-40">
          <div className="flex items-baseline justify-between gap-6 border-t border-bone/15 pt-4">
            <Measure className="text-bone/70">07 / {c.kicker}</Measure>
            <Measure className="hidden text-right text-bone/70 sm:inline">{t.navSub.contact}</Measure>
          </div>
          <Kinetic text={t.cta.title} className="display-2 max-w-[760px] text-bone" />
          <p className="m-0 max-w-[520px] text-[19px] leading-[1.6] text-bone/80">{t.cta.titleB}</p>
          <div className="flex flex-wrap gap-3">
            <Btn onClick={onStart} className="min-w-[280px]">{t.nav.cta}</Btn>
            <Btn tone="line" href={waLink(c.waText)} external className="min-w-[220px] border-bone/30 text-bone hover:border-bone">WhatsApp</Btn>
          </div>
        </Container>
      </div>

      <Container className="grid gap-14 py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:py-32">
        <div className="flex flex-col gap-6">
          <Kinetic text={c.title} className="display-3 text-fg" />
          <p className="m-0 max-w-[420px] text-[17px] leading-relaxed text-muted">{c.lead}</p>
          <ul className="m-0 mt-2 flex list-none flex-col p-0">
            {rows.map(({ Icon, label: l, value, href }) => {
              const inner = (
                <>
                  <Icon className="size-4 shrink-0 text-accent" />
                  <span className="measure w-24 shrink-0">{l}</span>
                  <span className="min-w-0 truncate text-[16px] text-fg">{value}</span>
                </>
              );
              return (
                <li key={l} className="border-t border-line last:border-b">
                  {href ? (
                    <a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="flex items-center gap-4 py-4 transition hover:translate-x-1">{inner}</a>
                  ) : (
                    <div className="flex items-center gap-4 py-4">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <Reveal><Form /></Reveal>
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
        <a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" onClick={onClose} className="btn-glow flex min-h-16 items-center gap-3.5 px-4 py-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-night text-glow"><MessageCircle className="size-5" /></span>
          <span className="flex flex-col leading-tight"><b>{t.contact.whatsapp}</b><span className="text-[14px] opacity-80">{t.contact.whatsappHint}</span></span>
        </a>
        <a href={`mailto:${SITE.email}`} onClick={onClose} className="flex min-h-16 items-center gap-3.5 rounded-[var(--radius-media)] border border-line bg-card-alt px-4 py-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent"><Mail className="size-5" /></span>
          <span className="flex min-w-0 flex-col leading-tight"><b>{t.contact.email}</b><span className="truncate text-[14px] text-muted">{SITE.email}</span></span>
        </a>
        <a href="#message" onClick={onClose} className="flex min-h-16 items-center gap-3.5 rounded-[var(--radius-media)] border border-line bg-card-alt px-4 py-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent"><PenLine className="size-5" /></span>
          <b>{s.form}</b>
        </a>
      </div>
    </Sheet>
  );
}
