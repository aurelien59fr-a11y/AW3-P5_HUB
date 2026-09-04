/* ============================================================
   Domaine NCP (Non-Conformites Produit) — Rendu et interactions
   Deplace tel quel depuis app.js (Etape 7 de la Phase 2), sans
   modification de comportement.

   buildNCPTab() (18,8 Ko) est le bloc le plus enchevetre du fichier
   d'origine (filtrage + agregation + generation HTML dans une seule
   fonction) — deplacee intacte, sans etre reecrite en interne, pour
   respecter la consigne « aucun changement de comportement » de la
   Phase 2 (meme principe que recalc() en Etape 5).

   IMPORTANT — patches successifs (IIFE) : dans le fichier d'origine,
   buildNCPTab, ncpKpiListe, ncpRendreListe et ncpDetail sont chacune
   REDEFINIES apres leur declaration de base par une ou plusieurs IIFE
   anonymes qui capturent l'ancienne version dans une fermeture et la
   remplacent par une version enrichie (tuiles KPI supplementaires,
   tri de liste, filtre par unite, verrouillage des ecritures pour le
   role "visiteur"). Ces IIFE sont deplacees ICI, a la suite de leur
   fonction de base, DANS LEUR ORDRE D'ORIGINE — l'ordre d'execution
   des redefinitions en chaine doit rester identique, sous peine de
   perdre silencieusement une couche de comportement. Voir
   TODO_PHASE_FUTURE.md pour le detail de chaque IIFE.
============================================================ */

var NCP_FILTRE_UNITE = 'all';

var NCP_FILTRE_DECOTE = false;

var NCP_FILTRE_TYPE = 'all';

var NCP_FILTRE_EQUIPE = 'all';

var NCP_FILTRE_DEBUT = '';

var NCP_FILTRE_FIN = '';

var NCP_PRESET_ACTIF = 'all';

var _ncpEvolutionChart = null, _ncpCausesChart = null, _ncpTonnageChart = null, _ncpLignesChart = null, _ncpProduitsChart = null;

var NCP_VUE = [];

function closeNCPList(){ var m = document.getElementById('ncp-list-modal'); if(m) m.style.display = 'none'; }

function ncpRendreListe(titre, rows){ var h = ''; if(!rows.length){ h = '<div style="font-size:12px;color:var(--tx3)">' + t('ncp_liste_vide') + '</div>'; } else { h = '<table class="bt" style="width:100%"><thead><tr><th>'+t('ncp_col_numero')+'</th><th>'+t('ncp_col_date')+'</th><th>'+t('ncp_col_unite')+'</th><th>'+t('ncp_col_ligne')+'</th><th>'+t('ncp_col_type')+'</th><th>'+t('ncp_col_declarant')+'</th><th>'+t('ncp_col_client')+'</th><th>'+t('ncp_col_palettes')+'</th><th>'+t('ncp_col_tonnage')+'</th><th>'+t('ncp_col_description')+'</th></tr></thead><tbody>'; rows.forEach(function(r){ h += '<tr style="cursor:pointer" onclick="ncpDetail(\'' + r.notification + '\')"><td style="color:#fff;font-weight:600">' + ncpEsc(r.notification) + '</td><td>' + ncpEsc(r.created_on || r.created_date_iso || '-') + '</td><td>' + ncpEsc(r.unite || '-') + '</td><td>' + ncpEsc(r.ligne || '-') + '</td><td>' + ncpEsc(r.type_ncp || '-') + '</td><td>' + ncpEsc(ncpNomAff(r.reporter)) + '</td><td>' + ncpEsc(r.famille_produit || '-') + '</td><td>' + (Number(r.total_pallets) || 0).toFixed(1) + '</td><td>' + (Number(r.total_tonnes) || 0).toFixed(2) + '</td><td style="max-width:320px;font-size:11px;color:var(--tx3)">' + ncpEsc(String(r.description || '').slice(0, 110)) + '</td></tr>'; }); h += '</tbody></table>'; } var tEl = document.getElementById('ncp-list-title'); if(tEl) tEl.textContent = titre + ' (' + rows.length + ')'; var bEl = document.getElementById('ncp-list-body'); if(bEl) bEl.innerHTML = h; var mEl = document.getElementById('ncp-list-modal'); if(mEl) mEl.style.display = 'flex'; }

function ncpListeDeclarant(cle){ var rows = (NCP_VUE || []).filter(function(r){ return ncpNomCle(r.reporter) === cle; }); ncpRendreListe(t('ncp_titre_declare_par').replace('{n}', ncpNomAff(cle)), rows); }

function ncpKpiListe(k){ var rows = (NCP_VUE || []).slice(); var titre = t('ncp_titre_total'); if(k === 'inpak'){ rows = rows.filter(function(r){ return r.type_ncp === 'Inpak'; }); titre = t('ncp_titre_inpak'); } else if(k === 'prod'){ rows = rows.filter(function(r){ return r.type_ncp === 'Production'; }); titre = t('ncp_titre_prod'); } else if(k === 'nonclasse'){ rows = rows.filter(ncpEstNonClasse); titre = t('ncp_titre_nonclasse'); } else if(k === 'tonnes'){ rows = rows.filter(function(r){ return (Number(r.total_tonnes) || 0) > 0; }).sort(function(a, b){ return (Number(b.total_tonnes) || 0) - (Number(a.total_tonnes) || 0); }); titre = t('ncp_titre_tonnage'); } else if(k === 'debloque'){
    rows = rows.filter(ncpEstDebloquee).sort(function(x, y){
      return (Number(y.total_tonnes) || 0) - (Number(x.total_tonnes) || 0);
    });
    titre = t('ncp_titre_debloque');
  } ncpRendreListe(titre, rows); }

function ncpBindKpi(){ var p = [['ncp-k-total','total'],['ncp-k-inpak','inpak'],['ncp-k-prod','prod'],
         ['ncp-k-tonnes','tonnes'],['ncp-k-debloque','debloque']]; p.forEach(function(x){ var el = document.getElementById(x[0]); var c = el ? el.parentNode : null; if(!c || c.getAttribute('data-kpibound')) return; c.setAttribute('data-kpibound','1'); c.style.cursor = 'pointer'; c.title = t('ncp_tooltip_ncp_concernes'); c.addEventListener('click', function(){ ncpKpiListe(x[1]); }); }); }

function ncpBuildDeclarants(rows){ ncpBindKpi(); var box = document.getElementById('ncp-declarants'); if(!box) return; var m = {}; rows.forEach(function(r){ if(!ncpEstNonClasse(r)) return; var k = ncpNomCle(r.reporter); if(!m[k]) m[k] = { n: 0, t: 0, u: {}, sem: 0, we: 0 }; m[k].n++; m[k].t += (Number(r.total_tonnes) || 0); if(r.unite) m[k].u[r.unite] = 1; if(r.created_date_iso){ var j = new Date(r.created_date_iso + 'T12:00:00').getDay(); if(j === 0 || j === 6) m[k].we++; else m[k].sem++; } }); var a = Object.keys(m).map(function(k){ return [k, m[k]]; }).sort(function(x, y){ return y[1].n - x[1].n; }); var tot = 0; a.forEach(function(x){ tot += x[1].n; }); var cnt = document.getElementById('ncp-decl-count'); var rat = 0; rows.forEach(function(r){ if(ncpEstNonClasse(r) && ncpBakorderLien(r)) rat++; }); if(cnt) cnt.textContent = '(' + t('ncp_decl_count').replace('{n}', a.length).replace('{tot}', tot).replace('{rat}', rat) + ')'; if(!a.length){ box.innerHTML = '<div style="font-size:12px;color:var(--tx3)">' + t('ncp_decl_aucun') + '</div>'; return; } var h = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px">'; a.forEach(function(x){ var v = x[1]; var un = Object.keys(v.u).sort().join(' '); h += '<div onclick="ncpListeDeclarant(\'' + x[0] + '\')" style="cursor:pointer;border:1px solid var(--bd);border-radius:10px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px"><div><div style="font-size:13px;font-weight:600;color:#fff">' + ncpEsc(ncpNomAff(x[0])) + '</div><div style="font-size:10px;color:var(--tx3);margin-top:3px">' + (un || t('ncp_decl_unite_inconnue')) + ' - ' + v.t.toFixed(1) + ' t - ' + t('ncp_decl_semaine').replace('{s}', v.sem).replace('{w}', v.we) + '</div></div><div style="font-size:18px;font-weight:700;color:#a78bfa">' + v.n + '</div></div>'; }); h += '</div>'; box.innerHTML = h; }

function ncpToggleDeCote(notif){
  if(!db){ toast('Connexion Firebase non disponible', '#ef4444'); return; }
  var r = NCP_DATA.find(function(x){ return String(x.notification) === String(notif); });
  if(!r) return;
  var nouveauEtat = !r.de_cote;
  db.ref('ncp_data/' + notif + '/de_cote').set(nouveauEtat || null).then(function(){
    r.de_cote = nouveauEtat;
    toast(nouveauEtat ? 'Mis de cote' : 'Retire des mis de cote', '#3b82f6');
    ncpDetail(notif);
    if(document.getElementById('ncp-tbody')) buildNCPTab();
  }).catch(function(e){ toast('Erreur : ' + e.message, '#ef4444'); });
}

