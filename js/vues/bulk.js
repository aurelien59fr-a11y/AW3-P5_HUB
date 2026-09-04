/* ============================================================
   Domaine Bulk / Bijlijn — Rendu et interactions
   Deplace tel quel depuis app.js (Etape 8 de la Phase 2), sans
   modification de comportement.

   Quatre fonctions reclassifiees de "metier" (premier tri automatique
   par marqueurs DOM/HTML) vers "vue" apres revue manuelle : ce sont de
   purs relais qui changent un etat local puis appellent
   buildBulkSections() pour tout re-rendre, sans aucun calcul propre —
   buildArretsBulkChart, buildArretsBulkEquipeChart, bulkSauverUnite,
   filtrerBulkEquipe (celle-ci modifie en plus directement le DOM via
   majPastillesEquipe avant de rafraichir). Meme famille que les onze
   reclassifications NCP de l'etape 7 (gestionnaires d'action
   utilisateur qui delegvent le rendu).

   importerBulk() / openImportBulkModal() sont extraites ICI (et non
   differees comme importerNCP()/importerArretsInpak()) : le plan ne
   liste que quatre fichiers d'import pour l'etape 10 (base, protime,
   grafana, ncp) — Bulk n'y figure pas.

   buildArretsBulkChart()/buildArretsBulkEquipeChart() : malgre leur
   nom, ce sont de purs relais vers buildBulkSections() — deja
   identifiees a l'etape 6 comme appartenant au domaine Bulk et non
   Arrets (nommage historique trompeur, non corrige ici pour respecter
   "aucun changement de comportement").
============================================================ */

var BULK_DATE_DEBUT = '';

var BULK_DATE_FIN = '';

var _arretsBulkChart = null;

var _arretsBulkEquipeChart = null;

function openImportBulkModal(){
  document.getElementById('bulk-import-modal').style.display = 'flex';
  document.getElementById('bulk-import-err').textContent = '';
}

function importerBulk(){
  var err = document.getElementById('bulk-import-err');
  err.textContent = '';
  var raw = document.getElementById('bulk-import-txt').value.trim();
  if(!raw){ err.textContent = 'Colle le JSON genere par le script.'; return; }

  var parsed;
  try { parsed = JSON.parse(raw); }
  catch(e){ err.textContent = 'JSON invalide : ' + e.message; return; }

  if(!parsed.standaard && !parsed.noodafvoer && !parsed.bijlijn1){
    err.textContent = 'Format inattendu (cles "standaard"/"noodafvoer"/"bijlijn1" manquantes).';
    return;
  }
  if(!db){ err.textContent = 'Connexion Firebase non disponible.'; return; }

  // On garde l'unite deja enregistree si le fichier importe n'en precise pas
  if(!parsed.unite && BULK_DATA && BULK_DATA.unite) parsed.unite = BULK_DATA.unite;

  err.style.color = '#3b82f6';
  err.textContent = 'Import en cours...';
  db.ref('bulk_data').set(parsed).then(function(){
    document.getElementById('bulk-import-modal').style.display = 'none';
    document.getElementById('bulk-import-txt').value = '';
    err.style.color = '#ef4444';
    err.textContent = '';
    var n = (parsed.standaard||[]).length + (parsed.noodafvoer||[]).length + (parsed.bijlijn1||[]).length;
    toast(n + ' points importes (Bulkopvang + Bijlijn)', '#10b981');
  }).catch(function(e){
    err.textContent = 'Erreur Firebase : ' + e.message;
  });
}

var BULK_EQUIPE_FILTRE = [];

function filtrerBulkEquipe(equipe){
  BULK_EQUIPE_FILTRE = basculerEquipe(BULK_EQUIPE_FILTRE, equipe);
  majPastillesEquipe('.bulk-equipe-btn', BULK_EQUIPE_FILTRE);
  buildBulkSections();
}

var BULK_COUL = { standaard:'#3b82f6', noodafvoer:'#ef4444', bijlijn1:'#10b981' };

function bulkCarteKpi(label, valeur, sousTitre, couleur){
  return '<div style="background:var(--bg3);border:1px solid var(--bd2);border-radius:var(--r);padding:12px 14px">'
    + '<div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--tx3);margin-bottom:6px">' + label + '</div>'
    + '<div style="font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;color:' + (couleur || 'var(--tx)') + '">' + valeur + '</div>'
    + (sousTitre ? '<div style="font-size:11px;color:var(--tx3);margin-top:5px">' + sousTitre + '</div>' : '')
    + '</div>';
}

