# Sauvegarde et restauration — Firebase Realtime Database

Le projet est sur le forfait **Spark** (gratuit) : **aucune sauvegarde automatique**. Si des données sont écrasées (mauvais import, bouton de migration, erreur de code), seule une copie faite à la main permet de revenir en arrière.

## Sauvegarder (≈ 5 minutes, une fois par semaine et avant toute opération risquée)

1. Console Firebase → **Realtime Database** → onglet **Données**.
2. Menu **⋮** en haut à droite de l'arbre → **Exporter JSON**. Le fichier s'appelle `aw3-p5-hub-default-rtdb-export.json` (≈ 300 Mo, dont ≈ 190 Mo de photos `sharepoint_photos`).
3. **Renommer tout de suite** le fichier avec la date : `aw3-p5-hub-AAAA-MM-JJ.json` (sinon le suivant écrase le précédent dans Téléchargements).
4. Le ranger **hors de Téléchargements**, dans un dossier protégé (OneDrive professionnel, disque chiffré). Il contient des données RH : ne jamais l'envoyer par mail, ni le mettre dans le dépôt GitHub, ni dans Obsidian.
5. Garder les 4 dernières semaines + une copie par mois ; supprimer le reste.

Avant toute opération à risque (import massif, publication de règles, migration) : refaire un export, même si le dernier date de la veille.

## Restaurer

⚠️ « Importer JSON » **remplace entièrement** le nœud sélectionné et tout ce qu'il contient.

1. **Refaire un export de l'état actuel** (pour pouvoir annuler la restauration).
2. Ouvrir le fichier de sauvegarde et en extraire **uniquement le nœud abîmé** (ex. `planning/absences`) dans un petit fichier JSON.
3. Console → Données → se placer **sur ce nœud précis** (pas à la racine) → **⋮** → **Importer JSON** → choisir le petit fichier.
4. Ouvrir le dashboard et vérifier l'onglet concerné.

Ne jamais importer le fichier complet à la racine : toute donnée saisie depuis la sauvegarde serait perdue.

## Pour aller plus loin

- **Forfait Blaze** : sauvegardes quotidiennes automatiques (option « Backups » de la Realtime Database), facturées à l'usage ; pour cette base, le coût resterait de l'ordre de quelques euros par mois au plus — à vérifier sur la page de tarification Firebase avant de l'activer.
- Sortir les photos (`sharepoint_photos`) de la base vers Firebase Storage réduirait l'export de près des deux tiers.
- Les règles proposées (`dev/firebase/`) journalisent les modifications sensibles dans `audit_log`, ce qui aide à savoir quoi restaurer.
