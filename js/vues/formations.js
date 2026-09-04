/* ====================================================================
 * vues/formations.js — Domaine Formations (onglet "formations")
 * Extrait de app.js a l'Etape 9 du plan de refactorisation (Phase 2).
 *
 * Contenu : liste des formations (buildFormationsListe), mini-calendrier
 * dedie, notification de formations a venir (checkFormationNotif), et la
 * modale de creation/edition/suppression (openFormationModal/saveFormation/
 * deleteFormation).
 *
 * Variables emportees : FORMATIONS (liste des formations), formationEditId
 * (id en cours d'edition), canEditFormations (droit d'edition).
 *
 * Correction de plan : le tableau du plan Phase 2 (Section D) liste par
 * erreur ACCOUNTS comme "propre au domaine Formations". Verifie par grep :
 * ACCOUNTS est en realite utilisee par startApp (bootstrap transverse),
 * par les fonctions Admin (buildComptesEmpListe/toggleAccesEdit) et par
 * "Mon espace" (non traite a l'Etape 9) ; elle reste donc dans app.js
 * comme variable partagee, pas dans ce fichier.
 * ==================================================================== */

var FORMATIONS=[];

var formationEditId=null;

var canEditFormations=false;

function fmtDateFormation(iso){
  if(!iso) return '-';
  var p = iso.split('-'); if(p.length!==3) return iso;
  var mois=['janv.','fevr.','mars','avr.','mai','juin','juil.','aout','sept.','oct.','nov.','dec.'];
  return parseInt(p[2],10)+' '+mois[parseInt(p[1],10)-1];
}

function formationEmployesLabel(f){
  var ids = f.employes || [];
  if(!ids.length) return t('formations_all_team');
  return ids.map(function(idOrName){
    var e = EMP.find(function(x){ return x.id===idOrName || x.n===idOrName; });
    return e ? e.n : idOrName;
  }).join(', ');
}

function buildFormationsListe(){
  var elAvenir = document.getElementById('form-liste-avenir');
  var elPassees = document.getElementById('form-liste-passees');
  if(!elAvenir || !elPassees) return;
  var today = new Date(); today.setHours(0,0,0,0);
  var avenir=[], passees=[];
  FORMATIONS.forEach(function(f){
    var d = new Date(f.date+'T00:00:00');
    if(d>=today) avenir.push(f); else passees.push(f);
  });
  avenir.sort(function(a,b){ return (a.date+(a.heureDebut||'')).localeCompare(b.date+(b.heureDebut||'')); });
  passees.sort(function(a,b){ return (b.date+(b.heureDebut||'')).localeCompare(a.date+(a.heureDebut||'')); });
  function carte(f){
    var badges = (f.employes||[]).map(function(idOrName){
      var e = EMP.find(function(x){ return x.id===idOrName || x.n===idOrName; });
      var nom = e ? e.n : idOrName;
      return '<span class="pill ok" style="margin:2px 4px 2px 0">'+nom+'</span>';
    }).join('');
    var clickAttr = canEditFormations ? ' onclick="openFormationModal(\''+f.id+'\')" style="cursor:pointer"' : '';
    return '<div class="note-card"'+clickAttr+' style="border-left-color:var(--blue)">'
      +'<div class="note-card-row"><div class="note-card-date">'+fmtDateFormation(f.date)+'</div>'
      +'<div class="note-card-txt"><b>'+(f.titre||'Formation')+'</b>'
      +(f.heureDebut?' &middot; '+f.heureDebut+(f.heureFin?'-'+f.heureFin:''):'')
      +(f.lieu?' &middot; '+f.lieu:'')
      +'<div style="margin-top:6px">'+(badges||"<span style='color:var(--tx3)'>"+t('formations_all_team')+"</span>")+'</div>'
      +(f.notes?'<div style="margin-top:6px;color:var(--tx2);font-size:12px">'+f.notes+'</div>':'')
      +'</div></div></div>';
  }
  elAvenir.innerHTML = avenir.length ? avenir.map(carte).join('') : '<div class="empty">'+t('formations_empty_upcoming')+'</div>';
  elPassees.innerHTML = passees.length ? passees.map(carte).join('') : '<div class="empty">'+t('formations_empty_past')+'</div>';
}

function buildMiniCalFormations(){
  var el = document.getElementById('mini-cal-formations');
  if(!el) return;
  var today = new Date(); today.setHours(0,0,0,0);
  var limite = new Date(today); limite.setDate(limite.getDate()+30);
  var upcoming = FORMATIONS.filter(function(f){
    var d = new Date(f.date+'T00:00:00');
    return d>=today && d<=limite;
  }).sort(function(a,b){ return (a.date+(a.heureDebut||'')).localeCompare(b.date+(b.heureDebut||'')); });
  if(!upcoming.length){ el.innerHTML = '<div class="empty">'+t('formations_empty_30d')+'</div>'; return; }
  el.innerHTML = upcoming.map(function(f){
    var noms = formationEmployesLabel(f);
    return '<div style="display:flex;align-items:center;gap:12px;padding:10px 4px;border-bottom:1px solid var(--bd)">'
      +'<div style="font-family:var(--mo);font-size:12px;font-weight:700;color:var(--blue);min-width:70px">'+fmtDateFormation(f.date)+'</div>'
      +'<div style="flex:1"><div style="font-size:13px;font-weight:500">'+(f.titre||'Formation')+(f.heureDebut?' &middot; '+f.heureDebut:'')+'</div>'
      +'<div style="font-size:11px;color:var(--tx3)">'+noms+'</div></div>'
      +'</div>';
  }).join('');
}

