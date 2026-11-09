# Commit·AI — site web

React 19 + Vite + Tailwind CSS v4 + `motion`. Mobile d'abord (barre d'onglets en bas, feuille « Démarrer un projet »), site classique à partir de `md`/`lg`. Bleu `#2196f3`, sombre par défaut, clair en option, français et anglais.

```bash
npm install
npm run dev          # http://localhost:5173  (?theme=light, ?lang=en pour forcer)
npm run build        # chiffre GitHub, types + build dans dist/
npm test             # tests (node --test, sans dépendance)
node scripts/contrast.mjs   # vérifie le contraste (4,5:1) de tous les textes, sombre et clair
```

## Où modifier quoi

| Je veux changer… | Fichier |
|---|---|
| Email, WhatsApp, LinkedIn, GitHub, chiffres du haut de page (« 10+ projets en production ») | `src/data/site.ts` |
| Projets clients affichés (écrits à la main : rien n'est lu dans les dépôts privés) | `src/data/projects.ts` → `CLIENT_PROJECTS`, textes dans `src/i18n/` |
| Mentions légales et politique de confidentialité (FR / EN) | `src/legal/content.ts` (mettre à jour `UPDATED`) |
| Outils de la section Stack | `src/data/stack.ts` |
| Villes du globe (parcours) | `src/data/career.ts` |
| Citations de clients (la section n'apparaît que s'il y en a, avec leur accord) | `src/data/testimonials.ts` |
| Tous les textes FR / EN | `src/i18n/fr.ts` et `src/i18n/en.ts` (l'anglais doit avoir la même forme que le français : TypeScript le vérifie) |
| Couleurs | `src/index.css` (les jetons `--ca-*`), puis `node scripts/contrast.mjs` |

## Mouvement

- **Partout** : titres qui se révèlent mot par mot (`RevealText`), bande de technologies (`Marquee`), halo de points autour du portrait (`DotSphere`, canvas 2D), barre de progression du défilement.
- **Grands écrans avec une souris seulement** (`DESKTOP_MOTION` dans `src/lib/useMedia.ts`) : défilement fluide (Lenis, `useSmoothScroll`), section Réalisations épinglée qui défile à l'horizontale, curseur qui réagit, boutons magnétiques.
- **Téléphones et tablettes** : défilement natif, cartes à balayer.
- **« Réduire les animations »** activé dans le système : plus aucun mouvement (sphère figée, bande repliée, titres affichés d'un coup).
- Le texte du haut de page n'est jamais invisible au premier affichage (vitesse). Objectif : Lighthouse mobile ≥ 90 ; mesuré à 100.

## Données GitHub

Le nombre de contributions GitHub affiché dans « À propos » est récupéré **au moment du build** par `scripts/github-snapshot.mjs` (lancé automatiquement avant `npm run build`) et enregistré dans `src/data/github.json`. Les navigateurs des visiteurs ne contactent donc aucun service tiers. Si le service est injoignable, le build garde la dernière valeur.

## Vie privée et conformité

Pas de cookies, pas de mesure d'audience, pas de bannière nécessaire : le navigateur ne garde que le thème et la langue (`localStorage`), et les polices sont servies par le site (`public/fonts`, `src/fonts.css`), sans appel à Google. Les pages `/mentions-legales` (`/legal-notice`) et `/confidentialite` (`/privacy`) sont liées en bas de page.

À faire quand ce sera le cas :
- **Entreprise immatriculée** : ajouter forme juridique, RCCM et NINEA dans la section « Éditeur » de `src/legal/content.ts`.
- **Déclaration à la CDP** (Commission de Protection des Données Personnelles du Sénégal) : ajouter le numéro de déclaration dans la politique de confidentialité.
- **Nouvel outil qui collecte des données** (mesure d'audience, chat, etc.) : mettre à jour la politique, et ajouter un consentement s'il dépose des cookies.

## Hébergement : Cloudflare Workers, fichiers statiques (gratuit)

Le site est un Worker `commit-ai` qui ne sert que les fichiers de `dist/` (config dans `wrangler.jsonc`). Les requêtes vers les fichiers statiques sont gratuites et illimitées. Chaque `git push` sur `main` relance le build et le déploiement ; les autres branches reçoivent un aperçu.

| Réglage (Workers Builds) | Valeur |
|---|---|
| Branche de production | `main` |
| Commande de build | `npm run build` |
| Commande de déploiement | `npx wrangler deploy` |
| Variables **de build** | `NODE_VERSION` = `22`, `VITE_WEB3FORMS_KEY` = clé Web3Forms |

Attention : `VITE_WEB3FORMS_KEY` doit être une variable de **build** (section *Build*, *Variables and secrets*), pas une variable du Worker : Vite l'intègre pendant la construction du site. Après l'avoir changée, relancer un build.

`public/_headers` règle le cache et les en-têtes de sécurité.

Le domaine `commitai.dev` est acheté chez Spaceship mais son DNS est géré par Cloudflare (serveurs de noms `*.ns.cloudflare.com`). Les domaines `commitai.dev` et `www.commitai.dev` sont ajoutés au Worker dans *Settings*, *Domains & Routes*, *Custom domain* ; Cloudflare crée les enregistrements et le certificat HTTPS.

## Formulaire de contact : Web3Forms

Le formulaire envoie un `POST` JSON à `api.web3forms.com` avec la clé `VITE_WEB3FORMS_KEY` (publique par conception : elle ne fait que désigner ton email). Les messages arrivent dans ta boîte `commit.ai@outlook.com`. Le plan gratuit donne 250 messages par mois. Sans clé (développement local, ou clé pas encore ajoutée), le formulaire ouvre la messagerie du visiteur avec le message pré-rempli. Une case cachée `botcheck` sert de piège à robots.