function bulkDelta(courant, precedent, hausseEstBonne){
  if(!precedent) return '';
  var d = ((courant - precedent) / precedent) * 100;
  if(!isFinite(d)) return '';
  var bon = hausseEstBonne ? (d >= 0) : (d < 0);
  var coul = bon ? '#10b981' : '#ef4444';
  var signe = d >= 0 ? '+' : '';
  return '<span style="color:' + coul + ';font-weight:600">' + signe + bulkFmt(d,1) + '&nbsp;%</span> '
    + bulkTxt('arr_bulk_vs_prec','vs periode precedente');
}

function bulkRendreKpiSur(cur, prec){
  var wrap = document.getElementById('bulk-kpi-sur');
  if(!wrap) return;
  var sur = bulkTon(cur.totaux.standaard);
  var nood = bulkTon(cur.totaux.noodafvoer);
  var tot = sur + nood;
  var pSur = bulkTon(prec.totaux.standaard);
  var pNood = bulkTon(prec.totaux.noodafvoer);
  var nbJours = cur.ordreJours.length;
  var actif = cur.heuresPoste > 0 ? (cur.heuresBulk / cur.heuresPoste) * 100 : null;
  var html = '';
  html += bulkCarteKpi(bulkTxt('arr_bulk_k_std','Surproduction'), bulkFmt(sur,1) + ' t',
            bulkDelta(sur, pSur, false), BULK_COUL.standaard);
  html += bulkCarteKpi(bulkTxt('arr_bulk_k_urg','Noodafvoer'), bulkFmt(nood,1) + ' t',
            bulkDelta(nood, pNood, false), BULK_COUL.noodafvoer);
  html += bulkCarteKpi(bulkTxt('arr_bulk_k_tot','Total bulk'), bulkFmt(tot,1) + ' t',
            (nbJours > 0 ? bulkFmt(tot / nbJours,1) + ' t ' + bulkTxt('arr_bulk_par_jour','par jour avec releve') : ''), 'var(--tx)');
  html += bulkCarteKpi(bulkTxt('arr_bulk_k_activite','Activite'),
            (actif === null ? '-' : bulkFmt(actif,1) + ' %'),
            bulkSousTitreActivite(cur.heuresBulk, cur.heuresPoste), 'var(--tx)');
  wrap.innerHTML = html;
}

function bulkRendreKpiBij(cur, prec){
  var wrap = document.getElementById('bulk-kpi-bij');
  if(!wrap) return;
  var bij = bulkTon(cur.totaux.bijlijn1);
  var pBij = bulkTon(prec.totaux.bijlijn1);
  var nbJours = cur.ordreJours.length;
  var actif = cur.heuresPoste > 0 ? (cur.heuresBij / cur.heuresPoste) * 100 : null;
  var moy = bulkKgH(bij, cur.heuresPoste);
  var html = '';
  html += bulkCarteKpi(bulkTxt('arr_bulk_k_bij','Bijlijn emballe'), bulkFmt(bij,1) + ' t',
            bulkDelta(bij, pBij, true), BULK_COUL.bijlijn1);
  html += bulkCarteKpi(bulkTxt('arr_bulk_k_activite','Activite'),
            (actif === null ? '-' : bulkFmt(actif,1) + ' %'),
            bulkSousTitreActivite(cur.heuresBij, cur.heuresPoste), 'var(--tx)');
  html += bulkCarteKpi(bulkTxt('arr_bulk_k_moy','Moyenne'),
            (moy === null ? '-' : bulkFmt(moy,0) + ' kg/h'),
            (nbJours > 0 ? bulkFmt(bij / nbJours,1) + ' t ' + bulkTxt('arr_bulk_par_jour','par jour avec releve') : ''), 'var(--tx)');
  wrap.innerHTML = html;
}

