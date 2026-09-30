/* ====================================================================
 * vues/attestation.js — Attestation de suivi de formation (a imprimer)
 * Ajoute le 30/09/2026.
 *
 * Genere la feuille "Attestation de suivi de formation / Bewijs van
 * deelname aan opleiding" (A4 portrait, FR/NL) A PARTIR DE L'EQUIPE REELLE :
 *  - "AW3 P5 (mon equipe)" = liste EMP (noeud Firebase `employees`, geree
 *    dans Admin > Gestion des employes). Un arrivant / un depart dans Admin
 *    = la feuille suit automatiquement, rien a retoucher ici.
 *  - Autres equipes : listes libres enregistrees dans Firebase
 *    `attestation_equipes/{id}` = {nom, membres:[{n, s, f}]}
 *    (n = nom, s = secteur INPAK/PROD/UNIT/autre, f = fonction).
 *    Noeud couvert par la regle racine (admin) : aucune regle a ajouter.
 *
 * Points d'entree :
 *  - openAttestationModal()            bouton de l'onglet Formations
 *  - openAttestationModal(formationId) bouton d'une carte formation
 *    (titre, date et participants pre-remplis depuis la formation)
 * ==================================================================== */

var ATT_EQUIPES = {};        // equipes supplementaires chargees depuis Firebase
var ATT_EQUIPE_COURANTE = 'p5';
var ATT_EDIT_ID = null;      // equipe supplementaire en cours d'edition

var ATT_SECTEURS = {
  INPAK: { fr:'INPAK', nl:'VERPAKKING', bg:'#1565c0' },
  PROD:  { fr:'PROD',  nl:'PRODUCTIE',  bg:'#43a047' },
  UNIT:  { fr:'UNIT',  nl:'UNIT',       bg:'#f57c00' },
  AUTRE: { fr:'AUTRE', nl:'ANDERE',     bg:'#607d8b' }
};
var ATT_ORDRE_SECTEURS = ['INPAK','PROD','UNIT','AUTRE'];