function ncpOpenComment(notif){
  var r = NCP_DATA.find(function(x){ return String(x.notification) === String(notif); });
  if(!r) return;
  var prev = r.commentaire_perso || '';
  var d = document.createElement('div');
  d.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:99999;display:flex;align-items:center;justify-content:center';
  d.id = 'ncp-cm-popup';
  d.innerHTML = '<div style="background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:12px;padding:24px;width:420px;max-width:95vw">'
    + '<div style="font-weight:700;font-size:15px;margin-bottom:4px">Note perso &mdash; NCP ' + ncpEsc(notif) + '</div>'
    + (r.commentaire_date ? '<div style="font-size:11px;color:var(--tx3);margin-bottom:12px">Derniere modif : ' + ncpEsc(r.commentaire_date) + (r.commentaire_par ? ' par ' + ncpEsc(r.commentaire_par) : '') + '</div>' : '<div style="margin-bottom:12px"></div>')
    + '<textarea id="ncp-cm-txt" style="width:100%;height:110px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:8px;color:var(--tx1);font-family:var(--fn);font-size:13px;padding:10px;resize:vertical">' + ncpEsc(prev) + '</textarea>'
    + '<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end">'
    + '<button onclick="document.getElementById(\'ncp-cm-popup\').remove()" style="padding:8px 16px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);cursor:pointer">Annuler</button>'
    + '<button onclick="ncpSaveComment(\'' + notif + '\')" style="padding:8px 16px;border-radius:var(--r);border:none;background:var(--blue);color:#fff;font-family:var(--fn);font-weight:600;cursor:pointer">Enregistrer</button>'
    + '</div></div>';
  document.body.appendChild(d);
  d.addEventListener('click', function(e){ if(e.target === d) d.remove(); });
  document.getElementById('ncp-cm-txt').focus();
}

function ncpSaveComment(notif){
  if(!db){ toast('Connexion Firebase non disponible', '#ef4444'); return; }
  var txt = document.getElementById('ncp-cm-txt').value.trim();
  var r = NCP_DATA.find(function(x){ return String(x.notification) === String(notif); });
  var qui = currentUser ? (currentUser.name || currentUser.email || '?') : '?';
  var quand = new Date().toLocaleDateString('fr-BE');
  var maj = txt
    ? { commentaire_perso: txt, commentaire_par: qui, commentaire_date: quand }
    : { commentaire_perso: null, commentaire_par: null, commentaire_date: null };
  db.ref('ncp_data/' + notif).update(maj).then(function(){
    if(r){ r.commentaire_perso = maj.commentaire_perso; r.commentaire_par = maj.commentaire_par; r.commentaire_date = maj.commentaire_date; }
    var p = document.getElementById('ncp-cm-popup'); if(p) p.remove();
    toast(txt ? 'Commentaire enregistre' : 'Commentaire supprime', '#10b981');
    ncpDetail(notif);
  }).catch(function(e){ toast('Erreur : ' + e.message, '#ef4444'); });
}

function ncpToggleControle(notif){
  if(!db){ toast('Connexion Firebase non disponible', '#ef4444'); return; }
  var r = NCP_DATA.find(function(x){ return String(x.notification) === String(notif); });
  if(!r) return;
  var nouveauEtat = !r.controle_perso;
  var chemin = 'ncp_data/' + notif;
  var qui = currentUser ? (currentUser.name || currentUser.email || '?') : '?';
  var quand = new Date().toLocaleDateString('fr-BE');
  var maj = nouveauEtat
    ? { controle_perso: true, controle_par: qui, controle_date: quand }
    : { controle_perso: null, controle_par: null, controle_date: null };
  db.ref(chemin).update(maj).then(function(){
    r.controle_perso = nouveauEtat; r.controle_par = maj.controle_par; r.controle_date = maj.controle_date;
    toast(nouveauEtat ? 'Marque comme controle' : 'Controle retire', '#10b981');
    ncpDetail(notif);
  }).catch(function(e){ toast('Erreur : ' + e.message, '#ef4444'); });
}

function ncpTraduire(){
  var body = document.getElementById('ncp-detail-body');
  if(!body) return;
  var btn = document.getElementById('ncp-traduire-btn');
  if(btn){ btn.disabled = true; btn.textContent = '\u23f3 Traduction...'; }
  var blocs = body.querySelectorAll('.ncp-tr');
  var taches = [];
  blocs.forEach(function(el){
    if(el.getAttribute('data-original') === null){
      el.setAttribute('data-original', el.textContent);
    }
    var original = el.getAttribute('data-original');
    taches.push(ncpTraduireTexte(original).then(function(trad){ el.textContent = trad; }));
  });
  Promise.all(taches).then(function(){
    if(btn){
      btn.disabled = false;
      btn.innerHTML = '&#8617; Original';
      btn.onclick = ncpRevenirOriginal;
    }
  });
}

function ncpRevenirOriginal(){
  var body = document.getElementById('ncp-detail-body');
  if(!body) return;
  body.querySelectorAll('.ncp-tr').forEach(function(el){
    var o = el.getAttribute('data-original');
    if(o !== null) el.textContent = o;
  });
  var btn = document.getElementById('ncp-traduire-btn');
  if(btn){ btn.innerHTML = '&#127760; Traduire'; btn.onclick = ncpTraduire; }
}

function ncpInitClicks(){ var tb = document.getElementById('ncp-tbody'); if(!tb || tb.getAttribute('data-clickbound')) return; tb.setAttribute('data-clickbound','1'); tb.style.cursor = 'pointer'; tb.addEventListener('click', function(e){ var tr = (e.target && e.target.closest) ? e.target.closest('tr') : null; if(!tr || !tr.cells || !tr.cells[0]) return; var c = tr.getAttribute('data-notif') || ''; if(!c){ var mm = tr.cells[0].textContent.match(/\d{6,}/); c = mm ? mm[0] : ''; } if(c && c !== '-') ncpDetail(c); }); }

function closeNCPDetail(){ var m = document.getElementById('ncp-detail-modal'); if(m) m.style.display = 'none'; }

