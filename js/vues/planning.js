/* ====================================================================
 * vues/planning.js — Domaine Planning (onglet "pl")
 * Extrait de app.js a l'Etape 9 du plan de refactorisation (Phase 2).
 *
 * Contenu : le calendrier principal (buildPT), la navigation mois/annee
 * (prevMonth/nextMonth/goToday), le mini-calendrier, la popup d'edition
 * de shift (openPopup/applyShift), le sous-systeme "notes" (badges,
 * panneau, traduction), le sous-systeme "personnel extra" (ajout/retrait,
 * historique, badge), et l'impression du planning (openPrintModal/doPrint).
 *
 * Aucune scission metier/vues pour ce domaine (contrairement aux Etapes
 * 5-8) : le plan Phase 2 ne prevoit qu'un seul fichier vues/planning.js
 * pour Planning/Formations/Pointages/Admin.
 *
 * Corrections apportees par rapport a une classification naive par nom :
 *  - "toggleNotesPanelManual" est physiquement situe dans le bloc Admin
 *    (pres de enregistrerAccesEmploye/applyOverviewAccess) mais son seul
 *    appelant reel est buildPT() (verifie par grep sur tout le fichier,
 *    pas seulement l'analyse du graphe d'appel top-level) : reclassee ici.
 *  - "buildAbs" et "updAbsLbl" restent dans app.js : malgre leur position
 *    physique adjacente a ce bloc, elles pilotent la grille #agrid de
 *    l'onglet "ab" (Absences), un domaine distinct non traite a l'Etape 9.
 *  - "detectMissingWeeks" reste dans app.js (differee) : son seul appelant
 *    reel est applyProtimeImport(), qui fait partie du cluster d'import
 *    Protime differe a l'Etape 10 (imports/protime.js).
 *
 * Variables emportees : OPTS, LAST_FILTERED_DATES, EXTRA_EDIT_CTX,
 * EXTRA_EDIT_IDX, EXTRA_HIST, NOTE_EDIT_CTX, NOTE_TRANSLATE_CACHE,
 * ABS_CHARGEES, et isSyncing/curYear/curMonth/activePill/popup.
 *
 * Ces 5 dernieres faisaient partie d'une instruction var groupee avec
 * currentUser : "var currentUser=null,isSyncing=false,curYear='2026',
 * curMonth=null,activePill=null,popup=null;". currentUser est utilise par
 * de nombreux domaines (i18n, Admin, Pointages, Mon Espace...) et reste
 * dans app.js ; les 5 autres ne sont utilisees que par le code Planning
 * ci-dessous (verifie exhaustivement : aucun appelant en dehors de ce
 * fichier). La scission est purement syntaxique (deux instructions var
 * au lieu d'une), sans aucun changement de valeur ni d'ordre d'execution
 * significatif (les deux nouvelles instructions s'executent avant le
 * reste de app.js, comme c'etait deja le cas pour toutes les variables
 * deplacees depuis l'Etape 5, car vues/planning.js est charge avant
 * app.js dans index.html).
 * ==================================================================== */

var EXTRA_HIST=[];

var OPTS={TL:['TL','ziek','verlof','recup'],INPAK:['coordinateur','31/32','33/34','35/36','extra','Labo','Karton','Batter','Kruiden','AW1','AW2','ziek','verlof','recup'],Prod:['Prod','Labo','Karton','ziek','verlof','recup'],Unit:['Batter','Cleaning','Inpak','Bulk','Karton','Kruiden','AW1','AW2','ziek','verlof','recup']};

var ABS_CHARGEES=false;

function sCls(v){var m={'TL':'tl','coordinateur':'coord','31/32':'31','33/34':'33','35/36':'35','extra':'ex','Prod':'pr','Labo':'lb','Batter':'bt','Cleaning':'cl','Inpak':'ip','Bulk':'bk','ziek':'zk','verlof':'vl','recup':'rc','AW1':'aw1','AW2':'aw2','Karton':'kt','Kruiden':'kr'};return 's-'+(m[v]||'em');}

function sLbl(v){var m={'coordinateur':'COORD','TL':'TL'};return m[v]||v||'-';}

function todayStr(){var n=new Date();return String(n.getDate()).padStart(2,'0')+'/'+String(n.getMonth()+1).padStart(2,'0');}

function allDates(){return(curYear==='2027'?WEEKS27:curYear==='2026'?WEEKS26:WEEKS25).reduce(function(a,w){return a.concat(w.d);},[]);}

function save(){if(!db)return;isSyncing=true;var d26={};SHIFTS26.forEach(function(e){d26[e.n]=e.s;});var d25={};SHIFTS25.forEach(function(e){d25[e.n]=e.s;});var upd={};upd['planning/shifts2026']=d26;upd['planning/shifts2025']=d25;if(ABS_CHARGEES)upd['planning/absences']=ABS;upd['planning/extraHistorique']=EXTRA_HIST;upd['planning/lastUpdate']={at:new Date().toISOString(),by:currentUser?currentUser.email:'anonyme'};db.ref().update(upd).then(function(){isSyncing=false;updSlbl(new Date().toISOString());}).catch(function(err){isSyncing=false;toast('Erreur: '+err.message,'#ef4444');});}

function updSlbl(iso){var el=document.getElementById('slbl');if(!el)return;var d=new Date(iso),now=new Date(),dm=Math.round((now-d)/60000);el.textContent=dm<1?'Synchronise':'Sync il y a '+dm+' min';el.style.color='var(--green)';}

function prevMonth(){
  var weeks=curYear==='2027'?WEEKS27:curYear==='2026'?WEEKS26:WEEKS25;
  var all=weeks.reduce(function(a,w){return a.concat(w.d);},[]);
  var months=[...new Set(all.map(function(d){return parseInt(d.split('/')[1],10)-1;}))].sort(function(a,b){return a-b;});
  if(curMonth===null){curMonth=months[months.length-1];}
  else{var idx=months.indexOf(curMonth);curMonth=idx>0?months[idx-1]:null;}
  buildPT();
}

function nextMonth(){
  var weeks=curYear==='2027'?WEEKS27:curYear==='2026'?WEEKS26:WEEKS25;
  var all=weeks.reduce(function(a,w){return a.concat(w.d);},[]);
  var months=[...new Set(all.map(function(d){return parseInt(d.split('/')[1],10)-1;}))].sort(function(a,b){return a-b;});
  if(curMonth===null){curMonth=months[0];}
  else{var idx=months.indexOf(curMonth);curMonth=idx<months.length-1?months[idx+1]:null;}
  buildPT();
}