function bulkRendreMeta(cur, d1, d2, nbJours, eqFiltre, pDeb, pFin){
  var el = document.getElementById('bulk-meta');
  if(!el) return;
  var lignes = [];
  lignes.push('&#128197; <b>' + d1 + '</b> &rarr; <b>' + d2 + '</b> ('
    + nbJours + ' ' + bulkTxt('arr_bulk_jours','jours') + ') &nbsp;&middot;&nbsp; '
    + bulkTxt('arr_bulk_m_prec','periode de comparaison') + ' : ' + pDeb + ' &rarr; ' + pFin);

  var manquants = nbJours - cur.ordreJours.length;
  if(!(eqFiltre && eqFiltre.length) && manquants > 0){
    lignes.push('&#9888;&#65039; <span style="color:#f59e0b">' + manquants + ' '
      + bulkTxt('arr_bulk_m_trous','jour(s) sans aucun releve sur la periode') + '</span> &mdash; '
      + bulkTxt('arr_bulk_m_trous2','un jour a zero n\'est pas forcement une bonne journee, ce peut etre un import manquant.'));
  }

  var record = null;
  cur.ordreJours.forEach(function(j){
    var v = cur.jours[j].standaard + cur.jours[j].noodafvoer;
    if(!record || v > record.v) record = { j:j, v:v, eq:Object.keys(cur.jours[j].equipes).sort().join(', ') };
  });
  if(record && record.v > 0){
    lignes.push('&#127942; ' + bulkTxt('arr_bulk_m_rec','Jour le plus charge en bulk') + ' : <b>' + record.j + '</b> avec <b>'
      + bulkFmt(bulkTon(record.v),1) + ' t</b>' + (record.eq ? ' (' + bulkTxt('arr_bulk_equipes','equipes') + ' ' + record.eq + ')' : ''));
  }

  if(eqFiltre && eqFiltre.length){
    var pastilles = eqFiltre.slice().sort().map(function(e){
      var c = (typeof COULEURS_EQUIPE !== 'undefined' && COULEURS_EQUIPE[e]) ? COULEURS_EQUIPE[e] : 'var(--tx2)';
      return '<b style="color:' + c + '">' + e + '</b>';
    }).join(', ');
    lignes.push('&#128269; ' + bulkTxt('arr_bulk_m_eq','Filtre equipe actif') + ' : ' + pastilles
      + ' &mdash; ' + bulkTxt('arr_bulk_m_eq2','seuls les releves des heures ou la selection etait en poste sont comptes.'));
  }
  el.innerHTML = lignes.join('<br>');
}

function bulkLigneEquipe(eq, cellules, actif){
  var coul = (typeof COULEURS_EQUIPE !== 'undefined' && COULEURS_EQUIPE[eq]) ? COULEURS_EQUIPE[eq] : 'var(--tx2)';
  var html = '<tr style="border-bottom:1px solid var(--bd2);opacity:' + (actif ? '1' : '.32') + '">'
    + '<td style="padding:8px 6px;white-space:nowrap">'
    + '<span style="display:inline-block;width:9px;height:9px;border-radius:99px;background:' + coul + ';margin-right:7px"></span>'
    + '<b style="color:' + coul + '">' + eq + '</b></td>';
  cellules.forEach(function(c){
    html += '<td style="padding:8px 6px;text-align:right' + (c.fort ? ';font-weight:700' : '') + '">' + c.v + '</td>';
  });
  return html + '</tr>';
}

function bulkLigneTotal(cellules){
  var html = '<tr style="border-top:2px solid var(--bd2)">'
    + '<td style="padding:9px 6px;font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:.05em">'
    + bulkTxt('arr_bulk_total','Total') + '</td>';
  cellules.forEach(function(c){
    html += '<td style="padding:9px 6px;text-align:right;font-weight:700">' + c + '</td>';
  });
  return html + '</tr>';
}

function bulkCelluleActivite(hFait, hPoste){
  if(!hPoste) return '-';
  var p = (hFait / hPoste) * 100;
  var coul = p >= 50 ? '#10b981' : (p >= 20 ? '#f59e0b' : '#ef4444');
  return '<span style="color:' + coul + ';font-weight:600">' + bulkFmt(p,1) + ' %</span>'
    + '<span style="color:var(--tx3);font-size:11px"> (' + bulkFmt(hFait,0) + ' h)</span>';
}