function ncpDetail(notif){ var r = null, i; for(i = 0; i < NCP_DATA.length; i++){ if(String(NCP_DATA[i].notification) === String(notif)){ r = NCP_DATA[i]; break; } } if(!r) return; var f = [['Numero', r.notification], ['Date de creation', r.created_on + (ncpJour(r.created_on) ? ' (' + ncpJour(r.created_on) + ')' : '')], ['Heure fiche', r.created_heure], ['Unite', r.unite], ['Ligne', r.ligne], ['Operateur(s) INPAK', ncpOperateurs(r) || (r.type_ncp === 'Inpak' ? 'non identifie' : '-')], ['Type', r.type_ncp], ['Source de l heure', ncpLibelleSrc(r)], ['Bakorder', ncpBakorder(r) || '-'], ['Production rattachable', (ncpBakorderLien(r) || ['-']).join(' | ')], ['Declarant', r.reporter], ['Statut', r.status], ['Code produit', r.code_produit], ['Client', r.famille_produit], ['Palettes', (Number(r.total_pallets) || 0).toFixed(1)], ['Tonnage', (Number(r.total_tonnes) || 0).toFixed(2) + ' t'], ['Priorite', r.priority], ['Site', r.plant], ['Responsable', r.person_responsible], ['Fichier PDF', r.fichier]]; var h = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px"><div class="ncp-tr" style="font-size:16px;font-weight:600">' + ncpEsc(r.description) + '</div><div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end">'
  + '<button id="ncp-decote-btn" onclick="ncpToggleDeCote(\'' + r.notification + '\')" style="padding:5px 12px;border-radius:99px;border:1px solid ' + (r.de_cote ? 'var(--blue)' : 'var(--bd2)') + ';background:' + (r.de_cote ? 'rgba(59,130,246,.12)' : 'none') + ';color:' + (r.de_cote ? 'var(--blue)' : 'var(--tx2)') + ';font-family:var(--fn);font-size:11px;cursor:pointer;white-space:nowrap">' + (r.de_cote ? '&#128204; De cote' : '&#128204; Mettre de cote') + '</button>'
  + '<button id="ncp-comment-btn" onclick="ncpOpenComment(\'' + r.notification + '\')" style="padding:5px 12px;border-radius:99px;border:1px solid ' + (r.commentaire_perso ? 'var(--amber)' : 'var(--bd2)') + ';background:' + (r.commentaire_perso ? 'rgba(245,158,11,.12)' : 'none') + ';color:' + (r.commentaire_perso ? 'var(--amber)' : 'var(--tx2)') + ';font-family:var(--fn);font-size:11px;cursor:pointer;white-space:nowrap">&#9998; ' + (r.commentaire_perso ? 'Commentaire' : 'Commenter') + '</button>'
  + '<button id="ncp-controle-btn" onclick="ncpToggleControle(\'' + r.notification + '\')" style="padding:5px 12px;border-radius:99px;border:1px solid ' + (r.controle_perso ? 'var(--green)' : 'var(--bd2)') + ';background:' + (r.controle_perso ? 'rgba(16,185,129,.12)' : 'none') + ';color:' + (r.controle_perso ? 'var(--green)' : 'var(--tx2)') + ';font-family:var(--fn);font-size:11px;cursor:pointer;white-space:nowrap">' + (r.controle_perso ? '&#10003; Controle' : '&#9711; Marquer controle') + '</button>'
  + '<button id="ncp-traduire-btn" onclick="ncpTraduire()" style="padding:5px 12px;border-radius:99px;border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:11px;cursor:pointer;white-space:nowrap">&#127760; Traduire</button>'
  + '</div></div>';
if(r.controle_perso) h += '<div style="font-size:11px;color:var(--green);margin-bottom:6px">&#10003; Controle par ' + ncpEsc(r.controle_par || '?') + ' le ' + ncpEsc(r.controle_date || '?') + '</div>';
if(r.commentaire_perso) h += '<div style="font-size:12px;color:var(--tx1);background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);border-radius:8px;padding:8px 10px;margin-bottom:10px;white-space:pre-wrap"><span style="color:var(--amber);font-weight:600">&#9998; Note perso</span> (' + ncpEsc(r.commentaire_par || '?') + ', ' + ncpEsc(r.commentaire_date || '?') + ') :<br>' + ncpEsc(r.commentaire_perso) + '</div>';
if(r.ncp_partage) h += '<div style="font-size:12px;color:var(--amber);margin-bottom:10px">Fiche repartie sur ' + r.ncp_partage + ' lignes : palettes et tonnage divises</div>'; h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 18px;margin-bottom:16px">'; f.forEach(function(c){ h += '<div style="display:flex;justify-content:space-between;gap:10px;border-bottom:1px solid var(--bd);padding:3px 0"><span style="font-size:11px;color:var(--tx3)">' + c[0] + '</span><span style="font-size:12px;text-align:right">' + ncpEsc(c[1] || '-') + '</span></div>'; });
  var auto = (function(){ var save = r.equipe_override; r.equipe_override = null; var v = ncpGetEquipe(r); r.equipe_override = save; return v; })();
  var equipes5 = ['P1','P2','P3','P4','P5'];
  h += '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid var(--bd);padding:3px 0">'
    + '<span style="font-size:11px;color:var(--tx3)">Equipe' + (r.equipe_override ? ' <span style="color:var(--amber)" title="Corrigee manuellement, deduction auto : ' + (auto || 'non deduite') + '">(corrigee)</span>' : '') + '</span>'
    + '<select onchange="ncpSetEquipeOverride(\'' + r.notification + '\', this.value===\'auto\'?null:this.value)" style="font-size:12px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:var(--tx1);border:1px solid var(--bd2);border-radius:6px;padding:2px 6px">'
    + '<option value="auto"' + (!r.equipe_override ? ' selected' : '') + '>Auto (' + (auto || 'non deduite') + ')</option>'
    + equipes5.map(function(e){ return '<option value="' + e + '"' + (r.equipe_override === e ? ' selected' : '') + '>' + e + '</option>'; }).join('')
    + '</select></div>';
  /* Corrections manuelles : unite, ligne, operateur. Disponibles sur TOUTES les
     fiches. Chaque menu affiche entre parentheses ce que la deduction automatique
     avait trouve, pour qu'on voie ce qu'on remplace. Repasser sur "Auto" efface
     l'override et rend la main a la deduction. */
  var _uAuto = r.unite_override ? (r.unite_avant_override || 'non deduite') : (r.unite || 'non deduite');
  var _lAuto = r.ligne_override ? (r.ligne_avant_override || 'non deduite') : (r.ligne || 'non deduite');
  var _opAuto = (function(){ var sv = r.operateur_override; r.operateur_override = null; var v = ncpOperateurs(r); r.operateur_override = sv; return v || 'non deduit'; })();
  var _selSty = 'font-size:12px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:var(--tx1);border:1px solid var(--bd2);border-radius:6px;padding:2px 6px';
  var _rowSty = 'display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid var(--bd);padding:3px 0';
  var _lblSty = 'font-size:11px;color:var(--tx3)';
  var _marque = function(actif, auto){ return actif ? ' <span style="color:var(--amber)" title="Corrige manuellement, deduction auto : ' + ncpEsc(auto) + '">(corrige)</span>' : ''; };
  h += '<div style="' + _rowSty + '"><span style="' + _lblSty + '">Unite' + _marque(r.unite_override, _uAuto) + '</span>'
    + '<select onchange="ncpSetUniteOverride(\'' + r.notification + '\', this.value===\'auto\'?null:this.value)" style="' + _selSty + '">'
    + '<option value="auto"' + (!r.unite_override ? ' selected' : '') + '>Auto (' + ncpEsc(_uAuto) + ')</option>'
    + ['AW1','AW2','AW3'].map(function(u){ return '<option value="' + u + '"' + (r.unite_override === u ? ' selected' : '') + '>' + u + '</option>'; }).join('')
    + '</select></div>';
  var _lignesU = (r.unite === 'AW1') ? [1,2,3,4,5,6,7,8,9,10,11,12] : (r.unite === 'AW2') ? [21,22,23,24,25,26] : (r.unite === 'AW3') ? [31,32,33,34,35,36] : [1,2,3,4,5,6,7,8,9,10,11,12,21,22,23,24,25,26,31,32,33,34,35,36];
  h += '<div style="' + _rowSty + '"><span style="' + _lblSty + '">Ligne' + _marque(r.ligne_override, _lAuto) + '</span>'
    + '<select onchange="ncpSetLigneOverride(\'' + r.notification + '\', this.value===\'auto\'?null:this.value)" style="' + _selSty + '">'
    + '<option value="auto"' + (!r.ligne_override ? ' selected' : '') + '>Auto (' + ncpEsc(_lAuto) + ')</option>'
    + '<option value="aucune"' + (r.ligne_override === 'aucune' ? ' selected' : '') + '>Aucune ligne</option>'
    + _lignesU.map(function(n){ var v = 'L' + ('0' + n).slice(-2); return '<option value="' + v + '"' + (r.ligne_override === v ? ' selected' : '') + '>' + v + '</option>'; }).join('')
    + '</select></div>';
  h += '<div style="' + _rowSty + '"><span style="' + _lblSty + '">Operateur' + _marque(r.operateur_override, _opAuto) + '</span>'
    + '<span style="display:flex;gap:4px;align-items:center">'
    + '<input id="ncp-op-input" list="ncp-op-datalist" value="' + ncpEsc(r.operateur_override || '') + '" placeholder="' + ncpEsc(_opAuto) + '" style="' + _selSty + ';width:150px" />'
    + '<datalist id="ncp-op-datalist">' + ((typeof EMP !== 'undefined' && EMP) ? EMP.map(function(e){ return '<option value="' + ncpEsc(e.n) + '"></option>'; }).join('') : '') + '</datalist>'
    + '<button onclick="ncpSetOperateurOverride(\'' + r.notification + '\', document.getElementById(\'ncp-op-input\').value)" style="font-size:11px;padding:3px 9px;border-radius:6px;border:1px solid var(--bd2);background:none;color:var(--tx2);cursor:pointer;font-family:var(--fn)">OK</button>'
    + '</span></div>';
  h += '</div>'; var bloc = function(t, v){ if(Array.isArray(v)) v = v.join(' | '); return v ? '<div style="margin-bottom:12px"><div style="font-size:11px;color:var(--tx3);text-transform:uppercase;margin-bottom:4px">' + t + '</div><div class="ncp-tr" style="font-size:12px;white-space:pre-wrap">' + ncpEsc(v) + '</div></div>' : ''; }; h += bloc('Probleme', r.problems) + bloc('Mesures', r.measures) + bloc('Toutes les mesures', r.toutes_mesures) + bloc('Info palettes', r.ncp_extra_info); var hist = r.historique_actions || []; if(hist.length){ h += '<div style="font-size:11px;color:var(--tx3);text-transform:uppercase;margin-bottom:6px">Historique (' + hist.length + ' version(s))</div>'; hist.forEach(function(v){ h += '<div style="border-left:2px solid var(--bd2);padding-left:10px;margin-bottom:10px"><div style="font-size:11px;color:var(--tx3);font-family:var(--mo)">' + ncpEsc(v.date_version) + (ncpJour(v.date_version) ? ' (' + ncpJour(v.date_version) + ')' : '') + '</div><div class="ncp-tr" style="font-size:12px;white-space:pre-wrap">' + ncpEsc(v.detail) + '</div></div>'; }); } var deg = r.degustationsLiees || []; if(deg.length){ h += '<div style="font-size:11px;color:var(--tx3);text-transform:uppercase;margin-bottom:6px;margin-top:14px">Degustations liees (' + deg.length + ')</div>'; deg.forEach(function(d){ var dt = d.dateProduction ? (new Date(d.dateProduction).toLocaleString('fr-BE') + ' (' + ncpJour(d.dateProduction) + ')') : '-'; h += '<div style="border-left:2px solid var(--blue);padding-left:10px;margin-bottom:10px">' + '<div style="font-size:11px;color:var(--tx3);font-family:var(--mo)">' + ncpEsc(dt) + ' &middot; ' + ncpEsc(d.ligne || '-') + (d.employe ? ' &middot; ' + ncpEsc(d.employe) : '') + '</div>' + '<div style="font-size:12px">' + ncpEsc(d.produit || '-') + (d.bakorder ? ' (bakorder ' + ncpEsc(d.bakorder) + ')' : '') + '</div>' + (d.remarque ? '<div style="font-size:12px;color:var(--tx2);white-space:pre-wrap">' + ncpEsc(d.remarque) + '</div>' : '') + (d.actionEffectuee ? '<div style="font-size:12px;color:var(--amber);white-space:pre-wrap">&#8594; ' + ncpEsc(d.actionEffectuee) + '</div>' : '') + '</div>'; }); } var body = document.getElementById('ncp-detail-body'); if(body) body.innerHTML = h; var md = document.getElementById('ncp-detail-modal'); if(md) md.style.display = 'flex'; }

