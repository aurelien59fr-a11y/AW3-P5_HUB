/* metier/arrets.js -- donnees et calculs des arrets Inpak (hors comparaison et import).
   Extrait de app.js a l'etape 6 du plan Phase 2 (aucune regle metier changee).
   loadArretsInpak() est l'ecouteur Firebase du noeud arrets_inpak -- il ne
   touche pas au DOM lui-meme, il delegue le rendu a buildArretsInpak() et
   buildComparaisonTab() (vues/arrets-inpak.js), disponibles globalement.
   ARRETS_REF_CAT et ARRETS_REF_RAISON sont aussi lues par des fonctions de
   vues/arrets-inpak.js (peuplerRaisonsSelect) -- comportement inchange, la
   portee globale du script ne requiert aucun ordre de chargement particulier.
   equipeDansSel/basculerEquipe/selEquipeTexte/majPastillesEquipe et
   COULEURS_EQUIPE restent dans app.js : partages avec Bulk (pas encore
   extrait) -- voir TODO_PHASE_FUTURE.md. */

var ARRETS_DATA = {};

var ARRETS_REF_CAT = {
  '00': ['Reinigen', 'Nettoyage', 'Cleaning'],
  '01': ['Wissel', 'Changement', 'Change'],
  '02': ['Aanvoer product', 'Arrivee du produit', 'Flow product'],
  '03': ['Ishida', 'Ishida', 'Ishida'],
  '04': ['GEA', 'GEA', 'GEA'],
  '05': ['Smartdate', 'Smartdate', 'Smartdate'],
  '06': ['CPS / Blueprint', 'CPS / Blueprint', 'CPS / Blueprint'],
  '07': ['Weber doos labelaar', 'Etiqueteuse de boite', 'Box labeler'],
  '08': ['Afvoer', 'Sortie boites et palettes', 'Exit product'],
  '10': ['Niet actief', 'Non actif', 'Inactive']
};