function bulkRendreEquipes(cur, eqFiltre){
  var tbS = document.getElementById('bulk-eq-sur');
  var tbB = document.getElementById('bulk-eq-bij');
  var totSur = bulkTon(cur.totaux.standaard + cur.totaux.noodafvoer);
  var totBij = bulkTon(cur.totaux.bijlijn1);
  var hS = '', hB = '';
  var sumPoste = 0, sumHB = 0, sumHJ = 0;
  BULK_EQ.forEach(function(eq){
    var e = cur.parEquipe[eq];
    var actif = equipeDansSel(eqFiltre, eq);
    var sur = bulkTon(e.standaard), nood = bulkTon(e.noodafvoer), bij = bulkTon(e.bijlijn1);
    var tot = sur + nood;
    /* moyenne rapportee aux heures de poste : 40 h contre 24 h, donc c'est la
       seule facon de comparer honnetement les 5 equipes entre elles. */
    var moySur = bulkKgH(tot, e.hPoste);
    var moyBij = bulkKgH(bij, e.hPoste);
    if(actif){ sumPoste += e.hPoste; sumHB += e.hBulk; sumHJ += e.hBij; }
    hS += bulkLigneEquipe(eq, [
      { v: bulkFmt(sur,1) }, { v: bulkFmt(nood,1) }, { v: bulkFmt(tot,1), fort:true },
      { v: bulkFmt(e.hPoste,0) },
      { v: bulkCelluleActivite(e.hBulk, e.hPoste) },
      { v: moySur === null ? '-' : bulkFmt(moySur,0) }
    ], actif);
    hB += bulkLigneEquipe(eq, [
      { v: bulkFmt(bij,1), fort:true },
      { v: bulkFmt(e.hPoste,0) },
      { v: bulkCelluleActivite(e.hBij, e.hPoste) },
      { v: moyBij === null ? '-' : bulkFmt(moyBij,0) }
    ], actif);
  });
  var moySurT = bulkKgH(totSur, sumPoste);
  var moyBijT = bulkKgH(totBij, sumPoste);
  hS += bulkLigneTotal([
    bulkFmt(bulkTon(cur.totaux.standaard),1), bulkFmt(bulkTon(cur.totaux.noodafvoer),1),
    bulkFmt(totSur,1), bulkFmt(sumPoste,0),
    bulkCelluleActivite(sumHB, sumPoste),
    moySurT === null ? '-' : bulkFmt(moySurT,0)
  ]);
  hB += bulkLigneTotal([
    bulkFmt(totBij,1), bulkFmt(sumPoste,0),
    bulkCelluleActivite(sumHJ, sumPoste),
    moyBijT === null ? '-' : bulkFmt(moyBijT,0)
  ]);
  if(tbS) tbS.innerHTML = hS;
  if(tbB) tbB.innerHTML = hB;
}

function bulkRendreDetail(cur){
  var tb = document.getElementById('bulk-detail-tbody');
  var tf = document.getElementById('bulk-detail-tfoot');
  if(!tb) return;
  var jours = cur.ordreJours.slice().sort().reverse();
  var html = '';
  jours.forEach(function(j){
    var o = cur.jours[j];
    var sur = bulkTon(o.standaard), nood = bulkTon(o.noodafvoer), bij = bulkTon(o.bijlijn1);
    var tot = sur + nood;
    var eqs = Object.keys(o.equipes).sort().map(function(e){
      var c = (typeof COULEURS_EQUIPE !== 'undefined' && COULEURS_EQUIPE[e]) ? COULEURS_EQUIPE[e] : 'var(--tx2)';
      return '<span style="display:inline-block;border:1px solid ' + c + ';color:' + c
        + ';border-radius:99px;padding:1px 7px;font-size:10px;font-weight:600;margin-right:4px">' + e + '</span>';
    }).join('');
    html += '<tr style="border-bottom:1px solid var(--bd2)">'
      + '<td style="padding:7px 6px;white-space:nowrap">' + j + '</td>'
      + '<td style="padding:7px 6px;white-space:nowrap">' + (eqs || '-') + '</td>'
      + '<td style="padding:7px 6px;text-align:right">' + bulkFmt(sur,1) + '</td>'
      + '<td style="padding:7px 6px;text-align:right">' + bulkFmt(nood,1) + '</td>'
      + '<td style="padding:7px 6px;text-align:right;font-weight:600">' + bulkFmt(tot,1) + '</td>'
      + '<td style="padding:7px 6px;text-align:right;color:' + BULK_COUL.bijlijn1 + '">' + bulkFmt(bij,1) + '</td>'
      + '</tr>';
  });
  if(!html) html = '<tr><td colspan="6" style="padding:22px;text-align:center;color:var(--tx3)">'
    + bulkTxt('arr_bulk_empty_per','Aucun releve sur la periode selectionnee.') + '</td></tr>';
  tb.innerHTML = html;
  if(tf){
    var tSur = bulkTon(cur.totaux.standaard), tNood = bulkTon(cur.totaux.noodafvoer), tBij = bulkTon(cur.totaux.bijlijn1);
    tf.innerHTML = '<tr style="border-top:2px solid var(--bd2);font-weight:700">'
      + '<td style="padding:9px 6px">' + bulkTxt('arr_bulk_total','Total') + '</td>'
      + '<td style="padding:9px 6px">' + jours.length + ' ' + bulkTxt('arr_bulk_jours','jours') + '</td>'
      + '<td style="padding:9px 6px;text-align:right">' + bulkFmt(tSur,1) + '</td>'
      + '<td style="padding:9px 6px;text-align:right">' + bulkFmt(tNood,1) + '</td>'
      + '<td style="padding:9px 6px;text-align:right">' + bulkFmt(tSur + tNood,1) + '</td>'
      + '<td style="padding:9px 6px;text-align:right">' + bulkFmt(tBij,1) + '</td>'
      + '</tr>';
  }
}

