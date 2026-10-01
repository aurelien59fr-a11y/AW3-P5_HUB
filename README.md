# AW3-P5_HUB

Tableau de bord de l'équipe AW3 · Ploeg 5 (score Bradford, planning, absences, pointages, arrêts Inpak, NCP, logbook, formations, recrutement).

## Architecture

- Site **statique** (HTML + scripts JS globaux, pas de build) à la racine du dépôt, publié par **Vercel** à chaque fusion sur `main`.
- Données dans **Firebase Realtime Database** (SDK compat 9.23) ; connexion par **Firebase Authentication** (e-mail + mot de passe).
- Application installable (PWA) : `sw.js` met en cache les fichiers listés dans `APP_SHELL`.

| Dossier | Contenu |
|---|---|
| `js/core/` | outils communs : dates et rotation des équipes (`format.js`), échappement HTML et accessibilité (`ui.js`), Firebase, connexion |
| `js/metier/` | calculs : Bradford, arrêts, NCP, bulk, logbook, « Mon espace » |
| `js/vues/` | construction des onglets |
| `js/imports/` | imports (Grafana, Protime, NCP, SharePoint) |
| `dev/` | outillage : tests, lint, test de fumée, règles Firebase proposées — **jamais publié** (`.vercelignore`) |

## Règles à respecter avant toute mise en production

1. **Versions de cache** : tout fichier JS ou CSS modifié doit changer de `?v=` dans `index.html` **et** dans `APP_SHELL` de `sw.js`, et `CACHE_VERSION` doit changer. Le test `dev/tests/versions.test.js` vérifie que les deux listes concordent.
2. **Aucune donnée réelle** (noms, absences, clés) dans les tests, les commits ou les captures.
3. Les règles Firebase ne se publient qu'après test dans le simulateur (voir `dev/firebase/README.md`).
4. Travail sur une branche, revue, puis fusion sur `main` (qui déclenche le déploiement Vercel).

## Vérifier une modification (sur un PC avec Node 20)

```bash
cd dev
npm ci
npm test          # tests unitaires (vitest + jsdom, Firebase simulé)
npm run lint      # ESLint sur js/ et sw.js
npm run fumee     # charge le site dans Chromium pour 6 rôles, faux Firebase, réseau externe bloqué
```

Le test de fumée échoue (code 1) en cas d'erreur JavaScript, d'injection HTML, de bouton de migration présent, d'élément sans nom accessible ou d'écriture en base par un rôle en lecture seule. Il applique aussi la politique de sécurité du contenu (CSP) de `vercel.json`. Les mêmes vérifications tournent sur GitHub (`.github/workflows/verifications.yml`) pour chaque pull request.

## En-têtes de sécurité (`vercel.json`)

`nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS, et une CSP en mode **Report-Only** : elle ne bloque rien, le navigateur signale seulement dans la console ce qu'elle bloquerait. Après quelques jours sans signalement, la passer en `Content-Security-Policy` (bloquante).

## Sauvegarde des données

Voir `dev/SAUVEGARDE.md`.