function checkFormationNotif(){
  var el = document.getElementById('formation-notif');
  if(!el) return;
  var today = new Date(); today.setHours(0,0,0,0);
  var seuil = new Date(today); seuil.setDate(seuil.getDate()+3);
  var proches = FORMATIONS.filter(function(f){
    var d = new Date(f.date+'T00:00:00');
    return d>=today && d<=seuil;
  });
  if(!proches.length){ el.style.display='none'; el.innerHTML=''; return; }
  el.style.display='flex';
  el.innerHTML = '<div style="font-size:22px">&#127891;</div><div style="flex:1"><div style="font-weight:600;margin-bottom:4px">'+(proches.length>1?t('formations_notif_plural'):t('formations_notif_singular'))+'</div><div style="font-size:12px;color:var(--tx2)">'
    + proches.map(function(f){ return fmtDateFormation(f.date)+' : '+(f.titre||'Formation')+' &mdash; '+formationEmployesLabel(f); }).join('<br>')
    + '</div></div>';
}

function openFormationModal(id){
  var modal = document.getElementById('formation-modal');
  if(!modal) return;
  formationEditId = id || null;
  var f = id ? FORMATIONS.find(function(x){ return x.id===id; }) : null;
  document.getElementById('formation-modal-title').textContent = f ? t('formations_modal_title_edit') : t('formations_modal_title_new');
  document.getElementById('form-f-titre').value = f ? (f.titre||'') : '';
  document.getElementById('form-f-date').value = f ? (f.date||'') : '';
  document.getElementById('form-f-heure-debut').value = f ? (f.heureDebut||'') : '';
  document.getElementById('form-f-heure-fin').value = f ? (f.heureFin||'') : '';
  document.getElementById('form-f-lieu').value = f ? (f.lieu||'') : '';
  document.getElementById('form-f-notes').value = f ? (f.notes||'') : '';
  document.getElementById('formation-modal-err').textContent = '';
  var selectedIds = f ? (f.employes||[]) : [];
  var wrap = document.getElementById('form-f-employes');
  wrap.innerHTML = EMP.map(function(e){
    var val = e.id || e.n;
    var checked = selectedIds.indexOf(val)>=0 ? 'checked' : '';
    return '<label style="display:flex;align-items:center;gap:6px;padding:5px 10px;border:1px solid var(--bd2);border-radius:20px;font-size:12px;cursor:pointer;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)">'
      +'<input type="checkbox" class="form-f-emp-cb" value="'+String(val).replace(/"/g,'&quot;')+'" '+checked+' style="width:14px;height:14px">'+e.n+'</label>';
  }).join('');
  document.getElementById('form-btn-delete').style.display = f ? 'inline-block' : 'none';
  modal.style.display = 'flex';
}

function closeFormationModal(){
  var modal = document.getElementById('formation-modal');
  if(modal) modal.style.display = 'none';
  formationEditId = null;
}

function saveFormation(){
  var titre = document.getElementById('form-f-titre').value.trim();
  var date = document.getElementById('form-f-date').value;
  var heureDebut = document.getElementById('form-f-heure-debut').value;
  var heureFin = document.getElementById('form-f-heure-fin').value;
  var lieu = document.getElementById('form-f-lieu').value.trim();
  var notes = document.getElementById('form-f-notes').value.trim();
  var errEl = document.getElementById('formation-modal-err');
  if(!titre){ errEl.textContent = t('formations_err_titre'); return; }
  if(!date){ errEl.textContent = t('formations_err_date'); return; }
  var employes = Array.prototype.slice.call(document.querySelectorAll('.form-f-emp-cb:checked')).map(function(cb){ return cb.value; });
  var payload = { titre:titre, date:date, heureDebut:heureDebut||'', heureFin:heureFin||'', lieu:lieu||'', notes:notes||'', employes:employes, statut:'planifiee', creeLe:new Date().toISOString() };
  var ref = formationEditId ? db.ref('formations/'+formationEditId) : db.ref('formations').push();
  ref.update(payload).then(function(){
    toast(t('formations_toast_saved'), '#3b82f6');
    closeFormationModal();
  }).catch(function(e){
    errEl.textContent = t('formations_err_generic') + e.message;
  });
}

function deleteFormation(){
  if(!formationEditId) return;
  if(!confirm(t('formations_confirm_delete'))) return;
  db.ref('formations/'+formationEditId).remove().then(function(){
    toast(t('formations_toast_deleted'), '#ef4444');
    closeFormationModal();
  });
}
