import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Mail, MessageCircle, PenLine } from 'lucide-react';
import { Sheet } from '../components/Sheet';
import { H2, Kicker } from '../components/ui';
import { Reveal } from '../motion';
import { SITE, waLink } from '../data/site';
import { useApp } from '../i18n';

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

/** Public by design (Web3Forms: it only maps to your email address). Set VITE_WEB3FORMS_KEY at build time. */
const FORM_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

const field = 'min-h-12 w-full rounded-lg border border-line-strong bg-card px-4 py-3 text-[16px] text-fg placeholder:text-muted outline-none transition focus:border-brand focus:ring-3 focus:ring-brand/15';

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
    <form id="message" onSubmit={onSubmit} className="flex flex-col gap-5 rounded-xl border border-line bg-card p-6 sm:p-8">
      <h3 className="m-0 text-[22px] font-semibold tracking-[-0.015em]">{f.title}</h3>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="flex flex-col gap-1.5 text-[14px] font-medium text-soft">{f.name}
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="flex flex-col gap-1.5 text-[14px] font-medium text-soft">{f.email}
        <input name="email" type="email" required autoComplete="email" inputMode="email" className={field} />
      </label>
      <label className="flex flex-col gap-1.5 text-[14px] font-medium text-soft">{f.message}
        <textarea name="message" required rows={4} className={`${field} resize-y`} />
      </label>
      <button disabled={status === 'sending'} className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg btn-primary px-8 font-semibold transition disabled:opacity-60">
        {status === 'sending' ? f.sending : f.send}
      </button>
      <p role="status" aria-live="polite" className={`m-0 min-h-6 text-[15px] ${status === 'error' ? 'text-warn' : 'text-ok'}`}>
        {status === 'sent' && <span className="inline-flex items-start gap-2"><Check className="mt-0.5 size-5 shrink-0" />{f.sent}</span>}
        {status === 'mailto' && f.mailto}
        {status === 'error' && f.error}
      </p>
    </form>
  );
}

export function Contact() {
  const { t } = useApp();
  const c = t.contact;
  const links = [
    { label: 'WhatsApp', value: SITE.whatsapp.display, href: waLink(c.waText) },
    { label: c.linkedin, value: SITE.linkedin.handle, href: SITE.linkedin.url },
    { label: c.github, value: SITE.github.user, href: SITE.github.url },
  ];
  return (
    <section id="contact" className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-16 px-4 py-20 sm:px-6 lg:py-28">
        <div className="flex flex-col items-center gap-6 text-center">
          <Kicker index="06">{c.kicker}</Kicker>
          <H2 className="lg:text-[52px]">{c.title}</H2>
          <p className="m-0 max-w-[520px] text-[17px] leading-relaxed text-muted">{c.lead}</p>
          <a href={`mailto:${SITE.email}`} className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-accent underline decoration-accent/30 decoration-2 underline-offset-8 transition hover:decoration-accent sm:text-[34px]">{SITE.email}</a>
          <p className="m-0 text-[14px] text-muted">{c.or}</p>
          <a href={waLink(c.waText)} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex min-h-12 items-center gap-2.5 rounded-lg px-7 font-semibold transition">
            <MessageCircle className="size-5" /> {c.whatsapp}
          </a>
        </div>
        <div className="grid gap-14 border-t border-line pt-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <ul className="m-0 flex list-none flex-col p-0">
            {links.map((l) => (
              <li key={l.label} className="border-b border-line">
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 py-5">
                  <span className="flex flex-col">
                    <span className="text-[13px] font-medium text-muted">{l.label}</span>
                    <span className="mt-1 text-[17px] text-fg">{l.value}</span>
                  </span>
                  <ArrowUpRight className="size-5 text-accent transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            ))}
          </ul>
          <Reveal><Form /></Reveal>
        </div>
      </div>
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
