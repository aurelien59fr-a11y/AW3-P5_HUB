# Sécurité — AW3 · Ploeg 5 Dashboard

État au 02/10/2026. Document destiné à la revue IT.

## Architecture

| Élément | Technologie | Remarque |
|---|---|---|
| Site | HTML/JS statique, hébergé par Vercel (HTTPS) | aucun serveur applicatif, aucun secret côté site |
| Données | Firebase Realtime Database (europe-west1, Belgique) | accès contrôlé par des règles côté serveur |
| Comptes | Firebase Authentication (e-mail + mot de passe) | créés par l'admin uniquement |
| Code | GitHub, déploiement automatique après revue (pull request) | vérifications automatiques à chaque PR |

La clé `apiKey` visible dans le code est un identifiant public de projet Firebase (ce n'est pas un secret) : la protection repose sur les règles de la base. Elle est en plus **limitée** aux API Firebase et aux sites `aw3-p5-hub.vercel.app` et `aw3-p5-hub.firebaseapp.com` (restriction HTTP referrer, Google Cloud).

## Contrôle d'accès (règles Firebase, côté serveur)

- Tout est refusé par défaut ; seul l'admin a un accès complet.
- Un compte authentifié **sans fiche** `/users/<uid>` (ex. créé via l'inscription publique) n'a accès à rien.
- Rôles : admin, sous-chef, visiteur (lecture), coordinateur (planning), employé (accès personnalisé par onglet).
- Absences et pointages : admin / sous-chef / visiteur (+ coordinateurs pour les absences).
- « Mon espace » : chaque employé lit **uniquement** ses propres données (`espace/<uid>`).
- Recrutement, logbook, comptes : admin seul.
- Un utilisateur ne peut pas modifier son rôle ni ses droits ; seule la date de son changement de mot de passe lui est accessible en écriture.
- Validation des formats (absences, planning, formations, rôles) : une donnée mal formée est refusée par le serveur.
- Règles testées dans le simulateur Firebase (64 cas : lecture et écriture par rôle) avant publication ; matrice de tests automatisée dans `dev/firebase/`.

## Comptes et mots de passe

- Mot de passe provisoire aléatoire à la création ; **changement obligatoire à la première connexion**.
- Règles : 8 caractères minimum, lettres et chiffres, sans le nom de la personne. Longueur et chiffre **imposés aussi par Firebase côté serveur** (politique de mot de passe en mode « exiger »).
- Changement possible à tout moment (« Mon mot de passe »), avec re-vérification du mot de passe actuel.
- Récupération autonome par e-mail personnel facultatif (lien de confirmation Firebase).
- Personne (ni l'admin, ni le code) ne voit ni ne stocke les mots de passe.
- **Déconnexion automatique après 60 min d'inactivité** (avertissement 2 min avant).

## Traçabilité

Journal `audit_log` en **ajout seul** (aucune entrée modifiable) : connexions, déconnexions automatiques, changements de mot de passe, comptes créés, droits modifiés, imports, suppressions. Consultable par l'admin (onglet Admin → Journal de sécurité).

## Protection du site

- Aucune donnée personnelle dans les fichiers publics (contrôlé par un test automatique).
- Politique de sécurité du contenu (CSP) stricte : scripts limités au site, à Firebase et à cdnjs, **aucun script inline autorisé** (pas de `'unsafe-inline'`) ; un script injecté dans la page ne s'exécute pas.
- Aucun code JavaScript dans le HTML : les actions des boutons passent par un répartiteur sans `eval` (`js/core/actions.js`) qui n'accepte qu'un appel de fonction avec des valeurs simples.
- Empreintes SRI sur les bibliothèques externes (Firebase, Chart.js, JSZip).
- En-têtes : HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy.
- Tout texte affiché est échappé (protection contre l'injection HTML), vérifié par des tests.
- Traduction des notes **sur le PC** (API du navigateur) : aucun texte envoyé à un service externe.

## Qualité et tests

104 tests unitaires, ESLint, test de fumée par rôle (7 profils, faux Firebase, CSP appliquée), exécutés à chaque pull request.

## Limites connues et pistes

| Point | État | Piste |
|---|---|---|
| Comptes Firebase / Vercel / GitHub personnels | à traiter | migrer vers des comptes de l'entreprise |
| Historique Git contenant d'anciennes données nominatives | dépôt privé | nouveau dépôt sans historique si le code doit être partagé |
| Données de santé (absences maladie) — RGPD | à valider avec le DPO | registre de traitement, durée de conservation |
| Pas d'authentification Microsoft (SSO) ni de double authentification | non fait | Firebase Auth avec Microsoft Entra ID |
| Sauvegardes manuelles (forfait gratuit) | procédure : `dev/SAUVEGARDE.md` | forfait Blaze + sauvegardes quotidiennes |
| Inscription publique active (nécessaire à la création de comptes depuis l'onglet Admin) | neutralisée par les règles | création des comptes côté serveur (Cloud Function) |
| App Check non activé | non fait | reCAPTCHA + App Check (la clé API est déjà limitée au domaine du site) |
