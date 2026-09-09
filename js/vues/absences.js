/* ====================================================================
 * vues/absences.js -- Domaine "Absences" (onglet "ab")
 * Extrait de app.js a l'Etape 12 du plan de refactorisation (Phase 2).
 * Grille des absences maladie (ABS), label du compteur admin, et widget
 * "absences du jour" affiche sur la vue d'ensemble.
 * ==================================================================== */

// ABSENCES

function updAbsLbl(){
  if(currentUser && currentUser.role !== 'admin') return;
  var el=document.getElementById('abs-lbl');
  if(el) el.textContent=ABS.length+t('ab_count_suffix');
}
function buildAbs(f){var grid=document.getElementById('agrid');var ziekOnly=ABS.filter(function(a){return a.t==='ziek';});var mx=Math.max.apply(null,ziekOnly.map(function(a){return a.d;}));if(mx<1)mx=1;var list=[].concat(ziekOnly);if(f&&f!=='all')list=list.filter(function(a){return a.y===f||a.n===f;});list.sort(function(a,b){return b.d-a.d;});
grid.innerHTML=list.map(function(a){var pct=Math.round(a.d/mx*100);return '<div class="arow"><div class="an">'+a.n+'</div><div class="ad">'+a.a+'</div><div class="ad">'+a.b+'</div><div class="aj">'+a.d+'j</div><div class="ab"><div class="abf" style="width:'+pct+'%;background:#ef4444"></div></div><div class="ay">'+a.y+'</div></div>';}).join('')||'<div class="empty">'+t('ab_empty')+'</div>';}

// ============================================================
// NOUVELLES FONCTIONS (widget absences du jour)
// ============================================================

function buildTodayAbs(){
  var el=document.getElementById('today-abs');
  var title=document.getElementById('today-abs-title');
  if(!el) return;
  var now=new Date();
  function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
  function ddmm(d){function z(n){return n<10?'0'+n:''+n;}return z(d.getDate())+'/'+z(d.getMonth()+1);}
  function weeksOf(y){return y==='2027'?WEEKS27:y==='2026'?WEEKS26:y==='2025'?WEEKS25:null;}
  // Determine le jour a afficher : aujourd'hui si c'est un jour travaille (present dans
  // le planning WEEKS25/26/27), sinon le prochain jour travaille -- meme definition et
  // meme source de donnees que goToday() dans vues/planning.js, aucune nouvelle regle.
  var targetDate=now, targetYr=String(now.getFullYear()), isToday=true;
  var w0=weeksOf(targetYr);
  var all0=w0?w0.reduce(function(a,w){return a.concat(w.d);},[]):[];
  if(all0.indexOf(ddmm(now))===-1){
    isToday=false;
    for(var i=1;i<=60;i++){
      var cand=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i);
      var cyr=String(cand.getFullYear());
      var cw=weeksOf(cyr);
      if(!cw) continue;
      var cAll=cw.reduce(function(a,w){return a.concat(w.d);},[]);
      if(cAll.indexOf(ddmm(cand))!==-1){ targetDate=cand; targetYr=cyr; break; }
    }
  }
  var today=ddmm(targetDate), yr=targetYr;
  var absToday=[];
  ABS.forEach(function(a){
    var deb=pFR(a.a),fin=pFR(a.b),td=new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate());
    if(deb<=td&&fin>=td) absToday.push(a);
  });
  var shifts=yr==='2027'?SHIFTS27:yr==='2026'?SHIFTS26:SHIFTS25;
  var weeks=yr==='2027'?WEEKS27:yr==='2026'?WEEKS26:WEEKS25;
  var allD=weeks.reduce(function(a,w){return a.concat(w.d);},[]);
  var ti=allD.indexOf(today);
  if(ti!==-1) shifts.forEach(function(emp){
    var sv=emp.s[ti]||'';
    if((sv==='verlof'||sv==='recup')&&!absToday.find(function(a){return a.n===emp.n;}))
      absToday.push({n:emp.n,t:sv,a:today+'/'+yr,b:today+'/'+yr,d:1});
  });
  window.OV_ABSENTS_TODAY = absToday.length;
  window.OV_ABSENTS_LIST = absToday;
  window.OV_ABSENTS_IS_TODAY = isToday;
  if(typeof buildOvResume==='function') buildOvResume();
  var MOIS=MOIS_I18N[LANG]||MOIS_I18N.fr;
  var dow=(DOW_FULL_I18N[LANG]||DOW_FULL_I18N.fr)[targetDate.getDay()];
  var lbl=isToday?t('ov_today_prefix'):t('ov_nextday_prefix');
  if(title) title.textContent=lbl+' \u2014 '+dow+' '+targetDate.getDate()+' '+MOIS[targetDate.getMonth()];
  if(!absToday.length){el.innerHTML='<div style="color:var(--tx3);font-size:13px;padding:12px 0;text-align:center">'+t('ov_today_allpresent')+'</div>';return;}
  el.innerHTML=absToday.map(function(a){
    var tc=a.t==='ziek'?'#ef4444':a.t==='verlof'?'#3b82f6':'#10b981';
    var tl=a.t==='ziek'?t('legend_ziek'):a.t==='verlof'?t('legend_verlof'):t('legend_recup');
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd2)"><div style="font-size:13px;font-weight:600;color:var(--tx1)">'+a.n+'</div><span style="font-size:11px;padding:2px 9px;border-radius:99px;background:'+tc+'22;color:'+tc+';border:1px solid '+tc+'44">'+tl+'</span></div>';
  }).join('');
}