function attEsc(s){
  return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* Secteur d'un employe EMP (groupe dashboard -> secteur de la feuille). */
function attSecteurDepuisGroupe(g){
  g = String(g||'').toUpperCase();
  if(g === 'INPAK') return 'INPAK';
  if(g === 'PROD' || g === 'PRODUCTION') return 'PROD';
  if(g === 'UNIT') return 'UNIT';
  return 'AUTRE';
}

/* Fonction affichee sur la feuille, deduite du role saisi dans Admin. */
function attFonctionDepuisEmp(e){
  var r = String(e.r||'').toLowerCase();
  var s = attSecteurDepuisGroupe(e.g);
  if(r.indexOf('coord') >= 0) return 'Coordinateur';
  if(r.indexOf('labo') >= 0 || r === 'qc') return 'Opérateur QC';
  if(s === 'INPAK') return 'Opérateur Inpak';
  if(s === 'PROD') return 'Opérateur Production';
  if(s === 'UNIT') return 'Opérateur Unit';
  return e.r || '';
}

/* Membres de l'equipe choisie, au format commun {n, s, f, id}. */
function attMembres(equipeId){
  if(equipeId === 'p5'){
    return (typeof EMP !== 'undefined' ? EMP : [])
      .filter(function(e){ return String(e.g||'').toUpperCase() !== 'TL'; })
      .map(function(e){ return { n:e.n, s:attSecteurDepuisGroupe(e.g), f:attFonctionDepuisEmp(e), id:e.id || e.n }; });
  }
  var eq = ATT_EQUIPES[equipeId];
  return eq && eq.membres ? eq.membres.map(function(m, i){ return { n:m.n, s:(m.s||'AUTRE').toUpperCase(), f:m.f||'', id:equipeId+'_'+i }; }) : [];
}

/* Responsable (signature du bas) : le TL de la liste EMP par defaut. */
function attResponsableParDefaut(){
  var tl = (typeof EMP !== 'undefined' ? EMP : []).find(function(e){ return String(e.g||'').toUpperCase() === 'TL'; });
  if(!tl) return '';
  var p = tl.n.split(' ');
  return p.length > 1 ? p[0] + ' ' + p.slice(1).join(' ').toUpperCase() : tl.n;
}

function attChargerEquipes(cb){
  if(typeof db === 'undefined' || !db){ if(cb) cb(); return; }
  db.ref('attestation_equipes').once('value').then(function(snap){
    ATT_EQUIPES = snap.val() || {};
    if(cb) cb();
  }).catch(function(){ ATT_EQUIPES = {}; if(cb) cb(); });
}

/* ---------------------------------------------------------------- */
/* Modale                                                            */
/* ---------------------------------------------------------------- */

function attCreerModale(){
  if(document.getElementById('att-modal')) return;
  var inp = 'box-sizing:border-box;width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--bd2);background:var(--bg3);color:var(--tx);font-family:var(--fn);font-size:13px';
  var lab = 'display:block;font-size:11px;font-weight:600;color:var(--tx2);margin:10px 0 4px';
  var btn = 'padding:7px 14px;border-radius:var(--r);border:1px solid var(--bd2);background:var(--bg3);color:var(--tx);font-family:var(--fn);font-size:12px;font-weight:600;cursor:pointer';
  var d = document.createElement('div');
  d.id = 'att-modal';
  d.style.cssText = 'display:none;position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.55);align-items:center;justify-content:center;padding:16px';
  d.innerHTML =
    '<div style="background:var(--bg2);border:1px solid var(--bd);border-radius:14px;max-width:620px;width:100%;max-height:92vh;overflow:auto;padding:18px 20px;color:var(--tx)">'
    +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><div style="font-size:16px;font-weight:700">Attestation de formation</div>'
    +'<button onclick="closeAttestationModal()" style="margin-left:auto;background:none;border:none;color:var(--tx2);font-size:20px;cursor:pointer">&times;</button></div>'
    +'<div style="font-size:12px;color:var(--tx3)">La liste se construit depuis l\'équipe choisie. Laisse un champ vide pour le remplir à la main sur papier.</div>'
    +'<label style="'+lab+'">Équipe</label>'
    +'<div style="display:flex;gap:8px;flex-wrap:wrap"><select id="att-equipe" onchange="attChangerEquipe(this.value)" style="'+inp+';flex:1;min-width:200px"></select>'
    +'<button id="att-btn-new" onclick="attEditerEquipe(null)" style="'+btn+'">+ Autre équipe</button>'
    +'<button id="att-btn-edit" onclick="attEditerEquipe(ATT_EQUIPE_COURANTE)" style="'+btn+';display:none">Modifier</button></div>'
    +'<div id="att-editeur" style="display:none;margin-top:10px;padding:12px;border:1px dashed var(--bd2);border-radius:10px">'
    +  '<label style="'+lab+';margin-top:0">Nom de l\'équipe</label><input id="att-ed-nom" style="'+inp+'" placeholder="ex : AW3 P3">'
    +  '<label style="'+lab+'">Membres — une personne par ligne : <b>Nom ; Secteur ; Fonction</b> (secteur = INPAK, PROD ou UNIT)</label>'
    +  '<textarea id="att-ed-membres" rows="8" style="'+inp+';font-family:var(--mo);font-size:12px" placeholder="Jean Dupont ; INPAK ; Opérateur Inpak&#10;Marie Martin ; PROD ; Opérateur Production"></textarea>'
    +  '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button onclick="attCopierP5()" style="'+btn+'">Partir de mon équipe P5</button>'
    +  '<button onclick="attEnregistrerEquipe()" style="'+btn+';background:var(--blue);color:#fff;border:none">Enregistrer l\'équipe</button>'
    +  '<button id="att-ed-suppr" onclick="attSupprimerEquipe()" style="'+btn+';color:#ef4444">Supprimer</button>'
    +  '<button onclick="attFermerEditeur()" style="'+btn+'">Annuler</button></div>'
    +  '<div id="att-ed-err" style="color:#ef4444;font-size:12px;margin-top:6px"></div>'
    +'</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 12px">'
    +  '<div style="grid-column:1/3"><label style="'+lab+'">Nom de la formation</label><input id="att-titre" style="'+inp+'"></div>'
    +  '<div><label style="'+lab+'">Date de la formation</label><input id="att-date" type="date" style="'+inp+'"></div>'
    +  '<div><label style="'+lab+'">Service / Équipe</label><input id="att-service" style="'+inp+'"></div>'
    +  '<div style="grid-column:1/3"><label style="'+lab+'">Responsable (signature du bas)</label><input id="att-resp" style="'+inp+'"></div>'
    +'</div>'
    +'<label style="'+lab+'">Participants <span id="att-compte" style="color:var(--tx3);font-weight:400"></span> '
    +'<a href="#" onclick="attToutCocher(true);return false" style="margin-left:8px;color:var(--blue)">tous</a> · '
    +'<a href="#" onclick="attToutCocher(false);return false" style="color:var(--blue)">aucun</a></label>'
    +'<div id="att-membres" style="display:flex;flex-wrap:wrap;gap:6px"></div>'
    +'<label style="display:flex;align-items:center;gap:6px;font-size:12px;margin-top:12px;color:var(--tx2)"><input type="checkbox" id="att-date-col" checked style="width:14px;height:14px">Préremplir la colonne « Date » avec la date de la formation</label>'
    +'<div id="att-err" style="color:#ef4444;font-size:12px;margin-top:8px"></div>'
    +'<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">'
    +  '<button onclick="closeAttestationModal()" style="'+btn+'">Fermer</button>'
    +  '<button onclick="attImprimer()" style="'+btn+';background:var(--blue);color:#fff;border:none">&#128424; Générer et imprimer</button>'
    +'</div></div>';
  document.body.appendChild(d);
}

function openAttestationModal(formationId){
  attCreerModale();
  var f = (formationId && typeof FORMATIONS !== 'undefined') ? FORMATIONS.find(function(x){ return x.id === formationId; }) : null;
  document.getElementById('att-titre').value = f ? (f.titre || '') : '';
  document.getElementById('att-date').value = f ? (f.date || '') : '';
  document.getElementById('att-resp').value = attResponsableParDefaut();
  document.getElementById('att-err').textContent = '';
  attFermerEditeur();
  var estAdmin = (typeof currentUser !== 'undefined' && currentUser && currentUser.role === 'admin');
  document.getElementById('att-btn-new').style.display = estAdmin ? '' : 'none';
  document.getElementById('att-modal').style.display = 'flex';
  attChargerEquipes(function(){
    ATT_EQUIPE_COURANTE = 'p5';
    attRemplirSelect();
    attChangerEquipe('p5', f ? (f.employes || []) : null);
  });
}

function closeAttestationModal(){
  var m = document.getElementById('att-modal');
  if(m) m.style.display = 'none';
}

function attRemplirSelect(){
  var sel = document.getElementById('att-equipe');
  var h = '<option value="p5">AW3 P5 — mon équipe (' + attMembres('p5').length + ' pers.)</option>';
  Object.keys(ATT_EQUIPES).sort(function(a,b){ return String(ATT_EQUIPES[a].nom).localeCompare(String(ATT_EQUIPES[b].nom)); }).forEach(function(id){
    var eq = ATT_EQUIPES[id];
    h += '<option value="'+attEsc(id)+'">' + attEsc(eq.nom || id) + ' (' + ((eq.membres||[]).length) + ' pers.)</option>';
  });
  sel.innerHTML = h;
  sel.value = ATT_EQUIPE_COURANTE;
}

/* preselection : null = tout le monde coche ; tableau = ids/noms de la formation (vide = toute l'equipe) */
function attChangerEquipe(id, preselection){
  ATT_EQUIPE_COURANTE = id;
  var estAdmin = (typeof currentUser !== 'undefined' && currentUser && currentUser.role === 'admin');
  document.getElementById('att-btn-edit').style.display = (id !== 'p5' && estAdmin) ? '' : 'none';
  var svc = document.getElementById('att-service');
  svc.value = id === 'p5' ? 'AW3 - Ploeg 5' : ((ATT_EQUIPES[id] && ATT_EQUIPES[id].nom) || '');
  var membres = attMembres(id);
  var aCocher = function(m){
    if(!preselection || !preselection.length) return true;
    return preselection.indexOf(m.id) >= 0 || preselection.indexOf(m.n) >= 0;
  };
  document.getElementById('att-membres').innerHTML = membres.map(function(m, i){
    var sec = ATT_SECTEURS[m.s] || ATT_SECTEURS.AUTRE;
    return '<label style="display:flex;align-items:center;gap:6px;padding:5px 10px;border:1px solid var(--bd2);border-left:4px solid '+sec.bg+';border-radius:20px;font-size:12px;cursor:pointer;background:var(--bg3)">'
      +'<input type="checkbox" class="att-cb" data-i="'+i+'" '+(aCocher(m)?'checked':'')+' onchange="attMajCompte()" style="width:14px;height:14px">'+attEsc(m.n)+'</label>';
  }).join('') || '<div style="color:var(--tx3);font-size:12px">Aucun membre dans cette équipe.</div>';
  attMajCompte();
}

function attMajCompte(){
  var n = document.querySelectorAll('.att-cb:checked').length;
  var t = document.querySelectorAll('.att-cb').length;
  document.getElementById('att-compte').textContent = '(' + n + ' / ' + t + ')';
}

function attToutCocher(v){
  document.querySelectorAll('.att-cb').forEach(function(cb){ cb.checked = v; });
  attMajCompte();
}

/* ---------------------------------------------------------------- */
/* Equipes supplementaires (admin)                                   */
/* ---------------------------------------------------------------- */

function attEditerEquipe(id){
  ATT_EDIT_ID = id;
  var eq = id ? ATT_EQUIPES[id] : null;
  document.getElementById('att-ed-nom').value = eq ? (eq.nom || '') : '';
  document.getElementById('att-ed-membres').value = eq ? (eq.membres || []).map(function(m){ return m.n + ' ; ' + (m.s || '') + ' ; ' + (m.f || ''); }).join('\n') : '';
  document.getElementById('att-ed-suppr').style.display = id ? '' : 'none';
  document.getElementById('att-ed-err').textContent = '';
  document.getElementById('att-editeur').style.display = 'block';
}

function attFermerEditeur(){
  ATT_EDIT_ID = null;
  var ed = document.getElementById('att-editeur');
  if(ed) ed.style.display = 'none';
}

function attCopierP5(){
  document.getElementById('att-ed-membres').value = attMembres('p5').map(function(m){ return m.n + ' ; ' + m.s + ' ; ' + m.f; }).join('\n');
}

function attEnregistrerEquipe(){
  var err = document.getElementById('att-ed-err');
  var nom = document.getElementById('att-ed-nom').value.trim();
  if(!nom){ err.textContent = 'Donne un nom à l\'équipe.'; return; }
  var membres = [];
  var lignesKo = [];
  document.getElementById('att-ed-membres').value.split('\n').forEach(function(l, i){
    l = l.trim(); if(!l) return;
    var p = l.split(';').map(function(x){ return x.trim(); });
    if(!p[0]){ lignesKo.push(i+1); return; }
    var s = String(p[1]||'').toUpperCase();
    if(s === 'PRODUCTION' || s === 'PRODUCTIE') s = 'PROD';
    if(s === 'VERPAKKING') s = 'INPAK';
    if(!ATT_SECTEURS[s]) s = 'AUTRE';
    membres.push({ n:p[0], s:s, f:p[2] || '' });
  });
  if(lignesKo.length){ err.textContent = 'Nom manquant ligne(s) ' + lignesKo.join(', ') + '.'; return; }
  if(!membres.length){ err.textContent = 'Ajoute au moins une personne.'; return; }
  if(!db){ err.textContent = 'Pas de connexion Firebase.'; return; }
  var id = ATT_EDIT_ID || nom.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'') || ('equipe_' + Date.now());
  db.ref('attestation_equipes/' + id).set({ nom:nom, membres:membres, maj:new Date().toISOString() }).then(function(){
    ATT_EQUIPES[id] = { nom:nom, membres:membres };
    ATT_EQUIPE_COURANTE = id;
    attFermerEditeur();
    attRemplirSelect();
    attChangerEquipe(id);
    if(typeof toast === 'function') toast('Équipe « ' + nom + ' » enregistrée', '#10b981');
  }).catch(function(e){ err.textContent = 'Erreur : ' + e.message; });
}