var ARRETS_REF_RAISON = {
  '00.01': ['Grote reiniging', 'Grand nettoyage', 'Extensive cleaning'],
  '00.02': ['Reiniging na technische interventie', 'Nettoyage apres intervention technique', 'Cleaning after technical intervention'],
  '00.03': ['Reiniging na batter', 'Nettoyage apres batter', 'Cleaning after batter'],
  '01.01': ['Ombouw', 'Changement d\'article', 'Change of article'],
  '02.01': ['Onvoldoende product (inpak sneller dan aanvoer)', 'Produit insuffisant (emballage plus rapide que l\'alimentation)', 'Insufficient product (packing faster than production)'],
  '02.02': ['Stilstand in productie', 'Temps d\'arret dans la production', 'Stand still in production'],
  '02.05': ['Ombouw in productie', 'Changement dans la production', 'Product change in production'],
  '02.06': ['Opvang klantenbulken', 'Production vers bulks clients', 'Filling client bulks'],
  '02.07': ['Wachten op bulkaanvoer', 'En attente de bulks', 'Waiting on bulk transport'],
  '03.01': ['Fouten PH, WH en DTH-fout, overgewicht', 'Fautes PH, WH, DTH et trop de poids', 'Errors PH, WH and DTH, overweight'],
  '03.02': ['Reinigen', 'Nettoyage de l\'Ishida', 'Cleaning Ishida'],
  '03.03': ['Technische dienst', 'Intervention service technique', 'Technical service'],
  '03.04': ['Andere (+ omschrijving)', 'Autre (+ description)', 'Other (+ description)'],
  '04.01': ['Folie uit fotocel', 'Hors cellule photo', 'Foil fotocel out of position'],
  '04.02': ['Foliewissel', 'Changement de bobine', 'Foil change'],
  '04.03': ['Bekkenfout', 'Faute machoires', 'Jaws error'],
  '04.04': ['Folie niet aanwezig', 'Film pas present', 'Foil not present'],
  '04.05': ['Mesbekken wisselen', 'Changement du couteau / contre-couteau', 'Jaws knife block change'],
  '04.06': ['Verstopping vulpijp', 'Bourrage de la pipe', 'Bag fill pipe blockage'],
  '04.07': ['Technische dienst', 'Intervention service technique', 'Technical service'],
  '04.08': ['Andere (+ omschrijving)', 'Autre (+ description)', 'Other (+ description)'],
  '04.09': ['Langs of dwarsnaad problemen', 'Probleme de soudure longitudinale ou transversale', 'Longitudinal or cross seam problem'],
  '05.01': ['Lintwissel', 'Changement de ruban', 'Ribbon change'],
  '05.02': ['Technische dienst', 'Intervention service technique', 'Technical service'],
  '05.03': ['Andere (+ omschrijving)', 'Autre (+ description)', 'Other (+ description)'],
  '06.01': ['Bak metaal vol', 'Bac de metal plein', 'Metal reject box full'],
  '06.02': ['Metaal test', 'Test de metal', 'Metal test'],
  '06.03': ['Bak gewicht vol', 'Bac de poids plein', 'Weight reject box full'],
  '06.04': ['Kartontoevoer', 'Approvisionnement de carton', 'Cardboard supply'],
  '06.07': ['Taper', 'Scotcheuse', 'Taper'],
  '06.08': ['Doosweger reject', 'Rejet du peseur de caisse', 'Box weigher reject'],
  '06.10': ['Technische dienst', 'Intervention service technique', 'Technical service'],
  '06.11': ['Andere (+ omschrijving)', 'Autre (+ description)', 'Other (+ description)'],
  '06.12': ['Thermische storing', 'Defaut thermique', 'Thermal fault'],
  '07.01': ['Storing', 'Erreur', 'Error'],
  '07.02': ['Rolwissel', 'Changement de rouleau d\'etiquette', 'Label roll change'],
  '07.03': ['Technische dienst', 'Intervention service technique', 'Technical service'],
  '08.02': ['Storing afvoer buffertafel', 'Dysfonctionnement sortie de table d\'accumulation', 'Buffer table exit error'],
  '08.03': ['Storing afvoer paletiser', 'Dysfonctionnement sortie du palettiseur', 'Palletizer exit error'],
  '08.04': ['Technische dienst', 'Intervention service technique', 'Technical service'],
  '10.01': ['Lijn niet beschikbaar - (investerings)werken', 'Ligne non disponible - travaux (investissement)', 'Line not available - (investment) works'],
  '10.02': ['Preventief onderhoud', 'Entretien preventif', 'Preventive maintenance'],
  '10.03': ['Sluiting', 'Fermeture', 'Closure'],
  '10.04': ['Geen werk', 'Pas de travail', 'No work'],
  '10.05': ['Andere (+ omschrijving)', 'Autre (+ description)', 'Other (+ description)'],
  '10.06': ['Geen personeel', 'Pas de personnel', 'No staff']
};

function loadArretsInpak(){
  if(!db) return;
  db.ref('arrets_inpak').on('value', function(snap){
    ARRETS_DATA = snap.val() || {};
    buildArretsInpak();
    if(typeof buildComparaisonTab === 'function') buildComparaisonTab();
  }, function(error){
    console.error('[Arrets Inpak] Erreur de lecture Firebase :', error);
  });
}

function arretsLangIdx(){
  var l = (typeof LANG !== 'undefined') ? LANG : 'fr';
  return l === 'nl' ? 0 : (l === 'en' ? 2 : 1);
}

function arretCode(raison){
  var m = /^\((\d{2}\.\d{2})\)/.exec(String(raison || '').trim());
  return m ? m[1] : null;
}

function arretCat(raison){
  var c = arretCode(raison);
  return c ? c.slice(0, 2) : null;
}

function arretCatLibelle(cat){
  var e = ARRETS_REF_CAT[cat];
  return e ? e[arretsLangIdx()] : (cat || '?');
}

function arretRaisonTexte(raison){
  var c = arretCode(raison);
  var e = c ? ARRETS_REF_RAISON[c] : null;
  if(e) return e[arretsLangIdx()];
  return String(raison || '').replace(/^\(\d{2}\.\d{2}\)\s*/, '') || '-';
}

function arretLibelle(raison){
  var c = arretCode(raison);
  return (c ? c + ' - ' : '') + arretRaisonTexte(raison);
}

function arretsFmtH(minutes){
  var m = Math.round(minutes || 0);
  return Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0');
}

function arretsCausesTri(mode){
  ARRETS_CAUSES_TRI = mode;
  if(typeof buildArretsInpak === 'function') buildArretsInpak();
}

