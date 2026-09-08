/* ====================================================================
 * vues/espace.js — Domaine "Mon espace" (onglet "espace")
 * Extrait de app.js a l'Etape 11 du plan de refactorisation (Phase 2).
 * Vue agregee individuelle par employe (pointages, absences, formations,
 * NCP le concernant). Un employe normal ne voit que sa propre fiche ;
 * seul l'admin peut choisir un autre employe via le selecteur.
 * Extrait en dernier car agrege des donnees de plusieurs autres domaines
 * deja extraits (metier/bradford.js, imports/protime, ncp, formations),
 * comme annonce dans js/vues/README.md.
 * ==================================================================== */

// ============================================================
// MON ESPACE — vue individuelle par employe (pointages, absences,
// NCP le concernant). Un employe normal ne voit que sa propre fiche ;
// seul l'admin peut choisir un autre employe via le selecteur.
// ============================================================
function normNomEspace(s){
  return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().split(/\s+/).filter(Boolean).sort().join(' ');
}

function monEspaceTrouverEmpActuel(){
  if(!currentUser) return null;
  // Admin : peut identifier n'importe quel compte via ACCOUNTS (uid -> employeId).
  var myId = Object.keys(ACCOUNTS).find(function(id){ return ACCOUNTS[id] && ACCOUNTS[id].uid === currentUser.uid; });
  if(myId){ var eAcc = EMP.find(function(e){ return e.id === myId; }); if(eAcc) return eAcc; }
  // Compte personnel (non-admin) : ACCOUNTS n'est jamais charge pour eux (regles
  // Firebase, ils ne peuvent pas lire la liste de tous les comptes) -- on retombe
  // sur le nom deja lu sur leur propre fiche a la connexion (currentUser.nom).
  if(currentUser.nom){ return EMP.find(function(e){ return e.n === currentUser.nom; }) || null; }
  return null;
}

function monEspaceToggle(hdr){
var wrap2 = hdr.parentElement;
var body = wrap2 ? wrap2.querySelector('.me-body') : null;
var arrow = hdr.querySelector('.me-arrow');
if(!body) return;
var isOpen = body.style.display !== 'none';
body.style.display = isOpen ? 'none' : 'block';
if(arrow) arrow.textContent = isOpen ? '▸' : '▾';
}

