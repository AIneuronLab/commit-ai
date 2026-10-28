/** Single source of truth for contact details and headline numbers. Nothing else in the app hardcodes these. */
export const SITE = {
  brand: 'Commit·AI',
  url: 'https://commitai.dev',
  owner: 'Anthony Mboumba Ikapi',
  email: 'commit.ai@outlook.com',
  whatsapp: { display: '+221 78 959 20 97', number: '221789592097' },
  linkedin: { handle: 'anthony-mboumba-ikapi', url: 'https://linkedin.com/in/anthony-mboumba-ikapi' },
  github: { user: 'AIneuronLab', url: 'https://github.com/AIneuronLab' },
  /** Headline numbers; `value` animates up to `to`, then shows `suffix`. */
  stats: [
    { id: 'prod', to: 10, prefix: '', suffix: '+' },
    { id: 'frameworks', to: 4, prefix: '', suffix: '' },
    { id: 'countries', to: 3, prefix: '', suffix: '' },
    { id: 'efficiency', to: 20, prefix: '+', suffix: ' %' },
  ],
} as const;

/** Technologies named on the site (shown in the drifting band). */
export const STACK = ['FastAPI', 'NestJS', 'Spring Boot', 'Python', 'React', 'n8n', 'RAG', 'LLM', 'Swagger'] as const;

export const waLink = (text?: string) =>
  `https://wa.me/${SITE.whatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
