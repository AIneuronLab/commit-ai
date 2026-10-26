# Commit·AI — site web

React 19 + Vite + Tailwind CSS v4 + `motion`. Mobile d'abord (barre d'onglets en bas, feuille « Démarrer un projet »), site classique à partir de `md`/`lg`. Bleu `#2196f3`, sombre par défaut, clair en option, français et anglais.

```bash
npm install
npm run dev          # http://localhost:5173  (?theme=light, ?lang=en pour forcer)
npm run build        # types + build dans dist/
node scripts/contrast.mjs   # vérifie le contraste (4,5:1) de tous les textes, sombre et clair
```

## Où modifier quoi

| Je veux changer… | Fichier |
|---|---|
| Email, WhatsApp, LinkedIn, GitHub, chiffres du haut de page (« 10+ projets en production ») | `src/data/site.ts` |
| Projets clients affichés (écrits à la main : rien n'est lu dans les dépôts privés) | `src/data/projects.ts` → `CLIENT_PROJECTS`, textes dans `src/i18n/` |
| Dépôts GitHub publics du « Labo » | `src/data/projects.ts` → `FEATURED_REPOS` |
| Tous les textes FR / EN | `src/i18n/fr.ts` et `src/i18n/en.ts` (l'anglais doit avoir la même forme que le français : TypeScript le vérifie) |
| Couleurs | `src/index.css` (les jetons `--ca-*`), puis `node scripts/contrast.mjs` |

## Données GitHub (sans coût Netlify)

`src/lib/github.ts` lit l'API GitHub publique **dans le navigateur du visiteur** quand la section « Labo » approche de l'écran, garde le résultat 1 h dans `localStorage`, et retombe sur les valeurs de `GITHUB_SNAPSHOT` si GitHub est injoignable. Le total de contributions (projets privés compris) et la carte d'activité viennent de `github-contributions-api.jogruber.de`, un service tiers : si vous préférez ne pas l'utiliser, retirez l'appel dans `fetchLive`.

## Déploiement Netlify (plan gratuit)

`netlify.toml` fixe la commande (`npm run build`) et le dossier publié (`dist`). Le formulaire de contact est déclaré dans `index.html` (`<form name="contact" data-netlify="true">`) : Netlify le détecte au premier déploiement, les messages arrivent dans *Forms*.

Le plan gratuit donne 300 crédits par mois (plafond dur) : un déploiement en production coûte 15 crédits, 1 Go de bande passante 20. Les aperçus de branche sont gratuits : travaillez sur une branche, fusionnez dans `main` seulement quand c'est prêt, et ne planifiez pas de rebuild automatique.
