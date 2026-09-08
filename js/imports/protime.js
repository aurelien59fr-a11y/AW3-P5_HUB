/* imports/protime.js -- import manuel des pointages et absences depuis Protime
   (copier-coller du JSON genere par le script externe).
   Extrait de app.js a l'Etape 10 du plan Phase 2. Code d'import actuel deplace
   tel quel -- sans automatisation, sans API, sans cron (points 14, 15, 19 du
   prompt initial).

   Regroupe les 13 fonctions du cluster d'import Protime (14eme fonction,
   ptKey, deplacee dans imports/base.js car partagee avec imports/grafana.js).
   Cluster documente dans vues/pointages.js (commentaire d'en-tete) a l'Etape 9. */

// --- Détection semaines manquantes après import ---
function detectMissingWeeks(importedData){
  if(!importedData||!importedData.employees||!importedData.employees.length) return;
  var allDates=importedData.employees.reduce(function(acc,emp){
    emp.days.forEach(function(d){if(acc.indexOf(d.date)===-1)acc.push(d.date);});
    return acc;
  },[]).sort();
  if(!allDates.length) return;
  // Trouver les gaps de plus de 9 jours (une semaine manquante = ~7j)
  var gaps=[];
  for(var i=1;i<allDates.length;i++){
    var a=new Date(allDates[i-1]),b=new Date(allDates[i]);
    var diff=(b-a)/(1000*60*60*24);
    if(diff>9) gaps.push({from:allDates[i-1],to:allDates[i],days:Math.round(diff)});
  }
  if(gaps.length){
    var msg='⚠ '+gaps.length+' semaine(s) potentiellement manquante(s) :\n'+gaps.map(function(g){return g.from+' → '+g.to+' ('+g.days+'j)';}).join('\n');
    toast(msg,'#f59e0b');
    console.warn('[Protime] Semaines manquantes détectées :',gaps);
  }
}

// ---- IMPORT PROTIME ----
// Table de correspondance personReference Protime -> nom exact dans EMP/SHIFTS.
// A completer/corriger au fil des imports si Protime ajoute des personnes
// ou si une orthographe ne correspond pas.
var PROTIME_PERSON_MAP = {
  118959: "Aurelien Turchi",
  133788: "Ramazani Abdulhassan",
  152746: "Anthony Raimondi",
  131719: "Brahim Akdim",
  140059: "Hakkim Akkouh",
  131713: "Halima Laadi",
  111217: "Julien Demuyter",
  116256: "Lachen Baraik",
  130245: "Larissa Fratutescu",
  126491: "Lyse Musik",
  120965: "Balan Marius",
  91855:  "Max Secember",
  156883: "Mohamed Lalaoui",
  101076: "Monir Salmi",
  125602: "Nicolas Fettu"
};

var protimeImportData = null;

function parseProtimeJson(){
  var raw = document.getElementById('protime-paste').value.trim();
  if(!raw){ toast('Colle d\'abord le JSON depuis Protime','#f59e0b'); return null; }
  try{
    return JSON.parse(raw);
  }catch(e){
    toast('JSON invalide - recopie depuis la console Protime','#ef4444');
    return null;
  }
}

// Convertit une date Protime "2026-07-04" vers le format dashboard "04/07"
function protimeDateToDDMM(isoDate){
  var parts = isoDate.split('-');
  return parts[2] + '/' + parts[1];
}

// Determine l'annee dashboard (2025/2026/2027) a partir d'une date ISO
function protimeDateToYear(isoDate){
  return isoDate.split('-')[0];
}