function attSupprimerEquipe(){
  if(!ATT_EDIT_ID) return;
  var eq = ATT_EQUIPES[ATT_EDIT_ID];
  if(!confirm('Supprimer l\'équipe « ' + (eq && eq.nom) + ' » ? (ta liste AW3 P5 n\'est pas concernée)')) return;
  var id = ATT_EDIT_ID;
  db.ref('attestation_equipes/' + id).remove().then(function(){
    delete ATT_EQUIPES[id];
    attFermerEditeur();
    ATT_EQUIPE_COURANTE = 'p5';
    attRemplirSelect();
    attChangerEquipe('p5');
  });
}

/* ---------------------------------------------------------------- */
/* Generation de la page A4                                          */
/* ---------------------------------------------------------------- */

function attDateFr(iso){
  if(!iso) return '';
  var p = iso.split('-');
  return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
}

function attImprimer(){
  var membres = attMembres(ATT_EQUIPE_COURANTE);
  var choisis = [];
  document.querySelectorAll('.att-cb:checked').forEach(function(cb){ choisis.push(membres[parseInt(cb.getAttribute('data-i'), 10)]); });
  if(!choisis.length){ document.getElementById('att-err').textContent = 'Coche au moins un participant.'; return; }
  document.getElementById('att-err').textContent = '';
  var html = attHtmlPage({
    titre: document.getElementById('att-titre').value.trim(),
    date: attDateFr(document.getElementById('att-date').value),
    service: document.getElementById('att-service').value.trim(),
    resp: document.getElementById('att-resp').value.trim(),
    dateCol: document.getElementById('att-date-col').checked,
    membres: choisis
  });
  // Impression via un cadre cache dans la page : pas de pop-up, donc jamais bloque
  var old = document.getElementById('att-print-frame');
  if(old) old.parentNode.removeChild(old);
  var fr = document.createElement('iframe');
  fr.id = 'att-print-frame';
  fr.setAttribute('aria-hidden', 'true');
  fr.style.cssText = 'position:fixed;left:-10000px;top:0;width:210mm;height:297mm;border:0;visibility:hidden';
  document.body.appendChild(fr);
  var d = fr.contentWindow.document;
  d.open(); d.write(html); d.close();
  var lance = false;
  var imprimer = function(){
    if(lance) return; lance = true;
    try { fr.contentWindow.focus(); fr.contentWindow.print(); }
    catch(e){ document.getElementById('att-err').textContent = 'Impression impossible : ' + e.message; }
  };
  var attendre = function(){
    var img = d.querySelector('img');
    var pImg = (img && !img.complete) ? new Promise(function(r){ img.onload = img.onerror = r; }) : Promise.resolve();
    var pFont = (d.fonts && d.fonts.ready) ? d.fonts.ready : Promise.resolve();
    Promise.all([pImg, pFont]).then(function(){ setTimeout(imprimer, 250); });
    setTimeout(imprimer, 4000); // filet de securite si une police ne charge pas
  };
  if(d.readyState === 'complete') attendre(); else fr.contentWindow.addEventListener('load', attendre);
}

