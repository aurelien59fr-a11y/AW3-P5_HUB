/* ============================================================
   Domaine Bulk / Bijlijn — Calculs
   Deplace tel quel depuis app.js (Etape 8 de la Phase 2), sans
   modification de comportement.

   loadBulkData() est l'ecouteur Firebase 'bulk_data' : il recoit les
   donnees brutes (BULK_DATA) puis appelle buildBulkSections()
   (vues/bulk.js) pour rafraichir l'affichage — meme schema que
   loadArretsInpak() (metier/arrets.js, etape 6) et loadNCPData()
   (metier/ncp.js, etape 7).

   Bulk est le domaine ou calcul et rendu etaient deja le plus
   nettement separes dans le code d'origine (note du plan Phase 2) :
   aucune IIFE de redefinition (motif rencontre a l'etape 7 pour NCP)
   n'a ete trouvee pour ce domaine — verifie par recherche exhaustive
   de tout "bulkXxx = function" / "var bulkXxx = function" sur le
   fichier entier.
============================================================ */

var BULK_DATA = null;

function loadBulkData(){
  if(!db) return;
  db.ref('bulk_data').on('value', function(snap){
    BULK_DATA = snap.val() || null;
    buildBulkSections();
  }, function(error){
    console.error('[Bulk] Erreur de lecture Firebase :', error);
  });
}

var BULK_EQ = ['P1','P2','P3','P4','P5'];

function bulkTxt(cle, defaut){
  try { if(typeof t === 'function'){ var v = t(cle); if(v && v !== cle) return v; } } catch(e){}
  return defaut;
}

function bulkNum(v){ var n = (typeof v === 'number') ? v : parseFloat(v); return isFinite(n) ? n : 0; }

function bulkTon(kg){ return bulkNum(kg) / 1000; }

function bulkFmt(v, dec){
  if(dec === undefined) dec = 1;
  if(v === null || v === undefined || !isFinite(v)) return '-';
  return Number(v).toLocaleString('fr-FR', { minimumFractionDigits:dec, maximumFractionDigits:dec });
}

function bulkKgH(tonnes, heures){ return heures > 0 ? (tonnes * 1000 / heures) : null; }

