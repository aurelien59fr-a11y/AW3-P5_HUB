/* ====================================================================
 * vues/ov-resume.js -- Cockpit "Vue d'ensemble" (mission refonte du 09/09/2026)
 * Agregateur visuel uniquement : ne recalcule aucune regle metier, relit les
 * globales et fonctions deja calculees ailleurs (EMP/ABS deja charges par
 * app.js, OV_ABSENTS_TODAY expose par vues/absences.js, ARRETS_DATA/BULK_DATA
 * deja charges par metier/arrets.js et metier/bulk.js, bulkCalc()/bulkJourProd()
 * /bulkDateISO() deja presents dans metier/bulk.js -- y compris la regle de
 * journee de production 05h->05h, reutilisee telle quelle, sans nouvelle regle).
 * Appele depuis vues/absences.js (buildTodayAbs), metier/arrets.js
 * (loadArretsInpak) et metier/bulk.js (loadBulkData) a chaque rafraichissement
 * de leurs donnees respectives -- comme le fait deja le Hub pour les autres
 * domaines agreges (ex: buildMonEspace() appele depuis le chargement des
 * formations). Toutes les lectures DOM sont protegees (aucune erreur si un
 * element n'existe pas encore).
 * ==================================================================== */

function buildOvResume(){
  // --- En-tete : prenom dynamique ---
  var greetEl = document.getElementById('ov-greet');
  if(greetEl){
    var emp = (typeof monEspaceTrouverEmpActuel === 'function') ? monEspaceTrouverEmpActuel() : null;
    var prenom = (emp && emp.n) ? emp.n.split(' ')[0] : ((typeof currentUser !== 'undefined' && currentUser && currentUser.nom) ? currentUser.nom.split(' ')[0] : '');
    greetEl.textContent = prenom ? ("Bonjour " + prenom + " - situation de l'equipe et de la production") : "Situation de l'equipe et de la production";
  }

  // --- Equipe / Absences (aujourd'hui si jour travaille, sinon prochain jour travaille -- cf. absences.js buildTodayAbs()) ---
  var teamVal = document.getElementById('ov-team-val');
  var teamMeta = document.getElementById('ov-team-meta');
  var absVal = document.getElementById('ov-abs-val');
  var absMeta = document.getElementById('ov-abs-meta');
  if(typeof EMP !== 'undefined' && EMP.length){
    var absToday = (typeof window.OV_ABSENTS_TODAY === 'number') ? window.OV_ABSENTS_TODAY : 0;
    var present = Math.max(0, EMP.length - absToday);
    if(teamVal) teamVal.textContent = present + '/' + EMP.length;
    if(teamMeta) teamMeta.textContent = present + ' presents';
    if(absVal) absVal.textContent = absToday;
    if(absMeta) absMeta.textContent = (window.OV_ABSENTS_IS_TODAY === false) ? 'prochain jour travaille' : "aujourd'hui";
    var absNamesEl = document.getElementById('ov-abs-names');
    if(absNamesEl){
      var list = Array.isArray(window.OV_ABSENTS_LIST) ? window.OV_ABSENTS_LIST : [];
      absNamesEl.innerHTML = list.map(function(a){
        var tc = a.t==='ziek' ? '#ef4444' : a.t==='verlof' ? '#3b82f6' : '#10b981';
        var tl = a.t==='ziek' ? 'Maladie' : a.t==='verlof' ? 'Conge' : 'Recup';
        var fn = a.n.split(' ')[0];
        return '<span style="font-size:11px;padding:2px 8px;border-radius:99px;background:'+tc+'22;color:'+tc+';border:1px solid '+tc+'55;white-space:nowrap">'+fn+' &middot; '+tl+'</span>';
      }).join('');
    }
  }

  // --- Production : Arrets Inpak (aujourd'hui, meme decoupage type/date/duree que buildArretsInpak) ---
  var arretsValEl = document.getElementById('ov-arrets-val');
  var arretsLineEl = document.getElementById('ov-arrets-line');
  if(arretsValEl && typeof ARRETS_DATA !== 'undefined' && ARRETS_DATA && typeof bulkDateISO === 'function'){
    var todayCal = bulkDateISO(new Date());
    var todays = Object.values(ARRETS_DATA).filter(function(a){ return a && a.type === 'avec_raison' && a.date === todayCal; });
    var totalMin = todays.reduce(function(s,a){ return s + (a.duree||0); }, 0);
    var parLigne = {};
    todays.forEach(function(a){ parLigne[a.ligne] = (parLigne[a.ligne]||0) + (a.duree||0); });
    var pire = null;
    Object.keys(parLigne).forEach(function(l){ if(!pire || parLigne[l] > parLigne[pire]) pire = l; });
    arretsValEl.textContent = totalMin + ' min';
    arretsLineEl.textContent = pire ? ("Ligne la plus impactee : " + pire + " - " + parLigne[pire] + " min") : "Aucun arret enregistre aujourd'hui";
  }

  // --- Production : Bulk & Bijlijn (journee de production en cours, regle 05h->05h de bulkJourProd/bulkCalc reutilisee telle quelle) ---
  var bulkValEl = document.getElementById('ov-bulk-val');
  var bijValEl = document.getElementById('ov-bij-val');
  if(bulkValEl && typeof BULK_DATA !== 'undefined' && typeof bulkCalc === 'function' && typeof bulkJourProd === 'function' && typeof bulkDateISO === 'function' && typeof bulkTon === 'function' && typeof bulkFmt === 'function'){
    var now = new Date();
    var nowIso = bulkDateISO(now) + 'T' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    var prodDay = bulkJourProd(nowIso);
    var res = bulkCalc(prodDay, prodDay, []);
    bulkValEl.textContent = bulkFmt(bulkTon(res.totaux.standaard), 1) + ' t';
    bijValEl.textContent = 'Bijlijn ' + bulkFmt(bulkTon(res.totaux.bijlijn1), 1) + ' t';
  }
}
