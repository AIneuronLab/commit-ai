import { useState, type FormEvent } from 'react';
import { ArrowUpRight, BriefcaseBusiness, Check, Code2, Mail, MessageCircle, PenLine } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Sheet } from '../components/Sheet';
import { H2, Kicker } from '../components/ui';
import { Reveal } from '../motion';
import { SITE, waLink } from '../data/site';
import { useApp } from '../i18n';

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

/** Public by design (Web3Forms: it only maps to your email address). Set VITE_WEB3FORMS_KEY at build time. */
const FORM_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

const field = 'min-h-12 w-full rounded-xl border border-line bg-card-alt px-4 py-3 text-[16px] text-fg placeholder:text-muted outline-none transition focus:border-brand-azure';

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
    <form id="message" onSubmit={onSubmit} className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-5 sm:p-6">
      <h3 className="m-0 font-display text-xl font-semibold">{f.title}</h3>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="flex flex-col gap-1.5 text-[14px] text-soft">{f.name}
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="flex flex-col gap-1.5 text-[14px] text-soft">{f.email}
        <input name="email" type="email" required autoComplete="email" inputMode="email" className={field} />
      </label>
      <label className="flex flex-col gap-1.5 text-[14px] text-soft">{f.message}
        <textarea name="message" required rows={4} className={`${field} resize-y`} />
      </label>
      <button disabled={status === 'sending'} className="mt-1 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#1976d2] to-brand-deep px-7 font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60">
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

export function useContactRows() {
  const { t } = useApp();
  return [
    { icon: Mail, label: t.contact.email, value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: BriefcaseBusiness, label: t.contact.linkedin, value: SITE.linkedin.handle, href: SITE.linkedin.url },
    { icon: Code2, label: t.contact.github, value: SITE.github.user, href: SITE.github.url },
  ];
}

export function Contact() {
  const { t, mode } = useApp();
  const rows = useContactRows();
  return (
    <>
      <section id="contact" className="border-t border-line">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col gap-5">
            <Kicker>{t.contact.kicker}</Kicker>
            <H2>{t.contact.title}</H2>
            <p className="m-0 max-w-[460px] text-[17px] text-muted">{t.contact.lead}</p>
            <a
              href={waLink(t.contact.waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 flex items-center gap-4 rounded-3xl bg-gradient-to-br from-[#1976d2] to-brand-deep p-5 text-white shadow-[0_20px_44px_-18px_rgba(33,150,243,.75)] transition hover:-translate-y-0.5"
            >
              <span className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-white/15"><MessageCircle className="size-6" /></span>
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <b className="text-lg">{t.contact.whatsapp}</b>
                <span className="text-[14px] text-white/90">{SITE.whatsapp.display} · {t.contact.whatsappHint}</span>
              </span>
              <ArrowUpRight className="size-6 shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <div className="flex flex-col gap-3">
              {rows.map(({ icon: I, label, value, href }) => (
                <a key={label} href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="flex min-h-16 items-center gap-3.5 rounded-2xl border border-line bg-card px-4 py-3 transition hover:border-line-strong">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"><I className="size-5" /></span>
                  <span className="flex min-w-0 flex-col"><span className="text-[13px] text-muted">{label}</span><span className="truncate text-[16px] text-fg">{value}</span></span>
                </a>
              ))}
            </div>
          </div>
          <Reveal><Form /></Reveal>
        </div>
      </section>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-3 px-4 py-7 text-[13px] text-muted sm:flex-row sm:items-center sm:px-6">
          <Logo size={26} variant={mode} />
          <span>{t.footer.copy}</span>
        </div>
      </footer>
    </>
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
        <a href={waLink(t.contact.waText)} target="_blank" rel="noopener noreferrer" onClick={onClose} className="flex min-h-16 items-center gap-3.5 rounded-2xl bg-gradient-to-br from-[#1976d2] to-brand-deep px-4 py-3 text-white">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/15"><MessageCircle className="size-5" /></span>
          <span className="flex flex-col leading-tight"><b>{t.contact.whatsapp}</b><span className="text-[14px] text-white/90">{t.contact.whatsappHint}</span></span>
        </a>
        <a href={`mailto:${SITE.email}`} onClick={onClose} className="flex min-h-16 items-center gap-3.5 rounded-2xl border border-line bg-card-alt px-4 py-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent"><Mail className="size-5" /></span>
          <span className="flex min-w-0 flex-col leading-tight"><b>{t.contact.email}</b><span className="truncate text-[14px] text-muted">{SITE.email}</span></span>
        </a>
        <a href="#message" onClick={onClose} className="flex min-h-16 items-center gap-3.5 rounded-2xl border border-line bg-card-alt px-4 py-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent"><PenLine className="size-5" /></span>
          <b>{s.form}</b>
        </a>
      </div>
    </Sheet>
  );
}
