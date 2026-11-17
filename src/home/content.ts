/**
 * The home page's own copy (French and English) and its list of projects, taken from the service pages' examples.
 */
import { SERVICES_TEXT } from '../services/content';
import { type ServiceId } from '../lib/route';
import { useApp } from '../i18n';

/** New copy variant C needs, kept here until it replaces today's page. */
export const COPY = {
  fr: {
    work: { kicker: 'Réalisations', title: 'Ce que nous avons déjà construit.', lead: 'Des projets réels, pour des entreprises et des organisations au Sénégal.' },
    consent: 'J’accepte que mes coordonnées (nom et e-mail) soient utilisées pour me recontacter au sujet de ma demande. Voir la',
  },
  en: {
    work: { kicker: 'Work', title: 'What we have already built.', lead: 'Real projects, for companies and organisations in Senegal.' },
    consent: 'I agree that my contact details (name and email) will be used to get back to me about my request. See the',
  },
} as const;

export type Case = { key: string; service: ServiceId; serviceTitle: string; title: string; client: string; result: string; desc: string; url?: string };

/** The real projects described on the service pages, keyed `<service>-<index>` (e.g. `web-0` is ActivityConnect). */
export function useCases(): Case[] {
  const { t, lang } = useApp();
  const text = SERVICES_TEXT[lang];
  const title = (id: ServiceId) => t.services.items.find((x) => x.id === id)!.title;
  return (['web', 'automation', 'mobile'] as ServiceId[]).flatMap((id) =>
    text[id].examples.map((x, i) => ({ key: `${id}-${i}`, service: id, serviceTitle: title(id), ...x })),
  );
}
