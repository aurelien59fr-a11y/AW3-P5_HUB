/* vues/bradford.js -- rendu, KPI, graphiques, commentaires et exports de l'onglet Bradford.
   Extrait de app.js a l'etape 5 du plan Phase 2 (aucune regle metier changee).
   BD_COMMENTS, BD_PREV_STATUS et les handles de graphiques (chB, chT, chJ)
   descendent ici : ils ne sont lus/ecrits que par les fonctions de ce fichier.
   getCommentHistory(), marquerDiscute() et trendHtml() n'ont aucun appelant
   dans le fichier (deja le cas avant cette extraction) ; conservees telles
   quelles, sans changement de comportement -- signale dans TODO_PHASE_FUTURE.md.
   genererRapportExcel() et calcStatsTrimestreNvsN1() restent dans app.js :
   ce sont des utilitaires transverses (rapport combinant Bradford + absences),
   pas des fonctions propres au domaine Bradford (voir section B du plan). */

var BD_COMMENTS={};
var BD_PREV_STATUS={};
var chB,chT,chJ;

function updKPI(){
  var ok=BD.filter(function(e){return e.sc<=50;}).length;
  var wn=BD.filter(function(e){return e.sc>50&&e.sc<=500;});
  var cr=BD.filter(function(e){return e.sc>500;});
  document.getElementById('k-ok').textContent=ok;
  document.getElementById('k-okp').textContent=Math.round(ok/BD.length*100)+'% OK';
  document.getElementById('k-wn').textContent=wn.length;
  document.getElementById('k-cr').textContent=cr.length;
  document.getElementById('k-crm').textContent=cr.length>0?t('ov_crm_urgent'):t('ov_crm_none');
  function chip(e,color){var fn=e.n.split(' ')[0];return '<span onclick="goToBradford(\''+e.n.replace(/'/g,"\\'")+'\')" style="cursor:pointer;font-size:12px;padding:3px 9px;border-radius:99px;background:'+color+'22;color:'+color+';border:1px solid '+color+'55;white-space:nowrap">'+fn+'</span>';}
  document.getElementById('k-wn-names').innerHTML=wn.map(function(e){return chip(e,'#f59e0b');}).join('');
  document.getElementById('k-cr-names').innerHTML=cr.map(function(e){return chip(e,'#ef4444');}).join('');
  // Détection franchissement de seuil
  var alertEl=document.getElementById('k-alerts');
  if(!alertEl) return;
  var alerts=[];
  BD.forEach(function(e){
    var prev=BD_PREV_STATUS[e.n];
    var curr=scSt(e.sc).l;
    if(prev&&prev!==curr&&e.sc>50){
      alerts.push('<b>'+e.n.split(' ')[0]+'</b>'+t('ov_alert_from')+'<i>'+prev+'</i>'+t('ov_alert_to')+'<i>'+curr+'</i>');
    }
    BD_PREV_STATUS[e.n]=curr;
  });
  alertEl.innerHTML=alerts.length?'<div style="background:#f59e0b22;border:1px solid #f59e0b55;border-radius:8px;padding:10px 14px;font-size:13px;color:#f59e0b;margin-bottom:12px">⚠ '+alerts.join(' &nbsp;·&nbsp; ')+'</div>':'';
  applyOverviewAccess();
}

function initCharts(){var s=[].concat(BD).sort(function(a,b){return b.sc-a.sc;});chB=new Chart(document.getElementById('cBrad'),{type:'bar',data:{labels:s.map(function(e){return e.n.split(' ')[0];}),datasets:[{data:s.map(function(e){return e.sc;}),backgroundColor:s.map(function(e){return scColor(e.sc)+'bb';}),borderColor:s.map(function(e){return scColor(e.sc);}),borderWidth:1,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}},beginAtZero:true}}}});var tr={'Q1 2025':0,'Q2 2025':0,'Q3 2025':0,'Q4 2025':0,'Q1 2026':0,'Q2 2026':0};ABS.forEach(function(a){var p=a.a.split('/');var k='Q'+Math.ceil(Number(p[1])/3)+' '+p[2];if(tr[k]!==undefined)tr[k]+=a.d;});chT=new Chart(document.getElementById('cTrim'),{type:'line',data:{labels:Object.keys(tr),datasets:[{data:Object.values(tr),borderColor:'#3b82f6',backgroundColor:'rgba(59,130,246,.08)',borderWidth:2,pointBackgroundColor:'#3b82f6',pointRadius:5,fill:true,tension:.3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}},beginAtZero:true}}}});var jj=[].concat(BD).filter(function(e){return e.D>0;}).sort(function(a,b){return b.D-a.D;});chJ=new Chart(document.getElementById('cJour'),{type:'bar',data:{labels:jj.map(function(e){return e.n.split(' ').pop();}),datasets:[{data:jj.map(function(e){return e.D;}),backgroundColor:jj.map(function(e){return scColor(e.sc)+'99';}),borderColor:jj.map(function(e){return scColor(e.sc);}),borderWidth:1,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#555c72',font:{size:11}},beginAtZero:true}}}});}

function refreshCharts(){if(!chB||!chT||!chJ)return;var s=[].concat(BD).sort(function(a,b){return b.sc-a.sc;});chB.data.labels=s.map(function(e){return e.n.split(' ')[0];});chB.data.datasets[0].data=s.map(function(e){return e.sc;});chB.data.datasets[0].backgroundColor=s.map(function(e){return scColor(e.sc)+'bb';});chB.data.datasets[0].borderColor=s.map(function(e){return scColor(e.sc);});chB.update();var jj=[].concat(BD).filter(function(e){return e.D>0;}).sort(function(a,b){return b.D-a.D;});chJ.data.labels=jj.map(function(e){return e.n.split(' ').pop();});chJ.data.datasets[0].data=jj.map(function(e){return e.D;});chJ.data.datasets[0].backgroundColor=jj.map(function(e){return scColor(e.sc)+'99';});chJ.data.datasets[0].borderColor=jj.map(function(e){return scColor(e.sc);});chJ.update();}

function buildBT(){
  var tbl=document.getElementById('btable');
  // Compte personnel (role "custom", onglet Bradford autorise) : on ne montre
  // JAMAIS le tableau complet de l'equipe (donnees de sante d'autrui), seulement
  // sa propre ligne, si on arrive a la retrouver via le nom enregistre sur le compte.
  if(currentUser && currentUser.role !== 'admin'){
    var estAccesPerso = currentUser.role === 'custom' && currentUser.tabs && currentUser.tabs.br;
    if(!estAccesPerso || !currentUser.nom){ if(tbl) tbl.innerHTML=''; return; }
    var moi=BD.find(function(e){return e.n===currentUser.nom;});
    if(!moi){ if(tbl) tbl.innerHTML='<tbody><tr><td style="padding:16px;color:var(--tx3)">'+t('br_perso_introuvable')+'</td></tr></tbody>'; return; }
    var mxP=Math.max.apply(null,BD.map(function(e){return e.sc;}));if(mxP<1)mxP=1;
    var empP=EMP.find(function(x){return x.n===moi.n;});
    var stP=scSt(moi.sc),colP=scColor(moi.sc),pctP=Math.round(moi.sc/mxP*100);
    var hP='<thead><tr><th>'+t('ab_col_emp')+'</th><th>'+t('br_col_role')+'</th><th>'+t('ab_col_days')+'</th><th>'+t('br_col_periods')+'</th><th>Score</th><th>'+t('br_col_status')+'</th></tr></thead><tbody>';
    hP+='<tr><td><b style="font-size:13px">'+moi.n+'</b></td>';
    hP+='<td style="color:var(--tx3);font-size:12px">'+(empP?empP.r:'')+'</td>';
    hP+='<td><span style="font-family:var(--mo)">'+moi.D+'</span></td>';
    hP+='<td><span style="font-family:var(--mo)">'+moi.S+'</span></td>';
    hP+='<td><div class="sbw"><div class="sbt"><div class="sbf" style="width:'+pctP+'%;background:'+colP+'"></div></div><span class="sv" style="color:'+colP+'">'+moi.sc+'</span></div></td>';
    hP+='<td><span class="pill '+stP.c+'">'+stP.l+'</span></td></tr>';
    if(tbl) tbl.innerHTML=hP+'</tbody>';
    return;
  }
  var mx=Math.max.apply(null,BD.map(function(e){return e.sc;}));if(mx<1)mx=1;
  var h='<thead><tr><th>'+t('ab_col_emp')+'</th><th>'+t('br_col_role')+'</th><th>'+t('ab_col_days')+'</th><th>'+t('br_col_periods')+'</th><th>Score</th><th>'+t('br_col_status')+'</th><th style="width:36px"></th></tr></thead><tbody>';
  ['TL','INPAK','Prod','Unit'].forEach(function(g){
    var em=BD.filter(function(e){var f=EMP.find(function(x){return x.n===e.n;});return f&&f.g===g;});
    if(!em.length)return;
    h+='<tr class="sr"><td colspan="7">'+g+'</td></tr>';
    em.forEach(function(e){
      var emp=EMP.find(function(x){return x.n===e.n;});
      var st=scSt(e.sc),col=scColor(e.sc),pct=Math.round(e.sc/mx*100);
      var cm=BD_COMMENTS[e.n];
      var cmIcon=cm&&cm.text?'<span style="color:#f59e0b;font-size:15px" title="'+cm.text.replace(/"/g,"&quot;")+'">&#9997;</span>':'<span style="color:var(--tx3);font-size:15px">&#9998;</span>';
      h+='<tr id="bdrow-'+e.n.replace(/\s+/g,'-')+'">';
      h+='<td><b style="font-size:13px;cursor:pointer;text-decoration:none" onclick="openBradfordPanel(\''+e.n.replace(/'/g,"\\'")+'\')" title="'+t('br_tooltip_history')+'">'+e.n+' <span style="font-size:10px;color:var(--blue);opacity:.6">&#9432;</span></b></td>';
      h+='<td style="color:var(--tx3);font-size:12px">'+(emp?emp.r:'')+'</td>';
      h+='<td><span style="font-family:var(--mo)">'+e.D+'</span></td>';
      h+='<td><span style="font-family:var(--mo)">'+e.S+'</span></td>';
      h+='<td><div class="sbw"><div class="sbt"><div class="sbf" style="width:'+pct+'%;background:'+col+'"></div></div><span class="sv" style="color:'+col+'">'+e.sc+'</span></div></td>';
      h+='<td><span class="pill '+st.c+'">'+st.l+'</span></td>';
      h+='<td style="text-align:center"><span style="cursor:pointer" onclick="openComment(\''+e.n.replace(/'/g,"\\'")+'\')" title="'+t('br_tooltip_comment')+'">'+cmIcon+'</span></td>';
      h+='</tr>';
    });
  });
  tbl.innerHTML=h+'</tbody>';
}

function openComment(name){
  var cm=BD_COMMENTS[name]||{text:'',date:'',author:''};
  var prev=cm.text||'';
  var d=document.createElement('div');
  d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center';
  d.id='cm-popup';d.innerHTML='<div style="background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:12px;padding:24px;width:420px;max-width:95vw">'
    +'<div style="font-weight:700;font-size:15px;margin-bottom:4px">'+t('br_comment_prefix')+name+'</div>'
    +(cm.date?'<div style="font-size:11px;color:var(--tx3);margin-bottom:12px">'+t('br_comment_last_mod')+cm.date+(cm.author?t('br_comment_by')+cm.author:'')+'</div>':'<div style="margin-bottom:12px"></div>')
    +'<textarea id="cm-txt" style="width:100%;height:110px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:8px;color:var(--tx1);font-family:var(--fn);font-size:13px;padding:10px;resize:vertical">'+prev+'</textarea>'
    +'<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end">'
    +'<button onclick="document.getElementById(\'cm-popup\').remove()" style="padding:8px 16px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);cursor:pointer">'+t('modal_cancel')+'</button>'
    +'<button onclick="saveComment(\''+name.replace(/'/g,"\\'")+'\')" style="padding:8px 16px;border-radius:var(--r);border:none;background:var(--blue);color:#fff;font-family:var(--fn);font-weight:600;cursor:pointer">'+t('btn_save')+'</button>'
    +'</div></div>';
  document.body.appendChild(d);
  d.addEventListener('click',function(e){if(e.target===d)d.remove();});
  document.getElementById('cm-txt').focus();
}

function saveComment(name){
  var txt=document.getElementById('cm-txt').value.trim();
  var now=new Date().toLocaleString('fr-BE');
  var author=currentUser?currentUser.name||currentUser.email||'':'';
  BD_COMMENTS[name]={text:txt,date:now,author:author};
  if(db) db.ref('bradford/comments/'+name.replace(/[.#$/\[\]]/g,'_')).set(BD_COMMENTS[name]);
  var cmPop=document.getElementById('cm-popup');if(cmPop)cmPop.remove();
  buildBT();
  toast(txt?t('br_comment_saved'):t('br_comment_deleted'),'#10b981');
}

function openBradfordPanel(name){
  var e=BD.find(function(x){return x.n===name;});
  if(!e) return;
  var col=scColor(e.sc);
  var st=scSt(e.sc);
  // Récupérer les épisodes de cette personne triés par date
  var eps=ABS.filter(function(a){return a.n===name&&a.t==='ziek';});
  eps.sort(function(a,b){
    function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
    return pFR(b.a)-pFR(a.a);
  });
  var cm=BD_COMMENTS[name];
  var d=document.createElement('div');
  d.style.cssText='position:fixed;top:0;right:0;bottom:0;width:380px;max-width:95vw;background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-left:1px solid var(--bd2);z-index:9998;display:flex;flex-direction:column;box-shadow:-8px 0 32px rgba(0,0,0,.4)';
  var epsHtml=eps.length?eps.map(function(a){
    var same=a.a===a.b;
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--bd2)">'
      +'<div><div style="font-size:13px;font-weight:600;color:var(--tx1)">'+(same?a.a:a.a+' → '+a.b)+'</div>'
      +'<div style="font-size:11px;color:var(--tx3)">'+a.d+(a.d>1?t('br_days_suffix_n'):t('br_days_suffix_1'))+'</div></div>'
      +'<span style="font-size:11px;padding:2px 8px;border-radius:99px;background:#ef444422;color:#ef4444;border:1px solid #ef444455">'+t('br_episode_badge')+'</span>'
      +'</div>';
  }).join(''):'<div style="color:var(--tx3);font-size:13px;padding:20px 0;text-align:center">'+t('br_no_episode')+'</div>';

  d.innerHTML='<div style="padding:20px;border-bottom:1px solid var(--bd2);display:flex;justify-content:space-between;align-items:center">'
    +'<div><div style="font-weight:700;font-size:16px">'+name+'</div><span class="pill '+st.c+'" style="margin-top:4px;display:inline-block">'+st.l+'</span></div>'
    +'<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="background:none;border:none;color:var(--tx3);font-size:22px;cursor:pointer;line-height:1">&times;</button>'
    +'</div>'
    +'<div style="padding:16px 20px;display:flex;gap:20px;border-bottom:1px solid var(--bd2)">'
    +'<div style="text-align:center"><div style="font-size:26px;font-weight:700;color:'+col+'">'+e.sc+'</div><div style="font-size:11px;color:var(--tx3)">'+t('br_stat_score')+'</div></div>'
    +'<div style="text-align:center"><div style="font-size:26px;font-weight:700;color:var(--tx1)">'+e.S+'</div><div style="font-size:11px;color:var(--tx3)">'+t('br_stat_episodes')+'</div></div>'
    +'<div style="text-align:center"><div style="font-size:26px;font-weight:700;color:var(--tx1)">'+e.D+'</div><div style="font-size:11px;color:var(--tx3)">'+t('br_stat_days')+'</div></div>'
    +'</div>'
    +'<div style="padding:16px 20px;border-bottom:1px solid var(--bd2)">'
    +'<div style="font-size:12px;font-weight:600;color:var(--tx3);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">'+t('br_comment_label')+'</div>'
    +'<div style="font-size:13px;color:var(--tx1);cursor:pointer;padding:8px;border-radius:8px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);min-height:36px" onclick="openComment(\''+name.replace(/'/g,"\\'")+'\')">'+( cm&&cm.text?cm.text:'<span style="color:var(--tx3)">'+t('br_comment_placeholder')+'</span>')+'</div>'
    +(cm&&cm.date?'<div style="font-size:10px;color:var(--tx3);margin-top:4px">'+cm.date+(cm.author?' · '+cm.author:'')+'</div>':'')
    +'</div>'
    +'<div style="padding:16px 20px;flex:1;overflow-y:auto">'
    +'<div style="font-size:12px;font-weight:600;color:var(--tx3);margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em">'+t('br_history_title')+'</div>'
    +epsHtml
    +'</div>';
  document.body.appendChild(d);
}

function exportBradfordCSV(){
  var rows=[['Nom','Role','Jours maladie','Episodes','Score Bradford','Statut']];
  BD.forEach(function(e){
    var emp=EMP.find(function(x){return x.n===e.n;});
    rows.push([e.n,emp?emp.r:'',e.D,e.S,e.sc,scSt(e.sc).l]);
  });
  var csv=rows.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(';');}).join('\r\n');
  var blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='bradford_'+new Date().toISOString().slice(0,10)+'.csv';
  a.click();
}

function goToBradford(name){
  var brTab = document.querySelector('.tab[data-tab="br"]');
  if(brTab) brTab.click();
  setTimeout(function(){
    var row = document.getElementById('bdrow-'+name.replace(/\s+/g,'-'));
    if(!row) return;
    row.scrollIntoView({behavior:'smooth', block:'center'});
    row.style.transition='background .3s';
    var orig = row.style.background;
    row.style.background='rgba(245,158,11,.25)';
    setTimeout(function(){row.style.background=orig;},1800);
  },100);
}

function getCommentHistory(name){
  var cm=BD_COMMENTS[name];
  if(!cm||!cm.history||!cm.history.length) return '';
  var html='<div style="margin-top:12px"><div style="font-size:11px;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Historique</div>';
  cm.history.slice(0,5).forEach(function(h){
    html+='<div style="font-size:12px;padding:6px 8px;border-radius:6px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);margin-bottom:4px">';
    html+='<div style="color:var(--tx2)">'+(h.text||'')+'</div>';
    html+='<div style="font-size:10px;color:var(--tx3);margin-top:2px">'+(h.date||'')+(h.author?' · '+h.author:'')+'</div></div>';
  });
  return html+'</div>';
}

function marquerDiscute(name){
  var now=new Date().toLocaleString('fr-BE');
  var author=currentUser?currentUser.email||'':'';
  if(!BD_COMMENTS[name]) BD_COMMENTS[name]={text:'',date:'',author:'',history:[]};
  if(!BD_COMMENTS[name].history) BD_COMMENTS[name].history=[];
  BD_COMMENTS[name].history.unshift({text:'[Entretien effectue]',date:now,author:author});
  if(!BD_COMMENTS[name].text){BD_COMMENTS[name].text='[Entretien effectue]';BD_COMMENTS[name].date=now;BD_COMMENTS[name].author=author;}
  if(db) db.ref('bradford/comments/'+name.replace(/[.#$\/\[\]]/g,'_')).set(BD_COMMENTS[name]);
  var panel=document.getElementById('bradford-panel');
  if(panel) panel.remove();
  openBradfordPanel(name);
  toast('Entretien marque pour '+name.split(' ')[0],'#10b981');
}

function exportBradfordExcel(){
  if(typeof JSZip==='undefined'){toast('JSZip non charge','#ef4444');return;}
  function scSty(sc){return sc===0?7:sc<=50?3:sc<=200?4:sc<=500?5:6;}
  function stLbl(sc){return sc===0?'Parfait':sc<=50?'OK':sc<=200?'A surveiller':sc<=500?'Preoccupant':'Critique';}
  var str=[],sm={};
  function si(s){s=String(s);if(sm[s]===undefined){sm[s]=str.length;str.push(s);}return sm[s];}
  function cell(r,col,v,s){var ref=String.fromCharCode(65+col)+r;if(typeof v==='number')return '<c r="'+ref+'" s="'+s+'"><v>'+v+'</v></c>';return '<c r="'+ref+'" t="s" s="'+s+'"><v>'+si(v)+'</v></c>';}
  var styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="3"><font><sz val="11"/><name val="Calibri"/></font><font><sz val="11"/><name val="Calibri"/><b/><color rgb="FFFFFFFF"/></font><font><sz val="11"/><name val="Calibri"/><b/><color rgb="FF1E3A5F"/></font></fonts><fills count="10"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1E3A5F"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1E40AF"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD1FAE5"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFEF3C7"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFED7AA"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFEE2E2"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD1FAE5"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/></border><border><left style="thin"><color rgb="FFE2E8F0"/></left><right style="thin"><color rgb="FFE2E8F0"/></right><top style="thin"><color rgb="FFE2E8F0"/></top><bottom style="thin"><color rgb="FFE2E8F0"/></bottom></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="11"><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="5" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="6" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="8" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="9" borderId="1" xfId="0" applyFill="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf></cellXfs></styleSheet>';
  var rows=[],r=1;
  rows.push('<row r="'+r+'" ht="20">'+cell(r,0,'Bradford Dashboard - AW3 Ploeg 5',1)+'</row>');r++;
  rows.push('<row r="'+r+'">'+cell(r,0,new Date().toLocaleDateString('fr-BE'),0)+'</row>');r++;
  rows.push('<row r="'+r+'"></row>');r++;
  rows.push('<row r="'+r+'" ht="18">'+cell(r,0,'Employe',1)+cell(r,1,'Groupe',1)+cell(r,2,'Role',1)+cell(r,3,'Jours',1)+cell(r,4,'Episodes',1)+cell(r,5,'Score',1)+cell(r,6,'Statut',1)+cell(r,7,'Tendance',1)+'</row>');r++;
  ['TL','INPAK','Prod','Unit'].forEach(function(g){
    var em=BD.filter(function(e){var f=EMP.find(function(x){return x.n===e.n;});return f&&f.g===g;});
    if(!em.length)return;
    rows.push('<row r="'+r+'">'+cell(r,0,g,2)+cell(r,1,'',2)+cell(r,2,'',2)+cell(r,3,'',2)+cell(r,4,'',2)+cell(r,5,'',2)+cell(r,6,'',2)+cell(r,7,'',2)+'</row>');r++;
    em.forEach(function(e,idx){
      var emp=EMP.find(function(x){return x.n===e.n;});var ss=scSty(e.sc);
      var tr=calcTrend(e.n),tl=tr==='down'?'En amelioration':tr==='up'?'En hausse':'Stable';
      rows.push('<row r="'+r+'">'+cell(r,0,e.n+(e.sc===0?' *':''),idx%2?9:0)+cell(r,1,g,10)+cell(r,2,emp?emp.r:'',idx%2?9:0)+cell(r,3,e.D,10)+cell(r,4,e.S,10)+cell(r,5,e.sc,ss)+cell(r,6,stLbl(e.sc),ss)+cell(r,7,tl,10)+'</row>');r++;
    });
  });
  var sheet='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetFormatPr defaultRowHeight="15"/><cols><col min="1" max="1" width="28" customWidth="1"/><col min="2" max="2" width="10" customWidth="1"/><col min="3" max="3" width="18" customWidth="1"/><col min="4" max="8" width="12" customWidth="1"/></cols><sheetData>'+rows.join('')+'</sheetData></worksheet>';
  var sst='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="'+str.length+'" uniqueCount="'+str.length+'">'+str.map(function(s){return '<si><t xml:space="preserve">'+s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</t></si>';}).join('')+'</sst>';
  var wb='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Bradford" sheetId="1" r:id="rId1"/></sheets></workbook>';
  var wbR='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
  var pR='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  var ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>';
  var zip=new JSZip();zip.file('[Content_Types].xml',ct);zip.file('_rels/.rels',pR);zip.file('xl/workbook.xml',wb);zip.file('xl/_rels/workbook.xml.rels',wbR);zip.file('xl/styles.xml',styles);zip.file('xl/sharedStrings.xml',sst);zip.file('xl/worksheets/sheet1.xml',sheet);
  zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}).then(function(blob){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Bradford_'+new Date().toISOString().slice(0,10)+'.xlsx';a.click();toast('Export Excel genere','#10b981');});
}

function trendHtml(trend){
  if(trend==='down') return '<span style="color:#10b981;font-size:12px;font-weight:700">&#8595; Mieux</span>';
  if(trend==='up') return '<span style="color:#ef4444;font-size:12px;font-weight:700">&#8593; Hausse</span>';
  return '<span style="color:var(--tx3);font-size:12px">&#8212; Stable</span>';
}