function filtrerNCPUnite(u){
  NCP_FILTRE_UNITE = u;
  document.querySelectorAll('.ncp-unite-btn').forEach(function(b){
    var on = b.dataset.unite === u;
    b.classList.toggle('on', on);
    b.style.background = on ? 'var(--blue)' : 'none';
    b.style.color = on ? '#fff' : 'var(--tx2)';
    b.style.borderColor = on ? 'var(--blue)' : 'var(--bd2)';
  });
  buildNCPTab();
}

function filtrerNCPType(ty){
  NCP_FILTRE_TYPE = ty;
  document.querySelectorAll('.ncp-type-btn').forEach(function(b){
    var on = b.dataset.type === ty;
    var couleur = ty === 'Inpak' ? 'var(--amber)' : ty === 'Production' ? 'var(--red)' : 'var(--blue)';
    b.classList.toggle('on', on);
    b.style.background = on ? (b.dataset.type === 'all' ? 'var(--blue)' : couleur) : 'none';
    b.style.color = on ? '#fff' : (b.dataset.type === 'all' ? 'var(--tx2)' : couleur);
  });
  buildNCPTab();
}

function filtrerNCPEquipe(e){
  NCP_FILTRE_EQUIPE = e;
  document.querySelectorAll('.ncp-equipe-btn').forEach(function(b){
    var on = b.dataset.equipe === e;
    var couleur = b.dataset.equipe === 'all' ? 'var(--blue)' : COULEURS_EQUIPE[b.dataset.equipe];
    b.classList.toggle('on', on);
    b.style.background = on ? couleur : 'none';
    b.style.color = on ? '#fff' : couleur;
  });
  buildNCPTab();
}

function majNCPPresets(){
  document.querySelectorAll('.ncp-preset-btn').forEach(function(b){
    b.classList.toggle('on', b.dataset.preset === NCP_PRESET_ACTIF);
  });
}

function filtrerNCPDates(){
  var eD = document.getElementById('ncp-date-debut');
  var eF = document.getElementById('ncp-date-fin');
  NCP_FILTRE_DEBUT = eD ? eD.value : '';
  NCP_FILTRE_FIN = eF ? eF.value : '';
  // Si les deux bornes sont inversees, on les remet dans l ordre
  if(NCP_FILTRE_DEBUT && NCP_FILTRE_FIN && NCP_FILTRE_DEBUT > NCP_FILTRE_FIN){
    var tmp = NCP_FILTRE_DEBUT;
    NCP_FILTRE_DEBUT = NCP_FILTRE_FIN;
    NCP_FILTRE_FIN = tmp;
    if(eD) eD.value = NCP_FILTRE_DEBUT;
    if(eF) eF.value = NCP_FILTRE_FIN;
  }
  NCP_PRESET_ACTIF = (!NCP_FILTRE_DEBUT && !NCP_FILTRE_FIN) ? 'all' : 'perso';
  majNCPPresets();
  buildNCPTab();
}

function ncpPresetPeriode(cle){
  NCP_PRESET_ACTIF = cle;
  var auj = new Date();
  var debut = '', fin = '';
  if(cle !== 'all'){
    fin = ncpISO(auj);
    var d;
    if(cle === 'mois'){
      d = new Date(auj.getFullYear(), auj.getMonth(), 1);
    } else if(cle === 'annee'){
      d = new Date(auj.getFullYear(), 0, 1);
    } else {
      d = new Date(auj.getTime());
      d.setDate(d.getDate() - parseInt(cle, 10));
    }
    debut = ncpISO(d);
  }
  NCP_FILTRE_DEBUT = debut;
  NCP_FILTRE_FIN = fin;
  var eD = document.getElementById('ncp-date-debut'); if(eD) eD.value = debut;
  var eF = document.getElementById('ncp-date-fin'); if(eF) eF.value = fin;
  majNCPPresets();
  buildNCPTab();
}

var _ncpFamillesChart = null;

var NCP_RECHERCHE = '';

var NCP_TOUT = false;

var _ncpRechTimer = null;

function ncpRecherche(){ var e = document.getElementById('ncp-recherche'); NCP_RECHERCHE = e ? e.value.trim().toLowerCase() : ''; if(_ncpRechTimer) clearTimeout(_ncpRechTimer); _ncpRechTimer = setTimeout(buildNCPTab, 260); }

function ncpToggleFiltreDecote(){
  NCP_FILTRE_DECOTE = !NCP_FILTRE_DECOTE;
  var b = document.getElementById('ncp-btn-decote');
  if(b){
    b.textContent = (NCP_FILTRE_DECOTE ? '\u2713 ' : '') + '\ud83d\udccc Mis de cote';
    b.style.borderColor = NCP_FILTRE_DECOTE ? 'var(--blue)' : 'var(--bd2)';
    b.style.color = NCP_FILTRE_DECOTE ? 'var(--blue)' : 'var(--tx2)';
    b.style.background = NCP_FILTRE_DECOTE ? 'rgba(59,130,246,.12)' : 'none';
  }
  buildNCPTab();
}

function ncpInjecterBoutonDecote(){
  if(document.getElementById('ncp-btn-decote')) return;
  var ref = document.getElementById('ncp-btn-tout');
  if(!ref || !ref.parentNode) return;
  var b = document.createElement('button');
  b.id = 'ncp-btn-decote';
  b.textContent = '\ud83d\udccc Mis de cote';
  b.style.cssText = 'padding:6px 14px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:12px;cursor:pointer;margin-left:8px';
  b.onclick = ncpToggleFiltreDecote;
  ref.parentNode.insertBefore(b, ref.nextSibling);
}

function ncpToggleTout(){ NCP_TOUT = !NCP_TOUT; var b = document.getElementById('ncp-btn-tout'); if(b) b.textContent = NCP_TOUT ? t('ncp_limiter_200') : t('ncp_tout_afficher'); buildNCPTab(); }