function bulkRendreCharts(cur){
  if(typeof Chart === 'undefined') return;
  var labels = cur.ordreJours.map(bulkJourCourt);
  var cA = document.getElementById('arretsBulkChart');
  if(cA){
    if(_arretsBulkChart){ try { _arretsBulkChart.destroy(); } catch(e){} _arretsBulkChart = null; }
    _arretsBulkChart = new Chart(cA, {
      type:'bar',
      data:{ labels:labels, datasets:[
        { label:bulkTxt('arr_bulk_s_std','Surproduction'), backgroundColor:BULK_COUL.standaard, borderRadius:3,
          data:cur.ordreJours.map(function(j){ return bulkTon(cur.jours[j].standaard); }) },
        { label:bulkTxt('arr_bulk_s_urg','Noodafvoer'), backgroundColor:BULK_COUL.noodafvoer, borderRadius:3,
          data:cur.ordreJours.map(function(j){ return bulkTon(cur.jours[j].noodafvoer); }) }
      ]},
      options:bulkChartOpts(true)
    });
  }
  var cB = document.getElementById('arretsBulkBijChart');
  if(cB){
    if(_arretsBulkEquipeChart){ try { _arretsBulkEquipeChart.destroy(); } catch(e){} _arretsBulkEquipeChart = null; }
    _arretsBulkEquipeChart = new Chart(cB, {
      type:'bar',
      data:{ labels:labels, datasets:[
        { label:bulkTxt('arr_bulk_s_bij','Bijlijn emballe'), backgroundColor:BULK_COUL.bijlijn1, borderRadius:3,
          data:cur.ordreJours.map(function(j){ return bulkTon(cur.jours[j].bijlijn1); }) }
      ]},
      options:bulkChartOpts(false)
    });
  }
}

function bulkMajBoutonsPeriode(){
  var actif = 'all';
  if(BULK_DATE_DEBUT || BULK_DATE_FIN){
    actif = '';
    if(BULK_DATE_DEBUT && BULK_DATE_FIN){
      var n = bulkNbJours(BULK_DATE_DEBUT, BULK_DATE_FIN);
      if(n === 7) actif = '7';
      else if(n === 30) actif = '30';
      else if(n === 90) actif = '90';
      else if(n === 180) actif = '180';
      var bornes = bulkBornesDonnees();
      if(BULK_DATE_DEBUT === BULK_DATE_FIN.slice(0,4) + '-01-01'
         && bornes.max && BULK_DATE_FIN === bornes.max) actif = 'annee';
    }
  }
  document.querySelectorAll('.bulk-per-btn').forEach(function(b){
    var on = (b.getAttribute('data-per') === actif);
    b.style.background = on ? 'var(--blue)' : 'none';
    b.style.color = on ? '#fff' : 'var(--tx2)';
    b.style.borderColor = on ? 'var(--blue)' : 'var(--bd2)';
  });
}