function buildMonEspace(){
var wrap = document.getElementById('espace-content');
if(!wrap) return;
var isAdminView = currentUser && currentUser.role === 'admin';
var picker = document.getElementById('espace-picker-wrap');
var emp = null;

if(isAdminView){
if(picker) picker.style.display = 'block';
var sel = document.getElementById('espace-emp-select');
if(sel && sel.dataset.rempli !== LANG){
var options = EMP.filter(function(e){ return e.id; }).slice().sort(function(a,b){ return a.n.localeCompare(b.n); });
sel.innerHTML = '<option value="">' + t('espace_select_placeholder') + '</option>' + options.map(function(e){
return '<option value="'+e.id+'">'+e.n+'</option>';
}).join('');
sel.dataset.rempli = LANG;
}
var chosenId = sel ? sel.value : '';
emp = chosenId ? EMP.find(function(e){ return e.id === chosenId; }) : null;
} else {
if(picker) picker.style.display = 'none';
emp = monEspaceTrouverEmpActuel();
}

if(!emp){
wrap.innerHTML = isAdminView
? '<div class="cc"><div style="padding:20px;color:var(--tx3);text-align:center">' + t('espace_choose_prompt') + '</div></div>'
: '<div class="cc"><div style="padding:20px;color:var(--tx3);text-align:center">' + t('espace_no_fiche') + '</div></div>';
return;
}

var cible = normNomEspace(emp.n);

var ptEntries = Object.values(PT_DATA || {}).filter(function(a){ return normNomEspace(a.nom) === cible; });
ptEntries.sort(function(a,b){ return (b.date+(b.heure||'')).localeCompare(a.date+(a.heure||'')); });
var retards = ptEntries.filter(function(a){ return a.type === 'retard'; });
var ecarts = ptEntries.filter(function(a){ return a.type === 'pointage' && a.ecart && !pointageEcartAvantShift(a); });

var absEntries = Object.values(ABS || {}).filter(function(a){ return normNomEspace(a.n) === cible; });
absEntries.sort(function(a,b){
function keyAbs(x){ var p=(x.a||'').split('/'); return p.length===3 ? p[2]+p[1]+p[0] : (x.a||''); }
return keyAbs(b).localeCompare(keyAbs(a));
});

var ncpEntries = Object.values(NCP_DATA || {}).filter(function(n){
if(n.type_ncp === 'Inpak' && n.ligne && n.unite === 'AW3'){
var ligneNum = String(n.ligne).replace(/^L0*/,'').replace(/^L/,'');
if(typeof getOperateur !== 'function') return false;
var op = getOperateur(n.created_date_iso, n.created_heure, ligneNum);
if(op) return op.split(', ').indexOf(emp.n) !== -1;
// Pas de planning individuel ligne par ligne pour ce jour (frequent en semaine :
// seul le planning week-end/ferie liste qui est precisement sur quelle ligne).
// On ne fait plus disparaitre le NCP : on le montre a l'equipe Inpak P5 concernee,
// sans pouvoir preciser qui exactement (badge "equipe" affiche au rendu).
if(emp.g !== 'INPAK' && !(emp.g === 'Unit' && emp.r === 'Inpak')) return false;
if(typeof ncpConcerneEquipe !== 'function') return false;
return ncpConcerneEquipe(n, 'P5');
}
// NCP Production AW3 : rattachees aux membres de l'equipe Production,
// mais seulement si le creneau appartient bien a l'equipe P5 (comme pour
// l'Inpak, cette dashboard ne suit que P5, pas P1-P4)
if(n.type_ncp === 'Production' && n.unite === 'AW3' && emp.g === 'Prod'){
if(typeof ncpConcerneEquipe !== 'function') return false;
return ncpConcerneEquipe(n, 'P5');
}
return false;
});
ncpEntries.sort(function(a,b){ return (b.created_date_iso+(b.created_heure||'')).localeCompare(a.created_date_iso+(a.created_heure||'')); });
var ncpDirectCount = ncpEntries.filter(function(n){ return typeof ncpHorsShift!=='function' || !ncpHorsShift(n); }).length;

var todayEspace = new Date(); todayEspace.setHours(0,0,0,0);
var formEntries = (typeof FORMATIONS !== 'undefined' ? FORMATIONS : []).filter(function(f){
var emps = f.employes || [];
if(!emps.length) return true;
return emps.some(function(idOrName){ return idOrName === emp.id || normNomEspace(idOrName) === cible; });
});
var formAvenir = formEntries.filter(function(f){ return new Date(f.date+'T00:00:00') >= todayEspace; });
var formPassees = formEntries.filter(function(f){ return new Date(f.date+'T00:00:00') < todayEspace; });
formAvenir.sort(function(a,b){ return (a.date+(a.heureDebut||'')).localeCompare(b.date+(b.heureDebut||'')); });
formPassees.sort(function(a,b){ return (b.date+(b.heureDebut||'')).localeCompare(a.date+(a.heureDebut||'')); });
var formSorted = formAvenir.concat(formPassees);

var bd = (typeof BD !== 'undefined' ? BD : []).find(function(b){ return normNomEspace(b.n) === cible; });

var TYPE_ABS_LABEL = {recup:t('espace_type_recup'), ziek:t('espace_type_ziek'), verlof:t('espace_type_verlof')};
var TYPE_ABS_PILL = {recup:'ok', ziek:'cr', verlof:'wn'};

var titreHtml = isAdminView ? '<div style="margin-bottom:16px;font-size:13px;color:var(--tx2)">' + t('espace_of') + ' <b>'+emp.n+'</b></div>' : '';

var html = titreHtml;

var initiales = emp.n.split(' ').map(function(w){ return w[0]||''; }).join('').slice(0,2).toUpperCase();
var scoreVal = bd ? bd.sc : 0;
var scCoul = typeof scColor==='function' ? scColor(scoreVal) : '#10b981';
var scInfo = typeof scSt==='function' ? scSt(scoreVal) : {l:'OK', c:'ok'};
var msgPositif = scoreVal<=50 ? t('espace_msg_ok') : scoreVal<=200 ? t('espace_msg_wn') : scoreVal<=500 ? t('espace_msg_al') : t('espace_msg_cr');
var tendanceHtml = '';
if(bd && bd.T && bd.T.length===4){
var recentT = bd.T[2]+bd.T[3], ancienT = bd.T[0]+bd.T[1];
if(recentT < ancienT) tendanceHtml = '<span class="pill ok" style="margin-left:8px">' + t('espace_trend_down') + '</span>';
else if(recentT > ancienT) tendanceHtml = '<span class="pill wn" style="margin-left:8px">' + t('espace_trend_up') + '</span>';
else tendanceHtml = '<span class="pill" style="margin-left:8px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:var(--tx2)">' + t('espace_trend_stable') + '</span>';
}

html += '<div class="cc" style="margin-bottom:16px;background:linear-gradient(135deg,var(--bg3),var(--bg2))">'
+ '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">'
+ '<div style="width:52px;height:52px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;flex:none">'+initiales+'</div>'
+ '<div style="flex:1;min-width:200px">'
+ '<div style="font-size:17px;font-weight:700">'+emp.n+'</div>'
+ '<div style="font-size:12px;color:var(--tx2);margin-top:3px">'+msgPositif+'</div>'
+ '</div>'
+ '<div style="text-align:center">'
+ '<div style="font-size:11px;color:var(--tx3);margin-bottom:4px">' + t('espace_score_bradford') + '</div>'
+ '<div style="font-size:24px;font-weight:700;color:'+scCoul+'">'+scoreVal+'</div>'
+ '<span class="pill '+scInfo.c+'">'+scInfo.l+'</span>'+tendanceHtml
+ '</div>'
+ '</div>'
+ (bd ? '<div style="display:flex;gap:24px;margin-top:14px;padding-top:14px;border-top:1px solid var(--bd)">'
+ '<div><div style="font-size:18px;font-weight:700">'+bd.D+'</div><div style="font-size:11px;color:var(--tx3)">' + t('espace_days_absence') + '</div></div>'
+ '<div><div style="font-size:18px;font-weight:700">'+bd.S+'</div><div style="font-size:11px;color:var(--tx3)">' + t('espace_periods') + '</div></div>'
+ '</div>' : '')
+ '</div>';

function meSection(icon, titre, count, bodyHtml){
return '<div class="cc" style="margin-bottom:16px">'
+ '<div class="cch" style="cursor:pointer" onclick="monEspaceToggle(this)"><div class="cct" style="display:flex;align-items:center;justify-content:space-between"><span>'+icon+' '+titre+' (' + count + ')</span><span class="me-arrow" style="color:var(--tx3);font-size:12px">▸</span></div></div>'
+ '<div class="me-body" style="display:none;margin-top:10px">' + bodyHtml + '</div>'
+ '</div>';
}

var formBody;
if(!formSorted.length){
formBody = '<div style="color:var(--tx3);font-size:13px;padding:8px 0">' + t('espace_no_formation') + '</div>';
} else {
formBody = formSorted.slice(0,100).map(function(f){
var estAvenir = new Date(f.date+'T00:00:00') >= todayEspace;
var badge = estAvenir ? '<span class="pill ok">' + t('espace_form_upcoming') + '</span>' : '<span style="font-size:11px;color:var(--tx3)">' + t('espace_form_past') + '</span>';
return '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);margin-bottom:6px;flex-wrap:wrap">'
+ '<div style="font-family:var(--mo);font-size:12px;color:var(--tx2);white-space:nowrap">'+dFR(f.date)+'</div>'
+ '<div style="font-size:13px;color:var(--tx1);flex:1;min-width:120px"><b>'+(f.titre||t('espace_sec_formations'))+'</b>'+(f.heureDebut?' · '+f.heureDebut+(f.heureFin?'-'+f.heureFin:''):'')+(f.lieu?' · '+f.lieu:'')+'</div>'
+ badge
+ '</div>';
}).join('');
}
html += meSection('🎓', t('espace_sec_formations'), formSorted.length, formBody);

var retardsBody;
if(!retards.length){
retardsBody = '<div style="color:var(--green);font-size:13px;padding:8px 0">' + t('espace_no_retard') + '</div>';
} else {
retardsBody = retards.slice(0,100).map(function(a){
return '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);margin-bottom:6px;flex-wrap:wrap">'
+ '<div style="font-family:var(--mo);font-size:12px;color:var(--tx2);white-space:nowrap">'+dFR(a.date)+'</div>'
+ '<span class="pill cr">'+(a.detail||((a.retardMin||0)+' min'))+'</span>'
+ '</div>';
}).join('');
}
html += meSection('🕐', t('espace_sec_retards'), retards.length, retardsBody);

var ecartsBody;
if(!ecarts.length){
ecartsBody = '<div style="color:var(--green);font-size:13px;padding:8px 0">' + t('espace_no_ecart') + '</div>';
} else {
ecartsBody = ecarts.slice(0,100).map(function(a){
return '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);margin-bottom:6px;flex-wrap:wrap">'
+ '<div style="font-family:var(--mo);font-size:12px;color:var(--tx2);white-space:nowrap">'+dFR(a.date)+'</div>'
+ '<div style="font-size:13px;color:var(--tx1)">'+(a.detail||((a.ecart||0)+' min'))+'</div>'
+ '</div>';
}).join('');
}
html += meSection('⏱️', t('espace_sec_ecarts'), ecarts.length, ecartsBody);

var absBody;
if(!absEntries.length){
absBody = '<div style="color:var(--green);font-size:13px;padding:8px 0">' + t('espace_no_absence') + '</div>';
} else {
absBody = absEntries.slice(0,100).map(function(a){
var lbl = TYPE_ABS_LABEL[a.t] || a.t;
var pillCls = TYPE_ABS_PILL[a.t] || 'wn';
return '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);margin-bottom:6px;flex-wrap:wrap">'
+ '<div style="font-family:var(--mo);font-size:12px;color:var(--tx2);white-space:nowrap">'+a.a+(a.b && a.b!==a.a ? t('date_range_sep')+a.b : '')+'</div>'
+ '<span class="pill '+pillCls+'">'+lbl+'</span>'
+ '<div style="margin-left:auto;font-size:11px;color:var(--tx3)">'+(a.d||'')+' ' + t('espace_days_suffix') + '</div>'
+ '</div>';
}).join('');
}
html += meSection('🏥', t('espace_sec_absences'), absEntries.length, absBody);

var ncpBody;
var ncpNote = '<div style="font-size:11px;color:var(--tx3);margin-bottom:10px">' + t('espace_ncp_note') + '</div>';
if(!ncpEntries.length){
ncpBody = ncpNote + '<div style="color:var(--green);font-size:13px;padding:8px 0">' + t('espace_no_ncp') + '</div>';
} else {
var ncpBanniere = ncpDirectCount > 0
? '<div style="background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.25);border-radius:8px;padding:8px 12px;margin-bottom:10px;font-size:12px;color:var(--green)">' + t('espace_ncp_banner').replace('{n}', ncpDirectCount).replace('{total}', ncpEntries.length) + '</div>'
: '';
var ncpRows = ncpEntries.slice(0,100).map(function(n){
var direct = typeof ncpHorsShift!=='function' || !ncpHorsShift(n);
var badge = direct
? '<span class="pill ok">' + t('espace_ncp_direct') + '</span>'
: '<span class="pill" style="background:rgba(59,130,246,.12);color:var(--blue)">' + t('espace_ncp_late') + '</span>';
var opPrecis = null;
if(n.type_ncp === 'Inpak' && n.ligne && typeof getOperateur === 'function'){
var ln = String(n.ligne).replace(/^L0*/,'').replace(/^L/,'');
opPrecis = getOperateur(n.created_date_iso, n.created_heure, ln);
}
var badgeEquipe = (n.type_ncp === 'Inpak' && !opPrecis)
? '<span class="pill" style="background:rgba(139,92,246,.12);color:#8b5cf6">' + t('espace_ncp_equipe') + '</span>'
: '';
return '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);margin-bottom:6px;flex-wrap:wrap;cursor:pointer" onclick="ncpDetail(\'' + n.notification + '\')">'
+ '<div style="font-family:var(--mo);font-size:12px;color:var(--tx2);white-space:nowrap">'+dFR(n.created_date_iso)+' '+(n.created_heure||'')+'</div>'
+ '<div style="font-size:12px;font-weight:600">'+(n.ligne||'-')+'</div>'
+ '<div style="font-size:13px;color:var(--tx1);flex:1;min-width:120px">'+(n.description||n.code_produit||'-')+'</div>'
+ badge + badgeEquipe
+ '</div>';
}).join('');
ncpBody = ncpNote + ncpBanniere + ncpRows;
}
html += meSection('🔧', t('espace_sec_ncp'), ncpEntries.length, ncpBody);

wrap.innerHTML = html;
}