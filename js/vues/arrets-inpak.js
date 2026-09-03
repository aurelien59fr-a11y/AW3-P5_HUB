/* vues/arrets-inpak.js -- rendu, filtres et onglet Comparaison des arrets Inpak.
   Extrait de app.js a l'etape 6 du plan Phase 2 (aucune regle metier changee).
   L'onglet Comparaison (filtrerCmp2*, peuplerCmp2RaisonsSelect,
   buildComparaisonTab, CMP2_*) part avec ce bloc plutot que dans un fichier
   separe : il partage l'etat de filtre des arrets (section C du plan).
   L'import manuel (importerArretsInpak, openImportArretsModal) part dans
   imports/grafana.js, pas ici. */

var ARRETS_LIGNE_FILTRE = 'all';
var ARRETS_EQUIPE_FILTRE = [];    // [] = toutes ; sinon ['P1','P4'] par exemple
var ARRETS_DATE_FILTRE = '';      // '' ou 'YYYY-MM-DD'
var ARRETS_DATE_FIN_FILTRE = '';  // '' ou 'YYYY-MM-DD' (fourchette)
var ARRETS_HEURE_FILTRE = '';     // '' ou 'HH:MM'
var ARRETS_RAISON_FILTRE = 'all'; // 'all' ou une raison precise
var ARRETS_OPERATEURS_FILTRE = {}; // {} = tous, sinon {nom: true, ...} = seulement ceux-la
var ARRETS_CAT_COUL = {
  '00': '#06b6d4', '01': '#8b5cf6', '02': '#3b82f6', '03': '#f59e0b', '04': '#ef4444',
  '05': '#ec4899', '06': '#10b981', '07': '#f97316', '08': '#84cc16', '10': '#64748b'
};
var ARRETS_CAUSES_TRI = 'duree';   /* 'duree' ou 'nombre' */
var ARRETS_CAUSES_CAT = null;      /* categorie depliee */
var _arretsParetoChart = null;
var _arretsCausesData = [];
var CMP2_LIGNE_FILTRE = 'all';
var CMP2_EQUIPE_OP_FILTRE = 'all';
var _cmp2EquipeChart = null;
var _cmp2EvolutionChart = null;
var _cmp2OperateurChart = null;
var CMP2_MOIS_I18N={
  fr:['Jan','Fev','Mar','Avr','Mai','Jun','Jul','Aou','Sep','Oct','Nov','Dec'],
  nl:['Jan','Feb','Mrt','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
  en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
};

function filtrerArretsRaison(){
  ARRETS_RAISON_FILTRE = document.getElementById('arrets-raison-select').value || 'all';
  buildArretsInpak();
  if(typeof buildComparaisonTab === 'function') buildComparaisonTab();
}

function toggleArretsOperateur(nom){
  if(nom === 'all'){
    ARRETS_OPERATEURS_FILTRE = {};
  } else {
    if(ARRETS_OPERATEURS_FILTRE[nom]) delete ARRETS_OPERATEURS_FILTRE[nom];
    else ARRETS_OPERATEURS_FILTRE[nom] = true;
  }
  document.querySelectorAll('.arrets-operateur-btn').forEach(function(b){
    var nomBtn = b.dataset.operateur;
    var actif = nomBtn === 'all' ? (Object.keys(ARRETS_OPERATEURS_FILTRE).length === 0) : !!ARRETS_OPERATEURS_FILTRE[nomBtn];
    b.style.background = actif ? 'var(--blue)' : 'none';
    b.style.color = actif ? '#fff' : 'var(--tx2)';
    b.style.borderColor = actif ? 'var(--blue)' : 'var(--bd2)';
  });
  buildArretsInpak();
}

function peuplerOperateursFiltre(){
  var wrap = document.getElementById('arrets-filtre-operateur');
  if(!wrap || wrap.dataset.rempli === LANG) return; // reconstruire seulement si la langue a change
  var operateurs = EMP.filter(function(e){ return e.g === 'INPAK'; }).map(function(e){ return e.n; });
  var html = '<button class="arrets-operateur-btn" data-operateur="all" onclick="toggleArretsOperateur(\'all\')" style="padding:6px 14px;border-radius:99px;border:1px solid var(--blue);background:var(--blue);color:#fff;font-family:var(--fn);font-size:12px;font-weight:600;cursor:pointer">' + t('ncp_tous') + '</button>';
  html += operateurs.map(function(nom){
    return '<button class="arrets-operateur-btn" data-operateur="' + nom.replace(/"/g,'&quot;') + '" onclick="toggleArretsOperateur(\'' + nom.replace(/'/g,"\\'") + '\')" style="padding:6px 14px;border-radius:99px;border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:12px;cursor:pointer">' + nom + '</button>';
  }).join('');
  wrap.innerHTML = html;
  wrap.dataset.rempli = LANG;
}

function buildArretsCauses(liste){
  var wrap = document.getElementById('arrets-causes-cat');
  if(!wrap) return;
  var parCat = {}, parRaison = {};
  (liste || []).forEach(function(a){
    if(!a || !a.raison) return;
    var cat = arretCat(a.raison) || '??';
    var d = a.duree || 0;
    if(!parCat[cat]) parCat[cat] = { cat: cat, duree: 0, nombre: 0 };
    parCat[cat].duree += d; parCat[cat].nombre++;
    var cle = cat + '|' + a.raison;
    if(!parRaison[cle]) parRaison[cle] = { cat: cat, raison: a.raison, duree: 0, nombre: 0 };
    parRaison[cle].duree += d; parRaison[cle].nombre++;
  });
  var champ = ARRETS_CAUSES_TRI;
  var cats = Object.keys(parCat).map(function(k){ return parCat[k]; })
                   .sort(function(x, y){ return y[champ] - x[champ]; });
  _arretsCausesData = cats;
  var total = cats.reduce(function(s, c){ return s + c[champ]; }, 0);

  /* boutons de tri */
  ['duree','nombre'].forEach(function(m){
    var b = document.getElementById('arrets-tri-' + m);
    if(!b) return;
    var on = (ARRETS_CAUSES_TRI === m);
    b.style.background = on ? 'var(--blue)' : 'none';
    b.style.color = on ? '#fff' : 'var(--tx2)';
    b.style.borderColor = on ? 'var(--blue)' : 'var(--bd2)';
  });

  if(!cats.length){
    wrap.innerHTML = '<div style="color:var(--tx3);font-size:13px;padding:14px">' + t('arr_no_data') + '</div>';
    var dv = document.getElementById('arrets-causes-detail'); if(dv) dv.innerHTML = '';
    if(_arretsParetoChart){ try { _arretsParetoChart.destroy(); } catch(e){} _arretsParetoChart = null; }
    return;
  }

  /* tableau des categories, cliquable */
  var cumul = 0;
  var html = '<table style="width:100%;border-collapse:collapse;font-size:12px;font-variant-numeric:tabular-nums">'
    + '<thead><tr style="border-bottom:1px solid var(--bd2);color:var(--tx3);font-size:11px;text-transform:uppercase;letter-spacing:.04em">'
    + '<th style="text-align:left;padding:8px 6px">' + t('arr_ca_th_cat') + '</th>'
    + '<th style="text-align:right;padding:8px 6px">' + t('arr_ca_th_duree') + '</th>'
    + '<th style="text-align:right;padding:8px 6px">' + t('arr_ca_th_part') + '</th>'
    + '<th style="text-align:right;padding:8px 6px">' + t('arr_ca_th_cumul') + '</th>'
    + '<th style="text-align:right;padding:8px 6px">' + t('arr_ca_th_nb') + '</th>'
    + '<th style="text-align:right;padding:8px 6px">' + t('arr_ca_th_moy') + '</th>'
    + '</tr></thead><tbody>';
  cats.forEach(function(c){
    cumul += c[champ];
    var coul = ARRETS_CAT_COUL[c.cat] || 'var(--tx2)';
    var ouvert = (ARRETS_CAUSES_CAT === c.cat);
    html += '<tr onclick="arretsCausesOuvrir(\'' + c.cat + '\')" style="border-bottom:1px solid var(--bd2);cursor:pointer'
      + (ouvert ? ';background:var(--bg3)' : '') + '">'
      + '<td style="padding:8px 6px;white-space:nowrap">'
      + '<span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:' + coul + ';margin-right:8px"></span>'
      + '<b style="color:' + coul + '">' + c.cat + '</b> ' + arretCatLibelle(c.cat)
      + '<span style="color:var(--tx3);margin-left:6px">' + (ouvert ? '&#9662;' : '&#9656;') + '</span></td>'
      + '<td style="padding:8px 6px;text-align:right;font-weight:700">' + arretsFmtH(c.duree) + '</td>'
      + '<td style="padding:8px 6px;text-align:right">' + (total ? (c[champ] / total * 100).toFixed(1) : '-') + ' %</td>'
      + '<td style="padding:8px 6px;text-align:right;color:var(--tx3)">' + (total ? (cumul / total * 100).toFixed(0) : '-') + ' %</td>'
      + '<td style="padding:8px 6px;text-align:right">' + c.nombre + '</td>'
      + '<td style="padding:8px 6px;text-align:right;color:var(--tx3)">' + (c.nombre ? Math.round(c.duree / c.nombre) : 0) + ' min</td>'
      + '</tr>';
  });
  html += '</tbody></table>';
  wrap.innerHTML = html;

  /* detail de la categorie depliee */
  var det = document.getElementById('arrets-causes-detail');
  if(det){
    if(!ARRETS_CAUSES_CAT){
      det.innerHTML = '<div style="font-size:12px;color:var(--tx3);padding:10px 2px">' + t('arr_ca_clic') + '</div>';
    } else {
      var lignes = Object.keys(parRaison).map(function(k){ return parRaison[k]; })
        .filter(function(r){ return r.cat === ARRETS_CAUSES_CAT; })
        .sort(function(x, y){ return y[champ] - x[champ]; });
      var totCat = lignes.reduce(function(s, r){ return s + r[champ]; }, 0);
      var coul = ARRETS_CAT_COUL[ARRETS_CAUSES_CAT] || 'var(--tx2)';
      var h = '<div style="margin-top:14px;border-left:3px solid ' + coul + ';padding-left:12px">'
        + '<div style="font-size:12px;font-weight:600;margin-bottom:8px;color:' + coul + '">'
        + ARRETS_CAUSES_CAT + ' - ' + arretCatLibelle(ARRETS_CAUSES_CAT) + '</div>'
        + '<table style="width:100%;border-collapse:collapse;font-size:12px;font-variant-numeric:tabular-nums">'
        + '<thead><tr style="border-bottom:1px solid var(--bd2);color:var(--tx3);font-size:11px;text-transform:uppercase;letter-spacing:.04em">'
        + '<th style="text-align:left;padding:7px 6px">' + t('arr_ca_th_raison') + '</th>'
        + '<th style="text-align:right;padding:7px 6px">' + t('arr_ca_th_duree') + '</th>'
        + '<th style="text-align:right;padding:7px 6px">' + t('arr_ca_th_part') + '</th>'
        + '<th style="text-align:right;padding:7px 6px">' + t('arr_ca_th_nb') + '</th>'
        + '<th style="text-align:right;padding:7px 6px">' + t('arr_ca_th_moy') + '</th>'
        + '<th style="text-align:right;padding:7px 6px"></th></tr></thead><tbody>';
      lignes.forEach(function(r){
        h += '<tr style="border-bottom:1px solid var(--bd2)">'
          + '<td style="padding:7px 6px">' + arretLibelle(r.raison) + '</td>'
          + '<td style="padding:7px 6px;text-align:right;font-weight:600">' + arretsFmtH(r.duree) + '</td>'
          + '<td style="padding:7px 6px;text-align:right">' + (totCat ? (r[champ] / totCat * 100).toFixed(1) : '-') + ' %</td>'
          + '<td style="padding:7px 6px;text-align:right">' + r.nombre + '</td>'
          + '<td style="padding:7px 6px;text-align:right;color:var(--tx3)">' + (r.nombre ? Math.round(r.duree / r.nombre) : 0) + ' min</td>'
          + '<td style="padding:7px 6px;text-align:right"><button onclick="arretsFiltrerRaison(\'' + String(r.raison).replace(/'/g, "\\'").replace(/"/g, '&quot;') + '\')" '
          + 'style="padding:3px 9px;border-radius:99px;border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:11px;cursor:pointer">'
          + t('arr_ca_filtrer') + '</button></td>'
          + '</tr>';
      });
      h += '</tbody></table></div>';
      det.innerHTML = h;
    }
  }

  /* Pareto : barres par categorie + courbe du cumule */
  var ctx = document.getElementById('arretsParetoChart');
  if(!ctx || typeof Chart === 'undefined') return;
  if(_arretsParetoChart){ try { _arretsParetoChart.destroy(); } catch(e){} _arretsParetoChart = null; }
  var cum = 0;
  var cumuls = cats.map(function(c){ cum += c[champ]; return total ? +(cum / total * 100).toFixed(1) : 0; });
  var valeurs = cats.map(function(c){ return champ === 'duree' ? +(c.duree / 60).toFixed(1) : c.nombre; });
  var unite = (champ === 'duree') ? ' h' : '';
  _arretsParetoChart = new Chart(ctx, {
    data: {
      labels: cats.map(function(c){ return c.cat + ' ' + arretCatLibelle(c.cat); }),
      datasets: [
        { type: 'bar', label: t(champ === 'duree' ? 'arr_ca_heures' : 'arr_ca_nombre'), data: valeurs,
          backgroundColor: cats.map(function(c){ return ARRETS_CAT_COUL[c.cat] || '#64748b'; }),
          borderRadius: 3, yAxisID: 'y', order: 2 },
        { type: 'line', label: t('arr_ca_cumule'), data: cumuls, yAxisID: 'y2', order: 1,
          borderColor: '#e8eaf0', backgroundColor: '#e8eaf0', borderWidth: 2,
          pointRadius: 3, pointBackgroundColor: '#e8eaf0', tension: .25, fill: false }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: true, position: 'top', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, font: { size: 11 }, color: '#8b90a4' } },
        tooltip: { callbacks: { label: function(c){
          return c.dataset.yAxisID === 'y2'
            ? t('arr_ca_cumule') + ' : ' + c.parsed.y + ' %'
            : c.dataset.label + ' : ' + c.parsed.y + unite;
        } } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#8b90a4', maxRotation: 30, minRotation: 0 } },
        y: { beginAtZero: true, position: 'left', grid: { color: 'rgba(128,128,128,.12)' },
             ticks: { font: { size: 10 }, color: '#8b90a4', callback: function(v){ return v + unite; } } },
        y2: { beginAtZero: true, max: 100, position: 'right', grid: { display: false },
              ticks: { font: { size: 10 }, color: '#8b90a4', callback: function(v){ return v + ' %'; } } }
      }
    }
  });
}

function arretsFiltrerRaison(raison){
  ARRETS_RAISON_FILTRE = raison;
  var sel = document.getElementById('arrets-raison-select');
  if(sel) sel.value = raison;
  if(typeof buildArretsInpak === 'function') buildArretsInpak();
  if(typeof buildComparaisonTab === 'function') buildComparaisonTab();
  var anc = document.getElementById('arrets-raison-select');
  if(anc && anc.scrollIntoView) anc.scrollIntoView({ block: 'center' });
}

function peuplerRaisonsSelect(){
  var sel = document.getElementById('arrets-raison-select');
  if(!sel) return;
  var stats = {};
  Object.values(ARRETS_DATA).forEach(function(a){
    if(a.type !== 'avec_raison' || !a.raison) return;
    if(!stats[a.raison]) stats[a.raison] = { n: 0, d: 0 };
    stats[a.raison].n++; stats[a.raison].d += (a.duree || 0);
  });
  /* regroupe par famille (00, 01, 02 ...) et trie chaque famille par temps perdu */
  var parCat = {};
  Object.keys(stats).forEach(function(r){
    var c = arretCat(r) || '99';
    if(!parCat[c]) parCat[c] = [];
    parCat[c].push(r);
  });
  var precedent = sel.value;
  var html = '<option value="all">' + t('arr_all_reasons') + '</option>';
  Object.keys(parCat).sort().forEach(function(c){
    var titre = (ARRETS_REF_CAT[c] ? c + ' - ' + arretCatLibelle(c) : t('arr_ca_th_cat'));
    html += '<optgroup label="' + titre.replace(/"/g, '&quot;') + '">';
    parCat[c].sort(function(x, y){ return stats[y].d - stats[x].d; }).forEach(function(r){
      html += '<option value="' + r.replace(/"/g, '&quot;') + '">'
            + arretLibelle(r).replace(/</g, '&lt;')
            + '  (' + Math.round(stats[r].d / 60) + ' h)</option>';
    });
    html += '</optgroup>';
  });
  sel.innerHTML = html;
  if(stats[precedent]) sel.value = precedent;
}

function filtrerArretsLigne(ligne){
  ARRETS_LIGNE_FILTRE = ligne;
  document.querySelectorAll('.arrets-ligne-btn').forEach(function(b){
    var actif = b.dataset.ligne === ligne;
    b.classList.toggle('on', actif);
    b.style.background = actif ? 'var(--blue)' : 'none';
    b.style.color = actif ? '#fff' : 'var(--tx2)';
    b.style.borderColor = actif ? 'var(--blue)' : 'var(--bd2)';
  });
  buildArretsInpak();
  if(typeof buildComparaisonTab === 'function') buildComparaisonTab();
}

function filtrerArretsEquipe(equipe){
  ARRETS_EQUIPE_FILTRE = basculerEquipe(ARRETS_EQUIPE_FILTRE, equipe);
  majPastillesEquipe('.arrets-equipe-btn', ARRETS_EQUIPE_FILTRE);
  buildArretsInpak();
  if(typeof buildComparaisonTab === 'function') buildComparaisonTab();
}

function rechercherArrets(){
  ARRETS_DATE_FILTRE = document.getElementById('arrets-recherche-date').value || '';
  ARRETS_DATE_FIN_FILTRE = document.getElementById('arrets-recherche-date-fin').value || '';
  ARRETS_HEURE_FILTRE = ARRETS_DATE_FIN_FILTRE ? '' : (document.getElementById('arrets-recherche-heure').value || '');
  buildArretsInpak();
  if(typeof buildComparaisonTab === 'function') buildComparaisonTab();
}

function reinitialiserRechercheArrets(){
  document.getElementById('arrets-recherche-date').value = '';
  document.getElementById('arrets-recherche-date-fin').value = '';
  document.getElementById('arrets-recherche-heure').value = '';
  ARRETS_DATE_FILTRE = '';
  ARRETS_DATE_FIN_FILTRE = '';
  ARRETS_HEURE_FILTRE = '';
  buildArretsInpak();
  if(typeof buildComparaisonTab === 'function') buildComparaisonTab();
}

function toggleMicrostopsDetail(){
  var wrap = document.getElementById('arrets-micro-wrap');
  var toggle = document.getElementById('arrets-micro-toggle');
  if(!wrap) return;
  var visible = wrap.style.display !== 'none';
  wrap.style.display = visible ? 'none' : 'block';
  if(toggle) toggle.innerHTML = visible ? '&#9660; '+t('arr_micro_show') : '&#9650; '+t('arr_micro_hide');
}

function diagnostiquerDoublonsArrets(){
  var legacy = [];
  Object.keys(ARRETS_DATA).forEach(function(key){
    var a = ARRETS_DATA[key];
    if(a.type === 'microstop' && a.nombre == null) legacy.push({ key: key, a: a });
  });

  var groupes = {};
  Object.keys(ARRETS_DATA).forEach(function(key){
    if(legacy.some(function(l){ return l.key === key; })) return;
    var a = ARRETS_DATA[key];
    var ligneNorm = String(a.ligne || '').trim();
    var dateNorm = String(a.date || '').trim();
    var heureNorm = String(a.heure || '').trim();
    var k = a.type + '|' + ligneNorm + '|' + dateNorm + '|' + heureNorm;
    if(!groupes[k]) groupes[k] = [];
    groupes[k].push({ key: key, a: a });
  });

  var doublons = Object.keys(groupes).filter(function(k){ return groupes[k].length > 1; });

  var wrap = document.getElementById('arrets-diag-wrap');
  if(!wrap) return;

  if(!legacy.length && !doublons.length){
    wrap.innerHTML = '<div style="color:#10b981;font-size:13px;padding:12px">✓ Aucun doublon ni entree obsolete detectee.</div>';
    wrap.style.display = 'block';
    return;
  }

  var html = '<div style="font-size:13px;color:var(--tx2);margin-bottom:10px">'
    + legacy.length + ' entree(s) au format obsolete, ' + doublons.length + ' groupe(s) en double (aperçu des 10 premiers de chaque) :</div>';

  if(legacy.length){
    html += '<div style="font-weight:600;font-size:12px;color:var(--tx1);margin:10px 0 6px">Micro-arrets format obsolete :</div>';
    html += legacy.slice(0, 10).map(function(l){
      return '<div style="font-family:var(--mo);font-size:11px;color:var(--tx3);padding:4px 0;border-bottom:1px solid var(--bd2)">' + JSON.stringify(l.a) + '</div>';
    }).join('');
  }

  if(doublons.length){
    html += '<div style="font-weight:600;font-size:12px;color:var(--tx1);margin:10px 0 6px">Groupes en double :</div>';
    html += doublons.slice(0, 10).map(function(k){
      var entries = groupes[k];
      return '<div style="margin-bottom:8px;padding:8px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:6px">'
        + '<div style="font-size:11px;color:var(--tx3);margin-bottom:4px">' + entries.length + ' exemplaires — cle: ' + k + '</div>'
        + entries.map(function(e){ return '<div style="font-family:var(--mo);font-size:11px;color:var(--tx2)">' + JSON.stringify(e.a) + '</div>'; }).join('')
        + '</div>';
    }).join('');
  }

  wrap.innerHTML = html;
  wrap.style.display = 'block';
  console.log('[Diagnostic doublons] Format obsolete:', legacy);
  console.log('[Diagnostic doublons] Groupes en double:', doublons.map(function(k){ return { cle: k, entrees: groupes[k] }; }));
}

function buildArretsInpak(){
  var tousLesArrets = Object.values(ARRETS_DATA);
  var filtre = ARRETS_LIGNE_FILTRE;
  var arrets = tousLesArrets.filter(function(a){ return filtre === 'all' || a.ligne === filtre; });

  var avecRaison = arrets.filter(function(a){ return a.type === 'avec_raison'; });
  var microstops = arrets.filter(function(a){ return a.type === 'microstop'; });

  // Filtre equipe — uniquement sur "avec raison" (les microstops sont
  // agreges par jour et n'ont pas d'heure precise, donc pas d'equipe possible)
  if(ARRETS_EQUIPE_FILTRE.length){
    avecRaison = avecRaison.filter(function(a){ return equipeDansSel(ARRETS_EQUIPE_FILTRE, equipeReelle(a.date, a.heure)); });
  }

  // Recherche precise date/heure, ou fourchette de dates
  if(ARRETS_DATE_FILTRE){
    if(ARRETS_DATE_FIN_FILTRE){
      avecRaison = avecRaison.filter(function(a){ return a.date >= ARRETS_DATE_FILTRE && a.date <= ARRETS_DATE_FIN_FILTRE; });
      microstops = microstops.filter(function(a){ return a.date >= ARRETS_DATE_FILTRE && a.date <= ARRETS_DATE_FIN_FILTRE; });
    } else {
      avecRaison = avecRaison.filter(function(a){ return a.date === ARRETS_DATE_FILTRE; });
      microstops = microstops.filter(function(a){ return a.date === ARRETS_DATE_FILTRE; });
      if(ARRETS_HEURE_FILTRE){
        avecRaison = avecRaison.filter(function(a){ return dansFenetreHeure(a.heure, ARRETS_HEURE_FILTRE); });
      }
    }
  }

  peuplerRaisonsSelect();
  peuplerOperateursFiltre();

  // Filtre par raison precise (ex: "combien de temps a pris le grand
  // nettoyage sur toute l'annee ?") — applique AVANT le filtre operateur,
  // pour que la comparaison par operateur montre toujours tout le monde.
  /* le Pareto doit montrer TOUTES les causes : on le construit avant
     d'appliquer le filtre raison, sinon il ne resterait qu'une barre. */
  if(typeof buildArretsCauses === 'function') buildArretsCauses(avecRaison);

  if(ARRETS_RAISON_FILTRE !== 'all'){
    avecRaison = avecRaison.filter(function(a){ return a.raison === ARRETS_RAISON_FILTRE; });
  }

  var wrapRaisonResume = document.getElementById('arrets-raison-resume-wrap');
  if(wrapRaisonResume){
    if(ARRETS_RAISON_FILTRE === 'all'){
      wrapRaisonResume.style.display = 'none';
    } else {
      var totalMin = avecRaison.reduce(function(s, a){ return s + (a.duree || 0); }, 0);
      var h = Math.floor(totalMin / 60), m = totalMin % 60;
      wrapRaisonResume.style.display = 'block';
      wrapRaisonResume.innerHTML = '<b>' + avecRaison.length + '</b> ' + t('arr_occurrences_de').replace('{raison}', arretLibelle(ARRETS_RAISON_FILTRE)) + ' <b>' + h + 'h' + String(m).padStart(2,'0') + '</b> (' + totalMin + ' ' + t('arr_min_suffix') + ')';
    }
  }

  // --- Comparaison par operateur (moyenne de duree), pour la raison
  // selectionnee — calculee AVANT le filtre operateur, pour comparer tout
  // le monde meme si un ou plusieurs operateurs sont selectionnes ailleurs.
  var wrapComparOp = document.getElementById('arrets-compar-op-wrap');
  if(wrapComparOp){
    if(ARRETS_RAISON_FILTRE === 'all'){
      wrapComparOp.style.display = 'none';
      if(_arretsComparOpChart){ _arretsComparOpChart.destroy(); _arretsComparOpChart = null; }
    } else {
      var parOp = {};
      avecRaison.forEach(function(a){
        var op = getOperateur(a.date, a.heure, a.ligne) || 'Inconnu';
        op.split(', ').forEach(function(n){
          if(!parOp[n]) parOp[n] = { total: 0, n: 0 };
          parOp[n].total += (a.duree || 0);
          parOp[n].n++;
        });
      });
      var noms = Object.keys(parOp).sort(function(x, y){ return (parOp[y].total/parOp[y].n) - (parOp[x].total/parOp[x].n); });
      if(noms.length && typeof Chart !== 'undefined'){
        wrapComparOp.style.display = 'block';
        var moyennes = noms.map(function(n){ return Math.round(parOp[n].total / parOp[n].n); });
        var occurrences = noms.map(function(n){ return parOp[n].n; });
        var ctx = document.getElementById('arretsComparOpChart');
        if(_arretsComparOpChart) _arretsComparOpChart.destroy();
        _arretsComparOpChart = new Chart(ctx, {
          type: 'bar',
          data: { labels: noms, datasets: [{ label: 'Duree moyenne (min)', data: moyennes, backgroundColor: '#3b82f6' }] },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { afterLabel: function(c){ return occurrences[c.dataIndex] + ' occurrence(s)'; } } }
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#8b90a4' } },
              y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' }, title: { display: true, text: 'minutes', color: '#8b90a4' } }
            }
          }
        });
      } else {
        wrapComparOp.style.display = 'none';
      }
    }
  }

  // Filtre par operateur(s) selectionne(s) — croise avec le planning,
  // applique APRES le calcul de comparaison ci-dessus.
  if(Object.keys(ARRETS_OPERATEURS_FILTRE).length){
    var matchOp = function(a){
      var op = getOperateur(a.date, a.heure, a.ligne);
      if(!op) return false;
      return op.split(', ').some(function(n){ return ARRETS_OPERATEURS_FILTRE[n]; });
    };
    avecRaison = avecRaison.filter(matchOp);
    microstops = microstops.filter(matchOp);
  }

  // --- Resume frequence par ligne ---
  var wrapResume = document.getElementById('arrets-resume-wrap');
  if(wrapResume){
    var parLigne = {};
    tousLesArrets.forEach(function(a){
      if(!parLigne[a.ligne]) parLigne[a.ligne] = { raison: 0, micro: 0 };
      if(a.type === 'avec_raison') parLigne[a.ligne].raison++;
      else parLigne[a.ligne].micro += (a.nombre || 0);
    });
    var lignes = Object.keys(parLigne).sort();
    if(!lignes.length){
      wrapResume.innerHTML = '<div style="color:var(--tx3);font-size:13px;padding:12px">'+t('arr_no_data')+'</div>';
    } else {
      wrapResume.innerHTML = '<table style="width:100%;border-collapse:collapse">'
        + '<thead><tr style="text-align:left;font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em">'
        + '<th style="padding:8px">'+t('arr_col_ligne')+'</th><th style="padding:8px">'+t('arr_col_with_reason')+'</th><th style="padding:8px">'+t('arr_col_micro')+'</th></tr></thead><tbody>'
        + lignes.map(function(l){
            return '<tr><td style="padding:8px;font-weight:600">Line ' + l + '</td>'
              + '<td style="padding:8px;color:#ef4444">' + parLigne[l].raison + '</td>'
              + '<td style="padding:8px;color:#f59e0b">' + parLigne[l].micro + '</td></tr>';
          }).join('')
        + '</tbody></table>';
    }
  }

  // --- Arrets avec raison ---
  var wrapRaison = document.getElementById('arrets-raison-wrap');
  var countRaison = document.getElementById('arrets-raison-count');
  if(countRaison) countRaison.textContent = '(' + avecRaison.length + ')';
  if(wrapRaison){
    avecRaison.sort(function(x, y){ return (y.date + y.heure).localeCompare(x.date + x.heure); });
    if(!avecRaison.length){
      wrapRaison.innerHTML = '<div style="color:var(--tx3);font-size:13px;padding:12px">'+t('arr_none_with_reason')+'</div>';
    } else {
      var LIMITE = 200;
      var tronque = avecRaison.length > LIMITE;
      var affiches = avecRaison.slice(0, LIMITE);
      var html = '<table style="width:100%;border-collapse:collapse">'
        + '<thead><tr style="text-align:left;font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em">'
        + '<th style="padding:8px">'+t('arr_col_date')+'</th><th style="padding:8px">'+t('arr_col_heure')+'</th><th style="padding:8px">'+t('arr_col_duree')+'</th><th style="padding:8px">'+t('arr_col_ligne')+'</th><th style="padding:8px">'+t('ov_kcard_team')+'</th><th style="padding:8px">'+t('col_operator')+'</th><th style="padding:8px">'+t('arr_col_raison')+'</th></tr></thead><tbody>';
      html += affiches.map(function(a){
        var eq = equipeReelle(a.date, a.heure);
        var coul = COULEURS_EQUIPE[eq] || 'var(--tx2)';
        var dureeTxt = (a.duree != null) ? a.duree + ' min' : '-';
        var operateur = getOperateur(a.date, a.heure, a.ligne) || '-';
        return '<tr>'
          + '<td style="padding:8px;font-family:var(--mo);font-size:12px">' + dFR(a.date) + '</td>'
          + '<td style="padding:8px;font-family:var(--mo);font-size:12px">' + a.heure + '</td>'
          + '<td style="padding:8px;font-family:var(--mo);font-size:12px;color:var(--tx1)">' + dureeTxt + '</td>'
          + '<td style="padding:8px;font-size:12px;font-weight:600">Line ' + a.ligne + '</td>'
          + '<td style="padding:8px;font-size:12px;font-weight:600;color:' + coul + '">' + eq + '</td>'
          + '<td style="padding:8px;font-size:12px;color:var(--tx1)">' + operateur + '</td>'
          + '<td style="padding:8px;font-size:13px;color:#ef4444">' + arretLibelle(a.raison) + '</td>'
          + '</tr>';
      }).join('');
      html += '</tbody></table>';
      if(tronque) html += '<div style="text-align:center;color:var(--tx3);padding:10px;font-size:12px">'+t('arr_limited_to1') + LIMITE + t('arr_limited_to2') + avecRaison.length + t('arr_limited_to3')+'</div>';
      wrapRaison.innerHTML = html;
    }
  }

  // --- Micro-arrets ---
  var wrapMicro = document.getElementById('arrets-micro-wrap');
  var countMicro = document.getElementById('arrets-micro-count');
  var totalMicro = microstops.reduce(function(s, a){ return s + (a.nombre || 0); }, 0);
  if(countMicro) countMicro.textContent = '(' + totalMicro + t('arr_micro_count_sep') + microstops.length + t('arr_micro_count_days');
  if(wrapMicro){
    microstops.sort(function(x, y){ return y.date.localeCompare(x.date) || (y.nombre - x.nombre); });
    if(!microstops.length){
      wrapMicro.innerHTML = '<div style="color:var(--tx3);font-size:13px;padding:12px">'+t('arr_micro_none')+'</div>';
    } else {
      var LIMITE2 = 200;
      var tronque2 = microstops.length > LIMITE2;
      var affiches2 = microstops.slice(0, LIMITE2);
      var html2 = '<table style="width:100%;border-collapse:collapse">'
        + '<thead><tr style="text-align:left;font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em">'
        + '<th style="padding:8px">'+t('arr_col_date')+'</th><th style="padding:8px">'+t('arr_col_ligne')+'</th><th style="padding:8px">'+t('arr_micro_col_number')+'</th></tr></thead><tbody>';
      html2 += affiches2.map(function(a){
        return '<tr>'
          + '<td style="padding:8px;font-family:var(--mo);font-size:12px">' + dFR(a.date) + '</td>'
          + '<td style="padding:8px;font-size:12px;font-weight:600">Line ' + a.ligne + '</td>'
          + '<td style="padding:8px;font-size:13px;color:#f59e0b">' + a.nombre + '</td>'
          + '</tr>';
      }).join('');
      html2 += '</tbody></table>';
      if(tronque2) html2 += '<div style="text-align:center;color:var(--tx3);padding:10px;font-size:12px">'+t('arr_limited_days1') + LIMITE2 + t('arr_limited_days2') + microstops.length + t('arr_limited_days3')+'</div>';
      wrapMicro.innerHTML = html2;
    }
  }
}

