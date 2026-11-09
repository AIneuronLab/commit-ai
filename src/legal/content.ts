/**
 * The legal notice and the privacy policy, in French and English. Written for Senegal's law 2008-12 and the EU's
 * GDPR. Update `UPDATED` whenever a text changes.
 *  - Once the company is registered, add its legal form, RCCM and NINEA to the publisher section.
 *  - Once the processing is declared to Senegal's CDP, add the declaration number to the privacy policy.
 */
import { SITE } from '../data/site';

export const UPDATED = { fr: '9 novembre 2026', en: '9 November 2026' };

/** A block of a section: a paragraph, or a bulleted list. `{privacy}` in a text becomes a link to the policy. */
export type Block = string | string[];
export type LegalText = { title: string; lead: string; sections: { h: string; body: Block[] }[] };

const contact = (lang: 'fr' | 'en') => [
  `${lang === 'fr' ? 'E-mail' : 'Email'} : ${SITE.email}`,
  `WhatsApp : ${SITE.whatsapp.display}`,
  lang === 'fr' ? 'Adresse : Dakar, Sénégal' : 'Address: Dakar, Senegal',
];

export const LEGAL: Record<'fr' | 'en', LegalText> = {
  fr: {
    title: 'Mentions légales',
    lead: 'Qui publie ce site, qui l’héberge et à qui appartient son contenu.',
    sections: [
      { h: 'Éditeur du site', body: [`${SITE.brand} est le nom commercial d’${SITE.owner}, entrepreneur individuel établi à Dakar (Sénégal).`, contact('fr')] },
      { h: 'Directeur de la publication', body: [SITE.owner] },
      { h: 'Hébergement', body: ['Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis — cloudflare.com'] },
      {
        h: 'Propriété intellectuelle',
        body: [
          `Les textes, le code, le logo et le nom ${SITE.brand} appartiennent à ${SITE.owner}. Toute reproduction sans accord écrit est interdite. Les captures de projets clients restent la propriété de leurs titulaires.`,
          'Éléments de tiers utilisés sur ce site :',
          [
            'Photo du Monument de la Renaissance africaine : Bamby Diagne, licence Unsplash.',
            'Images de la Terre (globe) : NASA Blue Marble et Black Marble, domaine public.',
            'Logos des outils : Devicon (licence MIT) et Simple Icons (CC0). Les marques citées appartiennent à leurs propriétaires.',
            'Polices Inter, Anton, JetBrains Mono et Space Grotesk : SIL Open Font License. Rendu 3D : three.js, licence MIT.',
          ],
        ],
      },
      { h: 'Données personnelles', body: ['Pour savoir quelles données ce site traite et comment exercer vos droits, consultez la {privacy}.'] },
      { h: 'Droit applicable', body: ['Ce site est soumis au droit sénégalais.'] },
    ],
  },
  en: {
    title: 'Legal notice',
    lead: 'Who publishes this site, who hosts it and who owns its content.',
    sections: [
      { h: 'Publisher', body: [`${SITE.brand} is the trade name of ${SITE.owner}, a sole trader based in Dakar (Senegal).`, contact('en')] },
      { h: 'Publication director', body: [SITE.owner] },
      { h: 'Hosting', body: ['Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, United States — cloudflare.com'] },
      {
        h: 'Intellectual property',
        body: [
          `The texts, code, logo and the name ${SITE.brand} belong to ${SITE.owner}. Reproduction without written permission is prohibited. Screenshots of client projects remain the property of their owners.`,
          'Third-party elements used on this site:',
          [
            'Photo of the African Renaissance Monument: Bamby Diagne, Unsplash License.',
            'Earth images (globe): NASA Blue Marble and Black Marble, public domain.',
            'Tool logos: Devicon (MIT licence) and Simple Icons (CC0). The brands named belong to their owners.',
            'Inter, Anton, JetBrains Mono and Space Grotesk fonts: SIL Open Font License. 3D rendering: three.js, MIT licence.',
          ],
        ],
      },
      { h: 'Personal data', body: ['To learn what data this site processes and how to exercise your rights, read the {privacy}.'] },
      { h: 'Governing law', body: ['This site is governed by Senegalese law.'] },
    ],
  },
};