function buildMiniCal(){
  var el=document.getElementById('mini-cal');if(!el)return;
  var now=new Date();
  var days=[];
  for(var i=0;i<30;i++){var d=new Date(now);d.setDate(d.getDate()+i);days.push(d);}
  function fmtDDMM(d){return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0');}
  function fmtFull(d){return fmtDDMM(d)+'/'+d.getFullYear();}
  // Trouver les absences ziek dans cette plage
  var abs30=[];
  ABS.filter(function(a){return a.t==='ziek'||a.t==='verlof'||a.t==='recup';}).forEach(function(a){
    function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
    var deb=pFR(a.a),fin=pFR(a.b);
    days.forEach(function(day){
      var dd=new Date(day);dd.setHours(0,0,0,0);
      var d0=new Date(deb);d0.setHours(0,0,0,0);
      var d1=new Date(fin);d1.setHours(0,0,0,0);
      if(dd>=d0&&dd<=d1){abs30.push({name:a.n,date:fmtDDMM(day),type:a.t,ts:a.ts||0});}
    });
  });
  // Grouper par date, en ne gardant qu'une entree par personne (la plus
  // recemment importee) si plusieurs types d'absence se chevauchent ce jour-la.
  var byDate={};
  abs30.forEach(function(x){
    if(!byDate[x.date])byDate[x.date]={};
    var short=x.name.split(' ')[0];
    var existing=byDate[x.date][short];
    if(!existing||x.ts>=existing.ts){ byDate[x.date][short]={name:short,type:x.type,ts:x.ts}; }
  });
  var daysWithAbs=days.filter(function(d){var e=byDate[fmtDDMM(d)];return e&&Object.keys(e).length;});
  if(!daysWithAbs.length){el.innerHTML='<div style="color:var(--tx3);font-size:13px;padding:12px 0">'+t('ov_next30_none')+'</div>';return;}
  var MOIS=MOIS_ABBR_I18N[LANG]||MOIS_ABBR_I18N.fr;
  var h=daysWithAbs.map(function(d){
    var k=fmtDDMM(d);
    var entries=Object.values(byDate[k]);
    var dow=(DOW_ABBR_I18N[LANG]||DOW_ABBR_I18N.fr)[d.getDay()];
    return '<div style="display:flex;align-items:center;gap:12px;padding:7px 0;border-bottom:1px solid var(--bd2)">'
      +'<div style="min-width:70px;font-size:12px;color:var(--tx3)">'+dow+' '+d.getDate()+' '+MOIS[d.getMonth()]+'</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:5px">'+entries.map(function(x){
        var col=x.type==='ziek'?'#ef4444':x.type==='verlof'?'#3b82f6':'#10b981';
        return '<span style="font-size:11px;padding:2px 7px;border-radius:99px;background:'+col+'22;color:'+col+';border:1px solid '+col+'44">'+x.name+'</span>';
      }).join('')+'</div>'
      +'</div>';
  }).join('');
  el.innerHTML=h;
}

function buildPT(){
  // Navigation mois
  var MOIS=MOIS_I18N[LANG]||MOIS_I18N.fr;
  var mlbl=document.getElementById('month-label');
  if(mlbl) mlbl.textContent=curMonth!==null?MOIS[curMonth]:t('plan_all');
  document.getElementById('plan-title').textContent='Planning '+curYear+(curMonth!==null?' — '+MOIS[curMonth]:'');
  var tbl=document.getElementById('ptable');var td=todayStr();var allFull=allDates();
  // Les indices dans emp.s[] sont toujours relatifs a allFull (toute l'annee).
  // On construit une liste de {ddmm, realIdx} pour que la vue mois utilise
  // le bon index meme quand on filtre sur un sous-ensemble de colonnes.
  var allWithIdx=allFull.map(function(d,i){return {d:d,i:i};});
  var filtered=curMonth!==null?allWithIdx.filter(function(x){var m=parseInt(x.d.split('/')[1],10)-1;return m===curMonth;}):allWithIdx;
  LAST_FILTERED_DATES=filtered;
  var noteEntries=[];
  var all=filtered.map(function(x){return x.d;});
  var ti=all.indexOf(td);var h='<thead><tr><th class="nc">Employe</th>';filtered.forEach(function(x,col){
  var d=x.d;
  var parts=d.split('/');
  var dt=new Date(Date.UTC(parseInt(curYear),parseInt(parts[1])-1,parseInt(parts[0])));
  var days=DOW_ABBR_I18N[LANG]||DOW_ABBR_I18N.fr;
  var dayLbl=days[dt.getUTCDay()];
  var isT=(col===ti);
  var hMap=curYear==='2027'?H2027:curYear==='2026'?H2026:H2025;
  var hor=hMap[d]||'';
  var horColor=hor==='05h-17h'?'#5eddb7':'#fda96a';
  h+='<th class="'+(isT?'td-on':'')+'" style="min-width:42px">'
    +(isT?'<div class="td-dot"></div>':'')
    +'<div style="font-size:9px;opacity:.8;color:'+(isT?'#7eb3ff':'var(--tx3)')+'">'+dayLbl+'</div>'
    +d
    +(hor?'<div style="font-size:8px;font-weight:600;color:'+horColor+';margin-top:1px">'+hor+'</div>':'')
    +'</th>';
});h+='</tr></thead><tbody>';['TL','INPAK','Prod','Unit','EXTRA'].forEach(function(g){var shiftsArr=(curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25);var emps;if(g==='EXTRA'){emps=shiftsArr.filter(function(e){return e.g==='EXTRA';});}else{emps=shiftsArr.filter(function(e){var f=EMP.find(function(x){return x.n===e.n;});return f&&f.g===g;});}if(!emps.length)return;h+='<tr class="sr"><td colspan="'+(all.length+1)+'">'+(g==='EXTRA'?t('plan_section_extra'):g)+'</td></tr>';emps.forEach(function(emp){var isExtra=emp.g==='EXTRA';h+='<tr><td class="nc"'+(emp.n==='Note'?' style="cursor:pointer" onclick="toggleNotesPanelManual()" title="'+t('tooltip_voir_notes')+'"':'')+'>'+rowLabel(emp.n)+'</td>';filtered.forEach(function(x,col){var sv=emp.s[x.i]||'';var isBdToday=(function(){
      var bd=EMP.find(function(e){return e.n===emp.n;});
      if(!bd||!bd.birthday) return false;
      var parts=bd.birthday.split('-');
      var bm=parseInt(parts[1],10),bday=parseInt(parts[2],10);
      var parts2=x.d.split('/');
      return parseInt(parts2[0],10)===bday&&parseInt(parts2[1],10)===bm;
    })();
    if(isExtra){
      var isNett=emp.n==='Nettoyeur externe';
      var isNote=emp.n==='Note';
      if(isNett){
        var nCls=sv==='Oui'?'sp-nett-oui':sv==='Non'?'sp-nett-non':'sp-nett-empty';
        var nLbl=sv==='Oui'?'Oui':sv==='Non'?'Non':'+';
        h+='<td class="'+(col===ti?'td-td':'')+'">'
          +'<span class="sp-nett '+nCls+'" data-n="'+emp.n+'" data-i="'+x.i+'" data-s="'+sv+'">'+nLbl+'</span>'
          +'</td>';
      } else if(isNote){
      if(sv)noteEntries.push({d:x.d,i:x.i,txt:sv});
      var noteEsc=escHtml(sv);
      var noteLbl=sv?escHtml(noteBadgeLabel(sv)):'+';
      h+='<td class="'+(col===ti?'td-td':'')+'">'
        +'<span class="sp-note-dot'+(sv?' filled':'')+'" data-n="'+emp.n+'" data-i="'+x.i+'" data-s="'+noteEsc+'" title="'+noteEsc+'">'+noteLbl+'</span>'
        +'</td>';
      } else {
      var list=parseExtraList(sv);
      var esc=(sv||'').replace(/"/g,'&quot;');
      var lbl=extraBadgeLabel(list);
      var ttl=list.length?list.map(function(w){return w.n+(w.p?' ('+w.p+')':'');}).join(', ').replace(/"/g,'&quot;'):'';
      h+='<td class="'+(col===ti?'td-td':'')+'">'
        +'<span class="sp-extra'+(list.length?' filled':' empty')+'" data-n="'+emp.n+'" data-i="'+x.i+'" data-s="'+esc+'" title="'+ttl+'">'+lbl+'</span>'
        +'</td>';
      }
    } else {
    h+='<td class="'+(col===ti?'td-td':'')+'">'
      +'<span class="sp '+(sv?sCls(sv):'s-em')+'" data-n="'+emp.n+'" data-i="'+x.i+'" data-s="'+sv+'">'+(sv?sLbl(sv):'-')+'</span>'
      +(isBdToday?'<span style="font-size:10px;margin-left:2px" title="Anniversaire de '+emp.n.split(' ')[0]+'">⭐</span>':'')
      +'</td>';
    }});h+='</tr>';});});h+='</tbody>';tbl.innerHTML=h;tbl.querySelectorAll('.sp[data-n]').forEach(function(p){p.addEventListener('click',function(e){e.stopPropagation();openPopup(p);});});tbl.querySelectorAll('.sp-extra').forEach(function(p){p.addEventListener('click',function(e){e.stopPropagation();openExtraEdit(p);});});tbl.querySelectorAll('.sp-nett').forEach(function(p){p.addEventListener('click',function(e){e.stopPropagation();toggleNettoyeur(p);});});tbl.querySelectorAll('.sp-note-dot').forEach(function(p){p.addEventListener('click',function(e){e.stopPropagation();openNoteEdit(p);});});window.__allNoteEntries = noteEntries;
(function(){
  var todayD = new Date(); todayD.setHours(0,0,0,0);
  var upcoming = noteEntries.filter(function(en){
    var mdd = (en.d||'').split('/'); var dd=parseInt(mdd[0],10), mm=parseInt(mdd[1],10);
    if(isNaN(dd)||isNaN(mm)) return true;
    var edt = new Date((parseInt(curYear,10)||new Date().getFullYear()), mm-1, dd); edt.setHours(0,0,0,0);
    return edt >= todayD;
  });
  renderNotesPanel(window.__notesPanelForced ? window.__allNoteEntries : upcoming);
})();var ntd=document.getElementById('no-today');if(ti===-1){ntd.style.display='flex';}else{ntd.style.display='none';requestAnimationFrame(function(){var sc=document.querySelector('.pscroll');var ths=document.querySelectorAll('.ptable thead tr th');var targetTh=ths[ti+1];if(targetTh&&sc){var scRect=sc.getBoundingClientRect();var thRect=targetTh.getBoundingClientRect();sc.scrollTo({left:sc.scrollLeft+(thRect.left-scRect.left)-sc.clientWidth/2+thRect.width/2,behavior:'smooth'});}});}}

function rowLabel(n){
  if(n==='Commentaire')return t('plan_row_extra_staff');
  if(n==='Nettoyeur externe')return t('plan_row_ext_cleaner');
  if(n==='Note')return t('plan_row_note');
  return n;
}

var NOTE_EDIT_CTX=null;

var LAST_FILTERED_DATES=null;

function noteBadgeLabel(txt){
  if(!txt)return '+';
  var oneLine=txt.replace(/\s+/g,' ').trim();
  return oneLine.length>9?oneLine.slice(0,9)+'…':oneLine;
}

function currentNoteRow(){
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  return shifts.find(function(e){return e.n==='Note';});
}

function renderNotesPanel(entries){
  var panel=document.getElementById('notes-panel');
  if(!panel)return;
  if(!entries||!entries.length){panel.style.display='none';panel.innerHTML='';return;}
  panel.style.display='flex';
  panel.innerHTML='<div class="notes-panel-title">'+t('plan_notes_panel_title')+'</div>'
    +entries.map(function(e){
      return '<div class="note-card" data-n="Note" data-i="'+e.i+'">'
        +'<div class="note-card-row">'
        +'<div class="note-card-date">'+e.d+'</div>'
        +'<div class="note-card-txt">'+escHtml(e.txt).replace(/\n/g,'<br>')+'</div>'
        +'<div class="note-translate-row">'
        +'<button type="button" class="note-translate-btn" data-i="'+e.i+'" data-target="nl" title="'+t('note_translate_nl')+'">'+(LANG_FLAG_SVG.nl||'')+'</button>'
        +'<button type="button" class="note-translate-btn" data-i="'+e.i+'" data-target="en" title="'+t('note_translate_en')+'">'+(LANG_FLAG_SVG.en||'')+'</button>'
        +'</div>'
        +'</div>'
        +'<div class="note-translation" id="note-tr-'+e.i+'"></div>'
        +'</div>';
    }).join('');
  panel.querySelectorAll('.note-card').forEach(function(c){
    c.addEventListener('click',function(){openNoteEditFor(c.dataset.n,parseInt(c.dataset.i));});
  });
  panel.querySelectorAll('.note-translate-btn').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      translateNoteEntry(parseInt(btn.dataset.i),btn.dataset.target,btn);
    });
  });
}