function buildBulkSections(){
  var wrapSur = document.getElementById('bulk-kpi-sur');
  if(!wrapSur) return;
  var vide = document.getElementById('bulk-empty');
  var meta = document.getElementById('bulk-meta');
  var cartes = ['bulk-card-sur','bulk-card-bij','bulk-card-detail'];
  var bornes = bulkBornesDonnees();
  var aucune = !BULK_DATA || !bornes.min;

  if(vide) vide.style.display = aucune ? 'block' : 'none';
  cartes.forEach(function(id){ var el = document.getElementById(id); if(el) el.style.display = aucune ? 'none' : ''; });
  if(aucune){ if(meta) meta.innerHTML = ''; return; }

  var eqFiltre = (typeof BULK_EQUIPE_FILTRE !== 'undefined') ? BULK_EQUIPE_FILTRE : [];
  var d1 = BULK_DATE_DEBUT || bornes.min;
  var d2 = BULK_DATE_FIN || bornes.max;
  if(d1 > d2){ var tmp = d1; d1 = d2; d2 = tmp; }

  var cur = bulkCalc(d1, d2, eqFiltre);
  var nbJours = bulkNbJours(d1, d2);
  var pFin = bulkDecalerJour(d1, -1);
  var pDeb = bulkDecalerJour(pFin, -(nbJours - 1));
  var prec = bulkCalc(pDeb, pFin, eqFiltre);

  bulkRendreKpiSur(cur, prec);
  bulkRendreKpiBij(cur, prec);
  bulkRendreMeta(cur, d1, d2, nbJours, eqFiltre, pDeb, pFin);
  bulkRendreEquipes(cur, eqFiltre);
  bulkRendreDetail(cur);
  bulkRendreCharts(cur);
  bulkMajBoutonsPeriode();
}

function bulkFiltrerPeriode(){
  var i1 = document.getElementById('bulk-date-debut');
  var i2 = document.getElementById('bulk-date-fin');
  BULK_DATE_DEBUT = i1 ? (i1.value || '') : '';
  BULK_DATE_FIN = i2 ? (i2.value || '') : '';
  buildBulkSections();
}

function bulkPeriodeAnnee(){
  var bornes = bulkBornesDonnees();
  var fin = bornes.max || bulkDateISO(new Date());
  BULK_DATE_FIN = fin;
  BULK_DATE_DEBUT = fin.slice(0,4) + '-01-01';
  if(bornes.min && BULK_DATE_DEBUT < bornes.min) BULK_DATE_DEBUT = bornes.min;
  var i1 = document.getElementById('bulk-date-debut'); if(i1) i1.value = BULK_DATE_DEBUT;
  var i2 = document.getElementById('bulk-date-fin'); if(i2) i2.value = BULK_DATE_FIN;
  buildBulkSections();
}

function bulkPeriodeRapide(n){
  var bornes = bulkBornesDonnees();
  var fin = bornes.max || bulkDateISO(new Date());
  BULK_DATE_FIN = fin;
  BULK_DATE_DEBUT = bulkDecalerJour(fin, -(n - 1));
  var i1 = document.getElementById('bulk-date-debut'); if(i1) i1.value = BULK_DATE_DEBUT;
  var i2 = document.getElementById('bulk-date-fin'); if(i2) i2.value = BULK_DATE_FIN;
  buildBulkSections();
}

function bulkReinitialiserPeriode(){
  BULK_DATE_DEBUT = '';
  BULK_DATE_FIN = '';
  var i1 = document.getElementById('bulk-date-debut'); if(i1) i1.value = '';
  var i2 = document.getElementById('bulk-date-fin'); if(i2) i2.value = '';
  buildBulkSections();
}

