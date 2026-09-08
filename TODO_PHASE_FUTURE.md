# TODO Phase 3 et suivantes

Notes accumulees au fil des etapes d'extraction de la Phase 2, comme demande
au point 25 du prompt initial : les anomalies rencontrees en chemin sont
consignees ici plutot que corrigees a la volee, pour ne pas melanger
extraction et correction de bugs.

## Etape 5 — Bradford

- **Code mort trouve (4 fonctions)** : `calcSaisons()`, `getCommentHistory()`,
  `marquerDiscute()` et `trendHtml()` n'ont aucun appelant nulle part dans
  `app.js` ni dans `index.html` (verifie par recherche exhaustive, y compris
  dans les attributs `onclick`). Elles ont ete deplacees telles quelles dans
  `metier/bradford.js` / `vues/bradford.js` sans suppression, pour ne rien
  changer au comportement sans validation explicite. A trancher plus tard :
  les supprimer (nettoyage) ou les reconnecter (fonctionnalites
  "marquer comme discute" et "historique de commentaire" qui semblent avoir
  ete debranchees du panneau Bradford a un moment donne — `openBradfordPanel`
  n'appelle plus `getCommentHistory()` ni n'affiche de bouton vers
  `marquerDiscute()`).

- **`EXTRA_HIST` mal classee par le plan initial** : la section D du plan
  (`phase2_plan.html`) rangeait `EXTRA_HIST` parmi les globales "propres a
  Bradford". Verification faite sur le code reel : elle sert uniquement a
  l'autocompletion des noms de personnel "extra" dans le Planning (utilisee
  dans `save()` et dans la construction d'un `<datalist>` d'edition de
  planning). Elle n'a aucun rapport avec Bradford. Laissee dans `app.js`
  pour cette etape, a extraire avec `vues/planning.js` a l'etape 9.

- **Ecart de comptage avec le plan** : le plan estimait 11 fonctions pour le
  domaine Bradford. L'analyse reelle (avec un outil d'extraction corrige,
  voir ci-dessous) en denombre 18 : `recalc`, `calcTrend`, `calcSaisons`,
  `scColor`, `scSt` (-> `metier/bradford.js`) et `updKPI`, `initCharts`,
  `refreshCharts`, `buildBT`, `openComment`, `saveComment`,
  `openBradfordPanel`, `getCommentHistory`, `marquerDiscute`,
  `exportBradfordCSV`, `goToBradford`, `exportBradfordExcel`, `trendHtml`
  (-> `vues/bradford.js`). Coherent avec la reserve deja exprimee par le plan
  lui-meme sur le caractere approximatif d'un comptage par analyse statique
  simple.

- **`genererRapportExcel()` et `calcStatsTrimestreNvsN1()`** : confirmes
  comme fonctions "transverses" (elles combinent donnees Bradford et
  absences dans un rapport mensuel, section Admin/Protime de `index.html`).
  Laissees dans `app.js` pour cette etape, a trier au cas par cas plus tard
  (probablement `vues/admin.js` ou `vues/pointages.js`).

- **Outillage** : le script `extract_fn.js` (etape 4) ne reconnaissait pas
  les litteraux regex (ex. `.replace(/'/g, ...)`), ce qui lui faisait
  confondre une apostrophe a l'interieur d'un regex avec une ouverture de
  chaine de caracteres et decaler silencieusement les bornes de la fonction
  extraite (detecte via un controle de chevauchement des offsets). Corrige
  dans `extract_fn2.js` (heuristique standard regex-vs-division + gestion
  des classes de caracteres `[...]`), utilise pour toute l'etape 5. Verifie
  retroactivement que les fichiers `core/*.js` des etapes 2 a 4 ne
  contiennent aucun litteral regex avec guillemet interne (aucun trouve) —
  combine aux controles d'anti-regression deja passes a l'epoque, aucune
  correction rattrapee necessaire.

## Etape 6 — Arrets Inpak