var NOTE_TRANSLATE_CACHE={};

function translateNoteEntry(i,target,btn){
  var row=currentNoteRow();if(!row)return;
  var txt=(row.s[i]||'').trim();if(!txt)return;
  var box=document.getElementById('note-tr-'+i);
  if(!box)return;
  var cacheKey=txt+'|'+target;
  if(NOTE_TRANSLATE_CACHE[cacheKey]){
    showNoteTranslation(box,target,NOTE_TRANSLATE_CACHE[cacheKey]);
    return;
  }
  var prevHTML=btn.innerHTML;
  btn.disabled=true;
  btn.innerHTML='<span style="font-size:10px;color:var(--tx3)">…</span>';
  fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(txt)+'&langpair=fr|'+target)
    .then(function(r){return r.json();})
    .then(function(data){
      var out=data&&data.responseData&&data.responseData.translatedText?data.responseData.translatedText:null;
      if(!out)throw new Error('empty translation');
      NOTE_TRANSLATE_CACHE[cacheKey]=out;
      showNoteTranslation(box,target,out);
      btn.innerHTML=prevHTML;btn.disabled=false;
    })
    .catch(function(){
      toast(t('note_translate_error'),'#ef4444');
      btn.innerHTML=prevHTML;btn.disabled=false;
    });
}

