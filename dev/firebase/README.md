# Règles Firebase proposées (phase 2) — NON PUBLIÉES

- `database.rules.proposition.json` : règles proposées.
- `regles.diff` : différence avec `database.rules.json` (identique aux règles déployées au 30/09/2026).
- `regles.emulateur.test.mjs` : matrice de tests exécutable contre l'émulateur local (jamais la production).

## Hypothèses

1. Un utilisateur légitime a toujours une fiche `/users/<uid>`. Un compte Auth sans fiche (créé par l'inscription publique, ou orphelin) n'a plus accès à rien.
2. Rôles existants : `admin`, `subchef`, `visiteur`, `custom` (+ drapeau `editPlanning` pour les coordinateurs). `employe` est accepté pour l'avenir.
3. Les absences ont toujours `n`, `a`, `b`, `d`, `t` (vérifié sur les 270 absences en base : 0 non conforme). Dates au format `jj/mm/aaaa`, `t` ∈ ziek / verlof / recup.
4. Les cellules de planning sont des textes de 2 000 caractères au plus (maximum constaté : 193, les travailleurs extra sont stockés en JSON dans la cellule).
5. « Mon espace » : chaque employé ne lit que **ses propres** absences, pointages et score Bradford, dans `espace/<uid>`. Ces données sont publiées par le navigateur de l'admin (qui lit déjà tout) à chaque changement. Limite : si aucun admin n'ouvre le dashboard, l'espace n'est pas rafraîchi.
6. Le bouton « Tester la connexion Firebase » échouera sur l'écriture de test pour les non-admins (attendu).

## Matrice attendue

| Action | admin | sous-chef | coordinateur | visiteur | employé | sans fiche /users | non connecté |
|---|---|---|---|---|---|---|---|
| Lire employés, planning | oui | oui | oui | oui | oui | non | non |
| Lire absences | oui | oui | oui | oui | non | non | non |
| Lire pointages, commentaires Bradford | oui | oui | non | oui | non | non | non |
| Lire recrutement, logbook, users | oui | non | non | non | non | non | non |
| Modifier une cellule, ajouter une absence | oui | oui | oui | non | non | non | non |
| Écrire `_test_connexion` | oui | non | non | non | non | non | non |
| Changer son propre rôle | — | non | non | non | non | non | non |
| Ajouter une entrée `audit_log` à son nom | oui | oui | oui | oui | oui | non | non |
| Modifier une entrée `audit_log` | non | non | non | non | non | non | non |
| Supprimer une entrée `audit_log` | oui (droit racine) | non | non | non | non | non | non |
| Lire `audit_log` | oui | non | non | non | non | non | non |
| Lire **son propre** `espace/<uid>` | — | oui | oui | oui | oui | non | non |
| Lire l'espace d'un autre employé | oui | non | non | non | non | non | non |

Validations : absence mal formée, champ inconnu (`_k`), cellule non texte, rôle inconnu → refusés.

## Tester dans le simulateur de la console (sans publier)

1. Console Firebase → Realtime Database → **Règles**.
2. Coller le contenu de `database.rules.proposition.json` dans l'éditeur, **sans cliquer sur « Publier »**.
3. Ouvrir **Terrain de jeu des règles** (« Rules playground »).
4. Pour chaque ligne de la matrice : type (Lecture / Écriture / Mise à jour), emplacement (ex. `/planning/absences`), cocher « Authentifié », fournisseur « Personnalisé », UID d'un compte du rôle voulu (ou un UID inventé pour « sans fiche »), données JSON pour les écritures, puis « Exécuter ».
5. Quand tout est conforme : **Annuler** les modifications de l'éditeur (ou recharger la page) pour revenir aux règles en place. La publication se fera séparément, après accord.

Tests automatisés (PC avec Java) : voir l'en-tête de `regles.emulateur.test.mjs`.
