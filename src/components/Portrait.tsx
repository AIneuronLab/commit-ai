import { SITE } from '../data/site';
import { useApp } from '../i18n';

/** The founder, as a compact card at the top of the career timeline ("Qui nous sommes"). */
export function Portrait() {
  const { t } = useApp();
  return (
    <figure className="m-0 mb-10 flex items-center gap-5 rounded-xl border border-line bg-card p-4 sm:p-5">
      <img
        src="/portrait.jpg"
        alt={t.journey.portraitAlt}
        width={540}
        height={660}
        loading="lazy"
        className="size-24 shrink-0 rounded-lg object-cover object-[50%_10%] sm:size-28"
      />
      <figcaption className="flex min-w-0 flex-col gap-1">
        <b className="font-display text-[19px] font-semibold tracking-tight">{SITE.owner}</b>
        <span className="text-[15px] text-soft">{t.journey.role} · Commit<span className="text-accent">·AI</span></span>
        <span className="text-[14px] text-muted">{t.footer.location}</span>
      </figcaption>
    </figure>
  );
}