function ncpExportCSV(){ var rows = NCP_VUE || []; var NL = String.fromCharCode(13, 10); var head = ['Numero','Date','Heure','Source heure','Unite','Ligne','Equipe','Type','Bakorder','Produit','Client','Palettes','Tonnage','Statut','Declarant','Motifs','Description']; var q = function(v){ return '"' + String(v == null ? '' : v).replace(/"/g, '""').replace(/\s+/g, ' ') + '"'; }; var lignes = [head.map(q).join(';')]; rows.forEach(function(r){ var hi = ncpHeureInfo(r); lignes.push([r.notification, r.created_on, hi.heure || '', hi.src || '', r.unite, r.ligne, ncpGetEquipe(r) || '', r.type_ncp, ncpBakorder(r) || '', r.code_produit, r.famille_produit, (Number(r.total_pallets) || 0).toFixed(1), (Number(r.total_tonnes) || 0).toFixed(2), r.status, r.reporter, r.problems, r.description].map(q).join(';')); }); var blob = new Blob([String.fromCharCode(65279) + lignes.join(NL)], { type: 'text/csv;charset=utf-8' }); var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'NCP_export_' + new Date().toISOString().slice(0, 10) + '.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); }

var _ncpDelaiChart = null;

var NCP_RECUR = [];

function ncpBuildRecurrences(rows){ var box = document.getElementById('ncp-recurrences'); if(!box) return; var m = {}; rows.forEach(function(r){ if(!r.problems) return; var vus = {}; String(r.problems).split('|').forEach(function(p){ var lib = p.trim(); if(!lib) return; var fa = ncpFamille(lib); if(vus[fa]) return; vus[fa] = 1; var k = (r.famille_produit || '?') + ' ' + (r.code_produit || '?') + ' > ' + fa; if(!m[k]) m[k] = { n: 0, t: 0, ids: {} }; m[k].n++; m[k].t += (Number(r.total_tonnes) || 0); m[k].ids[String(r.notification)] = 1; }); }); NCP_RECUR = Object.keys(m).filter(function(k){ return m[k].n >= 3; }).sort(function(x, y){ return m[y].n - m[x].n; }).slice(0, 18).map(function(k){ return { k: k, n: m[k].n, t: m[k].t, ids: Object.keys(m[k].ids) }; }); if(!NCP_RECUR.length){ box.innerHTML = '<div style="font-size:12px;color:var(--tx3)">' + t('ncp_aucune_recurrence') + '</div>'; return; } var h = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:8px">'; NCP_RECUR.forEach(function(x, i){ h += '<div onclick="ncpListeRecurrence(' + i + ')" style="cursor:pointer;border:1px solid var(--bd);border-radius:10px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px"><div><div style="font-size:12px;font-weight:600;color:#fff">' + ncpEsc(x.k) + '</div><div style="font-size:10px;color:var(--tx3);margin-top:3px">' + t('ncp_bloque_au_total').replace('{t}', x.t.toFixed(1)) + '</div></div><div style="font-size:18px;font-weight:700;color:var(--amber)">' + x.n + '</div></div>'; }); h += '</div>'; box.innerHTML = h; }

function ncpListeRecurrence(i){ var x = NCP_RECUR[i]; if(!x) return; var rows = (NCP_VUE || []).filter(function(r){ return x.ids.indexOf(String(r.notification)) >= 0; }); ncpRendreListe(t('ncp_recurrence_titre').replace('{k}', x.k), rows); }

function ncpEtiquetteMulti(r){                     // "+P2" a coller derriere l'equipe
  var mm = ncpEquipesMulti(r);
  if(!mm.multi) return '';
  return ' <span style="color:#8b5cf6;font-size:11px" title="NCP a cheval sur plusieurs postes : '
    + mm.equipes.map(function(e){ return e.equipe+' '+Math.round(e.part*100)+'%'; }).join(' + ')
    + ' (source : '+mm.src+')">+'
    + mm.equipes.slice(1).map(function(e){ return e.equipe; }).join('/') + '</span>';
}

function ncpBadgeSrc(r){ var i = ncpHeureInfo(r); if(i.src === 'degustation') return ' <span title="Heure reelle prise sur la degustation liee (la plus fiable)" style="color:#10b981">&#9679;</span>'; if(i.src === 'fiche') return ''; if(i.src === 'texte') return ' <span title="Heure du defaut lue dans le texte du NCP (prioritaire sur l heure de la fiche)" style="color:var(--amber)">~</span>'; return ' <span title="Aucune heure exploitable : equipe non deduite" style="color:var(--tx3)">*</span>'; }

function ncpMajCouverture(rows){ var el = document.getElementById('ncp-couverture'); if(!el) return; var d = 0, f = 0, x = 0, n = 0, pl = 0, mu = 0;
  rows.forEach(function(r){
    var m = ncpEquipesMulti(r);
    if(m.src === 'declarant'){ n++; return; }
    if(!m.principale) return;
    if(m.src === 'degustation' || m.src === 'degustation-plage') d++;
    else if(m.src === 'texte-plage'){ x++; pl++; }
    else if(m.src === 'texte') x++;
    else if(m.src === 'fiche') f++;
    if(m.multi) mu++;
  });
  var tot = rows.length, att = d + f + x;
  el.innerHTML = '<br>' + t('ncp_couverture_text')
    .replace('{att}', att).replace('{tot}', tot)
    .replace('{pct}', tot ? Math.round(att/tot*100) : 0)
    .replace('{d}', d).replace('{x}', x).replace('{pl}', pl)
    .replace('{f}', f).replace('{mu}', mu).replace('{n}', n);
  }

function ncpSetEquipeOverride(notif, valeur){
  if(!db){ toast('Connexion Firebase non disponible', '#ef4444'); return; }
  var r = NCP_DATA.find(function(x){ return String(x.notification) === String(notif); });
  var chemin = 'ncp_data/' + notif + '/equipe_override';
  var ecrire = valeur ? db.ref(chemin).set(valeur) : db.ref(chemin).remove();
  ecrire.then(function(){
    if(r) r.equipe_override = valeur || null;
    toast(valeur ? ('Equipe forcee a ' + valeur) : 'Retour a la deduction automatique', '#10b981');
    ncpDetail(notif);
  }).catch(function(e){ toast('Erreur : ' + e.message, '#ef4444'); });
}

function buildNCPTab(){
  ncpInjecterBoutonDecote();
  var emptyState = document.getElementById('ncp-empty-state');
  var contentWrap = document.getElementById('ncp-content-wrap');
  if(!NCP_DATA || NCP_DATA.length === 0){
    if(emptyState) emptyState.style.display = 'block';
    if(contentWrap) contentWrap.style.display = 'none';
    return;
  }
  if(emptyState) emptyState.style.display = 'none';
  if(contentWrap) contentWrap.style.display = 'block';

  var filtres = NCP_DATA.filter(function(r){
    if(NCP_FILTRE_DECOTE && !r.de_cote) return false;
    if(NCP_FILTRE_UNITE !== 'all' && r.unite !== NCP_FILTRE_UNITE) return false;
    if(NCP_FILTRE_TYPE !== 'all' && r.type_ncp !== NCP_FILTRE_TYPE) return false;
    if(NCP_FILTRE_EQUIPE !== 'all' && !ncpConcerneEquipe(r, NCP_FILTRE_EQUIPE)) return false;
    if(NCP_FILTRE_DEBUT && (!r.created_date_iso || r.created_date_iso < NCP_FILTRE_DEBUT)) return false;
    if(NCP_FILTRE_FIN && (!r.created_date_iso || r.created_date_iso > NCP_FILTRE_FIN)) return false; if(NCP_RECHERCHE && ncpTexteRecherche(r).indexOf(NCP_RECHERCHE) < 0) return false;
    return true;
  });

  // Filtres actifs mais aucun resultat : message clair plutot que des graphiques vides
  if(filtres.length === 0){
    ['ncp-k-total','ncp-k-inpak','ncp-k-prod','ncp-k-tonnes','ncp-k-debloque','ncp-k-sl-inpak','ncp-k-sl-prod'].forEach(function(id){
      var el = document.getElementById(id); if(el) el.textContent = '0';
    });
    var elPer = document.getElementById('ncp-k-periode'); if(elPer) elPer.textContent = '-';
    [_ncpEvolutionChart, _ncpCausesChart, _ncpTonnageChart, _ncpLignesChart, _ncpProduitsChart].forEach(function(c){ if(c) c.destroy(); });
    _ncpEvolutionChart = _ncpCausesChart = _ncpTonnageChart = _ncpLignesChart = _ncpProduitsChart = null;
    var tbody0 = document.getElementById('ncp-tbody');
    if(tbody0) tbody0.innerHTML = '<tr><td colspan="12" style="text-align:center;color:var(--tx3);padding:24px;font-size:13px">'+t('ncp_no_match')+'</td></tr>';
    NCP_VUE = []; ncpBuildDeclarants([]); var countEl0 = document.getElementById('ncp-liste-count'); if(countEl0) countEl0.textContent = '(0)';
    return;
  }

  NCP_VUE = filtres; ncpMajCouverture(filtres); // --- KPI ---
  // Client "BLK" = bulk interne / surproduction, pas un vrai defaut client :
  // exclu des totaux/KPI/graphiques, mais reste visible dans la liste ci-dessous.
  var filtresKPI = filtres.filter(function(r){ return r.famille_produit !== 'BLK'; });
  var total = filtresKPI.length;
  var nInpak = filtresKPI.filter(function(r){ return r.type_ncp === 'Inpak'; }).length;
  var nProd = filtresKPI.filter(function(r){ return r.type_ncp === 'Production'; }).length;
  var tonnes = filtresKPI.reduce(function(s, r){ return s + (r.total_tonnes || 0); }, 0);
  var elTotal = document.getElementById('ncp-k-total'); if(elTotal) elTotal.textContent = total;
  var elInpak = document.getElementById('ncp-k-inpak'); if(elInpak) elInpak.textContent = nInpak;
  var elInpakPct = document.getElementById('ncp-k-inpak-pct'); if(elInpakPct) elInpakPct.textContent = total ? Math.round(nInpak/total*100) + '%' : '-';
  var elProd = document.getElementById('ncp-k-prod'); if(elProd) elProd.textContent = nProd;
  var elProdPct = document.getElementById('ncp-k-prod-pct'); if(elProdPct) elProdPct.textContent = total ? Math.round(nProd/total*100) + '%' : '-';
  var elTonnes = document.getElementById('ncp-k-tonnes'); if(elTonnes) elTonnes.textContent = Math.round(tonnes) + ' t';
  // NCP encore ouvertes : tout ce qui n a pas ete libere par la qualite
  var nNonClasses = filtresKPI.filter(ncpEstNonClasse).length;
  var nOuvertes = nNonClasses;
  var elOuv = document.getElementById('ncp-k-ouvertes'); if(elOuv) elOuv.textContent = nOuvertes;
  var elClo = document.getElementById('ncp-k-cloture-pct');
  if(elClo) elClo.textContent = total ? t('ncp_pct_cloture').replace('{pct}', Math.round(nNonClasses / total * 100)) : '-';
  var nDebloque = filtresKPI.filter(ncpEstDebloquee);
  var tDebloque = nDebloque.reduce(function(s, r){ return s + (Number(r.total_tonnes) || 0); }, 0);
  var elDeb = document.getElementById('ncp-k-debloque');
  if(elDeb) elDeb.textContent = nDebloque.length;
  var elDebM = document.getElementById('ncp-k-debloque-meta');
  if(elDebM) elDebM.textContent = t('ncp_debloque_meta')
    .replace('{t}', Math.round(tDebloque))
    .replace('{pct}', total ? Math.round(nDebloque.length / total * 100) : 0);
  var elPeriode = document.getElementById('ncp-k-periode');
  if(elPeriode && filtresKPI.length){
    var dates = filtresKPI.map(function(r){ return r.created_date_iso; }).filter(Boolean).sort();
    if(dates.length) elPeriode.textContent = dFR(dates[0]) + t('date_range_sep') + dFR(dates[dates.length-1]);
  }

  // --- Evolution mensuelle ---
  var ctxEvo = document.getElementById('ncpEvolutionChart');
  if(ctxEvo && typeof Chart !== 'undefined'){
    var parMois = {};
    filtresKPI.forEach(function(r){
      if(!r.created_date_iso) return;
      var mois = r.created_date_iso.slice(0,7);
      parMois[mois] = (parMois[mois] || 0) + 1;
    });
    var moisTries = Object.keys(parMois).sort();
    var moisActuel = new Date().toISOString().slice(0, 7);
    var moisEnCours = moisTries.length > 0 && moisTries[moisTries.length - 1] === moisActuel;
    if(_ncpEvolutionChart){ _ncpEvolutionChart.destroy(); _ncpEvolutionChart = null; }
    _ncpEvolutionChart = new Chart(ctxEvo, {
      type: 'line',
      data: { labels: moisTries.map(moisFR), datasets: [{
        data: moisTries.map(function(m){ return parMois[m]; }),
        borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)', fill: true, tension: .3, pointRadius: 3,
        // Le mois en cours n est pas termine : on le trace en pointilles
        segment: { borderDash: function(ctx){ return (moisEnCours && ctx.p1DataIndex === moisTries.length - 1) ? [5, 4] : undefined; } }
      }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false }, ticks: { color: '#8b90a4' } }, y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } } } }
    });
  }

  // --- Top 10 des causes reelles (Pareto) ---
  // Remplace l ancien graphique 'Comparaison par equipe' : celui-ci comparait
  // les equipes sur l heure de creation de la fiche qualite, pas sur l heure
  // reelle du defaut, ce qui penalisait mecaniquement les equipes de journee.
  var ctxCa = document.getElementById('ncpCausesChart');
  if(ctxCa && typeof Chart !== 'undefined'){
    var parCause = {};
    filtresKPI.forEach(function(r){
      if(!r.problems) return;
      String(r.problems).split('|').forEach(function(p){
        var lib = p.trim();
        if(!lib) return;
        parCause[lib] = (parCause[lib] || 0) + 1;
      });
    });
    var causes = Object.keys(parCause).sort(function(x, y){ return parCause[y] - parCause[x]; });
    var topCauses = causes.slice(0, 10);
    if(_ncpCausesChart){ _ncpCausesChart.destroy(); _ncpCausesChart = null; }
    if(topCauses.length){
      var totalCauses = causes.reduce(function(s, k){ return s + parCause[k]; }, 0);
      var cumul = 0;
      var cumulPct = topCauses.map(function(c){ cumul += parCause[c]; return Math.round(cumul / totalCauses * 100); });
      _ncpCausesChart = new Chart(ctxCa, {
        data: {
          labels: topCauses.map(function(c){ return c.length > 24 ? c.slice(0, 23) + '\u2026' : c; }),
          datasets: [
            { type: 'bar', data: topCauses.map(function(c){ return parCause[c]; }), backgroundColor: '#8b5cf6', borderRadius: 4, order: 2 },
            { type: 'line', data: cumulPct, borderColor: '#f59e0b', backgroundColor: 'transparent', borderWidth: 2, pointRadius: 2, pointBackgroundColor: '#f59e0b', tension: .25, yAxisID: 'y2', order: 1 }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false },
            tooltip: { callbacks: {
              title: function(items){ return topCauses[items[0].dataIndex]; },
              label: function(c){ return c.datasetIndex === 1 ? ('Cumul : ' + c.parsed.y + '%') : (c.parsed.y + ' NCP'); }
            } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#8b90a4', font: { size: 9 }, maxRotation: 55, minRotation: 40, autoSkip: false } },
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4', precision: 0 } },
            y2: { position: 'right', beginAtZero: true, max: 100, grid: { display: false }, ticks: { color: '#f59e0b', font: { size: 10 }, callback: function(v){ return v + '%'; } } }
          } }
      });
    }
  }

  var ctxFa = document.getElementById('ncpFamillesChart'); if(ctxFa && typeof Chart !== 'undefined'){ var parFam = {}; var totFam = 0; filtresKPI.forEach(function(r){ if(!r.problems) return; String(r.problems).split('|').forEach(function(p){ var lib = p.trim(); if(!lib) return; var fa = ncpFamille(lib); parFam[fa] = (parFam[fa] || 0) + 1; totFam++; }); }); var fams = Object.keys(parFam).sort(function(a, b){ return parFam[b] - parFam[a]; }); if(_ncpFamillesChart){ _ncpFamillesChart.destroy(); _ncpFamillesChart = null; } if(fams.length){ var cumF = 0; var cumFPct = fams.map(function(f){ cumF += parFam[f]; return Math.round(cumF / totFam * 100); }); _ncpFamillesChart = new Chart(ctxFa, { data: { labels: fams, datasets: [ { type: 'bar', data: fams.map(function(f){ return parFam[f]; }), backgroundColor: '#3b82f6', borderRadius: 4, order: 2 }, { type: 'line', data: cumFPct, borderColor: '#f59e0b', backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#f59e0b', tension: .25, yAxisID: 'y2', order: 1 } ] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(c){ return c.datasetIndex === 1 ? (t('ncp_cumul_label') + ' ' + c.parsed.y + '%') : (c.parsed.y + ' ' + t('ncp_mentions_label') + ', ' + t('ncp_pct_total').replace('{pct}', Math.round(c.parsed.y / totFam * 100))); } } } }, scales: { x: { grid: { display: false }, ticks: { color: '#8b90a4', maxRotation: 40, minRotation: 40, font: { size: 10 } } }, y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } }, y2: { position: 'right', beginAtZero: true, max: 100, grid: { display: false }, ticks: { color: '#f59e0b', callback: function(v){ return v + '%'; } } } } } }); } }   var ctxDe = document.getElementById('ncpDelaiChart'); if(ctxDe && typeof Chart !== 'undefined'){ var seaux = [0, 0, 0, 0, 0]; var nMes = 0, somme = 0, sup7 = 0, nonSoldees = 0; filtresKPI.forEach(function(r){ if(!ncpEstSoldee(r)) nonSoldees++; var j = ncpDelai(r); if(j === null) return; nMes++; somme += j; if(j > 7) sup7++; if(j <= 2) seaux[0]++; else if(j <= 7) seaux[1]++; else if(j <= 14) seaux[2]++; else if(j <= 30) seaux[3]++; else seaux[4]++; }); var elInfo = document.getElementById('ncp-delai-info'); if(elInfo) elInfo.textContent = t('ncp_delai_info').replace('{moy}', nMes ? (somme / nMes).toFixed(1) : '-').replace('{n}', nMes).replace('{sup7}', sup7).replace('{ns}', nonSoldees); if(_ncpDelaiChart){ _ncpDelaiChart.destroy(); _ncpDelaiChart = null; } _ncpDelaiChart = new Chart(ctxDe, { type: 'bar', data: { labels: [t('ncp_delai_l1'), t('ncp_delai_l2'), t('ncp_delai_l3'), t('ncp_delai_l4'), t('ncp_delai_l5')], datasets: [{ data: seaux, backgroundColor: ['#10b981', '#34d399', '#f59e0b', '#f97316', '#ef4444'], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#8b90a4' } }, y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } } } } }); }   // --- Tonnage bloque par client ---
  // Remplace l ancien donut 'Repartition par unite' : trois parts quasi egales
  // n apportaient aucune information exploitable.
  var ctxTo = document.getElementById('ncpTonnageChart');
  if(ctxTo && typeof Chart !== 'undefined'){
    var parFam = {};
    filtresKPI.forEach(function(r){
      var t = parseFloat(r.total_tonnes) || 0;
      if(t <= 0) return;
      var fam = r.famille_produit || 'Inconnu';
      parFam[fam] = (parFam[fam] || 0) + t;
    });
    var topFam = Object.keys(parFam).sort(function(x, y){ return parFam[y] - parFam[x]; }).slice(0, 10);
    if(_ncpTonnageChart){ _ncpTonnageChart.destroy(); _ncpTonnageChart = null; }
    if(topFam.length){
      _ncpTonnageChart = new Chart(ctxTo, {
        type: 'bar',
        data: { labels: topFam, datasets: [{ data: topFam.map(function(f){ return Math.round(parFam[f]); }), backgroundColor: '#10b981', borderRadius: 4 }] },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(c){ return c.parsed.x + ' t bloquees'; } } } },
          scales: {
            x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } },
            y: { grid: { display: false }, ticks: { color: '#8b90a4', font: { size: 11 } } }
          } }
      });
    }
  }

  // --- Top lignes (cause directe uniquement, exclut les consequences Production) ---
  var ctxLi = document.getElementById('ncpLignesChart');
  if(ctxLi && typeof Chart !== 'undefined'){
    var parLigne = {};
    filtresKPI.forEach(function(r){
      if(!r.ligne || r.ligne_type !== 'cause_directe') return;
      parLigne[r.ligne] = (parLigne[r.ligne] || 0) + 1;
    });
    var topLignes = Object.keys(parLigne).sort(function(a,b){ return parLigne[b]-parLigne[a]; }).slice(0,10);
    if(_ncpLignesChart){ _ncpLignesChart.destroy(); _ncpLignesChart = null; }
    if(topLignes.length){
      _ncpLignesChart = new Chart(ctxLi, {
        type: 'bar',
        data: { labels: topLignes, datasets: [{ data: topLignes.map(function(l){ return parLigne[l]; }), backgroundColor: '#3b82f6', borderRadius: 4 }] },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } }, y: { grid: { display: false }, ticks: { color: '#8b90a4' } } } }
      });
    }
  }

  // --- Top produits ---
  var ctxPr = document.getElementById('ncpProduitsChart');
  if(ctxPr && typeof Chart !== 'undefined'){
    var parProduit = {};
    filtresKPI.forEach(function(r){
      if(!r.code_produit) return;
      parProduit[r.code_produit] = (parProduit[r.code_produit] || 0) + 1;
    });
    var topProduits = Object.keys(parProduit).sort(function(a,b){ return parProduit[b]-parProduit[a]; }).slice(0,10);
    if(_ncpProduitsChart){ _ncpProduitsChart.destroy(); _ncpProduitsChart = null; }
    if(topProduits.length){
      _ncpProduitsChart = new Chart(ctxPr, {
        type: 'bar',
        data: { labels: topProduits, datasets: [{ data: topProduits.map(function(p){ return parProduit[p]; }), backgroundColor: '#f97316', borderRadius: 4 }] },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } }, y: { grid: { display: false }, ticks: { color: '#8b90a4' } } } }
      });
    }
  }

  // --- Table (200 plus recents) ---
  var tbody = document.getElementById('ncp-tbody');
  ncpInitClicks(); ncpBuildDeclarants(filtresKPI); ncpBuildRecurrences(filtresKPI); var countEl = document.getElementById('ncp-liste-count');
  if(countEl) countEl.textContent = '(' + filtres.length + ')';
  if(tbody){
    var tries = filtres.slice().sort(function(a,b){ return (b.created_date_iso||'').localeCompare(a.created_date_iso||''); });
    var LIMITE = 200;
    LIMITE = NCP_TOUT ? 999999 : 200; var tronque = tries.length > LIMITE;
    var affiches = tries.slice(0, LIMITE);
    tbody.innerHTML = affiches.map(function(r){
      var eq = ncpEquipesMulti(r).principale;
      var typeColor = r.type_ncp === 'Inpak' ? 'var(--amber)' : 'var(--red)';
      var autreDeclarant = ncpEstNonClasse(r);
      return '<tr>'
        + '<td style="font-family:var(--mo);font-size:11px;color:var(--tx);font-weight:600">' + (r.de_cote ? '<span title="Mis de cote" style="color:var(--blue);margin-right:5px;vertical-align:middle">&#128204;</span>' : '') + (r.commentaire_perso ? '<span title="' + ncpEsc(r.commentaire_perso) + '" style="color:var(--amber);margin-right:5px;vertical-align:middle">&#9998;</span>' : '') + (r.controle_perso ? '<span title="Controle par ' + ncpEsc(r.controle_par || '?') + ' le ' + ncpEsc(r.controle_date || '?') + '" style="color:var(--green);margin-right:5px;vertical-align:middle">&#10003;</span>' : '') + (autreDeclarant ? '<span title="Bloque par une personne autre qu\'Inpak ou Production (' + ncpEsc(ncpNomAff(r.reporter)) + ')" style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#a78bfa;margin-right:6px;vertical-align:middle"></span>' : '') + (r.notification || '-') + '</td>' + '<td style="font-family:var(--mo);font-size:12px">' + dFR(r.created_date_iso) + '<span style="color:var(--tx3);font-size:10px"> (' + ncpJour(r.created_date_iso) + ')</span>' + ncpBadgeSrc(r) + '</td>'
        + '<td>' + (r.unite || '-') + '</td>'
        + '<td>' + (eq || '-') + ncpEtiquetteMulti(r) + '</td>'
        + '<td style="color:' + typeColor + ';font-weight:600">' + r.type_ncp + '</td>'
        + '<td>' + (r.ligne || '-') + (r.ligne_type === 'consequence_blocage_aval' ? ' <span style="color:var(--tx3);font-size:10px">(consequence)</span>' : '') + (r.type_ncp === 'Inpak' && ncpOperateurs(r) ? '<br><span style="color:var(--tx3);font-size:10px">&#128100; ' + ncpEsc(ncpOperateurs(r)) + '</span>' : '') + '</td>'
        + '<td style="font-family:var(--mo);font-size:11px;color:var(--tx3)">' + (ncpBakorder(r) || '-') + '</td>' + '<td>' + (r.code_produit || '-') + '</td>' + '<td style="font-family:var(--mo);font-size:12px;text-align:right">' + (Number(r.total_pallets) || 0) + '</td>' + '<td style="font-family:var(--mo);font-size:12px;text-align:right">' + (Number(r.total_tonnes) || 0).toFixed(2) + ' t</td>'
        + '<td style="font-size:12px;color:var(--tx3)">' + (r.status || '-') + '</td>'
        + '<td style="font-size:12px">' + (r.description || '-') + '</td>'
        + '</tr>';
    }).join('');
    if(tronque){
      tbody.innerHTML += '<tr><td colspan="12" style="text-align:center;color:var(--tx3);padding:10px;font-size:12px">'+t('ncp_truncated').replace('{n}',LIMITE).replace('{total}',tries.length)+'</td></tr>';
    }
  }
}

