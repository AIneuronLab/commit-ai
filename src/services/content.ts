/**
 * The texts of the four service pages, in French and English. The card title, short description and tags shown
 * on the home page stay in src/i18n (services.items); this file holds what the dedicated page adds: a longer
 * introduction, what we build, real examples and the tools used. Only real projects and claims made elsewhere on
 * the site are used here.
 */
import type { ServiceId } from '../lib/route';

export type ServiceText = {
  intro: string;
  builds: { t: string; d: string }[];
  examples: { title: string; client: string; result: string; desc: string; url?: string }[];
};

/** Tools shown on each page, by their name in src/data/stack.ts. */
export const SERVICE_TOOLS: Record<ServiceId, string[]> = {
  automation: ['n8n', 'Python', 'LLM & RAG', 'LangChain', 'Mastra'],
  web: ['React', 'TypeScript', 'Cloudflare', 'Docker'],
  mobile: ['CNN', 'Python', 'FastAPI', 'Docker'],
  api: ['FastAPI', 'Flask', 'NestJS', 'Spring Boot', 'Docker', 'Linux'],
};

/** Order of the services, used for the "next service" link. */
export const SERVICE_ORDER: ServiceId[] = ['web', 'automation', 'mobile', 'api'];

export const SERVICES_TEXT: Record<'fr' | 'en', Record<ServiceId, ServiceText>> = {
  fr: {
    automation: {
      intro: 'Nous supprimons les tâches répétitives : collecter des données, les trier, les résumer, les envoyer à la bonne personne. Et nous construisons des assistants IA qui répondent à partir de vos propres documents, en citant la source pour que chaque réponse puisse être vérifiée.',
      builds: [
        { t: 'Collecte et tri de données', d: 'Portails publics, sites, fichiers et boîtes mail lus automatiquement, dédoublonnés et classés.' },
        { t: 'Workflows planifiés', d: 'Des tâches qui tournent seules chaque matin ou à chaque événement, et vous préviennent par e-mail.' },
        { t: 'Résumés et tri par l’IA', d: 'Les documents longs résumés, les demandes classées par priorité, les informations clés extraites.' },
        { t: 'Chatbots sur vos documents', d: 'Vos équipes posent leurs questions en langage naturel ; l’assistant répond en citant la page source.' },
      ],
      examples: [
        { title: 'Veille des appels d’offres', client: 'Réalisé chez Ashia Group · 2026', result: '50 à 60 offres triées chaque jour', desc: 'Les offres publiques sont collectées chaque matin, triées et résumées par l’IA, puis envoyées dans la boîte mail de l’équipe commerciale. Environ 200 offres traitées en 3 jours.' },
        { title: 'Chatbot RH sur documents', client: 'Réalisé chez Ashia Group · 2026', result: 'Un guide de 88 pages, interrogeable', desc: 'Les équipes posent leurs questions en langage naturel. Le chatbot cherche dans le guide RH et répond en citant la page source.' },
      ],
    },
    web: {
      intro: 'Des sites rapides, bien référencés et simples à utiliser, et des applications web qui font gagner du temps : réservation et paiement en ligne, espaces clients, back-offices pour gérer votre activité.',
      builds: [
        { t: 'Sites vitrines', d: 'Rapides sur téléphone, bien référencés sur Google, en français et en anglais si besoin.' },
        { t: 'Réservation et paiement', d: 'Vos clients choisissent une date, réservent et paient en ligne, y compris par Wave.' },
        { t: 'Espaces clients', d: 'Un accès réservé où vos clients suivent leurs commandes, documents ou rendez-vous.' },
        { t: 'Back-offices', d: 'Une interface pour gérer contenus, réservations et données sans toucher au code.' },
      ],
      examples: [
        { title: 'ActivityConnect', client: 'Client · ActivityConnect · 2026', result: 'Réservation en ligne, en production', desc: 'Un organisateur de sorties à Dakar voulait que ses clients réservent en ligne. Le client choisit une date, réserve sa place et paie par Wave. La dirigeante est satisfaite du résultat.', url: 'https://activityconnect.commitai.dev' },
      ],
    },
    mobile: {
      intro: 'Des applications iOS et Android pensées pour le terrain : elles restent utiles avec une connexion limitée, peuvent embarquer de l’IA, et sont publiées sur les stores.',
      builds: [
        { t: 'Applications iOS et Android', d: 'Des applications pour iPhone et Android, publiées sur l’App Store et Google Play.' },
        { t: 'Usage hors connexion', d: 'Les fonctions essentielles continuent de marcher sans réseau, puis se synchronisent.' },
        { t: 'IA dans l’application', d: 'Vision par ordinateur, par exemple pour reconnaître une maladie sur la photo d’une feuille.' },
        { t: 'Lien avec vos outils', d: 'L’application parle à votre back-office et à vos API existantes.' },
      ],
      examples: [
        { title: 'BayKat', client: 'Réalisé chez SOTILMA · 2026', result: 'Diagnostic des cultures par photo', desc: 'L’agriculteur photographie une feuille : la vision IA détecte la maladie et l’application conseille traitement et irrigation. Web et mobile, présenté avec l’accord de SOTILMA.' },
      ],
    },
    api: {
      intro: 'Des API REST sécurisées et documentées qui relient vos outils entre eux, servent vos applications et vos modèles d’IA, et tiennent la charge en production.',
      builds: [
        { t: 'API REST documentées', d: 'Chaque route décrite (Swagger), pour que vos équipes et vos partenaires s’y branchent facilement.' },
        { t: 'Intégrations', d: 'Vos outils reliés entre eux : paiement, e-mail, tableurs, logiciels métier.' },
        { t: 'Service de modèles d’IA', d: 'Vos modèles exposés derrière une API simple, prête pour vos applications.' },
        { t: 'Mise en production', d: 'Déploiement en conteneurs, accès sécurisés, et une solution qui tient la charge.' },
      ],
      examples: [],
    },
  },
  en: {
    automation: {
      intro: 'We remove repetitive tasks: collecting data, sorting it, summarising it, sending it to the right person. And we build AI assistants that answer from your own documents, citing the source so every answer can be checked.',
      builds: [
        { t: 'Data collection and sorting', d: 'Public portals, websites, files and mailboxes read automatically, de-duplicated and classified.' },
        { t: 'Scheduled workflows', d: 'Tasks that run on their own every morning or on every event, and notify you by email.' },
        { t: 'AI summaries and triage', d: 'Long documents summarised, requests ranked by priority, key information extracted.' },
        { t: 'Chatbots on your documents', d: 'Your teams ask questions in plain language; the assistant answers and cites the source page.' },
      ],
      examples: [
        { title: 'Tender monitoring', client: 'Built at Ashia Group · 2026', result: '50 to 60 tenders sorted every day', desc: 'Public tenders are collected every morning, sorted and summarised by AI, then sent to the sales team’s inbox. About 200 tenders processed in 3 days.' },
        { title: 'HR chatbot on documents', client: 'Built at Ashia Group · 2026', result: 'An 88-page guide, searchable', desc: 'Teams ask questions in plain language. The chatbot searches the HR guide and answers with the source page.' },
      ],
    },
    web: {
      intro: 'Fast, well-ranked, easy-to-use websites, and web apps that save time: online booking and payment, customer areas, back offices to run your business.',
      builds: [
        { t: 'Showcase websites', d: 'Fast on phones, well ranked on Google, in French and English if needed.' },
        { t: 'Booking and payment', d: 'Your customers pick a date, book and pay online, including with Wave.' },
        { t: 'Customer areas', d: 'A private space where your customers follow their orders, documents or appointments.' },
        { t: 'Back offices', d: 'An interface to manage content, bookings and data without touching the code.' },
      ],
      examples: [
        { title: 'ActivityConnect', client: 'Client · ActivityConnect · 2026', result: 'Online booking, in production', desc: 'An outings organiser in Dakar wanted customers to book online. Customers pick a date, reserve a seat and pay with Wave. The CEO is happy with the result.', url: 'https://activityconnect.commitai.dev' },
      ],
    },
    mobile: {
      intro: 'iOS and Android apps built for the field: they stay useful on a weak connection, can carry AI on board, and are published on the stores.',
      builds: [
        { t: 'iOS and Android apps', d: 'Apps for iPhone and Android, published on the App Store and Google Play.' },
        { t: 'Works offline', d: 'The essential features keep working without a network, then sync.' },
        { t: 'AI in the app', d: 'Computer vision, for example to spot a disease in a photo of a leaf.' },
        { t: 'Connected to your tools', d: 'The app talks to your back office and your existing APIs.' },
      ],
      examples: [
        { title: 'BayKat', client: 'Built at SOTILMA · 2026', result: 'Crop diagnosis from a photo', desc: 'The farmer photographs a leaf: vision AI detects the disease and the app advises treatment and irrigation. Web and mobile, shown with SOTILMA’s permission.' },
      ],
    },
    api: {
      intro: 'Secure, documented REST APIs that connect your tools, serve your apps and your AI models, and hold up in production.',
      builds: [
        { t: 'Documented REST APIs', d: 'Every route described (Swagger), so your teams and partners can plug in easily.' },
        { t: 'Integrations', d: 'Your tools connected: payment, email, spreadsheets, business software.' },
        { t: 'Serving AI models', d: 'Your models behind a simple API, ready for your apps.' },
        { t: 'Going to production', d: 'Container deployment, secured access, and a solution that holds the load.' },
      ],
      examples: [],
    },
  },
};