function attHtmlPage(o){
  // Regroupe par secteur dans l'ordre INPAK, PROD, UNIT, autres
  var groupes = [];
  ATT_ORDRE_SECTEURS.forEach(function(s){
    var ms = o.membres.filter(function(m){ return (ATT_SECTEURS[m.s] ? m.s : 'AUTRE') === s; });
    if(ms.length) groupes.push({ s:s, ms:ms });
  });
  var n = o.membres.length;
  // Hauteur de ligne adaptee pour tenir sur une page A4 (zone tableau ~ 185 mm)
  var hLigne = Math.max(6.5, Math.min(13, Math.round(168 / Math.max(n, 1) * 10) / 10));
  var fsNom = hLigne >= 11 ? 14 : hLigne >= 8 ? 12 : 10.5;
  var fsFn = fsNom - 2;
  var lignes = '';
  groupes.forEach(function(g){
    var sec = ATT_SECTEURS[g.s];
    g.ms.forEach(function(m, i){
      lignes += '<tr style="height:' + hLigne + 'mm">';
      if(i === 0){
        lignes += '<td class="sec" rowspan="' + g.ms.length + '" style="background:' + sec.bg + '">'
          + '<div>' + sec.fr + '</div><div>' + sec.nl + '</div></td>';
      }
      lignes += '<td class="nom" style="font-size:' + fsNom + 'px">' + attEsc(m.n) + '</td>'
        + '<td class="fn" style="font-size:' + fsFn + 'px">' + attEsc(m.f) + '</td>'
        + '<td></td>'
        + '<td class="dt">' + (o.dateCol && o.date ? attEsc(o.date) : '') + '</td></tr>';
    });
  });
  var logo = new URL('icons/agristo-logo.png', location.href).href;
  var champ = function(v){ return v ? '<span class="val">' + attEsc(v) + '</span>' : '<span class="ligne"></span>'; };
  return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Attestation de formation' + (o.titre ? ' - ' + attEsc(o.titre) : '') + '</title>'
    + '<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">'
    + '<style>'
    + '*{box-sizing:border-box;margin:0;padding:0}'
    + '@page{size:A4 portrait;margin:0}'
    + 'html,body{background:#e5e7eb}'
    + 'body{font-family:Inter,Arial,sans-serif;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact}'
    + '.page{width:210mm;height:297mm;margin:8mm auto;background:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column;padding:8mm 7mm 0}'
    + '.pbtn{position:fixed;top:14px;right:14px;background:#111;color:#fff;border:none;border-radius:6px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;z-index:5}'
    + '.hd{display:flex;align-items:stretch;gap:5mm}'
    + '.logo{width:40mm;display:flex;align-items:center;border-right:2px solid #f5b800;padding-right:5mm}.logo img{width:100%}'
    + '.titres{flex:1;display:flex;flex-direction:column;justify-content:center}'
    + '.t1{font-family:Oswald,"Arial Narrow",sans-serif;font-weight:500;font-size:19px;white-space:nowrap;letter-spacing:.2px}'
    + '.t2{font-family:Oswald,"Arial Narrow",sans-serif;font-weight:500;font-size:19px;white-space:nowrap;color:#f5b800;margin-bottom:2.5mm}'
    + '.st1{font-size:11px}.st2{font-size:11px;color:#f5b800;margin-top:1.5mm}'
    + '.bloc{width:56mm;border:1px solid #bbb;border-radius:3mm;padding:4mm;display:flex;flex-direction:column;justify-content:space-around;font-size:11px;gap:3mm}'
    + '.bloc .l2{color:#f5b800}.bloc .row{display:flex;flex-direction:column;gap:1mm}'
    + '.val{font-weight:700;font-size:12px;border-bottom:1px solid #999;padding-bottom:.5mm}.ligne{display:block;border-bottom:1px solid #666;height:4mm}'
    + '.form{margin-top:5mm;border:1.5px solid #f5b800;border-radius:3mm;padding:4mm 5mm;display:flex;align-items:center;gap:5mm}'
    + '.ico{width:15mm;height:15mm;border-radius:50%;background:#f5b800;display:flex;align-items:center;justify-content:center;color:#fff;font-size:26px;flex:none}'
    + '.form .lab{font-family:Oswald,"Arial Narrow",sans-serif;color:#f5b800;font-size:17px}'
    + '.form .nm{margin-top:3mm;border-bottom:1.5px solid #111;min-height:8mm;font-size:17px;font-weight:700;padding-bottom:1mm}'
    + 'table{width:100%;border-collapse:collapse;margin-top:5mm;table-layout:fixed}'
    + 'th{background:#111;color:#f5b800;font-family:Oswald,"Arial Narrow",sans-serif;font-weight:400;font-size:11px;padding:2.5mm 1mm;line-height:1.35;border-right:1px solid #444}'
    + 'th .w{color:#fff}'
    + 'td{border:1px solid #cfcfcf;padding:0 3mm}'
    + 'td.sec{color:#fff;font-family:Oswald,"Arial Narrow",sans-serif;font-size:12.5px;word-break:break-word;text-align:center;padding:0 1mm;line-height:1.3;border:none;border-bottom:2px solid #fff}'
    + 'td.nom{font-family:Oswald,"Arial Narrow",sans-serif;font-weight:500}td.fn{color:#333}td.dt{text-align:center;font-size:11px}'
    + '.sig{margin-top:4mm;flex:none;border:1.5px solid #f5b800;border-radius:3mm;padding:4mm 6mm;display:flex;align-items:center;gap:8mm}'
    + '.sig .resp{font-family:Oswald,"Arial Narrow",sans-serif;font-size:18px;font-weight:500;min-width:55mm}'
    + '.sig .sl{flex:1;display:flex;align-items:flex-end;gap:3mm;font-size:12px}.sig .sl span{flex:1;border-bottom:1px solid #111;height:5mm}'
    + '.ft{margin-top:auto;margin-left:-7mm;margin-right:-7mm;height:17mm;flex:none;background:#111;color:#fff;display:flex;align-items:center;position:relative;overflow:hidden}'
    + '.ft .l{padding-left:9mm;font-size:14px;display:flex;align-items:center;gap:3mm}'
    + '.ft .r{position:absolute;right:0;top:0;bottom:0;width:85mm;background:#f5b800;border-top-left-radius:19mm;display:flex;align-items:center;justify-content:center;font-family:"Brush Script MT","Segoe Script",cursive;font-size:22px;color:#111}'
    + '@media print{html,body{background:#fff}.page{margin:0}.pbtn{display:none}}'
    + '</style></head><body>'
    + '<button class="pbtn" onclick="window.print()">&#128424; Imprimer</button>'
    + '<div class="page">'
    +   '<div class="hd">'
    +     '<div class="logo"><img src="' + logo + '" alt="Agristo"></div>'
    +     '<div class="titres"><div class="t1">ATTESTATION DE SUIVI DE FORMATION</div><div class="t2">BEWIJS VAN DEELNAME AAN OPLEIDING</div>'
    +       '<div class="st1">Confirmation de participation et d\'acquisition des compétences</div><div class="st2">Bevestiging van deelname en verwerving van competenties</div></div>'
    +     '<div class="bloc">'
    +       '<div class="row"><div>&#128197; Date de la formation :</div><div class="l2">Datum van de opleiding :</div>' + champ(o.date) + '</div>'
    +       '<div class="row"><div>&#127970; Service / Équipe :</div><div class="l2">Dienst / Team :</div>' + champ(o.service) + '</div>'
    +     '</div>'
    +   '</div>'
    +   '<div class="form"><div class="ico">&#128221;</div><div style="flex:1"><div class="lab">NOM DE LA FORMATION / NAAM VAN DE OPLEIDING</div><div class="nm">' + attEsc(o.titre) + '</div></div></div>'
    +   '<table><colgroup><col style="width:24mm"><col style="width:52mm"><col style="width:48mm"><col><col style="width:27mm"></colgroup>'
    +   '<thead><tr><th><span class="w">SECTEUR</span><br>AFDELING</th><th>NOM ET PRÉNOM<br>NAAM EN VOORNAAM</th><th>FONCTION / POSTE<br>FUNCTIE / FUNCTIEBENAMING</th><th>SIGNATURE<br>HANDTEKENING</th><th>DATE<br>DATUM</th></tr></thead>'
    +   '<tbody>' + lignes + '</tbody></table>'
    +   '<div class="sig"><div class="resp">' + attEsc(o.resp) + '</div><div class="sl">Signature :<span></span></div></div>'
    +   '<div class="ft"><div class="l">&#9825; we love potatoes</div><div class="r">Together, we grow.</div></div>'
    + '</div></body></html>';
}