- **Fonctions Bulk mal nommees comme si elles etaient du domaine Arrets** :
  `buildArretsBulkChart()` et `buildArretsBulkEquipeChart()` portent un nom
  qui laisse penser qu'elles appartiennent au domaine Arrets Inpak, mais leur
  corps ne fait que deleguer purement a `buildBulkSections()` (aucune logique
  Arrets propre). Verification faite sur le code reel : elles sont bien du
  domaine Bulk & Bijijin malgre leur nom. Laissees dans `app.js` pour cette
  etape (non extraites avec `metier/arrets.js` / `vues/arrets-inpak.js`), a
  extraire avec le domaine Bulk a l'etape 8. Le nom pretant a confusion
  pourrait etre corrige a ce moment-la (hors perimetre Phase 2, qui
  n'effectue que des deplacements sans renommage).

- **Aides "equipe" partagees non extraites** : `COULEURS_EQUIPE`,
  `equipeDansSel()`, `basculerEquipe()`, `selEquipeTexte()` et
  `majPastillesEquipe()` sont utilisees par les vues Arrets Inpak *et* par le
  domaine Bulk (pas encore extrait). Laissees dans `app.js` pour cette etape
  afin de ne pas casser silencieusement le Bulk en attendant son extraction
  a l'etape 8 — a deplacer alors vers un fichier partage (candidat :
  `core/equipes.js`) plutot que duplique dans les deux domaines.

- **Ecart de comptage avec le plan** : le plan estimait 26 fonctions pour
  Arrets Inpak et 3 pour le sous-onglet Comparaison (29 au total).
  L'analyse reelle (avec `extract_fn2.js`, controle de chevauchement des
  offsets passe sans anomalie) en denombre 27 pour Arrets Inpak (dont les
  2 fonctions d'import Grafana, isolees dans `imports/grafana.js`) et 4 pour
  Comparaison, soit 31 au total. Ecart minime, coherent avec la reserve deja
  exprimee par le plan sur l'approximation de son propre comptage — l'ecart
  s'explique principalement par l'exclusion correcte des 2 wrappers Bulk
  mentionnes ci-dessus (que le plan semble avoir comptes dans l'estimation
  Arrets a cause de leur nom) et par les aides "equipe" partagees, elles
  aussi exclues de ce compte.

- **Verification fonctionnelle live** : apres deploiement, les 51 001
  arrets s'affichent correctement (verifie via
  `Object.keys(ARRETS_DATA).length`), les filtres ligne / equipe / operateur
  / raison sont fonctionnels (teste : filtre "Line 31", le graphique
  "Analyse des causes" se met a jour en consequence), la comparaison
  inter-equipes (P1 a P5) et la comparaison par operateur s'affichent
  correctement, et l'import manuel (bouton "Importer Grafana") ouvre bien la
  boite de dialogue de collage JSON referencant `grafana_arrets_inpak.js`.
  Aucune erreur en console.

## Etape 7 — NCP