function bulkDateISO(d){
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function bulkJourProd(iso){
  var j = String(iso).slice(0,10);
  var h = parseInt(String(iso).slice(11,13), 10);
  if(!isFinite(h) || h >= 5) return j;
  return bulkDecalerJour(j, -1);
}

function bulkJourCourt(iso){
  var p = String(iso).split('-');
  return (p.length === 3) ? (p[2] + '/' + p[1]) : String(iso);
}

function bulkDecalerJour(iso, n){
  var d = new Date(String(iso) + 'T12:00:00');
  if(isNaN(d.getTime())) return iso;
  d.setDate(d.getDate() + n);
  return bulkDateISO(d);
}

function bulkNbJours(d1, d2){
  var a = new Date(String(d1) + 'T12:00:00'), b = new Date(String(d2) + 'T12:00:00');
  if(isNaN(a.getTime()) || isNaN(b.getTime())) return 0;
  return Math.round((b - a) / 86400000) + 1;
}

function bulkDansPeriode(h){
  if(!h) return false;
  var j = bulkJourProd(h);
  if(BULK_DATE_DEBUT && j < BULK_DATE_DEBUT) return false;
  if(BULK_DATE_FIN && j > BULK_DATE_FIN) return false;
  return true;
}

function bulkBornesDonnees(){
  var min = null, max = null;
  ['standaard','noodafvoer','bijlijn1'].forEach(function(cle){
    var serie = (BULK_DATA && BULK_DATA[cle]) || [];
    serie.forEach(function(p){
      if(!p || !p.heure) return;
      var j = bulkJourProd(p.heure);
      if(min === null || j < min) min = j;
      if(max === null || j > max) max = j;
    });
  });
  return { min:min, max:max };
}

var _bulkPosteCache = {};

function bulkHeuresPoste(dDebut, dFin){
  var cle = dDebut + '>' + dFin;
  if(_bulkPosteCache[cle]) return _bulkPosteCache[cle];
  var h = {};
  BULK_EQ.forEach(function(e){ h[e] = 0; });
  if(!dDebut || !dFin) return h;
  var d = new Date(String(dDebut) + 'T12:00:00');
  var fin = new Date(String(dFin) + 'T12:00:00');
  if(isNaN(d.getTime()) || isNaN(fin.getTime())) return h;
  var garde = 0;
  var compte = function(jourCal, i){
    var eq = (typeof equipeReelle === 'function') ? equipeReelle(jourCal, (i < 10 ? '0' : '') + i + ':00') : null;
    if(eq && h[eq] !== undefined) h[eq]++;
  };
  while(d <= fin && garde++ < 3000){
    var jour = bulkDateISO(d);
    var lendemain = bulkDecalerJour(jour, 1);
    for(var i = 5; i < 24; i++) compte(jour, i);      /* 05h -> 23h du jour */
    for(var k = 0; k < 5; k++) compte(lendemain, k);  /* 00h -> 04h du lendemain */
    d.setDate(d.getDate() + 1);
  }
  _bulkPosteCache[cle] = h;
  return h;
}

function bulkCalc(dDebut, dFin, eqFiltre){
  var res = {
    jours:{}, ordreJours:[], parEquipe:{},
    totaux:{ standaard:0, noodafvoer:0, bijlijn1:0 },
    heuresBulk:0, heuresBij:0, heuresPoste:0, nbPoints:0
  };
  BULK_EQ.forEach(function(e){ res.parEquipe[e] = { standaard:0, noodafvoer:0, bijlijn1:0, hBulk:0, hBij:0, hPoste:0 }; });
  var poste = bulkHeuresPoste(dDebut, dFin);
  BULK_EQ.forEach(function(e){
    res.parEquipe[e].hPoste = poste[e] || 0;
    if(equipeDansSel(eqFiltre, e)) res.heuresPoste += (poste[e] || 0);
  });
  if(!BULK_DATA) return res;
  var slots = { bulk:{}, bij:{} };
  ['standaard','noodafvoer','bijlijn1'].forEach(function(cle){
    var serie = BULK_DATA[cle] || [];
    serie.forEach(function(p){
      if(!p || !p.heure) return;
      var brut = String(p.heure);
      var cal = brut.slice(0,10);
      var jour = bulkJourProd(brut);   /* journee de production 05h -> 05h */
      if(dDebut && jour < dDebut) return;
      if(dFin && jour > dFin) return;
      var heure = brut.slice(11,16);
      var eq = (typeof equipeReelle === 'function') ? equipeReelle(cal, heure) : null;
      if(!equipeDansSel(eqFiltre, eq)) return;
      var v = bulkNum(p.valeur);
      if(!res.jours[jour]){
        res.jours[jour] = { standaard:0, noodafvoer:0, bijlijn1:0, equipes:{} };
        res.ordreJours.push(jour);
      }
      res.jours[jour][cle] += v;
      if(eq) res.jours[jour].equipes[eq] = true;
      res.totaux[cle] += v;
      res.nbPoints++;
      if(eq && res.parEquipe[eq]) res.parEquipe[eq][cle] += v;
      var groupe = (cle === 'bijlijn1') ? 'bij' : 'bulk';
      var k = cal + '|' + heure;
      if(!slots[groupe][k]){
        slots[groupe][k] = 1;
        if(groupe === 'bij'){
          res.heuresBij++;
          if(eq && res.parEquipe[eq]) res.parEquipe[eq].hBij++;
        } else {
          res.heuresBulk++;
          if(eq && res.parEquipe[eq]) res.parEquipe[eq].hBulk++;
        }
      }
    });
  });
  res.ordreJours.sort();
  return res;
}

function bulkSousTitreActivite(hFait, hPoste){
  return bulkFmt(hFait,0) + ' ' + bulkTxt('arr_bulk_h_sur','h sur') + ' '
    + bulkFmt(hPoste,0) + ' ' + bulkTxt('arr_bulk_h_poste','h de poste');
}

function bulkChartOpts(empile){
  return {
    responsive:true,
    maintainAspectRatio:false,
    interaction:{ mode:'index', intersect:false },
    plugins:{
      legend:{ display:true, position:'top', labels:{ boxWidth:10, boxHeight:10, usePointStyle:true, font:{ size:11 } } },
      tooltip:{ callbacks:{ label:function(c){ return c.dataset.label + ' : ' + bulkFmt(c.parsed.y,2) + ' t'; } } }
    },
    scales:{
      x:{ stacked:!!empile, grid:{ display:false }, ticks:{ font:{ size:10 }, maxRotation:0, autoSkip:true, maxTicksLimit:14 } },
      y:{ stacked:!!empile, beginAtZero:true, grid:{ color:'rgba(128,128,128,.12)' },
          ticks:{ font:{ size:10 }, callback:function(v){ return bulkFmt(v,0) + ' t'; } } }
    }
  };
}
