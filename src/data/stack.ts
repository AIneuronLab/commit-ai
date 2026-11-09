/**
 * The tools shown in the stack cards (À propos). Only tools the site already names elsewhere are listed.
 * icon: a file in public/stack/ (Devicon, MIT licence, or Simple Icons, CC0); without one, the card shows the tool's initials.
 * level: 1 to 5 (Apprentissage, À l'aise, Confirmé, Avancé, Expert). Adjust them to your own assessment.
 */
export type StackGroup = 'ai' | 'backend' | 'web' | 'automation' | 'deploy' | 'tools';

export const STACK: { name: string; group: StackGroup; icon?: string; level: number; use: { fr: string; en: string } }[] = [
  { name: 'Python', group: 'ai', icon: 'python-original', level: 5, use: { fr: 'Modèles, pipelines de données et API.', en: 'Models, data pipelines and APIs.' } },
  { name: 'LLM & RAG', group: 'ai', level: 4, use: { fr: 'Chatbots qui répondent depuis vos documents, en citant la source.', en: 'Chatbots that answer from your documents and cite the source.' } },
  { name: 'LangChain', group: 'ai', icon: 'langchain', level: 4, use: { fr: 'Chaînes et agents LLM branchés sur vos données et vos outils.', en: 'LLM chains and agents wired to your data and tools.' } },
  { name: 'Mastra', group: 'ai', level: 3, use: { fr: 'Agents et workflows IA en TypeScript.', en: 'AI agents and workflows in TypeScript.' } },
  { name: 'CNN', group: 'ai', level: 4, use: { fr: 'Vision par ordinateur : reconnaître une maladie sur une photo de feuille.', en: 'Computer vision: spotting a disease in a photo of a leaf.' } },
  { name: 'Jupyter', group: 'ai', icon: 'jupyter-original', level: 4, use: { fr: 'Analyse, expériences et prototypes.', en: 'Analysis, experiments and prototypes.' } },
  { name: 'FastAPI', group: 'backend', icon: 'fastapi-original', level: 5, use: { fr: 'API rapides et typées pour les services IA.', en: 'Fast, typed APIs for AI services.' } },
  { name: 'Flask', group: 'backend', icon: 'flask-original', level: 4, use: { fr: 'API légères pour servir un modèle.', en: 'Lightweight APIs to serve a model.' } },
  { name: 'NestJS', group: 'backend', icon: 'nestjs-plain', level: 4, use: { fr: 'Back-offices et API structurés en TypeScript.', en: 'Structured TypeScript APIs and back offices.' } },
  { name: 'Spring Boot', group: 'backend', icon: 'spring-original', level: 3, use: { fr: 'Services Java robustes pour les systèmes existants.', en: 'Robust Java services for existing systems.' } },
  { name: 'TypeScript', group: 'web', icon: 'typescript-original', level: 4, use: { fr: 'Un code plus sûr, du serveur à l’interface.', en: 'Safer code, from server to interface.' } },
  { name: 'React', group: 'web', icon: 'react-original', level: 2, use: { fr: 'Sites et applications web rapides.', en: 'Fast websites and web apps.' } },
  { name: 'n8n', group: 'automation', icon: 'n8n', level: 5, use: { fr: 'Workflows planifiés qui relient vos outils.', en: 'Scheduled workflows that connect your tools.' } },
  { name: 'Docker', group: 'deploy', icon: 'docker-original', level: 4, use: { fr: 'Chaque service empaqueté de la même façon, du poste à la production.', en: 'Every service packaged the same way, from laptop to production.' } },
  { name: 'Cloudflare', group: 'deploy', icon: 'cloudflare', level: 4, use: { fr: 'Hébergement, domaines et HTTPS, déployés à chaque push.', en: 'Hosting, domains and HTTPS, deployed on every push.' } },
  { name: 'Linux', group: 'deploy', icon: 'linux-original', level: 2, use: { fr: 'Administration de serveurs : installation, accès SSH, mises à jour et sauvegardes.', en: 'Server administration: setup, SSH access, updates and backups.' } },
  { name: 'Git', group: 'tools', icon: 'git-original', level: 5, use: { fr: 'Versionnage et travail en équipe.', en: 'Version control and team workflows.' } },
];

/** Two letters for a card without a logo: one from each of the first two words, or the first two of a single word. */
export const stackInitials = (n: string) => {
  const w = n.replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
  return (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 2)).toUpperCase();
};