export const PRIVACY: Record<'fr' | 'en', LegalText> = {
  fr: {
    title: 'Politique de confidentialité',
    lead: 'Ce site collecte très peu de données : pas de cookies, pas de mesure d’audience, pas de publicité. Voici le détail.',
    sections: [
      { h: 'Responsable du traitement', body: [`${SITE.owner} (${SITE.brand}), Dakar, Sénégal. Contact : ${SITE.email}.`] },
      {
        h: 'Données collectées et pourquoi',
        body: [
          [
            'Formulaire de contact : votre nom, votre e-mail et votre message, uniquement pour vous répondre. Base légale : votre demande (mesures précontractuelles) et notre intérêt légitime à y répondre.',
            'Journaux de l’hébergeur : votre adresse IP et la page demandée, enregistrées par Cloudflare pour la sécurité et le dépannage du site. Base légale : intérêt légitime.',
          ],
          'Si vous nous écrivez sur WhatsApp ou par e-mail, nous recevons les informations que vous choisissez de nous envoyer.',
        ],
      },
      {
        h: 'Cookies et stockage',
        body: [
          'Ce site n’utilise aucun cookie et aucun outil de mesure d’audience. Votre navigateur mémorise seulement deux préférences, le thème (clair ou sombre) et la langue, qui ne quittent jamais votre appareil. Aucun consentement n’est donc nécessaire.',
          'Les polices et les images sont servies par ce site lui-même : votre navigateur ne contacte aucun service tiers en affichant la page.',
        ],
      },
      {
        h: 'Destinataires et prestataires',
        body: [
          [
            'Web3Forms (web3forms.com) transmet les messages du formulaire à notre boîte e-mail.',
            'Microsoft (Outlook) héberge cette boîte e-mail.',
            'Cloudflare héberge le site et ses journaux.',
          ],
          'Ces prestataires peuvent traiter les données hors du Sénégal et de l’Union européenne, notamment aux États-Unis. Cloudflare et Microsoft encadrent ces transferts par le Data Privacy Framework UE–États-Unis et des clauses contractuelles types de la Commission européenne. Seules les données nécessaires sont transmises, et vos données ne sont jamais vendues ni utilisées à des fins publicitaires.',
          'Les liens vers WhatsApp, LinkedIn et GitHub vous mènent sur ces services, qui appliquent leur propre politique de confidentialité.',
        ],
      },
      {
        h: 'Durée de conservation',
        body: [[
          'Messages de personnes qui ne sont pas devenues clientes : 3 ans après le dernier échange.',
          'Échanges avec les clients : le temps exigé par la comptabilité et le contrat.',
          'Journaux de l’hébergeur : quelques jours.',
        ]],
      },
      {
        h: 'Vos droits',
        body: [
          'Vous pouvez demander l’accès à vos données, leur rectification ou leur suppression, vous opposer à leur traitement, en demander la limitation ou la portabilité. Écrivez à ' + SITE.email + ' : nous répondons sous un mois.',
          'Vous pouvez aussi saisir la Commission de Protection des Données Personnelles du Sénégal (CDP, cdp.sn) ou, si vous résidez dans l’Union européenne, l’autorité de protection des données de votre pays (en France, la CNIL).',
        ],
      },
      { h: 'Sécurité', body: ['Le site est servi uniquement en HTTPS. L’accès à la boîte e-mail est protégé et réservé à l’éditeur.'] },
      { h: 'Modifications', body: ['Cette politique peut évoluer. La date de dernière mise à jour figure en haut de la page.'] },
    ],
  },
  en: {
    title: 'Privacy policy',
    lead: 'This site collects very little data: no cookies, no analytics, no advertising. Here are the details.',
    sections: [
      { h: 'Data controller', body: [`${SITE.owner} (${SITE.brand}), Dakar, Senegal. Contact: ${SITE.email}.`] },
      {
        h: 'Data collected and why',
        body: [
          [
            'Contact form: your name, email and message, only to answer you. Legal basis: your request (pre-contractual steps) and our legitimate interest in answering it.',
            'Host logs: your IP address and the page requested, recorded by Cloudflare for the site’s security and troubleshooting. Legal basis: legitimate interest.',
          ],
          'If you write to us on WhatsApp or by email, we receive the information you choose to send.',
        ],
      },
      {
        h: 'Cookies and storage',
        body: [
          'This site uses no cookies and no analytics. Your browser only remembers two preferences, the theme (light or dark) and the language, which never leave your device. No consent is therefore needed.',
          'Fonts and images are served by this site itself: your browser contacts no third-party service when displaying the page.',
        ],
      },
      {
        h: 'Recipients and service providers',
        body: [
          [
            'Web3Forms (web3forms.com) forwards contact-form messages to our mailbox.',
            'Microsoft (Outlook) hosts that mailbox.',
            'Cloudflare hosts the site and its logs.',
          ],
          'These providers may process data outside Senegal and the European Union, notably in the United States. Cloudflare and Microsoft cover these transfers with the EU–US Data Privacy Framework and the European Commission’s standard contractual clauses. Only the data needed is shared, and your data is never sold or used for advertising.',
          'Links to WhatsApp, LinkedIn and GitHub take you to those services, which apply their own privacy policies.',
        ],
      },
      {
        h: 'How long we keep data',
        body: [[
          'Messages from people who did not become clients: 3 years after the last exchange.',
          'Exchanges with clients: as long as accounting and the contract require.',
          'Host logs: a few days.',
        ]],
      },
      {
        h: 'Your rights',
        body: [
          'You can ask to access, correct or delete your data, object to its processing, or ask for it to be restricted or ported. Write to ' + SITE.email + ': we answer within one month.',
          'You can also contact Senegal’s data protection authority (CDP, cdp.sn) or, if you live in the European Union, your own country’s data protection authority (in France, the CNIL).',
        ],
      },
      { h: 'Security', body: ['The site is served over HTTPS only. Access to the mailbox is protected and limited to the publisher.'] },
      { h: 'Changes', body: ['This policy may change. The date of the last update is shown at the top of the page.'] },
    ],
  },
};
