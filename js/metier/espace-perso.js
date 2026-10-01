/* ====================================================================
 * metier/espace-perso.js — Donnees personnelles de « Mon espace »
 *
 * Principe : chaque employe ne lit QUE ses propres donnees, rangees dans
 * espace/<uid> (regle Firebase : lecture reservee au compte <uid>).
 * Il n'a donc plus besoin de lire les absences et les pointages de toute
 * l'equipe.
 *
 * Qui ecrit espace/<uid> ? Le navigateur de l'ADMIN, qui lit deja toutes
 * les donnees : a chaque changement des absences ou des pointages (et une
 * fois au demarrage), il recalcule la part de chaque employe ayant un compte
 * et n'envoie que ce qui a change. Limite connue : si aucun admin n'ouvre le
 * dashboard, les espaces ne sont pas rafraichis (une Cloud Function pourra
 * prendre le relais plus tard).
 * ==================================================================== */

var ESPACE_PERSO = null;      // espace/<uid> du compte connecte (employes)
var ESPACE_PUBLIE = {};       // admin : uid -> empreinte du dernier envoi
var ESPACE_PT_CHARGES = false;
var ESPACE_MINUTERIE = null;

function lecturePointagesComplete(){
  return !!(currentUser && (currentUser.role === 'admin' || currentUser.role === 'subchef' || currentUser.role === 'visiteur'));
}

/* Employe : ecoute son propre espace. */
function chargerEspacePerso(){
  if(!db || !currentUser || currentUser.role === 'admin') return;
  db.ref('espace/' + currentUser.uid).on('value', function(snap){
    ESPACE_PERSO = snap.val() || {};
    if(typeof buildMonEspace === 'function') buildMonEspace();
  }, function(e){ console.warn('[Mon espace] lecture refusee :', e && e.message); ESPACE_PERSO = {}; });
}

/* Sources de donnees utilisees par Mon espace, selon les droits du compte. */
function espaceAbsences(){
  if(typeof peutLireAbsences === 'function' && peutLireAbsences()) return ABS;
  return (ESPACE_PERSO && ESPACE_PERSO.absences) || [];
}
function espacePointages(){
  if(lecturePointagesComplete()) return PT_DATA || {};
  return (ESPACE_PERSO && ESPACE_PERSO.pointages) || {};
}
function espaceBradford(nomCible){
  if(typeof peutLireAbsences === 'function' && peutLireAbsences()){
    return (typeof BD !== 'undefined' ? BD : []).find(function(b){ return normNomEspace(b.n) === nomCible; });
  }
  return (ESPACE_PERSO && ESPACE_PERSO.bradford) || null;
}

/* Admin : part des donnees d'un employe (copie sans cle locale _k). */
function espaceCalculerPour(nom){
  var cible = normNomEspace(nom);
  var absences = ABS.filter(function(a){ return normNomEspace(a.n) === cible; }).map(function(a){
    var c = {}; Object.keys(a).forEach(function(k){ if(k !== '_k') c[k] = a[k]; }); return c;
  });
  var pointages = {};
  Object.keys(PT_DATA || {}).forEach(function(k){ if(PT_DATA[k] && normNomEspace(PT_DATA[k].nom) === cible) pointages[k] = PT_DATA[k]; });
  var bd = (typeof BD !== 'undefined' ? BD : []).find(function(b){ return normNomEspace(b.n) === cible; });
  return {
    nom: nom,
    absences: absences,
    pointages: pointages,
    bradford: bd ? { S: bd.S || 0, D: bd.D || 0, sc: bd.sc || 0, T: bd.T || [0,0,0,0] } : null
  };
}

function publierEspacesPersonnels(){
  if(!db || !currentUser || currentUser.role !== 'admin') return Promise.resolve(0);
  if(!ABS_CHARGEES || !ESPACE_PT_CHARGES) return Promise.resolve(0); // donnees completes requises
  if(typeof ACCOUNTS === 'undefined') return Promise.resolve(0);
  var updates = {}, n = 0;
  Object.keys(ACCOUNTS).forEach(function(empId){
    var acc = ACCOUNTS[empId];
    var emp = EMP.find(function(e){ return e.id === empId; });
    if(!acc || !acc.uid || !emp) return;
    var donnees = espaceCalculerPour(emp.n);
    var empreinte = JSON.stringify(donnees);
    if(ESPACE_PUBLIE[acc.uid] === empreinte) return;
    donnees.maj = new Date().toISOString();
    updates['espace/' + acc.uid] = donnees;
    ESPACE_PUBLIE[acc.uid] = empreinte;
    n++;
  });
  if(!n) return Promise.resolve(0);
  return db.ref().update(updates).then(function(){ return n; }, function(e){
    ESPACE_PUBLIE = {}; // nouvel essai complet au prochain changement
    console.warn('[Mon espace] publication refusee :', e && e.message);
    return 0;
  });
}

/* Regroupe les changements rapproches (import, chargement) en un seul envoi. */
function planifierPublicationEspaces(){
  if(!currentUser || currentUser.role !== 'admin') return;
  clearTimeout(ESPACE_MINUTERIE);
  ESPACE_MINUTERIE = setTimeout(publierEspacesPersonnels, 2000);
}