function filtrerCmp2Ligne(ligne){
  CMP2_LIGNE_FILTRE = ligne;
  document.querySelectorAll('.cmp2-ligne-btn').forEach(function(b){
    var actif = b.dataset.ligne === ligne;
    b.classList.toggle('on', actif);
    b.style.background = actif ? 'var(--blue)' : 'none';
    b.style.color = actif ? '#fff' : 'var(--tx2)';
    b.style.borderColor = actif ? 'var(--blue)' : 'var(--bd2)';
  });
  buildComparaisonTab();
}

function filtrerCmp2EquipeOp(equipe){
  CMP2_EQUIPE_OP_FILTRE = equipe;
  document.querySelectorAll('.cmp2-equipe-op-btn').forEach(function(b){
    var nomBtn = b.dataset.equipe;
    var coul = nomBtn === 'all' ? 'var(--blue)' : (COULEURS_EQUIPE[nomBtn] || 'var(--blue)');
    var actif = nomBtn === equipe;
    b.classList.toggle('on', actif);
    b.style.background = actif ? coul : 'none';
    b.style.color = actif ? '#fff' : coul;
  });
  buildComparaisonTab();
}

function peuplerCmp2RaisonsSelect(){
  var sel = document.getElementById('cmp2-raison-select');
  if(!sel) return;
  var raisons = {};
  Object.values(ARRETS_DATA).forEach(function(a){
    if(a.type === 'avec_raison' && a.raison) raisons[a.raison] = true;
  });
  var liste = Object.keys(raisons).sort();
  var precedent = sel.value;
  sel.innerHTML = '<option value="all">' + t('arr_all_reasons') + '</option>' + liste.map(function(r){
    return '<option value="' + r.replace(/"/g,'&quot;') + '">' + r + '</option>';
  }).join('');
  if(liste.indexOf(precedent) !== -1) sel.value = precedent;
}

function buildComparaisonTab(){
  var raison = ARRETS_RAISON_FILTRE;
  var dateDebut = ARRETS_DATE_FILTRE;
  var dateFin = ARRETS_DATE_FIN_FILTRE;

  var arrets = Object.values(ARRETS_DATA).filter(function(a){ return a.type === 'avec_raison'; });
  if(ARRETS_LIGNE_FILTRE !== 'all') arrets = arrets.filter(function(a){ return a.ligne === ARRETS_LIGNE_FILTRE; });
  if(ARRETS_EQUIPE_FILTRE.length) arrets = arrets.filter(function(a){ return equipeDansSel(ARRETS_EQUIPE_FILTRE, equipeReelle(a.date, a.heure)); });
  if(raison !== 'all') arrets = arrets.filter(function(a){ return a.raison === raison; });
  if(dateDebut) arrets = arrets.filter(function(a){ return a.date >= dateDebut; });
  if(dateFin) arrets = arrets.filter(function(a){ return a.date <= dateFin; });

var wrapResume = document.getElementById('cmp2-resume-wrap');
  if(wrapResume){
    if(!arrets.length){
      wrapResume.style.display = 'none';
    } else {
      var totalMin = arrets.reduce(function(s, a){ return s + (a.duree || 0); }, 0);
      var h = Math.floor(totalMin / 60), m = totalMin % 60;
      wrapResume.style.display = 'block';
      wrapResume.innerHTML = '<b>' + arrets.length + '</b>' + t('cmp_resume_occ_suffix') + (raison !== 'all' ? t('cmp_resume_of') + raison + '"' : '') + t('cmp_resume_total') + '<b>' + h + 'h' + String(m).padStart(2,'0') + '</b>';
    }
  }

  // --- Evolution mois par mois, une courbe par equipe (P1 a P5) ---
  var ctxEvo = document.getElementById('cmp2EvolutionChart');
  if(ctxEvo && typeof Chart !== 'undefined'){
    // parMoisEquipe[mois][equipe] = {total, n}
    var parMoisEquipe = {};
    var tousLesMois = {};
    arrets.forEach(function(a){
      var mois = a.date.slice(0, 7); // YYYY-MM
      tousLesMois[mois] = true;
      var eq = equipeReelle(a.date, a.heure);
      if(!parMoisEquipe[mois]) parMoisEquipe[mois] = {};
      if(!parMoisEquipe[mois][eq]) parMoisEquipe[mois][eq] = { total: 0, n: 0 };
      parMoisEquipe[mois][eq].total += (a.duree || 0);
      parMoisEquipe[mois][eq].n++;
    });
    var moisTries = Object.keys(tousLesMois).sort();
    if(_cmp2EvolutionChart){ _cmp2EvolutionChart.destroy(); _cmp2EvolutionChart = null; }
    if(moisTries.length){
      var labelsMois = moisTries.map(function(m){
        var p = m.split('-');
        var noms = CMP2_MOIS_I18N[LANG]||CMP2_MOIS_I18N.fr;
        return noms[parseInt(p[1],10) - 1] + ' ' + p[0].slice(2);
      });
      var datasets = ['P1','P2','P3','P4','P5'].map(function(eq){
        var data = moisTries.map(function(m){
          var c = parMoisEquipe[m] && parMoisEquipe[m][eq];
          return c ? Math.round(c.total / c.n) : null;
        });
        var occ = moisTries.map(function(m){
          var c = parMoisEquipe[m] && parMoisEquipe[m][eq];
          return c ? c.n : 0;
        });
        return {
          label: eq === 'P5' ? t('arr_p5_moi') : eq,
          data: data,
          borderColor: COULEURS_EQUIPE[eq],
          backgroundColor: COULEURS_EQUIPE[eq],
          fill: false,
          tension: 0.25,
          pointRadius: 4,
          spanGaps: true,
          _occurrences: occ
        };
      });
      _cmp2EvolutionChart = new Chart(ctxEvo, {
        type: 'line',
        data: { labels: labelsMois, datasets: datasets },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: '#8b90a4' } },
            tooltip: {
              callbacks: {
                afterLabel: function(c){
                  var occ = c.dataset._occurrences[c.dataIndex];
                  return occ + t('cmp_month_occurrences');
                }
              }
            }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } },
            y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' }, title: { display: true, text: 'minutes', color: '#8b90a4' } }
          }
        }
      });
    }
  }

  // --- Comparaison par equipe ---
  var ctxEq = document.getElementById('cmp2EquipeChart');
  if(ctxEq && typeof Chart !== 'undefined'){
    var parEquipe = { P1: {total:0,n:0}, P2: {total:0,n:0}, P3: {total:0,n:0}, P4: {total:0,n:0}, P5: {total:0,n:0} };
    arrets.forEach(function(a){
      var eq = equipeReelle(a.date, a.heure);
      if(!parEquipe[eq]) return;
      parEquipe[eq].total += (a.duree || 0);
      parEquipe[eq].n++;
    });
    var equipes = ['P1','P2','P3','P4','P5'].filter(function(e){ return parEquipe[e].n > 0; });
    if(_cmp2EquipeChart){ _cmp2EquipeChart.destroy(); _cmp2EquipeChart = null; }
    if(equipes.length){
      var moyEq = equipes.map(function(e){ return Math.round(parEquipe[e].total / parEquipe[e].n); });
      var nEq = equipes.map(function(e){ return parEquipe[e].n; });
      _cmp2EquipeChart = new Chart(ctxEq, {
        type: 'bar',
        data: { labels: equipes.map(function(e){ return e === 'P5' ? t('arr_p5_moi') : e; }), datasets: [{ data: moyEq, backgroundColor: equipes.map(function(e){ return COULEURS_EQUIPE[e]; }) }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { afterLabel: function(c){ return nEq[c.dataIndex] + t('cmp_resume_occ_suffix'); } } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#8b90a4' } },
            y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' }, title: { display: true, text: 'minutes', color: '#8b90a4' } }
          }
        }
      });
    }
  }

  // --- Comparaison par operateur, filtree par equipe si choisie ---
  var ctxOp = document.getElementById('cmp2OperateurChart');
  if(ctxOp && typeof Chart !== 'undefined'){
    var arretsOp = arrets;
    if(CMP2_EQUIPE_OP_FILTRE !== 'all'){
      arretsOp = arretsOp.filter(function(a){ return equipeReelle(a.date, a.heure) === CMP2_EQUIPE_OP_FILTRE; });
    }
    var parOp2 = {};
    arretsOp.forEach(function(a){
      var op = getOperateur(a.date, a.heure, a.ligne);
      if(!op) return;
      op.split(', ').forEach(function(n){
        if(!parOp2[n]) parOp2[n] = { total: 0, n: 0 };
        parOp2[n].total += (a.duree || 0);
        parOp2[n].n++;
      });
    });
    var noms2 = Object.keys(parOp2).sort(function(x, y){ return (parOp2[y].total/parOp2[y].n) - (parOp2[x].total/parOp2[x].n); });
    if(_cmp2OperateurChart){ _cmp2OperateurChart.destroy(); _cmp2OperateurChart = null; }
    if(noms2.length){
      var moyOp = noms2.map(function(n){ return Math.round(parOp2[n].total / parOp2[n].n); });
      var nOp = noms2.map(function(n){ return parOp2[n].n; });
      _cmp2OperateurChart = new Chart(ctxOp, {
        type: 'bar',
        data: { labels: noms2, datasets: [{ data: moyOp, backgroundColor: '#3b82f6' }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { afterLabel: function(c){ return nOp[c.dataIndex] + t('cmp_resume_occ_suffix'); } } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#8b90a4' } },
            y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' }, title: { display: true, text: 'minutes', color: '#8b90a4' } }
          }
        }
      });
    }
  }
}