function arretsCausesOuvrir(cat){
  ARRETS_CAUSES_CAT = (ARRETS_CAUSES_CAT === cat) ? null : cat;
  if(typeof buildArretsInpak === 'function') buildArretsInpak();
}

function dansFenetreHeure(heure, reference){
  var toMin = function(h){ var p = h.split(':'); return parseInt(p[0],10)*60 + parseInt(p[1],10); };
  var diff = Math.abs(toMin(heure) - toMin(reference));
  return diff <= 30;
}

function nettoyerDoublonsArrets(){
  if(!db){ toast(t('pt_firebase_unavailable'), '#ef4444'); return; }

  var aSupprimer = [];

  // 1. Micro-arrets au format obsolete (avant l'agregation par jour) :
  // ils ont un champ "heure" mais pas de champ "nombre" — reliquats des
  // tout premiers tests, remplaces depuis par le format agrege.
  Object.keys(ARRETS_DATA).forEach(function(key){
    var a = ARRETS_DATA[key];
    if(a.type === 'microstop' && a.nombre == null){
      aSupprimer.push(key);
    }
  });

  // 2. Doublons classiques (meme ligne+date+heure+type, cree par l'ancienne
  // cle aleatoire, ou par de petites variations d'espace/type entre deux
  // imports) — on ignore les entrees deja marquees ci-dessus. Normalisation
  // stricte (trim + casse) pour ne rater aucune variante.
  var groupes = {};
  Object.keys(ARRETS_DATA).forEach(function(key){
    if(aSupprimer.indexOf(key) !== -1) return;
    var a = ARRETS_DATA[key];
    var ligneNorm = String(a.ligne || '').trim();
    var dateNorm = String(a.date || '').trim();
    var heureNorm = String(a.heure || '').trim();
    var k = a.type + '|' + ligneNorm + '|' + dateNorm + '|' + heureNorm;
    if(!groupes[k]) groupes[k] = [];
    groupes[k].push({ key: key, ts: a.ts || 0 });
  });

  Object.keys(groupes).forEach(function(k){
    var entries = groupes[k];
    if(entries.length <= 1) return;
    entries.sort(function(a, b){ return b.ts - a.ts; }); // le plus recent en premier
    for(var i = 1; i < entries.length; i++) aSupprimer.push(entries[i].key);
  });

  if(!aSupprimer.length){ toast(t('arr_toast_no_duplicates'), '#10b981'); return; }
  if(!confirm(t('arr_confirm_delete1') + aSupprimer.length + t('arr_confirm_delete2'))) return;

  var TAILLE_LOT = 100;
  var lots = [];
  for(var i = 0; i < aSupprimer.length; i += TAILLE_LOT) lots.push(aSupprimer.slice(i, i + TAILLE_LOT));

  var fait = 0;
  toast(t('arr_toast_deleting1') + aSupprimer.length + t('arr_toast_deleting2'), '#3b82f6');
  console.log('[Nettoyage doublons] ' + lots.length + ' lot(s) a traiter');

  function envoyerLot(idx){
    if(idx >= lots.length){
      toast(aSupprimer.length + t('arr_toast_deleted_suffix'), '#10b981');
      console.log('[Nettoyage doublons] Termine :', aSupprimer.length, 'doublon(s) supprime(s)');
      return;
    }
    var updates = {};
    lots[idx].forEach(function(key){ updates['arrets_inpak/' + key] = null; });
    db.ref().update(updates).then(function(){
      fait += lots[idx].length;
      console.log('[Nettoyage doublons] ' + fait + ' / ' + aSupprimer.length);
      envoyerLot(idx + 1);
    }).catch(function(e){
      if(e.message && e.message.indexOf('WRITE_TOO_BIG') !== -1 && lots[idx].length > 5){
        console.warn('[Nettoyage doublons] Lot trop gros, decoupe en deux et reessaie...');
        var moitie = Math.ceil(lots[idx].length / 2);
        var lotA = lots[idx].slice(0, moitie);
        var lotB = lots[idx].slice(moitie);
        lots.splice(idx, 1, lotA, lotB);
        envoyerLot(idx);
        return;
      }
      toast(t('arr_toast_error_lot1') + (idx+1) + t('arr_toast_error_lot2') + lots.length + t('arr_toast_error_lot3') + e.message, '#ef4444');
      console.error('[Nettoyage doublons] Erreur lot ' + idx, e);
    });
  }
  envoyerLot(0);
}