- **Fonctions redefinies apres coup (IIFE), non detectees par un simple
  grep de `function NOM(`** : dans le fichier d'origine, quatre fonctions
  du domaine NCP sont chacune REDEFINIES apres leur declaration de base
  par une ou plusieurs IIFE anonymes qui capturent l'ancienne version
  dans une fermeture puis remplacent la globale par une version enrichie :
  - `ncpKpiListe` — redefinie deux fois (ajout du cas `debloque/inpak/
    prod/slinpak/slprod`, puis du cas `acompleter`).
  - `buildNCPTab` — redefinie deux fois (ajout de `ncpMajTuilesExtra()`,
    puis de `ncpInjecterTuileACompleter()` et de la mise a jour de la
    tuile "a completer").
  - `ncpRendreListe` — redefinie deux fois (ajout du tri de liste, puis
    du filtre par unite).
  - `ncpDetail` — redefinie une fois (verrouillage des boutons d'action
    en ecriture pour le role "visiteur").

  Une extraction naive par nom de fonction (comme aux etapes 5 et 6)
  aurait deplace uniquement la declaration de base et **silencieusement
  perdu** ces cinq couches de comportement actif (dont le verrou de
  securite du role visiteur). Verification faite par recherche exhaustive
  de tout `nomFonction = function` dans le fichier entier (pas seulement
  dans la zone NCP) : aucune autre fonction, du domaine NCP ou d'un
  autre domaine, n'est concernee par ce motif — a l'exception de
  `applyRole` (deja extraite dans `core/auth.js` a l'etape 4) et d'un
  IIFE cosmetique (nav mobile/splash), tous deux hors du perimetre NCP
  et donc non deplaces. Les cinq IIFE NCP ont ete deplacees telles
  quelles dans `vues/ncp.js`, **dans leur ordre d'origine**, a la suite
  de la declaration de base de la fonction qu'elles enrobent — l'ordre
  d'execution des redefinitions en chaine est preserve a l'identique.

- **Code non contigu** : le domaine NCP n'est pas regroupe en un seul
  bloc dans `app.js` d'origine — les cinq IIFE ci-dessus se trouvent
  dans une deuxieme zone du fichier (autour de la section Recrutement/
  auth/splash-screen), entremelees avec du code d'autres domaines
  (`applyRole`, l'ecran de demarrage cosmetique, les questions
  d'entretien de Recrutement). Chaque fragment a ete identifie et
  extrait individuellement par nom, sans toucher au code environnant
  qui n'appartient pas a NCP.

- **Import NCP non extrait a cette etape** : `importerNCP()` et
  `openImportNCPModal()` restent dans `app.js`, conformement au plan
  (`imports/ncp.js` est prevu a l'etape 10, avec `imports/base.js` et
  `imports/protime.js`, et non a l'etape 7). Verifie fonctionnel en
  l'etat apres extraction.

- **Fonctions reclassifiees de "metier" vers "vue" par rapport a un
  premier tri automatique** : un premier passage (marqueurs DOM/HTML
  uniquement) rangeait `ncpKpiListe`, `ncpListeDeclarant`,
  `ncpListeRecurrence`, `ncpBasculerTriListe`, `ncpChangerFiltreUnite`,
  `ncpSetOverrideChamp`, `ncpSetEquipeOverride`, `ncpSetLigneOverride`,
  `ncpSetUniteOverride`, `ncpSetOperateurOverride` et `ncpToggleControle`
  en "metier" faute d'appel direct au DOM. Revu manuellement : ce sont
  des gestionnaires d'action utilisateur (ecriture Firebase suivie d'un
  rafraichissement de modale, ou filtrage/tri d'une liste deja affichee)
  — meme famille que `saveComment()`/`openComment()` de Bradford
  (etape 5), deplaces en `vues/bradford.js` malgre l'ecriture Firebase.
  Les onze ont ete replacees dans `vues/ncp.js` pour rester coherentes
  avec ce precedent.

- **Ecart de comptage avec le plan** : le plan estimait 59 fonctions
  pour NCP. L'analyse reelle (memes outils qu'aux etapes 5-6, controle
  de chevauchement des offsets passe sans anomalie) en denombre 91
  (89 extraites cette etape + les 2 fonctions d'import laissees en
  place). Ecart plus important que sur les etapes precedentes, dans la
  continuite de la reserve deja exprimee par le plan sur son propre
  comptage — NCP etant explicitement signale par le plan comme "le
  bloc le plus enchevetre".

- **`buildNCPTab()` (18,8 Ko) deplacee intacte, sans scission
  calcul/rendu** : le plan notait que separer calcul et rendu a
  l'interieur de cette fonction demanderait de la lire ligne a ligne.
  Conformement au principe "aucun changement de comportement" applique
  a toute la Phase 2 (deja suivi pour `recalc()` a l'etape 5), la
  fonction est deplacee en un seul bloc vers `vues/ncp.js` — elle fait
  a la fois filtrage, agregation et generation HTML, ce qui la classe
  cote "vue" comme `buildBT()`/`buildArretsInpak()` aux etapes
  precedentes. La vraie separation calcul/rendu, si souhaitee, reste a
  faire en Phase 3.

- **Verification fonctionnelle live** : apres deploiement, l'onglet
  NCP Qualite charge sans erreur console, les KPI (total, Inpak,
  Production, tonnes, debloque, hors-shift, fiches a completer) et
  leurs listes filtrees s'affichent (teste : clic sur une tuile ->
  liste avec tri et filtre par unite fonctionnels, confirmant les deux
  couches de wrap sur `ncpRendreListe`), le detail d'une fiche s'ouvre
  correctement avec ses actions (mettre de cote, commenter, marquer
  controle, traduire, overrides equipe/ligne/unite/operateur) actives
  pour un compte Admin — comportement attendu, le verrou ne s'applique
  qu'au role "visiteur" et n'a pas ete reteste avec un tel compte faute
  d'en avoir un sous la main pour cette verification —, les graphiques
  (evolution mensuelle, top causes, tonnage par client) se dessinent et
  se recalculent quand le filtre d'unite change, et l'import NCP
  (fusion non destructive, toujours dans `app.js`) ouvre bien sa boite
  de dialogue.

## Etape 8 — Bulk / Bijlijn

- **Quatre fonctions reclassifiees de "metier" vers "vue"** par rapport au
  premier tri automatique (marqueurs DOM/HTML) : `buildArretsBulkChart`,
  `buildArretsBulkEquipeChart` et `bulkSauverUnite` sont de purs relais
  d'une seule ligne (`{ buildBulkSections(); }`), sans aucun calcul propre ;
  `filtrerBulkEquipe` modifie l'etat de filtre equipe puis appelle
  directement `majPastillesEquipe()` (DOM) avant de rafraichir via
  `buildBulkSections()`. Meme famille que les onze reclassifications NCP de
  l'etape 7 (gestionnaires d'action utilisateur qui delegvent le rendu).
  `loadBulkData()` en revanche est **restee en metier** malgre son appel
  final a `buildBulkSections()` : c'est l'ecouteur Firebase `bulk_data`
  lui-meme (memes schema que `loadArretsInpak()`/`loadNCPData()`), pas un
  gestionnaire d'action utilisateur.

- **Aucune IIFE de redefinition trouvee** (motif rencontre a l'etape 7 pour
  NCP, cause d'une perte silencieuse de comportement si non detecte) :
  recherche exhaustive sur le fichier entier de tout `bulkXxx = function` /
  `var bulkXxx = function` pour les 42 noms Bulk — aucun resultat. Coherent
  avec la note du plan signalant Bulk comme le domaine ou calcul et rendu
  etaient deja le plus nettement separes.

- **`importerBulk()` / `openImportBulkModal()` extraites a cette etape**,
  contrairement a `importerArretsInpak()` (etape 6) et `importerNCP()`
  (etape 7) qui avaient ete laissees dans `app.js` en attendant l'etape 10.
  Verification faite sur le texte exact du plan (section etape 10) : seuls
  quatre fichiers d'import y sont explicitement lister — `imports/base.js`,
  `imports/protime.js`, `imports/grafana.js` et `imports/ncp.js` ("les
  quatre imports") — `imports/bulk.js` n'y figure pas. Les deux fonctions
  sont donc deplacees directement dans `vues/bulk.js`, coherent avec leur
  classification "vue" du premier tri automatique.

- **Variables classees individuellement** (aucune n'est groupee dans une
  meme instruction `var` avec d'autres domaines) : `BULK_DATA` (donnee
  brute de l'ecouteur Firebase), `BULK_EQ` (liste constante des equipes) et
  `_bulkPosteCache` (cache interne pur, utilise uniquement dans
  `bulkHeuresPoste`) rangees en metier — meme famille que `NCP_DATA` /
  `NCP_JOURS` (etape 7). `BULK_COUL` (utilisee uniquement dans les
  fonctions de rendu), `BULK_DATE_DEBUT` / `BULK_DATE_FIN` (etat de filtre
  de periode, ecrit uniquement par les gestionnaires UI de periode, lu en
  lecture seule cote metier par `bulkDansPeriode`), `BULK_EQUIPE_FILTRE`
  (etat de filtre equipe, ecrit uniquement par `filtrerBulkEquipe`,
  desormais cote vue) et les deux instances Chart.js
  `_arretsBulkChart` / `_arretsBulkEquipeChart` rangees en vue.

- **Aides "equipe" partagees toujours pas extraites** : `COULEURS_EQUIPE`,
  `equipeDansSel()`, `basculerEquipe()`, `selEquipeTexte()` et
  `majPastillesEquipe()` restent dans `app.js`, comme annonce a l'etape 6 —
  elles sont utilisees a la fois par Bulk (cette etape) et par Planning
  (pas encore extrait, etape 9). Confirme candidates pour un futur
  `core/equipes.js` en Phase 3, non extraites ici pour ne pas casser
  Planning en attendant son tour.

- **Anomalie pre-existante trouvee (non corrigee, point 25)** : la boite de
  dialogue d'import Bulk affiche `arr_bulk_modal_title` (la cle de
  traduction brute) au lieu du texte "Importer Bulkopvang + Bijlijn" prevu
  en repli statique dans `index.html`
  (`<span data-i18n="arr_bulk_modal_title">Importer Bulkopvang +
  Bijlijn</span>`). Verifie : cette cle est absente du dictionnaire
  `I18N.fr` dans `app.js` **d'origine** (avant toute modification de cette
  etape) — c'est un bug preexistant du systeme de traduction, sans lien
  avec l'extraction, non corrige ici conformement au point 25 du prompt
  initial.

- **Ecart de comptage avec le plan** : le plan estimait 40 fonctions pour
  Bulk. L'analyse reelle (memes outils qu'aux etapes 5-7, controle de
  chevauchement des offsets passe sans anomalie) en denombre 42 (17 metier
  + 25 vue). Ecart de +5%, le plus faible rencontre depuis le debut de la
  Phase 2 — coherent avec la note du plan qualifiant Bulk de "le plus
  simple des quatre blocs metier".

- **Verification fonctionnelle live** : apres deploiement, l'onglet Bulk &
  Bijlijn charge sans erreur console, les KPI (surproduction, noodafvoer,
  total bulk, activite) et le tableau par equipe (P1 a P5) s'affichent avec
  des tonnages coherents (teste : filtre equipe "P1" -> KPI et ligne de
  tableau P1 identiques, 1173,2 t), le graphique se recalcule en
  consequence, le bandeau d'information periode confirme le decoupage en
  jour de production 05h->05h ("les journees vont de 05h a 05h, comme les
  postes"), et la boite de dialogue d'import Bulk (bouton "Importer
  Grafana") s'ouvre et se ferme correctement (anomalie de traduction
  ci-dessus mise a part, preexistante). `js/metier/bulk.js` et
  `js/vues/bulk.js` se chargent tous deux en 200.

## `recalc()` — signature impure (rappel)

`recalc()` ne prend aucun parametre et ne retourne rien : elle lit le
global `ABS` et ecrit le global `BD` par effet de bord. La rendre pure
(`calculateBradford(abs) -> resultat`) est explicitement reporte a la
Phase 3 par le plan, pour ne pas melanger extraction et refonte.

## Etape 9 — Pointages, Admin, Recrutement (fin de l'extraction des vues)

Extraction des trois derniers domaines de la Phase 2 : `js/vues/pointages.js`,
`js/vues/admin.js`, `js/vues/recrutement.js`. Chaque domaine a suivi le
protocole habituel (4 fichiers dans l'ordre : `vues/<domaine>.js`,
`index.html`, `app.js`, `sw.js`), avec verification octet pour octet
(hash SHA-256) de chaque fichier avant et apres commit via l'API Git de
GitHub (`git/blobs`), pas seulement via `raw.githubusercontent.com` qui
sert parfois une version en cache pendant quelques minutes apres un commit.

Versions : Pointages -> v76 / bradford-v59, Admin -> v77 / bradford-v60,
Recrutement -> v78 / bradford-v61.

### Methode de deploiement retenue

Le depot GitHub distant ne permet pas de `git push` direct depuis cet
environnement (aucun identifiant configure, et la consigne de securite
interdit de toute facon de manipuler des identifiants). L'upload manuel
fichier par fichier dans l'interface web GitHub a ete fait de la maniere
suivante, qui s'est averee fiable :

1. Les fichiers prepares (contenu exact, deja verifie par hash en local)
   sont ecrits directement dans le dossier Telechargements de l'utilisateur.
2. La page GitHub "Upload files" est ouverte a la racine du depot, et
   l'utilisateur selectionne lui-meme les fichiers dans la boite de
   dialogue Windows (l'automatisation native du clic dans cette boite de
   dialogue s'est averee non fiable dans cet environnement — echecs
   systematiques et repetes, meme apres plusieurs tentatives sur des
   cibles differentes).
3. Une fois les fichiers commites (a la racine, sous leur nom temporaire),
   leur contenu est recupere directement depuis l'API Git de GitHub
   (`git/blobs/<sha>`), reconverti en octets dans le navigateur, puis
   reinjecte comme fichier via un objet `File`/`DataTransfer` sur la page
   d'upload du bon sous-dossier (`js/`, `js/vues/`). Cela permet de
   deplacer/renommer un fichier vers son emplacement final sans jamais
   faire retranscrire son contenu par le modele (risque de corruption sur
   de gros fichiers en texte).
4. Les fichiers temporaires a la racine sont ensuite supprimes.
5. Chaque fichier final est reverifie par hash SHA-256 via l'API Git
   avant de considerer le domaine termine.

Cette methode a remplace une premiere approche (retranscription manuelle
du contenu en base64 par blocs de ~10000 caracteres, avec verification de
hash a chaque bloc) qui s'est revelee correcte mais tres lente et sujette
a des erreurs de transcription sur de tres longues chaines repetitives
(plusieurs blocs ont du etre re-decoupes en blocs de 5000 caracteres pour
etre transcrits sans erreur). Elle reste documentee ici au cas ou elle
serait necessaire de nouveau (par exemple si l'upload de fichier via
`File`/`DataTransfer` cesse de fonctionner) : lire le fichier local par
blocs, les injecter un par un dans une variable JS cote navigateur, et
verifier le hash SHA-256 de chaque bloc avant de les concatener.

### Verification

Pour les trois domaines : `index.html`, `sw.js`, `js/app.js` et le nouveau
`js/vues/<domaine>.js` ont ete verifies avec le hash SHA-256 attendu
(calcule localement avant l'upload), et le site `aw3-p5-hub.vercel.app` a
ete recharge sans erreur console apres chaque domaine. La page de connexion
s'affiche normalement pour Pointages ; les onglets Admin et Recrutement
n'ont pas ete testes en profondeur avec un compte reel (pas d'identifiants
manipules par l'assistant), a confirmer par l'utilisateur.

## Etape 10 — Cluster imports (base.js, protime.js, ncp.js)

Extraction du cluster "imports manuels" reste de app.js vers `js/imports/`,
completant les 4 fichiers prevus par `js/imports/README.md` (base.js,
grafana.js deja fait a une etape anterieure, protime.js, ncp.js).

Perimetre exact : les 14 fonctions listees dans le commentaire d'en-tete de
`js/vues/pointages.js` (ajoute a l'Etape 9) comme "differees a l'Etape 10" :
loadPointages, parseProtimeJson, protimeDateToDDMM, protimeDateToYear,
previewProtimeImport, purgeAllProtimeAbsences, purgeUntypedAbsences,
purgeProtimeAbsences, applyProtimeImport, detectMissingWeeks,
matchNomProtime, classifierTypeAbsence, importerAbsencesProtime, ptKey —
plus openImportNCPModal et importerNCP (cluster NCP, differe depuis
l'Etape 7). Repartition finale :

- `js/imports/base.js` : ptKey seule (partagee avec grafana.js, doit donc
  se charger avant lui).
- `js/imports/protime.js` : les 13 autres fonctions du cluster Protime.
- `js/imports/ncp.js` : openImportNCPModal + importerNCP (fichier distinct
  de `js/metier/ncp.js`, deja extrait a l'Etape 7 -- pas de collision de
  nom, chemins differents).

Version : v79 / bradford-v62.

### Methode d'extraction (nouvelle etape par rapport aux domaines precedents)

Contrairement aux domaines vues/metier des etapes precedentes (fichiers
deja prepares en amont), le decoupage a ete fait directement dans cet
environnement a partir du `js/app.js` en production :

1. Recuperation de `js/app.js` via `curl` (l'environnement sandbox peut
   contacter `raw.githubusercontent.com` directement, contrairement aux
   services de paste anonymes qui sont bloques par le proxy).
2. Reperage des positions exactes de chaque fonction/bloc du cluster
   imports en repartant de la liste faisant autorite (commentaire d'en-tete
   de `vues/pointages.js`, cf. Etape 9), une premiere recherche automatique
   par mot-cle ayant manque 2 fonctions (loadPointages, detectMissingWeeks,
   qui ne contiennent ni "protime" ni "absence" dans leur nom).
3. Extraction par un petit analyseur Python maison (comptage d'accolades)
   qui saute correctement les chaines ('/"), les template literals
   (backticks), et les commentaires (// et /* */) pour trouver la fin
   exacte du corps de chaque fonction, evitant de couper au milieu d'une
   chaine contenant des accolades.
4. Verification exhaustive avant upload : `node --check` sur les 4 fichiers
   produits, verification que les 58 noms de fonctions d'origine se
   retrouvent exactement une fois dans l'ensemble des 4 fichiers (0 perte,
   0 doublon), et verification que la longueur totale retiree de app.js
   correspond exactement a la somme des blocs extraits.

Le reste de la methode de deploiement (upload racine -> deplacement via
`fetch` + `File`/`DataTransfer` vers le chemin final -> suppression des
fichiers temporaires -> verification hash SHA-256 via l'API Git) est
identique a celle documentee a l'Etape 9.

### Verification

`js/imports/base.js`, `js/imports/protime.js`, `js/imports/ncp.js`,
`js/app.js`, `index.html` et `sw.js` ont tous ete verifies par hash
SHA-256 via l'API Git (`git/blobs`) apres commit, correspondant exactement
au contenu prepare localement. Le site `aw3-p5-hub.vercel.app` recharge
sans le cache navigateur affiche bien les scripts `js/imports/base.js?v=1`,
`js/imports/grafana.js?v=1`, `js/imports/protime.js?v=1`,
`js/imports/ncp.js?v=1` puis `js/app.js?v=79`, sans erreur console.

### Etat de app.js apres l'Etape 10

`js/app.js` fait maintenant 237096 octets (contre 259132 avant cette
etape) et contient : le CSS injecte dynamiquement en tete de fichier, et
31 fonctions restantes formant la coquille de l'application (demarrage,
gestion des onglets, authentification, etc.) qui ne font pas partie d'un
domaine metier/vue specifique et ne sont donc pas ciblees par le decoupage
de la Phase 2. Avec cette etape, les 4 fichiers prevus dans
`js/imports/README.md` (base.js, grafana.js, protime.js, ncp.js) sont tous
presents -- le cluster d'import manuel de la Phase 2 est complet.

## Etape 11 -- Mon espace (js/vues/espace.js)

Extraction du dernier domaine de vue identifie dans js/vues/README.md : "Mon
espace" (onglet espace), vue individuelle agregee par employe (pointages,
absences, formations, NCP le concernant). Un employe normal ne voit que sa
propre fiche ; seul l'admin peut choisir un autre employe via le selecteur.

Fonctions deplacees vers js/vues/espace.js : normNomEspace(s),
monEspaceTrouverEmpActuel(), monEspaceToggle(hdr), buildMonEspace().

Methode : extraction du cluster "MON ESPACE" de app.js (237096 -> 222290
octets) par reperage du commentaire banniere et comptage d'accolades pour
trouver la fin exacte de buildMonEspace(). Verification exhaustive : les 31
fonctions originales se retrouvent integralement reparties en 27 (app.js) +
4 (espace.js), sans perte ni doublon. index.html met a jour la balise
<script> (espace.js?v=1, apres recrutement.js) et bascule app.js en v80.
sw.js passe en cache bradford-v63, ajoute espace.js?v=1 a la liste des
fichiers caches et reference app.js?v=80.

Verification : hash SHA-256 de chaque fichier commite (espace.js, app.js,
index.html, sw.js) compare au hash attendu calcule localement avant
deploiement -- correspondance exacte dans les 4 cas. Site live verifie sans
erreur console, balises <script> confirmant espace.js?v=1 et app.js?v=80.

Etat apres extraction : tous les fichiers vues/ annonces dans le README
correspondent desormais a un fichier reel, SAUF deux entrees du README qui
n'ont pas d'equivalent extrait : "ov.js" et "ab.js" (absences). Une
premiere analyse de app.js (221674 octets, 25 fonctions restantes) montre
un cluster ABSENCES encore present (updAbsLbl, buildAbs, buildTodayAbs) et
une fonction applyOverviewAccess qui pourrait correspondre a "ov.js", ainsi
qu'un cluster ANNIVERSAIRES (birthdays) non repertorie dans le README. Ces
clusters restent a examiner et a extraire lors d'etapes futures (Etape 12+)
si le decoupage de la Phase 2 doit couvrir la totalite du README.