var NCP_KPI_MAP = {
  'ncp-k-total':'total', 'ncp-k-inpak':'inpak', 'ncp-k-prod':'prod',
  'ncp-k-tonnes':'tonnes', 'ncp-k-debloque':'debloque',
  'ncp-k-sl-inpak':'slinpak', 'ncp-k-sl-prod':'slprod'
};

function ncpBindTuiles(){
  var g = document.querySelector('#ncp-content-wrap .kgrid');
  if(!g) return;
  if(!g.getAttribute('data-kpideleg')){
    g.setAttribute('data-kpideleg','1');
    g.addEventListener('click', function(ev){
      var card = ev.target.closest ? ev.target.closest('.kcard') : null;
      if(!card) return;
      var v = card.querySelector('.kval');
      if(!v || !NCP_KPI_MAP[v.id]) return;
      ev.stopPropagation();
      ncpKpiListe(NCP_KPI_MAP[v.id]);
    }, true);
  }
  Array.prototype.forEach.call(g.querySelectorAll('.kcard'), function(c){
    var v = c.querySelector('.kval');
    if(v && NCP_KPI_MAP[v.id]){ c.style.cursor = 'pointer'; c.title = t('ncp_tooltip_liste'); }
  });
}

function ncpMajTuilesExtra(){
  function set(id, v){ var e = document.getElementById(id); if(e) e.textContent = v; }
  var b = ncpBaseKPI(), tot = b.length;
  var deb = 0, i = 0, p = 0, si = 0, sp = 0;
  b.forEach(function(r){
    if(ncpEstDebloque(r)) deb++;
    var t = r.type_ncp;
    if(ncpSansLabo(r)){ if(t === 'Inpak') si++; else if(t === 'Production') sp++; }
    else              { if(t === 'Inpak') i++;  else if(t === 'Production') p++;  }
  });
  function pct(n){ return tot ? t('ncp_pct_total').replace('{pct}', Math.round(n / tot * 100)) : '-'; }
  function pctSl(n){ return tot ? t('ncp_pct_sanslabo').replace('{pct}', Math.round(n / tot * 100)) : '-'; }
  set('ncp-k-inpak', i);      set('ncp-k-inpak-pct', pct(i));
  set('ncp-k-prod', p);       set('ncp-k-prod-pct', pct(p));
  set('ncp-k-debloque', deb); set('ncp-k-debloque-pct', pct(deb));
  set('ncp-k-sl-inpak', si);  set('ncp-k-sl-inpak-pct', pctSl(si));
  set('ncp-k-sl-prod', sp);   set('ncp-k-sl-prod-pct', pctSl(sp));
  ncpBindTuiles();
}