function previewProtimeImport(){
  var data = parseProtimeJson();
  if(!data || !data.employees){
    toast('Structure JSON inattendue (champ employees manquant)','#ef4444');
    return;
  }

  var matched = 0, unmatched = [], totalDays = 0, changedDays = 0;
  var unmappedShortLabels = [];

  data.employees.forEach(function(emp){
    var dashName = PROTIME_PERSON_MAP[emp.personReference];
    if(!dashName){
      unmatched.push(emp.firstName + ' ' + emp.lastName + ' (ref ' + emp.personReference + ')');
      return;
    }
    matched++;
    emp.days.forEach(function(d){
      totalDays++;
      if(d.value !== null) changedDays++;
      if(d.source === 'absence_unknown' && unmappedShortLabels.indexOf(d.raw) === -1){
        unmappedShortLabels.push(d.raw);
      }
    });
  });

  var html = '<div><b style="color:var(--green)">' + matched + '</b> employes reconnus sur ' + data.employees.length + '</div>';
  html += '<div style="margin-top:4px"><b>' + changedDays + '</b> jours avec une donnee a appliquer sur ' + totalDays + ' jours lus</div>';
  if(unmatched.length){
    html += '<div style="margin-top:8px;color:var(--red)">Non reconnus : ' + unmatched.join(', ') + '</div>';
  }
  if(unmappedShortLabels.length){
    html += '<div style="margin-top:8px;color:var(--amber)">Codes absence inconnus : ' + unmappedShortLabels.join(', ') + ' (ignores pour l\'instant)</div>';
  }

  var prev = document.getElementById('protime-preview');
  prev.style.display = 'block';
  prev.innerHTML = html;

  protimeImportData = data;
  var btn = document.getElementById('protime-apply-btn');
  if(matched > 0){
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

function purgeAllProtimeAbsences(){
  if(!canEdit()) return;
  if(!confirm("Cette action va supprimer TOUTES les absences importées depuis Protime (ziek, verlof, recup). Les postes du planning ne sont pas touchés. Relance ensuite un import Protime complet pour tout reconstituer proprement. Continuer ?")) return;
  var before = ABS.length;
  for(var k=ABS.length-1;k>=0;k--){
    var t=ABS[k].t;
    if(t==='ziek'||t==='verlof'||t==='recup'||!t) ABS.splice(k,1);
  }
  var removed = before - ABS.length;
  recalc(); buildBT(); updKPI(); refreshCharts();
  if(document.querySelector('.fb.on')) buildAbs(document.querySelector('.fb.on').dataset.f);
  updAbsLbl(); buildMiniCal(); save();
  toast(removed + ' absences supprimées — relance maintenant l\'import Protime', '#f59e0b');
}

function purgeUntypedAbsences(){
  if(!canEdit()){ return; }
  if(!confirm("Cette action va supprimer toutes les absences sans type connu (ziek/verlof/recup), c'est-a-dire les entrees importees avant la mise a jour du systeme. Elles n'apparaissent plus correctement dans Bradford de toute facon. Relance un import Protime juste apres pour tout reconstituer avec le bon type. Continuer ?")) return;

  var before = ABS.length;
  for(var k=ABS.length-1;k>=0;k--){
    if(!ABS[k].t){ ABS.splice(k,1); }
  }
  var removed = before - ABS.length;

  recalc(); buildBT(); updKPI(); refreshCharts();
  if(document.querySelector('.fb.on')) buildAbs(document.querySelector('.fb.on').dataset.f);
  updAbsLbl();
  save();

  toast(removed + ' entrees sans type supprimees - relance maintenant un import Protime propre', '#f59e0b');
}

function purgeProtimeAbsences(){
  if(!canEdit()){ return; }
  if(!confirm("Cette action va supprimer toutes les absences enregistrees comme des periodes d'un seul jour (le symptome du bug d'import precedent). Les vraies absences manuelles d'un seul jour seront aussi supprimees, mais tu pourras relancer un import Protime propre juste apres pour tout reconstituer correctement avec les periodes regroupees. Continuer ?")) return;

  var before = ABS.length;
  for(var k=ABS.length-1;k>=0;k--){
    if(ABS[k].d===1){ ABS.splice(k,1); }
  }
  var removed = before - ABS.length;

  recalc(); buildBT(); updKPI(); refreshCharts();
  if(document.querySelector('.fb.on')) buildAbs(document.querySelector('.fb.on').dataset.f);
  updAbsLbl();
  save();

  toast(removed + ' entrees d\'un jour supprimees - relance maintenant un import Protime propre', '#f59e0b');
}

function applyProtimeImport(){
  if(!protimeImportData){ toast('Clique d\'abord sur Verifier','#f59e0b'); return; }
  if(!canEdit()){ return; }

  var applied = 0;
  var ALLOWED_VALUES = ['ziek','verlof','recup'];

  protimeImportData.employees.forEach(function(emp){
    var dashName = PROTIME_PERSON_MAP[emp.personReference];
    if(!dashName) return;

    // Etape 1 : appliquer chaque jour au planning (SHIFTS), comme avant.
    // On retient au passage la liste ordonnee des jours d'absence par
    // personne, pour pouvoir ensuite les regrouper en periodes.
    var absenceDays = []; // {date: 'YYYY-MM-DD', value, ddmm, year}

    emp.days.forEach(function(d){
      if(d.value === null) return; // jour de repos ou code inconnu, on ne touche pas
      if(ALLOWED_VALUES.indexOf(d.value) === -1) return; // garde-fou : on ne touche jamais a un poste (31/32 etc.)

      var year = protimeDateToYear(d.date);
      var ddmm = protimeDateToDDMM(d.date);
      var shifts = year==='2027' ? SHIFTS27 : year==='2026' ? SHIFTS26 : SHIFTS25;
      var weeks = year==='2027' ? WEEKS27 : year==='2026' ? WEEKS26 : WEEKS25;
      var allDatesYear = weeks.reduce(function(a,w){return a.concat(w.d);},[]);
      var dayIdx = allDatesYear.indexOf(ddmm);
      if(dayIdx === -1) return; // date hors planning (ex: 24/12, 31/12 exclus)

      var empShifts = shifts.find(function(e){return e.n===dashName;});
      if(!empShifts) return;

      while(empShifts.s.length <= dayIdx) empShifts.s.push('');
      empShifts.s[dayIdx] = d.value;
      applied++;

      absenceDays.push({date:d.date, value:d.value, ddmm:ddmm, year:year});
    });

    // Etape 2 : regrouper les jours d'absence de meme type en periodes.
    // IMPORTANT : le planning Agristo ne contient que certains jours (ex: sam+lun),
    // donc un arret continu de 9 jours calendrier peut n'avoir que 4 entrees dans
    // absenceDays (22/03, 28/03...). On considere deux entrees comme appartenant
    // au MEME episode si le gap entre elles ne contient aucun jour present dans
    // le planning Agristo (= jours non travailles, donc l'absence couvre bien
    // tout l'intervalle).
    if(!absenceDays.length) return;

    absenceDays.sort(function(a,b){return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;});

    // Construire un Set de toutes les dates du planning annee courante pour test rapide
    var allPlannedDates2025 = WEEKS25.reduce(function(a,w){return a.concat(w.d);},[]);
    var allPlannedDates2026 = WEEKS26.reduce(function(a,w){return a.concat(w.d);},[]);
    var allPlannedDates2027 = WEEKS27.reduce(function(a,w){return a.concat(w.d);},[]);
    function isPlannedDay(isoDate){
      var dt = new Date(isoDate);
      var dd = String(dt.getDate()).padStart(2,'0');
      var mm = String(dt.getMonth()+1).padStart(2,'0');
      var ddmm = dd+'/'+mm;
      var yr = String(dt.getFullYear());
      var arr = yr==='2027'?allPlannedDates2027:yr==='2026'?allPlannedDates2026:allPlannedDates2025;
      return arr.indexOf(ddmm) !== -1;
    }
    function gapContainsWorkDay(isoA, isoB){
      // Retourne true si au moins un jour planifie existe ENTRE isoA et isoB (exclus)
      var d = new Date(isoA); d.setDate(d.getDate()+1);
      var end = new Date(isoB);
      while(d < end){
        if(isPlannedDay(d.toISOString().slice(0,10))) return true;
        d.setDate(d.getDate()+1);
      }
      return false;
    }

    var periods = [];
    var cur = null;
    absenceDays.forEach(function(d){
      if(cur && cur.value===d.value && !gapContainsWorkDay(cur.lastISO, d.date)){
        // Meme type + pas de jour travaille entre les deux -> meme episode
        cur.lastISO = d.date; cur.lastDDMM = d.ddmm; cur.lastYear = d.year; cur.count++;
      } else {
        if(cur) periods.push(cur);
        cur = {value:d.value, firstISO:d.date, firstDDMM:d.ddmm, firstYear:d.year, lastISO:d.date, lastDDMM:d.ddmm, lastYear:d.year, count:1};
      }
    });
    if(cur) periods.push(cur);

    // Etape 3 : pour chaque periode regroupee, retirer toute ancienne
    // entree ABS de cette personne qui chevauche les memes dates (pour
    // eviter les doublons en cas de re-import), puis ajouter une seule
    // entree couvrant la periode entiere.
    periods.forEach(function(p){
      var dateA = p.firstDDMM + '/' + p.firstYear;
      var dateB = p.lastDDMM + '/' + p.lastYear;

      for(var k=ABS.length-1;k>=0;k--){
        if(ABS[k].n===dashName && ABS[k].a===dateA && ABS[k].b===dateB){ ABS.splice(k,1); }
      }

      ABS.push({n:dashName, a:dateA, b:dateB, d:p.count, y:p.lastYear, t:p.value, ts:Date.now()});
    });
  });

  recalc(); buildBT(); updKPI(); refreshCharts(); buildPT();
  if(document.querySelector('.fb.on')) buildAbs(document.querySelector('.fb.on').dataset.f);
  updAbsLbl();
  save();

  var nowTs=new Date().toISOString();
  if(db) db.ref('bradford/import_ts').set(nowTs);
  document.getElementById('protime-status').textContent = applied + ' jours importes le ' + new Date().toLocaleString('fr-BE');
  document.getElementById('protime-status').style.color = 'var(--green)';
  detectMissingWeeks(protimeImportData);
  buildMiniCal();
  document.getElementById('protime-paste').value = '';
  document.getElementById('protime-preview').style.display = 'none';
  document.getElementById('protime-apply-btn').disabled = true;
  document.getElementById('protime-apply-btn').style.opacity = '.5';
  protimeImportData = null;

  toast(applied + ' jours mis a jour depuis Protime', '#10b981');
}

// Charger depuis Firebase au démarrage

function loadPointages(){
  if(!db) return;
  db.ref('pointages').on('value', function(snap){
    var data = snap.val();
    PT_DATA = data || {};
    buildPT2();
    updPointagesBanner();
  }, function(error){
    console.error('[Pointages] Erreur de lecture Firebase :', error);
    toast('Pointages : accès Firebase refusé (' + error.message + ')', '#ef4444');
  });
}

// Générer une clé unique pour une anomalie
// Rapproche un nom Protime ("Abdulhassan Ramazani") avec un nom du
// dashboard ("Ramazani Abdulhassan") — l'ordre prenom/nom differe entre
// les deux systemes, donc on compare les mots un par un, peu importe l'ordre.
function matchNomProtime(nomProtime){
  var motsProtime = nomProtime.toLowerCase().split(/\s+/).sort().join(' ');
  var trouve = EMP.find(function(e){
    var motsEmp = e.n.toLowerCase().split(/\s+/).sort().join(' ');
    return motsEmp === motsProtime;
  });
  return trouve ? trouve.n : null;
}

// Classe une absence Protime en ziek/verlof/recup a partir du titre/detail/groupe
function classifierTypeAbsence(titre, detail, groupe){
  var texte = ((titre||'') + ' ' + (detail||'') + ' ' + (groupe||'')).toLowerCase();
  if(/ziek|maladie|sick/.test(texte)) return 'ziek';
  if(/recup|compensation/.test(texte)) return 'recup';
  if(/verlof|cong|vacation|vakantie/.test(texte)) return 'verlof';
  return null; // type inconnu : on ignore plutot que de deviner
}

// Importe les absences Protime : remplit directement les cases du planning
// (ziek/verlof/recup) et regroupe en periodes pour le tableau ABS (Bradford)
function importerAbsencesProtime(absences){
  var parPersonneType = {}; // "nom|type" -> [dateISO, ...]
  var casesRemplies = 0, nomsNonTrouves = {}, typesInconnus = 0;

  absences.forEach(function(a){
    var nomDashboard = matchNomProtime(a.nom);
    if(!nomDashboard){ nomsNonTrouves[a.nom] = true; return; }
    var type = classifierTypeAbsence(a.titre, a.detail, a.groupe);
    if(!type){ typesInconnus++; return; }

    // Remplir directement la case du planning ce jour-la
    var pos = indexPourDate(a.date);
    if(pos.idx !== -1){
      var shiftsAnnee = pos.year==='2027'?SHIFTS27:pos.year==='2026'?SHIFTS26:SHIFTS25;
      var empShift = shiftsAnnee.find(function(e){ return e.n === nomDashboard; });
      if(empShift){ empShift.s[pos.idx] = type; casesRemplies++; }
    }

    var cle = nomDashboard + '|' + type;
    if(!parPersonneType[cle]) parPersonneType[cle] = [];
    parPersonneType[cle].push(a.date);
  });

  // Regrouper les dates consecutives en periodes pour le tableau ABS
  var nouvellesAbs = [];
  Object.keys(parPersonneType).forEach(function(cle){
    var parts = cle.split('|');
    var nom = parts[0], type = parts[1];
    var dates = parPersonneType[cle].slice().sort();
    var i = 0;
    while(i < dates.length){
      var debut = dates[i];
      var fin = debut;
      while(i + 1 < dates.length){
        var d1 = new Date(fin + 'T00:00:00');
        var d2 = new Date(dates[i+1] + 'T00:00:00');
        if((d2 - d1) / 86400000 <= 3){ fin = dates[i+1]; i++; } // tolere les jours non-travailles entre 2 jours de planning
        else break;
      }
      var nbJours = Math.round((new Date(fin+'T00:00:00') - new Date(debut+'T00:00:00')) / 86400000) + 1;
      nouvellesAbs.push({ n: nom, a: dateISOtoFR(debut), b: dateISOtoFR(fin), d: nbJours, y: debut.slice(0,4), t: type, ts: Date.now() });
      i++;
    }
  });

  // Fusionner avec l'existant : on remplace les periodes qui se recoupent
  // exactement (meme personne+type+debut), on ajoute le reste.
  nouvellesAbs.forEach(function(nouvelle){
    var idxExistant = ABS.findIndex(function(old){ return old.n === nouvelle.n && old.t === nouvelle.t && old.a === nouvelle.a; });
    if(idxExistant !== -1) ABS[idxExistant] = nouvelle;
    else ABS.push(nouvelle);
  });

  return {
    casesRemplies: casesRemplies,
    periodesCreees: nouvellesAbs.length,
    nomsNonTrouves: Object.keys(nomsNonTrouves),
    typesInconnus: typesInconnus
  };
}