function showNoteTranslation(box,target,text){
  box.style.display='flex';
  box.innerHTML='<span class="ntr-flag">'+(LANG_FLAG_SVG[target]||'')+'</span><span>'+escHtml(text)+'</span>';
}

function refreshNotesPanel(){
  if(!LAST_FILTERED_DATES)return;
  var row=currentNoteRow();if(!row)return;
  var entries=[];
  LAST_FILTERED_DATES.forEach(function(x){var txt=row.s[x.i]||'';if(txt)entries.push({d:x.d,i:x.i,txt:txt});});
  renderNotesPanel(entries);
}

function openNoteEdit(span){
  openNoteEditFor(span.dataset.n,parseInt(span.dataset.i));
}

function openNoteEditFor(nm,i){
  if(!canEdit())return;
  NOTE_EDIT_CTX={nm:nm,i:i};
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===nm;});
  if(!row)return;
  var cur=row.s[i]||'';
  var d=document.createElement('div');
  d.id='note-popup';
  d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center';
  d.innerHTML='<div style="background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:12px;padding:24px;width:380px;max-width:95vw">'
    +'<div style="font-weight:700;font-size:15px;margin-bottom:2px">'+t('note_modal_title')+'</div>'
    +'<div style="font-size:11px;color:var(--tx3);margin-bottom:14px">'+(allDates()[i]||'')+t('note_modal_hint')+'</div>'
    +'<textarea id="note-txt" placeholder="'+t('note_placeholder')+'" style="width:100%;height:90px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:8px;color:var(--tx1);font-family:var(--fn);font-size:13px;padding:10px;resize:vertical">'+escHtml(cur)+'</textarea>'
    +'<div style="display:flex;justify-content:space-between;margin-top:16px">'
    +'<button id="note-del-btn" style="padding:8px 14px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:#ef4444;font-family:var(--fn);font-size:12px;cursor:pointer">'+t('note_del_btn')+'</button>'
    +'<div style="display:flex;gap:8px">'
    +'<button id="note-close-btn" style="padding:8px 16px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:13px;cursor:pointer">'+t('note_close_btn')+'</button>'
    +'<button id="note-save-btn" style="padding:8px 16px;border-radius:var(--r);border:none;background:var(--blue);color:#fff;font-family:var(--fn);font-weight:600;font-size:13px;cursor:pointer">'+t('note_save_btn')+'</button>'
    +'</div></div></div>';
  document.body.appendChild(d);
  d.addEventListener('click',function(e){if(e.target===d)d.remove();});
  document.getElementById('note-close-btn').addEventListener('click',function(){d.remove();});
  document.getElementById('note-save-btn').addEventListener('click',function(){noteSave(document.getElementById('note-txt').value);d.remove();});
  document.getElementById('note-del-btn').addEventListener('click',function(){noteSave('');d.remove();});
  document.getElementById('note-txt').focus();
}

function noteSave(txt){
  var ctx=NOTE_EDIT_CTX;if(!ctx)return;
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===ctx.nm;});
  if(!row)return;
  while(row.s.length<=ctx.i)row.s.push('');
  row.s[ctx.i]=(txt||'').trim();
  updateNoteCell(ctx.nm,ctx.i);
  refreshNotesPanel();
  save();
}

function updateNoteCell(nm,i){
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===nm;});
  var txt=row.s[i]||'';
  var esc=escHtml(txt);
  var lbl=txt?escHtml(noteBadgeLabel(txt)):'+';
  document.querySelectorAll('.sp-note-dot[data-n="'+nm+'"][data-i="'+i+'"]').forEach(function(p){
    p.dataset.s=esc;
    p.title=esc;
    p.innerHTML=lbl;
    p.className='sp-note-dot'+(txt?' filled':'');
  });
}

function toggleNettoyeur(span){
  if(!canEdit())return;
  var nm=span.dataset.n,i=parseInt(span.dataset.i),cur=span.dataset.s||'';
  var next=cur===''?'Oui':cur==='Oui'?'Non':'';
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===nm;});
  if(!row)return;
  while(row.s.length<=i)row.s.push('');
  row.s[i]=next;
  document.querySelectorAll('.sp-nett[data-n="'+nm+'"][data-i="'+i+'"]').forEach(function(p){
    p.dataset.s=next;
    p.textContent=next==='Oui'?'Oui':next==='Non'?'Non':'+';
    p.className='sp-nett '+(next==='Oui'?'sp-nett-oui':next==='Non'?'sp-nett-non':'sp-nett-empty');
  });
  save();
}

function parseExtraList(sv){
  if(!sv)return[];
  try{var l=JSON.parse(sv);return Array.isArray(l)?l.filter(function(w){return w&&w.n;}):[];}
  catch(e){
    // Compat retro : anciennes cases en texte libre -> converties en une entree sans poste
    return sv.trim()?[{n:sv.trim(),p:''}]:[];
  }
}

function stringifyExtraList(list){return list.length?JSON.stringify(list):'';}

function extraBadgeLabel(list){
  if(!list.length)return '+';
  var first=list[0].n.split(' ')[0];
  return list.length===1?first:(first+' +'+(list.length-1));
}

function extraSaveHist(nom){
  if(!nom)return;
  if(EXTRA_HIST.indexOf(nom)===-1){EXTRA_HIST.push(nom);EXTRA_HIST.sort();}
}

var EXTRA_EDIT_CTX=null;

var EXTRA_EDIT_IDX=-1;