(function(){
  var _kpi = ncpKpiListe;
  ncpKpiListe = function(k){
    var b = ncpBaseKPI();
    if(k === 'debloque') return ncpRendreListe(t('ncp_titre_debloques2'), b.filter(ncpEstDebloque));
    if(k === 'inpak')    return ncpRendreListe(t('ncp_titre_inpak_shift'), b.filter(function(r){ return r.type_ncp === 'Inpak' && !ncpSansLabo(r); }));
    if(k === 'prod')     return ncpRendreListe(t('ncp_titre_prod_shift'), b.filter(function(r){ return r.type_ncp === 'Production' && !ncpSansLabo(r); }));
    if(k === 'slinpak')  return ncpRendreListe(t('ncp_titre_hors_shift_inpak'), b.filter(ncpSansLaboInpak));
    if(k === 'slprod')   return ncpRendreListe(t('ncp_titre_hors_shift_prod'), b.filter(ncpSansLaboProd));
    return _kpi.call(this, k);
  };
  var _build = buildNCPTab;
  buildNCPTab = function(){
    var out = _build.apply(this, arguments);
    try { ncpMajTuilesExtra(); } catch(e){ console.warn('tuiles NCP', e); }
    return out;
  };
})();

function ncpSetOverrideChamp(notif, champ, valeur, libelle){
  if(!db){ toast('Connexion Firebase non disponible', '#ef4444'); return; }
  var r = null, i;
  for(i = 0; i < NCP_DATA.length; i++){ if(String(NCP_DATA[i].notification) === String(notif)){ r = NCP_DATA[i]; break; } }
  var chemin = 'ncp_data/' + notif + '/' + champ;
  var ecrire = valeur ? db.ref(chemin).set(valeur) : db.ref(chemin).remove();
  ecrire.then(function(){
    if(r) r[champ] = valeur || null;
    toast(valeur ? (libelle + ' : ' + valeur) : (libelle + ' : retour a la deduction automatique'), '#10b981');
    setTimeout(function(){ try { ncpDetail(notif); } catch(e){} }, 450);
  }).catch(function(e){ toast('Erreur : ' + e.message, '#ef4444'); });
}