function bulkExportCSV(){
  if(!BULK_DATA){ alert(bulkTxt('arr_bulk_empty','Aucune donnee bulk importee pour le moment.')); return; }
  var bornes = bulkBornesDonnees();
  if(!bornes.min) return;
  var eqFiltre = (typeof BULK_EQUIPE_FILTRE !== 'undefined') ? BULK_EQUIPE_FILTRE : [];
  var d1 = BULK_DATE_DEBUT || bornes.min;
  var d2 = BULK_DATE_FIN || bornes.max;
  var cur = bulkCalc(d1, d2, eqFiltre);
  var sep = ';';
  var virg = function(x, d){ return x.toFixed(d).replace('.', ','); };
  var lignes = [['Jour','Equipes','Surproduction (t)','Noodafvoer (t)','Total bulk (t)','Bijlijn emballe (t)'].join(sep)];
  cur.ordreJours.slice().sort().forEach(function(j){
    var o = cur.jours[j];
    var sur = bulkTon(o.standaard), nood = bulkTon(o.noodafvoer), bij = bulkTon(o.bijlijn1);
    lignes.push([
      j, Object.keys(o.equipes).sort().join(' '),
      virg(sur,2), virg(nood,2), virg(sur + nood,2), virg(bij,2)
    ].join(sep));
  });
  lignes.push('');
  lignes.push(['Equipe','Surproduction (t)','Noodafvoer (t)','Total bulk (t)','Bijlijn emballe (t)','Heures de poste','Heures avec bulk','Activite bulk (%)','Heures avec bijlijn','Activite bijlijn (%)','Bulk kg/h de poste','Bijlijn kg/h de poste'].join(sep));
  BULK_EQ.forEach(function(eq){
    var e = cur.parEquipe[eq];
    var sur = bulkTon(e.standaard), nood = bulkTon(e.noodafvoer), bij = bulkTon(e.bijlijn1);
    var tot = sur + nood;
    lignes.push([
      eq, virg(sur,2), virg(nood,2), virg(tot,2), virg(bij,2),
      e.hPoste, e.hBulk, (e.hPoste > 0 ? virg(e.hBulk / e.hPoste * 100, 1) : ''),
      e.hBij, (e.hPoste > 0 ? virg(e.hBij / e.hPoste * 100, 1) : ''),
      (e.hPoste > 0 ? virg(bulkKgH(tot, e.hPoste), 0) : ''),
      (e.hPoste > 0 ? virg(bulkKgH(bij, e.hPoste), 0) : '')
    ].join(sep));
  });
  var blob = new Blob(['﻿' + lignes.join('\r\n')], { type:'text/csv;charset=utf-8;' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Bulk_bijlijn_' + d1 + '_' + d2 + (eqFiltre.length ? '_' + eqFiltre.slice().sort().join('-') : '') + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function bulkImprimerDetail(){
  var carte = document.getElementById('bulk-card-detail');
  var table = carte ? carte.querySelector('table') : null;
  if(!table) return;
  var eqFiltre = (typeof BULK_EQUIPE_FILTRE !== 'undefined') ? BULK_EQUIPE_FILTRE : [];
  var bornes = bulkBornesDonnees();
  var d1 = BULK_DATE_DEBUT || bornes.min || '';
  var d2 = BULK_DATE_FIN || bornes.max || '';
  var w = window.open('', '_blank');
  if(!w){ alert(bulkTxt('arr_bulk_popup','Autorise les fenetres pop-up pour imprimer le tableau.')); return; }
  w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Bulk et bijlijn</title>'
    + '<style>body{font-family:Arial,Helvetica,sans-serif;margin:22px;color:#111}'
    + 'h1{font-size:17px;margin:0 0 4px}p.sub{font-size:12px;color:#555;margin:0 0 16px}'
    + 'table{width:100%;border-collapse:collapse;font-size:11px}'
    + 'th,td{border:1px solid #ccc;padding:4px 6px}th{background:#f0f0f0;text-align:left}'
    + 'td:nth-child(n+3),th:nth-child(n+3){text-align:right}'
    + 'tfoot td{font-weight:bold;background:#f7f7f7}span{border:none !important;padding:0 !important;margin-right:3px}'
    + '@page{size:A4;margin:12mm}</style></head><body>'
    + '<h1>Bulk et bijlijn &mdash; detail jour par jour</h1>'
    + '<p class="sub">Periode ' + d1 + ' &rarr; ' + d2
    + (eqFiltre.length ? ' &middot; equipes ' + selEquipeTexte(eqFiltre) : ' &middot; toutes equipes')
    + ' &middot; volumes en tonnes &middot; edite le ' + bulkDateISO(new Date()) + '</p>'
    + table.outerHTML + '</body></html>');
  w.document.close();
  w.focus();
  setTimeout(function(){ try { w.print(); } catch(e){} }, 400);
}

function buildArretsBulkChart(){ buildBulkSections(); }

function buildArretsBulkEquipeChart(){ buildBulkSections(); }

function bulkSauverUnite(){ buildBulkSections(); }