function openExtraEdit(span){
  if(!canEdit())return;
  var nm=span.dataset.n,i=parseInt(span.dataset.i);
  EXTRA_EDIT_CTX={nm:nm,i:i};
  EXTRA_EDIT_IDX=-1;
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===nm;});
  if(!row)return;
  var d=document.createElement('div');
  d.id='extra-popup';
  d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center';
  d.innerHTML='<div style="background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:12px;padding:24px;width:380px;max-width:95vw">'
    +'<div style="font-weight:700;font-size:15px;margin-bottom:2px">'+t('extra_modal_title')+'</div>'
    +'<div style="font-size:11px;color:var(--tx3);margin-bottom:14px">'+(allDates()[i]||'')+'</div>'
    +'<div id="extra-list" style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px"></div>'
    +'<div style="display:flex;gap:6px">'
    +'<input id="extra-nom" list="extra-hist" placeholder="'+t('extra_name_ph')+'" style="flex:1;min-width:0;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:8px;color:var(--tx1);font-family:var(--fn);font-size:13px;padding:8px 10px">'
    +'<datalist id="extra-hist">'+EXTRA_HIST.map(function(h){return '<option value="'+h.replace(/"/g,'&quot;')+'">';}).join('')+'</datalist>'
    +'<select id="extra-poste" style="background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:8px;color:var(--tx1);font-family:var(--fn);font-size:13px;padding:8px 6px">'
    +OPTS.INPAK.map(function(o){return '<option value="'+o+'">'+sLbl(o)+'</option>';}).join('')
    +'</select>'
    +'</div>'
    +'<div style="display:flex;gap:6px;margin-top:8px">'
    +'<button id="extra-add-btn" style="flex:1;padding:8px;border-radius:var(--r);border:1px dashed var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);font-size:12px;cursor:pointer">'+t('extra_add_btn')+'</button>'
    +'<button id="extra-cancel-btn" style="display:none;padding:8px 12px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx3);font-family:var(--fn);font-size:12px;cursor:pointer">'+t('extra_cancel_btn')+'</button>'
    +'</div>'
    +'<div style="display:flex;justify-content:flex-end;margin-top:16px">'
    +'<button id="extra-close-btn" style="padding:8px 16px;border-radius:var(--r);border:none;background:var(--blue);color:#fff;font-family:var(--fn);font-weight:600;cursor:pointer">'+t('extra_close_btn')+'</button>'
    +'</div></div>';
  document.body.appendChild(d);
  d.addEventListener('click',function(e){if(e.target===d)d.remove();});
  document.getElementById('extra-add-btn').addEventListener('click',extraAddWorker);
  document.getElementById('extra-cancel-btn').addEventListener('click',extraCancelEdit);
  document.getElementById('extra-close-btn').addEventListener('click',function(){d.remove();});
  renderExtraList();
  document.getElementById('extra-nom').focus();
}

function renderExtraList(){
  var ctx=EXTRA_EDIT_CTX;if(!ctx)return;
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===ctx.nm;});
  var list=parseExtraList(row.s[ctx.i]);
  var box=document.getElementById('extra-list');if(!box)return;
  box.innerHTML=list.length?list.map(function(w,idx){
    var isEditing=(idx===EXTRA_EDIT_IDX);
    return '<div style="display:flex;align-items:center;justify-content:space-between;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid '+(isEditing?'var(--blue)':'var(--bd2)')+';border-radius:8px;padding:6px 10px">'
      +'<span style="font-size:13px;color:var(--tx1)">'+w.n+(w.p?' <span style="color:var(--tx3);font-size:11px">('+sLbl(w.p)+')</span>':'')+'</span>'
      +'<span style="display:flex;gap:10px">'
      +'<span data-idx="'+idx+'" class="extra-edit" title="'+t('extra_edit_title')+'" style="cursor:pointer;color:var(--tx3);font-size:13px;line-height:1;padding:0 2px">&#9998;</span>'
      +'<span data-idx="'+idx+'" class="extra-rm" title="'+t('extra_remove_title')+'" style="cursor:pointer;color:var(--tx3);font-size:16px;line-height:1;padding:0 2px">&times;</span>'
      +'</span>'
      +'</div>';
  }).join(''):'<div style="font-size:12px;color:var(--tx3);font-style:italic;text-align:center;padding:8px 0">'+t('extra_empty_day')+'</div>';
  box.querySelectorAll('.extra-rm').forEach(function(btn){
    btn.addEventListener('click',function(){extraRemoveWorker(parseInt(btn.dataset.idx));});
  });
  box.querySelectorAll('.extra-edit').forEach(function(btn){
    btn.addEventListener('click',function(){extraStartEdit(parseInt(btn.dataset.idx));});
  });
}

function extraStartEdit(idx){
  var ctx=EXTRA_EDIT_CTX;if(!ctx)return;
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===ctx.nm;});
  var list=parseExtraList(row.s[ctx.i]);
  var w=list[idx];if(!w)return;
  EXTRA_EDIT_IDX=idx;
  var nomEl=document.getElementById('extra-nom'),posteEl=document.getElementById('extra-poste'),btn=document.getElementById('extra-add-btn'),cancelEl=document.getElementById('extra-cancel-btn');
  nomEl.value=w.n;
  if(w.p)posteEl.value=w.p;
  if(btn)btn.textContent=t('extra_save_btn');
  if(cancelEl)cancelEl.style.display='inline-block';
  renderExtraList();
  nomEl.focus();
}

function extraCancelEdit(){
  EXTRA_EDIT_IDX=-1;
  var nomEl=document.getElementById('extra-nom'),btn=document.getElementById('extra-add-btn'),cancelEl=document.getElementById('extra-cancel-btn');
  if(nomEl)nomEl.value='';
  if(btn)btn.textContent=t('extra_add_btn');
  if(cancelEl)cancelEl.style.display='none';
  renderExtraList();
}

function extraAddWorker(){
  var ctx=EXTRA_EDIT_CTX;if(!ctx)return;
  var nomEl=document.getElementById('extra-nom'),posteEl=document.getElementById('extra-poste');
  var nom=nomEl.value.trim();
  if(!nom){nomEl.focus();return;}
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===ctx.nm;});
  while(row.s.length<=ctx.i)row.s.push('');
  var list=parseExtraList(row.s[ctx.i]);
  if(EXTRA_EDIT_IDX>=0&&EXTRA_EDIT_IDX<list.length){
    list[EXTRA_EDIT_IDX]={n:nom,p:posteEl.value};
  } else {
    list.push({n:nom,p:posteEl.value});
  }
  row.s[ctx.i]=stringifyExtraList(list);
  extraSaveHist(nom);
  updateExtraBadge(ctx.nm,ctx.i);
  extraCancelEdit();
  nomEl.focus();
  save();
}

function extraRemoveWorker(idx){
  var ctx=EXTRA_EDIT_CTX;if(!ctx)return;
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===ctx.nm;});
  var list=parseExtraList(row.s[ctx.i]);
  list.splice(idx,1);
  row.s[ctx.i]=stringifyExtraList(list);
  updateExtraBadge(ctx.nm,ctx.i);
  if(EXTRA_EDIT_IDX===idx){extraCancelEdit();}else{renderExtraList();}
  save();
}