function ncpSetUniteOverride(n, v){ ncpSetOverrideChamp(n, 'unite_override', v, 'Unite'); }

function ncpSetLigneOverride(n, v){ ncpSetOverrideChamp(n, 'ligne_override', v, 'Ligne'); }

function ncpSetOperateurOverride(n, v){ ncpSetOverrideChamp(n, 'operateur_override', String(v || '').trim(), 'Operateur'); }

function ncpInjecterTuileACompleter(){
  if(document.getElementById('ncp-k-acompleter')) return;
  var g = document.querySelector('#ncp-content-wrap .kgrid');
  if(!g) return;
  var c = document.createElement('div');
  c.className = 'kcard pu';
  c.innerHTML = '<div class="klbl">Fiches a completer</div>'
    + '<div class="kval" id="ncp-k-acompleter">-</div>'
    + '<div class="kmeta" id="ncp-k-acompleter-pct">-</div>';
  g.appendChild(c);
  if(typeof NCP_KPI_MAP !== 'undefined') NCP_KPI_MAP['ncp-k-acompleter'] = 'acompleter';
}

(function(){
  var _kpiAC = ncpKpiListe;
  ncpKpiListe = function(k){
    if(k === 'acompleter'){
      return ncpRendreListe('Fiches a completer - unite ou ligne manquante', ncpBaseKPI().filter(ncpNonDirigeable));
    }
    return _kpiAC.call(this, k);
  };
  var _buildAC = buildNCPTab;
  buildNCPTab = function(){
    var out = _buildAC.apply(this, arguments);
    try {
      ncpInjecterTuileACompleter();
      var b = ncpBaseKPI(), n = b.filter(ncpNonDirigeable).length;
      var e = document.getElementById('ncp-k-acompleter');
      if(e) e.textContent = n;
      var p = document.getElementById('ncp-k-acompleter-pct');
      if(p) p.textContent = b.length ? (Math.round(n / b.length * 100) + '% du total') : '-';
      if(typeof ncpBindTuiles === 'function') ncpBindTuiles();
    } catch(err){ console.warn('tuile a completer', err); }
    return out;
  };
})();

var NCP_LISTE_TRI = 'date';

var NCP_LISTE_COURANTE = null;

var NCP_LISTE_TITRE = '';

function ncpBasculerTriListe(){
  NCP_LISTE_TRI = (NCP_LISTE_TRI === 'date') ? 'priorite' : 'date';
  if(NCP_LISTE_COURANTE) ncpRendreListe(NCP_LISTE_TITRE, NCP_LISTE_COURANTE);
}

function ncpInjecterBoutonTri(){
  var tEl = document.getElementById('ncp-list-title');
  if(!tEl || !tEl.parentNode) return;
  var b = document.getElementById('ncp-btn-tri');
  if(!b){
    b = document.createElement('button');
    b.id = 'ncp-btn-tri';
    b.onclick = ncpBasculerTriListe;
    b.style.cssText = 'margin-right:auto;margin-left:12px;padding:4px 12px;border-radius:8px;border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:12px;cursor:pointer;white-space:nowrap';
    tEl.parentNode.insertBefore(b, tEl.nextSibling);
  }
  b.textContent = (NCP_LISTE_TRI === 'date') ? '\u2193 Plus recentes d abord' : '\u2193 Priorite d abord';
}

(function(){
  var _rendreTri = ncpRendreListe;
  ncpRendreListe = function(titre, rows){
    NCP_LISTE_TITRE = titre;
    NCP_LISTE_COURANTE = rows;
    var out = _rendreTri.call(this, titre, ncpTrierListe(rows));
    try { ncpInjecterBoutonTri(); } catch(e){ console.warn('bouton tri', e); }
    return out;
  };
})();

var NCP_LISTE_FILTRE_UNITE = 'toutes';

var NCP_LISTE_BASE = [];

var NCP_LISTE_TITRE_PREC = null;

function ncpChangerFiltreUnite(v){
  NCP_LISTE_FILTRE_UNITE = v;
  if(NCP_LISTE_TITRE_PREC !== null) ncpRendreListe(NCP_LISTE_TITRE_PREC, NCP_LISTE_BASE);
}

function ncpInjecterFiltreUnite(){
  var tEl = document.getElementById('ncp-list-title');
  if(!tEl || !tEl.parentNode) return;
  var s = document.getElementById('ncp-sel-filtre-unite');
  if(!s){
    s = document.createElement('select');
    s.id = 'ncp-sel-filtre-unite';
    s.onchange = function(){ ncpChangerFiltreUnite(this.value); };
    s.style.cssText = 'margin-left:8px;padding:4px 10px;border-radius:8px;border:1px solid var(--bd2);background:var(--bg3);color:var(--tx1);font-family:var(--fn);font-size:12px;cursor:pointer';
    ['toutes','AW1','AW2','AW3'].forEach(function(u){
      var o = document.createElement('option');
      o.value = u;
      o.textContent = (u === 'toutes') ? 'Toutes les unites' : u;
      s.appendChild(o);
    });
    var ref = document.getElementById('ncp-btn-tri');
    tEl.parentNode.insertBefore(s, ref ? ref.nextSibling : tEl.nextSibling);
  }
  s.value = NCP_LISTE_FILTRE_UNITE;
}

(function(){
  var _rendreFiltre = ncpRendreListe;
  ncpRendreListe = function(titre, rows){
    if(titre !== NCP_LISTE_TITRE_PREC){ NCP_LISTE_FILTRE_UNITE = 'toutes'; NCP_LISTE_TITRE_PREC = titre; }
    NCP_LISTE_BASE = rows;
    var out = _rendreFiltre.call(this, titre, ncpAppliquerFiltreUnite(rows));
    try { ncpInjecterFiltreUnite(); } catch(e){ console.warn('filtre unite', e); }
    return out;
  };
})();

(function(){
  var _ncpDetailVisiteur = ncpDetail;
  ncpDetail = function(notif){
    var out = _ncpDetailVisiteur.call(this, notif);
    try {
      if(currentUser && currentUser.role === 'visiteur'){
        var body = document.getElementById('ncp-detail-body');
        if(body){
          var sel = [
            'button[onclick^="ncpOpenComment"]',
            'button[onclick^="ncpSetOperateurOverride"]',
            'button[onclick^="ncpToggleControle"]',
            'button[onclick^="ncpToggleDeCote"]',
            'select[onchange^="ncpSetEquipeOverride"]',
            'select[onchange^="ncpSetLigneOverride"]',
            'select[onchange^="ncpSetUniteOverride"]',
            '#ncp-op-input'
          ].join(',');
          body.querySelectorAll(sel).forEach(function(el){
            el.disabled = true;
            el.style.opacity = '.45';
            el.style.cursor = 'not-allowed';
            el.title = 'Lecture seule (compte visiteur)';
          });
        }
      }
    } catch(e){ console.warn('ncpDetail verrou visiteur', e); }
    return out;
  };
})();