function updateExtraBadge(nm,i){
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var row=shifts.find(function(e){return e.n===nm;});
  var sv=row.s[i]||'';
  var list=parseExtraList(sv);
  var esc=sv.replace(/"/g,'&quot;');
  var lbl=extraBadgeLabel(list);
  var ttl=list.length?list.map(function(w){return w.n+(w.p?' ('+w.p+')':'');}).join(', ').replace(/"/g,'&quot;'):'';
  document.querySelectorAll('.sp-extra[data-n="'+nm+'"][data-i="'+i+'"]').forEach(function(p){
    p.dataset.s=esc;p.title=ttl;
    p.innerHTML=lbl;
    p.className='sp-extra'+(list.length?' filled':' empty');
  });
}

function openPopup(pill){activePill=pill;popup=document.getElementById('popup');if(popup&&popup.parentNode!==document.body)document.body.appendChild(popup);var nm=pill.dataset.n;var emp=EMP.find(function(e){return e.n===nm;});var opts=OPTS[emp?emp.g:'INPAK']||[];var cur=pill.dataset.s;var h='<div class="ptit">'+nm.split(' ')[0]+'</div>';opts.forEach(function(o){h+='<div class="popt" data-v="'+o+'"><span class="sp '+sCls(o)+'" style="'+(o===cur?'outline:1.5px solid #3b82f6':'')+'">'+sLbl(o)+'</span><span style="font-size:11px;color:var(--tx2)">'+(o==='ziek'?'Maladie':o==='verlof'?'Conge':o==='recup'?'Recuperation':o==='TL'?'Present':o==='AW1'?'Vers AW1':o==='AW2'?'Vers AW2':o)+'</span></div>';});h+='<div class="pcancel">Annuler</div>';popup.innerHTML=h;
var r=pill.getBoundingClientRect();
// IMPORTANT : #popup est en position:fixed (repere = fenetre visible),
// donc ses coordonnees ne doivent JAMAIS inclure window.scrollX/scrollY.
// Les ajouter (comme avant) decalait le menu de tout le defilement de la
// page, le poussant hors ecran des qu'on scrollait dans le tableau.
var left=r.left;
if(left+180>window.innerWidth-8) left=window.innerWidth-188;
if(left<8) left=8;
popup.style.left=left+'px';
popup.style.visibility='hidden';
popup.style.display='block';
var popupHeight=popup.offsetHeight; // deja plafonne par max-height en CSS
popup.style.visibility='visible';
var marge=8;
var spaceBelow=window.innerHeight-r.bottom-marge;
var spaceAbove=r.top-marge;
var top;
if(spaceBelow>=popupHeight){
  top=r.bottom+4;
}else if(spaceAbove>=popupHeight){
  top=r.top-popupHeight-4;
}else if(spaceBelow>=spaceAbove){
  // Ni en dessous ni au-dessus il n'y a la place pour tout afficher :
  // on colle en bas de l'ecran visible, le popup reste scrollable (voir CSS .popup).
  top=window.innerHeight-popupHeight-marge;
  if(top<r.bottom+4) top=r.bottom+4;
}else{
  top=marge;
}
popup.style.top=top+'px';
popup.querySelectorAll('.popt').forEach(function(o){o.addEventListener('click',function(){applyShift(o.dataset.v);});});popup.querySelector('.pcancel').addEventListener('click',closePopup);}

function closePopup(){if(popup)popup.style.display='none';activePill=null;}

function applyShift(nv){
  if(!activePill)return;
  if(!canEdit())return;
  var nm=activePill.dataset.n,i=parseInt(activePill.dataset.i),old=activePill.dataset.s;
  closePopup();
  var shifts=curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25;
  var emp=shifts.find(function(e){return e.n===nm;});
  if(!emp)return;
  while(emp.s.length<=i)emp.s.push('');
  emp.s[i]=nv;
  document.querySelectorAll('.sp[data-n="'+nm+'"][data-i="'+i+'"]').forEach(function(p){
    p.className='sp '+(nv?sCls(nv):'s-em');p.textContent=nv?sLbl(nv):'-';p.dataset.s=nv;
  });
  var all=allDates(),dateStr=all[i];

  // --- AUTOMATISME Lyse -> Larissa ---
  if(nm==='Lyse Musik'){
    var larissa=shifts.find(function(e){return e.n==='Larissa Fratutescu';});
    if(larissa){
      while(larissa.s.length<=i)larissa.s.push('');
      var wasAbs=(old==='ziek'||old==='verlof');
      var isAbs=(nv==='ziek'||nv==='verlof');
      var newLarissa=null;
      if(!wasAbs&&isAbs){ newLarissa='Labo'; toast('Larissa automatiquement en Labo','#06b6d4'); }
      else if(wasAbs&&!isAbs){ newLarissa='Prod'; toast('Larissa automatiquement en Prod','#10b981'); }
      if(newLarissa){
        larissa.s[i]=newLarissa;
        document.querySelectorAll('.sp[data-n="Larissa Fratutescu"][data-i="'+i+'"]').forEach(function(p){
          p.className='sp '+sCls(newLarissa);p.textContent=sLbl(newLarissa);p.dataset.s=newLarissa;
        });
      }
    }
  }

  if(nv==='ziek'&&old!=='ziek'){
    var fd=dateStr+'/'+curYear;
    if(!ABS.find(function(a){return a.n===nm&&a.a===fd&&a.d===1;})){
      ABS.push({n:nm,a:fd,b:fd,d:1,y:curYear,t:'ziek',ts:Date.now()});
      buildAbs(document.querySelector('.fb.on').dataset.f);updAbsLbl();
    }
    recalc();buildBT();updKPI();refreshCharts();save();
    var bd=BD.find(function(e){return e.n===nm;});
    toast(nm.split(' ')[0]+' malade - Bradford: '+(bd?bd.sc:0),scColor(bd?bd.sc:0));
  } else if(old==='ziek'&&nv!=='ziek'){
    var fd2=dateStr+'/'+curYear;
    for(var k=ABS.length-1;k>=0;k--){if(ABS[k].n===nm&&ABS[k].a===fd2&&ABS[k].d===1){ABS.splice(k,1);break;}}
    buildAbs(document.querySelector('.fb.on').dataset.f);updAbsLbl();
    recalc();buildBT();updKPI();refreshCharts();save();
    toast(nm.split(' ')[0]+' -> '+sLbl(nv),'#10b981');
  } else {
    save();toast(nm.split(' ')[0]+' -> '+sLbl(nv),'#3b82f6');
  }
}

function goToday(){
  var td=todayStr();
  var now=new Date();
  curMonth=now.getMonth(); // se positionner sur le mois actuel
  var all=allDates();
  var ti=all.indexOf(td);
  buildPT(); // rebuild avec le bon mois d'abord
  // Si aujourd'hui est un jour planifie -> scroll direct
  if(ti!==-1){
    setTimeout(function(){
      var sc=document.querySelector('.pscroll');
      var ths=document.querySelectorAll('.ptable thead tr th');
      // Dans la vue mois, chercher la colonne par data-i
      var targetTh=document.querySelector('.ptable thead tr th.td-on');
      if(!targetTh) targetTh=ths[1]; // fallback
      if(targetTh&&sc){
        var scRect=sc.getBoundingClientRect();
        var thRect=targetTh.getBoundingClientRect();
        sc.scrollTo({left:sc.scrollLeft+(thRect.left-scRect.left)-sc.clientWidth/2+thRect.width/2,behavior:'smooth'});
      }
    },50);
    toast('Positionne sur le '+td,'#3b82f6');
    return;
  }
  // Aujourd'hui est un jour de repos -> trouver le prochain shift
  var now=new Date();
  var todayMs=now.getTime();
  var nextDate=null;var nextIdx=-1;var nextYr=curYear;
  // Chercher dans l'annee courante d'abord
  var yr=parseInt(curYear);
  for(var i=0;i<all.length;i++){
    var parts2=all[i].split('/');
    var d2=new Date(Date.UTC(yr,parseInt(parts2[1])-1,parseInt(parts2[0])));
    if(d2.getTime()>todayMs){nextDate=all[i];nextIdx=i;break;}
  }
  // Si pas trouvé dans l'année courante, chercher dans l'année suivante
  if(!nextDate){
    var nextYear=String(yr+1);
    var nextWeeks=nextYear==='2027'?WEEKS27:null;
    if(nextWeeks){
      var nextAll=nextWeeks.reduce(function(a,w){return a.concat(w.d);},[]);
      for(var j=0;j<nextAll.length;j++){
        var parts3=nextAll[j].split('/');
        var d3=new Date(Date.UTC(yr+1,parseInt(parts3[1])-1,parseInt(parts3[0])));
        if(d3.getTime()>todayMs){
          // Switcher vers l'année suivante
          document.querySelectorAll('.ytab').forEach(function(b){b.classList.remove('on');});
          var nextBtn=document.querySelector('.ytab[data-yr="'+nextYear+'"]');
          if(nextBtn){nextBtn.classList.add('on');curYear=nextYear;buildPT();}
          setTimeout(function(){goToday();},150);return;
        }
      }
    }
  }
  if(nextDate){
    var sc2=document.querySelector('.pscroll');
    var ths2=document.querySelectorAll('.ptable thead tr th');
    var targetTh2=ths2[nextIdx+1];
    if(targetTh2&&sc2){
      var scRect2=sc2.getBoundingClientRect();
      var thRect2=targetTh2.getBoundingClientRect();
      sc2.scrollTo({left:sc2.scrollLeft+(thRect2.left-scRect2.left)-sc2.clientWidth/2+thRect2.width/2,behavior:'smooth'});
    }
    toast("Repos aujourd'hui - prochain shift: "+nextDate,'#f59e0b');
  } else {
    toast("Aucun shift planifie",'#f59e0b');
  }
}

function openPrintModal(){var all=allDates();if(!all.length)return;var overlay=document.createElement('div');overlay.id='print-overlay';overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:500;display:flex;align-items:center;justify-content:center';var dateOpts=all.map(function(d,i){return '<option value="'+i+'">'+d+'</option>';}).join('');overlay.innerHTML='<div style="background:#1e2436;border:1px solid rgba(255,255,255,.13);border-radius:14px;padding:28px 32px;min-width:360px;box-shadow:0 24px 60px rgba(0,0,0,.6)"><div style="font-size:16px;font-weight:600;margin-bottom:20px;color:#e8eaf0">Imprimer le planning</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px"><div><label style="font-size:11px;color:#8b90a4;display:block;margin-bottom:6px">Du</label><select id="pFrom" style="width:100%;background:#0f1117;color:#e8eaf0;border:1px solid rgba(255,255,255,.13);border-radius:8px;padding:8px 10px;font-size:12px">'+dateOpts+'</select></div><div><label style="font-size:11px;color:#8b90a4;display:block;margin-bottom:6px">Au</label><select id="pTo" style="width:100%;background:#0f1117;color:#e8eaf0;border:1px solid rgba(255,255,255,.13);border-radius:8px;padding:8px 10px;font-size:12px">'+dateOpts+'</select></div></div><div id="print-preview" style="font-size:11px;color:#555c72;margin-bottom:20px;padding:8px 12px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);border-radius:8px"></div><div style="display:flex;gap:10px;justify-content:flex-end"><button onclick="closePrintModal()" style="padding:8px 18px;border-radius:8px;border:1px solid rgba(255,255,255,.13);background:none;color:#8b90a4;font-family:Inter,sans-serif;font-size:13px;cursor:pointer">Annuler</button><button onclick="confirmPrint()" style="padding:8px 18px;border-radius:8px;border:none;background:#3b82f6;color:#fff;font-family:Inter,sans-serif;font-size:13px;font-weight:500;cursor:pointer">Imprimer</button></div></div>';document.body.appendChild(overlay);overlay.addEventListener('click',function(e){if(e.target===overlay)closePrintModal();});var td=todayStr(),ti=all.indexOf(td);if(ti!==-1)document.getElementById('pFrom').selectedIndex=ti;document.getElementById('pTo').selectedIndex=all.length-1;function updPrev(){var f=parseInt(document.getElementById('pFrom').value);var t=parseInt(document.getElementById('pTo').value);if(t<f){document.getElementById('pTo').selectedIndex=f;t=f;}document.getElementById('print-preview').textContent=(t-f+1)+' colonnes : '+all[f]+' -> '+all[t];}document.getElementById('pFrom').addEventListener('change',updPrev);document.getElementById('pTo').addEventListener('change',updPrev);updPrev();}

function closePrintModal(){var o=document.getElementById('print-overlay');if(o)o.remove();}

function confirmPrint(){var f=parseInt(document.getElementById('pFrom').value);var t=parseInt(document.getElementById('pTo').value);if(t<f)t=f;closePrintModal();doPrint(f,t);}

function doPrint(fromIdx,toIdx){var all=allDates();if(fromIdx===undefined)fromIdx=0;if(toIdx===undefined)toIdx=all.length-1;var selDates=all.slice(fromIdx,toIdx+1);var SC={'TL':{bg:'#eef2ff',c:'#3730a3',b:'#c7d2fe'},'coordinateur':{bg:'#e8f0fe',c:'#1a56db',b:'#93c5fd'},'31/32':{bg:'#d1fae5',c:'#065f46',b:'#6ee7b7'},'33/34':{bg:'#ccfbf1',c:'#0f766e',b:'#5eead4'},'35/36':{bg:'#ede9fe',c:'#5b21b6',b:'#c4b5fd'},'extra':{bg:'#f3f4f6',c:'#374151',b:'#d1d5db'},'Prod':{bg:'#fff7ed',c:'#9a3412',b:'#fdba74'},'Labo':{bg:'#ecfeff',c:'#0e7490',b:'#67e8f9'},'Batter':{bg:'#fdf2f8',c:'#831843',b:'#f0abfc'},'Cleaning':{bg:'#eff6ff',c:'#1e40af',b:'#93c5fd'},'Inpak':{bg:'#ecfdf5',c:'#065f46',b:'#6ee7b7'},'Bulk':{bg:'#f5f3ff',c:'#4c1d95',b:'#c4b5fd'},'ziek':{bg:'#fff1f2',c:'#9f1239',b:'#fca5a5'},'verlof':{bg:'#fffbeb',c:'#92400e',b:'#fcd34d'},'recup':{bg:'#fffbeb',c:'#92400e',b:'#fcd34d'},'AW1':{bg:'#fef2f2',c:'#991b1b',b:'#fca5a5'},'AW2':{bg:'#faf5ff',c:'#6b21a8',b:'#d8b4fe'},'Karton':{bg:'#fdf3e7',c:'#7c4a20',b:'#e3c19a'}};
  // Calcule pour chaque colonne : est-ce un weekend, et si oui l'horaire (05h-17h ou 17h-05h)
  var infoJour=selDates.map(function(d){
    var parts=d.split('/');var iso=curYear+'-'+parts[1]+'-'+parts[0];
    var dt=new Date(iso+'T00:00:00');var dow=dt.getDay();var weekend=(dow===0||dow===6);
    var horaire='';
    if(weekend){var bloc=(equipeWeekend(iso,'05h-17h')==='P5')?'05h-17h':'17h-05h';horaire=bloc;}
    return {weekend:weekend,horaire:horaire};
  });
  var nb=selDates.length;var fs=nb<=6?18:nb<=8?17:nb<=10?15:nb<=14?13:nb<=18?12:11;var nameFs=15;var tb='';var rowIdx=0;['TL','INPAK','Prod','Unit'].forEach(function(g){var em=(curYear==='2027'?SHIFTS27:curYear==='2026'?SHIFTS26:SHIFTS25).filter(function(e){var f=EMP.find(function(x){return x.n===e.n;});return f&&f.g===g;});if(!em.length)return;tb+='<tr style="background:#1e293b"><td colspan="'+(selDates.length+1)+'" style="color:#fff;font-size:9px;font-weight:700;text-transform:uppercase;padding:4px 6px">'+g+'</td></tr>';em.forEach(function(emp){var impaire=(rowIdx++ % 2 === 1);var nameBg=impaire?'#eef1f5':'#fafafa';tb+='<tr><td style="text-align:left;padding-left:8px;font-weight:700;font-size:'+nameFs+'px;border-right:2px solid #d1d5db;background:'+nameBg+';width:150px">'+emp.n+'</td>';selDates.forEach(function(d,i){var si=fromIdx+i;var s=emp.s[si]||'';var c=SC[s]||{bg:'#f9fafb',c:'#6b7280',b:'#e5e7eb'};var wkBg=infoJour[i].weekend?(impaire?'#dbeafe':'#eff6ff'):(impaire?'#f4f6f8':'#fff');tb+='<td style="padding:4px 2px;text-align:center;border:.5px solid #e5e7eb;background:'+wkBg+'">'+(s?'<span style="display:inline-block;background:'+c.bg+';color:'+c.c+';border:1.5px solid '+c.b+';padding:5px 10px;border-radius:4px;font-size:'+fs+'px;font-weight:700;white-space:nowrap">'+sLbl(s)+'</span>':'')+'</td>';});tb+='</tr>';});});var w=window.open('','_blank');w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Planning '+curYear+'</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,Arial,sans-serif;font-size:'+fs+'px;color:#111;background:#fff;padding:6mm}table{width:100%;border-collapse:collapse;table-layout:fixed}th{background:#f3f4f6;font-size:'+fs+'px;font-weight:700;padding:6px 2px;text-align:center;border:.5px solid #e5e7eb}th.wk{background:#bfdbfe}th .h{display:block;font-size:'+(fs-3)+'px;font-weight:600;color:#1e40af;margin-top:2px}.pbtn{position:fixed;top:14px;right:14px;background:#1e293b;color:#fff;border:none;border-radius:6px;padding:7px 16px;font-size:12px;cursor:pointer}@media print{.pbtn{display:none}@page{size:A4 landscape;margin:6mm}}</style></head><body>');w.document.write('<button class="pbtn" onclick="window.print()">Imprimer</button>');w.document.write('<div style="text-align:center;font-size:34px;font-weight:800;letter-spacing:3px;color:#111;margin-bottom:6px">AW3 P5</div>');
w.document.write('<div style="display:flex;justify-content:space-between;border-bottom:1.5px solid #111;padding-bottom:8px;margin-bottom:10px"><div><div style="font-size:16px;font-weight:700">Planning '+curYear+' - AW3 Ploeg 5</div><div style="font-size:10px;color:#555">Week-ends, feries et ponts — bande bleue = weekend, horaire indique sous la date</div></div><div style="font-size:10px;color:#555">'+new Date().toLocaleDateString('fr-BE',{day:'2-digit',month:'long',year:'numeric'})+'</div></div>');w.document.write('<table><thead><tr><th style="text-align:left;padding-left:8px;width:150px">Operateur</th>'+selDates.map(function(d,i){return '<th'+(infoJour[i].weekend?' class="wk"':'')+'>'+d+(infoJour[i].horaire?'<span class="h">'+infoJour[i].horaire+'</span>':'')+'</th>';}).join('')+'</tr></thead><tbody>'+tb+'</tbody></table>');w.document.write('</body></html>');w.document.close();w.focus();}

function toggleNotesPanelManual(){
  window.__notesPanelForced = !window.__notesPanelForced;
  var list;
  if(window.__notesPanelForced){
    list = window.__allNoteEntries||[];
  } else {
    var todayD = new Date(); todayD.setHours(0,0,0,0);
    list = (window.__allNoteEntries||[]).filter(function(en){
      var mdd = (en.d||'').split('/'); var dd=parseInt(mdd[0],10), mm=parseInt(mdd[1],10);
      if(isNaN(dd)||isNaN(mm)) return true;
      var edt = new Date((parseInt(curYear,10)||new Date().getFullYear()), mm-1, dd); edt.setHours(0,0,0,0);
      return edt >= todayD;
    });
  }
  renderNotesPanel(list);
}


// Variables d'etat Planning issues de la scission de la ligne 546 de app.js
// (voir commentaire d'en-tete). currentUser reste dans app.js.
var isSyncing=false,curYear='2026',curMonth=null,activePill=null,popup=null;
