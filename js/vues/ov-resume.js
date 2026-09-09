/* ====================================================================
 * vues/ov-resume.js -- Cockpit "Vue d'ensemble" (refonte "briefing rapide"
 * du 09/09/2026, sur demande utilisateur).
 * Agregateur visuel uniquement : ne recalcule et n'invente AUCUNE regle
 * metier, ne relit que des globales et fonctions deja calculees ailleurs :
 *  - EMP/ABS/SHIFTS25-27/WEEKS25-27 (deja charges par app.js)
 *  - BD + scSt()/scColor() (metier/bradford.js -- score et seuils Bradford
 *    inchanges, meme fonction que l'onglet Bradford)
 *  - NCP_DATA + ncpEquipesMulti()/ncpGetEquipe() (metier/ncp.js -- meme
 *    deduction unite/equipe que l'onglet NCP Qualite)
 *  - ARRETS_DATA + equipeReelle() (metier/arrets.js + core/format.js --
 *    meme filtre equipe que l'onglet Arrets Inpak)
 *  - BULK_DATA + bulkCalc()/bulkBornesDonnees() (metier/bulk.js -- meme
 *    regle de journee de production 05h->05h, meme filtre equipe)
 *  - FORMATIONS + getBirthdays() (deja charges/exposes ailleurs)
 * Six sections fixes, demandees explicitement : A surveiller, Derniers NCP
 * AW3 P5, Bradford a surveiller, Absences week-end a venir, Derniere
 * activite Production P5, A venir. Aucune section/KPI supplementaire.
 * Toutes les lectures DOM sont protegees (aucune erreur si un element
 * n'existe pas encore ou si une donnee source n'est pas encore chargee).
 * ==================================================================== */

// ----------------------------------------------------------------------
// Aides partagees par plusieurs sections de ce fichier (prochain week-end
// travaille + absences sur ce week-end). Reutilise EXACTEMENT le meme
// algorithme de recherche "prochain jour dans WEEKS25/26/27" deja etabli
// dans vues/absences.js (buildTodayAbs) et vues/planning.js (goToday,
// buildMiniCal) -- aucune nouvelle regle de "jour travaille".
// ----------------------------------------------------------------------

function ovNextWeekend(){
  function ddmm(d){function z(n){return n<10?'0'+n:''+n;}return z(d.getDate())+'/'+z(d.getMonth()+1);}
  function weeksOf(y){return y==='2027'?(typeof WEEKS27!=='undefined'?WEEKS27:null):y==='2026'?(typeof WEEKS26!=='undefined'?WEEKS26:null):y==='2025'?(typeof WEEKS25!=='undefined'?WEEKS25:null):null;}
  var now=new Date();
  var sat=null;
  for(var i=0;i<=60;i++){
    var cand=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i);
    var cw=weeksOf(String(cand.getFullYear()));
    if(!cw) continue;
    var cAll=cw.reduce(function(a,w){return a.concat(w.d);},[]);
    if(cAll.indexOf(ddmm(cand))!==-1){ sat=cand; break; }
  }
  if(!sat) return null;
  var days=[sat];
  var next=new Date(sat.getFullYear(),sat.getMonth(),sat.getDate()+1);
  var nw=weeksOf(String(next.getFullYear()));
  if(nw){
    var nAll=nw.reduce(function(a,w){return a.concat(w.d);},[]);
    if(nAll.indexOf(ddmm(next))!==-1) days.push(next);
  }
  return days;
}

function ovWeekendAbsences(weekend){
  function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
  function ddmm(d){function z(n){return n<10?'0'+n:''+n;}return z(d.getDate())+'/'+z(d.getMonth()+1);}
  var DOW=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  var byPerson={};
  (weekend||[]).forEach(function(day){
    var yr=String(day.getFullYear());
    var weeks=yr==='2027'?(typeof WEEKS27!=='undefined'?WEEKS27:null):yr==='2026'?(typeof WEEKS26!=='undefined'?WEEKS26:null):(typeof WEEKS25!=='undefined'?WEEKS25:null);
    var shifts=yr==='2027'?(typeof SHIFTS27!=='undefined'?SHIFTS27:null):yr==='2026'?(typeof SHIFTS26!=='undefined'?SHIFTS26:null):(typeof SHIFTS25!=='undefined'?SHIFTS25:null);
    var dayAbs=[];
    if(typeof ABS!=='undefined') ABS.forEach(function(a){
      var deb=pFR(a.a),fin=pFR(a.b),td=new Date(day.getFullYear(),day.getMonth(),day.getDate());
      if(deb<=td&&fin>=td) dayAbs.push({n:a.n,t:a.t});
    });
    if(weeks&&shifts){
      var allD=weeks.reduce(function(a,w){return a.concat(w.d);},[]);
      var ti=allD.indexOf(ddmm(day));
      if(ti!==-1) shifts.forEach(function(emp){
        var sv=emp.s[ti]||'';
        if((sv==='verlof'||sv==='recup')&&!dayAbs.find(function(a){return a.n===emp.n;}))
          dayAbs.push({n:emp.n,t:sv});
      });
    }
    dayAbs.forEach(function(a){
      if(!byPerson[a.n]) byPerson[a.n]=[];
      byPerson[a.n].push({jour:DOW[day.getDay()],t:a.t});
    });
  });
  return byPerson;
}

function ovVideMsg(txt){
  return '<div style="color:var(--tx3);font-size:13px;padding:12px 0;text-align:center">'+txt+'</div>';
}

// ----------------------------------------------------------------------
// Section 1 -- A surveiller (max 5, agregation des sections 2/3/4/6)
// ----------------------------------------------------------------------

function ovGoToNCP(notif){
  var ncpTab=document.querySelector('.tab[data-tab="ncp"]');
  if(ncpTab) ncpTab.click();
  setTimeout(function(){ if(typeof ncpDetail==='function') ncpDetail(notif); },150);
}

function ovBuildWatchlist(){
  var el=document.getElementById('ov-watch');
  if(!el) return;
  var items=[];

  // Bradford critique puis preoccupant -- memes seuils/fonction que l'onglet Bradford (scSt/BD), aucun nouveau seuil.
  if(typeof BD!=='undefined'){
    var crit = BD.filter(function(e){return e.sc>500;}).sort(function(a,b){return b.sc-a.sc;});
    var prevo = BD.filter(function(e){return e.sc>200&&e.sc<=500;}).sort(function(a,b){return b.sc-a.sc;});
    crit.forEach(function(e){ items.push({icon:'\uD83D\uDD34', txt:'Bradford critique \u2014 '+e.n+' (score '+e.sc+')', nom:e.n}); });
    prevo.forEach(function(e){ items.push({icon:'\uD83D\uDFE0', txt:'Bradford pr\u00e9occupant \u2014 '+e.n+' (score '+e.sc+')', nom:e.n}); });
  }

  // NCP AW3 P5 recent -- fenetre d'affichage de 3 jours (choix d'affichage, ne modifie aucune donnee ni seuil metier).
  if(typeof NCP_DATA!=='undefined' && typeof ncpEquipesMulti==='function'){
    var ncpP5 = NCP_DATA.filter(function(r){
      if(r.unite!=='AW3') return false;
      return ncpEquipesMulti(r).equipes.some(function(x){return x.equipe==='P5';});
    }).sort(function(a,b){ var da=a.created_date_iso||'',db=b.created_date_iso||''; return da<db?1:(da>db?-1:0); });
    var lastNcp = ncpP5[0];
    if(lastNcp && lastNcp.created_date_iso){
      var joursDepuis = Math.floor((new Date()-new Date(lastNcp.created_date_iso+'T00:00:00'))/86400000);
      if(joursDepuis<=3) items.push({icon:'\uD83D\uDCCB', txt:'NCP AW3 P5 r\u00e9cent \u2014 '+(lastNcp.code_produit||lastNcp.notification)+' ('+(lastNcp.created_on||'')+')', notif:lastNcp.notification});
    }
  }

  // Absence importante pour le week-end a venir -- seuil d'affichage (3 personnes ou plus), n'affecte aucun calcul.
  var weekend = ovNextWeekend();
  if(weekend && weekend.length){
    var byPerson = ovWeekendAbsences(weekend);
    var nAbs = Object.keys(byPerson).length;
    if(nAbs>=3) items.push({icon:'\uD83D\uDC65', txt:nAbs+' absents ce week-end \u2014 voir Absences ci-dessous', scrollTo:'ov-weekend-abs'});
  }

  // Formation dans les 7 prochains jours -- fenetre d'affichage, aucun nouveau champ.
  if(typeof FORMATIONS!=='undefined'){
    var now=new Date(); var today0=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    var soon = FORMATIONS.filter(function(f){
      var d=new Date(f.date+'T00:00:00');
      var days=(d-today0)/86400000;
      return days>=0 && days<=7;
    }).sort(function(a,b){return a.date<b.date?-1:1;})[0];
    if(soon) items.push({icon:'\uD83C\uDF93', txt:'Formation proche \u2014 '+(soon.titre||'Formation')+' ('+(typeof fmtDateFormation==='function'?fmtDateFormation(soon.date):soon.date)+')', tab:'formations'});
  }

  items = items.slice(0,5);
  if(!items.length){ el.innerHTML=ovVideMsg('\u2713 Rien \u00e0 signaler'); return; }
  window._ovWatchActions = items.map(function(it){
    return function(){
      if(it.nom && typeof goToBradford==='function') goToBradford(it.nom);
      else if(it.notif) ovGoToNCP(it.notif);
      else if(it.scrollTo){ var t=document.getElementById(it.scrollTo); if(t) t.scrollIntoView({behavior:'smooth'}); }
      else if(it.tab){ var tb=document.querySelector('.tab[data-tab="'+it.tab+'"]'); if(tb) tb.click(); }
    };
  });
  el.innerHTML = items.map(function(it,i){
    return '<div onclick="window._ovWatchActions['+i+']()" style="cursor:pointer;display:flex;align-items:center;gap:10px;padding:8px 4px;border-bottom:1px solid var(--bd2)">'
      +'<span style="font-size:16px">'+it.icon+'</span>'
      +'<span style="font-size:13px;color:var(--tx1)">'+it.txt+'</span>'
      +'</div>';
  }).join('');
}

// ----------------------------------------------------------------------
// Section 2 -- Derniers NCP AW3 P5 (3 max)
// ----------------------------------------------------------------------

function ovBuildNCP(){
  var el=document.getElementById('ov-ncp');
  if(!el) return;
  if(typeof NCP_DATA==='undefined' || typeof ncpEquipesMulti!=='function'){ el.innerHTML=ovVideMsg('Donn\u00e9es NCP indisponibles'); return; }
  var esc=(typeof ncpEsc==='function')?ncpEsc:function(s){return String(s==null?'':s);};
  var list = NCP_DATA.filter(function(r){
    if(r.unite!=='AW3') return false;
    return ncpEquipesMulti(r).equipes.some(function(x){return x.equipe==='P5';});
  }).sort(function(a,b){
    var da=a.created_date_iso||'', db=b.created_date_iso||'';
    return da<db?1:(da>db?-1:0);
  }).slice(0,3);
  if(!list.length){ el.innerHTML=ovVideMsg('Aucun NCP AW3 P5 identifi\u00e9'); return; }
  el.innerHTML = list.map(function(r){
    var defaut = String(r.problems||'').split('|')[0].trim() || (r.description? String(r.description).slice(0,70):'-');
    var tonnage = (Number(r.total_tonnes)||0).toFixed(2)+' t';
    var typeLbl = r.type_ncp || '-';
    var tc = r.type_ncp==='Inpak' ? '#3b82f6' : '#f97316';
    return '<div onclick="ovGoToNCP(\''+String(r.notification).replace(/'/g,"\\'")+'\')" style="cursor:pointer;padding:10px 0;border-bottom:1px solid var(--bd2)">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'
      +'<span style="font-size:12px;color:var(--tx3);font-family:var(--mo)">'+esc(r.created_on||'-')+' \u00b7 '+esc(r.ligne||'-')+'</span>'
      +'<span style="font-size:11px;padding:2px 8px;border-radius:99px;background:'+tc+'22;color:'+tc+';border:1px solid '+tc+'44">'+esc(typeLbl)+'</span>'
      +'</div>'
      +'<div style="font-size:13px;font-weight:600;color:var(--tx1)">'+esc(r.code_produit||'-')+'</div>'
      +'<div style="font-size:12px;color:var(--tx2);margin-top:2px">'+esc(defaut)+'</div>'
      +'<div style="font-size:11px;color:var(--tx3);margin-top:2px">'+tonnage+'</div>'
      +'</div>';
  }).join('');
}

// ----------------------------------------------------------------------
// Section 3 -- Bradford a surveiller (critique/preoccupant/a surveiller,
// jamais OK -- meme fonction scSt()/scColor() que l'onglet Bradford).
// ----------------------------------------------------------------------

function ovBuildBradfordWatch(){
  var el=document.getElementById('ov-bradford-watch');
  if(!el) return;
  if(typeof BD==='undefined' || typeof scSt!=='function' || typeof scColor!=='function'){ return; }
  var watch = BD.filter(function(e){ return e.sc>50; })
    .map(function(e){ return {e:e, st:scSt(e.sc)}; })
    .sort(function(a,b){ return b.e.sc-a.e.sc; });
  if(!watch.length){ el.innerHTML=ovVideMsg('\u2713 Aucun Bradford \u00e0 surveiller'); return; }
  var icon = {cr:'\uD83D\uDD34', al:'\uD83D\uDFE0', wn:'\uD83D\uDFE1'};
  el.innerHTML = watch.map(function(x){
    var col = scColor(x.e.sc);
    return '<div onclick="goToBradford(\''+x.e.n.replace(/'/g,"\\'")+'\')" style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:8px 10px;margin-bottom:6px;border-radius:8px;background:'+col+'12;border:1px solid '+col+'33">'
      +'<span style="font-size:13px;font-weight:600;color:var(--tx1)">'+(icon[x.st.c]||'')+' '+x.e.n+'</span>'
      +'<span style="font-size:12px;font-weight:600;color:'+col+'">'+x.st.l+' \u00b7 '+x.e.sc+'</span>'
      +'</div>';
  }).join('');
}

// ----------------------------------------------------------------------
// Section 4 -- Absences week-end a venir (liste complete, sans limite)
// ----------------------------------------------------------------------

function ovBuildWeekendAbs(){
  var titleEl=document.getElementById('ov-weekend-title');
  var el=document.getElementById('ov-weekend-abs');
  if(!el) return;
  if(typeof ABS==='undefined'){ return; }
  var weekend=ovNextWeekend();
  if(!weekend||!weekend.length){ el.innerHTML=ovVideMsg('Aucun prochain week-end de travail trouv\u00e9'); return; }
  var MOIS=(typeof MOIS_I18N!=='undefined'&&typeof LANG!=='undefined'&&(MOIS_I18N[LANG]||MOIS_I18N.fr))||['janv','f\u00e9vr','mars','avr','mai','juin','juil','ao\u00fbt','sept','oct','nov','d\u00e9c'];
  var d0=weekend[0], d1=weekend[weekend.length-1];
  var titreDates = d0.getDate()+(weekend.length>1?('\u2013'+d1.getDate()):'')+' '+MOIS[d0.getMonth()];
  if(titleEl) titleEl.textContent = 'Absences \u2014 week-end du '+titreDates;
  var byPerson = ovWeekendAbsences(weekend);
  var names = Object.keys(byPerson);
  if(!names.length){ el.innerHTML=ovVideMsg('\u2713 \u00c9quipe compl\u00e8te'); return; }
  el.innerHTML = names.sort().map(function(n){
    var entries=byPerson[n];
    var jours=entries.map(function(e){return e.jour;});
    var t0=entries[0].t;
    var tc = t0==='ziek'?'#ef4444':t0==='verlof'?'#3b82f6':'#10b981';
    var tl = t0==='ziek'?'Maladie':t0==='verlof'?'Cong\u00e9':'R\u00e9cup';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd2)">'
      +'<div style="font-size:13px;font-weight:600;color:var(--tx1)">'+n+'</div>'
      +'<div style="display:flex;align-items:center;gap:8px">'
      +'<span style="font-size:12px;color:var(--tx3)">'+jours.join(' + ')+'</span>'
      +'<span style="font-size:11px;padding:2px 9px;border-radius:99px;background:'+tc+'22;color:'+tc+';border:1px solid '+tc+'44">'+tl+'</span>'
      +'</div></div>';
  }).join('');
}

// ----------------------------------------------------------------------
// Section 5 -- Derniere activite Production P5 (Arrets Inpak + Bulk & Bijlijn)
// ----------------------------------------------------------------------

function ovBuildArretsP5(){
  var el=document.getElementById('ov-arrets-p5');
  if(!el) return;
  if(typeof ARRETS_DATA==='undefined' || typeof equipeReelle!=='function'){ el.innerHTML=ovVideMsg('Donn\u00e9es indisponibles'); return; }
  var all = Object.keys(ARRETS_DATA).map(function(k){return ARRETS_DATA[k];}).filter(function(a){
    return a && a.type==='avec_raison' && a.raison && equipeReelle(a.date,a.heure)==='P5';
  });
  if(!all.length){ el.innerHTML=ovVideMsg('Aucune donn\u00e9e P5 disponible'); return; }
  var lastDate=null;
  all.forEach(function(a){ if(!lastDate||a.date>lastDate) lastDate=a.date; });
  var jour = all.filter(function(a){ return a.date===lastDate; });
  var totalMin = jour.reduce(function(s,a){ return s+(a.duree||0); },0);
  var parLigne={}; jour.forEach(function(a){ parLigne[a.ligne]=(parLigne[a.ligne]||0)+(a.duree||0); });
  var pireLigne=null; Object.keys(parLigne).forEach(function(l){ if(!pireLigne||parLigne[l]>parLigne[pireLigne]) pireLigne=l; });
  var parRaison={}; jour.forEach(function(a){ parRaison[a.raison]=(parRaison[a.raison]||0)+(a.duree||0); });
  var pireRaison=null; Object.keys(parRaison).forEach(function(r){ if(!pireRaison||parRaison[r]>parRaison[pireRaison]) pireRaison=r; });
  var raisonLbl = pireRaison ? (typeof arretRaisonTexte==='function' ? arretRaisonTexte(pireRaison) : pireRaison) : '-';
  var h=Math.floor(totalMin/60), m=totalMin%60;
  el.innerHTML = '<div style="font-size:11px;color:var(--tx3);margin-bottom:8px">'+(typeof dFR==='function'?dFR(lastDate):lastDate)+'</div>'
    +'<div class="klbl">Total</div><div class="kval" style="font-size:20px">'+h+'h'+String(m).padStart(2,'0')+'</div>'
    +'<div class="klbl" style="margin-top:10px">Ligne la plus impact\u00e9e</div><div style="font-size:14px;font-weight:600">'+(pireLigne||'-')+(pireLigne?(' \u2014 '+parLigne[pireLigne]+' min'):'')+'</div>'
    +'<div class="klbl" style="margin-top:10px">Principale cause</div><div style="font-size:14px;font-weight:600">'+raisonLbl+(pireRaison?(' \u2014 '+parRaison[pireRaison]+' min'):'')+'</div>';
  el.onclick=function(){ var tab=document.querySelector('.tab[data-tab="arrets"]'); if(tab) tab.click(); };
  el.style.cursor='pointer';
}

function ovBuildBulkP5(){
  var el=document.getElementById('ov-bulk-p5');
  if(!el) return;
  if(typeof bulkBornesDonnees!=='function' || typeof bulkCalc!=='function' || typeof bulkTon!=='function' || typeof bulkFmt!=='function' || typeof bulkDateISO!=='function'){ el.innerHTML=ovVideMsg('Donn\u00e9es indisponibles'); return; }
  var bornes = bulkBornesDonnees();
  if(!bornes || !bornes.max){ el.innerHTML=ovVideMsg('Aucune donn\u00e9e P5 disponible'); return; }
  // Le tout dernier jour present dans BULK_DATA (bornes.max) peut n'avoir que des
  // releves a 0 (ex. jour tout juste commence, avant les premieres mesures reelles) --
  // on cherche donc, en remontant depuis ce jour, le dernier jour ou l'equipe P5 a
  // une activite reellement mesuree (bulkCalc/bulkJourProd reutilises tels quels,
  // seul le choix du jour affiche est adapte pour ne pas montrer un jour vide).
  var res=null, jourRetenu=null;
  var d = new Date(bornes.max+'T12:00:00');
  for(var i=0;i<30;i++){
    var iso = bulkDateISO(d);
    if(iso < bornes.min) break;
    var r = bulkCalc(iso, iso, ['P5']);
    if((r.totaux.standaard+r.totaux.noodafvoer+r.totaux.bijlijn1)>0){ res=r; jourRetenu=iso; break; }
    d.setDate(d.getDate()-1);
  }
  if(!res){ el.innerHTML=ovVideMsg('Aucune activit\u00e9 P5 mesur\u00e9e sur les 30 derniers jours'); return; }
  var totalT = bulkTon(res.totaux.standaard)+bulkTon(res.totaux.noodafvoer)+bulkTon(res.totaux.bijlijn1);
  var kgh = (typeof bulkKgH==='function' && res.heuresPoste>0) ? bulkKgH(totalT, res.heuresPoste) : null;
  el.innerHTML = '<div style="font-size:11px;color:var(--tx3);margin-bottom:8px">'+(typeof dFR==='function'?dFR(jourRetenu):jourRetenu)+'</div>'
    +'<div class="klbl">Surproduction</div><div class="kval" style="font-size:20px">'+bulkFmt(bulkTon(res.totaux.standaard),1)+' t</div>'
    +'<div class="klbl" style="margin-top:10px">Noodafvoer</div><div style="font-size:14px;font-weight:600">'+bulkFmt(bulkTon(res.totaux.noodafvoer),1)+' t</div>'
    +'<div class="klbl" style="margin-top:10px">Bijlijn</div><div style="font-size:14px;font-weight:600">'+bulkFmt(bulkTon(res.totaux.bijlijn1),1)+' t</div>'
    +'<div class="klbl" style="margin-top:10px">kg/h</div><div style="font-size:14px;font-weight:600">'+(kgh!=null?bulkFmt(kgh,0):'-')+'</div>';
  el.onclick=function(){ var tab=document.querySelector('.tab[data-tab="bulk"]'); if(tab) tab.click(); };
  el.style.cursor='pointer';
}

// ----------------------------------------------------------------------
// Section 6 -- A venir (formations + prochain anniversaire uniquement,
// pas de 2e liste d'absences -- deja couvertes en section 4).
// ----------------------------------------------------------------------

function ovBuildAVenir(){
  var elF=document.getElementById('ov-formations-next');
  var elB=document.getElementById('ov-next-birthday');
  if(elF){
    if(typeof FORMATIONS==='undefined'){ elF.innerHTML=''; }
    else {
      var now=new Date(); var today0=new Date(now.getFullYear(),now.getMonth(),now.getDate());
      var avenir = FORMATIONS.filter(function(f){ return new Date(f.date+'T00:00:00')>=today0; })
        .sort(function(a,b){ return (a.date+(a.heureDebut||'')).localeCompare(b.date+(b.heureDebut||'')); })
        .slice(0,3);
      elF.innerHTML = '<div class="klbl" style="margin-bottom:8px">\uD83C\uDF93 Formations \u00e0 venir</div>'
        + (avenir.length ? avenir.map(function(f){
            return '<div style="padding:6px 0;border-bottom:1px solid var(--bd2)"><div style="font-size:13px;font-weight:600">'+(f.titre||'Formation')+'</div><div style="font-size:11px;color:var(--tx3)">'+(typeof formationEmployesLabel==='function'?formationEmployesLabel(f):'')+' \u00b7 '+(typeof fmtDateFormation==='function'?fmtDateFormation(f.date):f.date)+'</div></div>';
          }).join('') : ovVideMsg('Aucune formation \u00e0 venir'));
      elF.onclick=function(){ var tab=document.querySelector('.tab[data-tab="formations"]'); if(tab) tab.click(); };
      elF.style.cursor='pointer';
    }
  }
  if(elB){
    if(typeof getBirthdays!=='function'){ elB.innerHTML=''; }
    else {
      var now2=new Date(); var today02=new Date(now2.getFullYear(),now2.getMonth(),now2.getDate());
      var bdAll=getBirthdays();
      var upcoming = bdAll.map(function(b){
        var thisYear=new Date(now2.getFullYear(),b.month-1,b.day);
        var nextYear=new Date(now2.getFullYear()+1,b.month-1,b.day);
        var next = thisYear>=today02 ? thisYear : nextYear;
        var daysUntil=Math.floor((next-today02)/86400000);
        return {n:b.n, daysUntil:daysUntil};
      }).sort(function(a,b){return a.daysUntil-b.daysUntil;});
      var next=upcoming[0];
      elB.innerHTML = '<div class="klbl" style="margin-bottom:8px">Prochain anniversaire</div>'
        + (next ? ('<div style="font-size:13px">\uD83C\uDF82 <b>'+next.n.split(' ')[0]+'</b> \u2014 '+(next.daysUntil===0?'aujourd\u2019hui !':('dans '+next.daysUntil+' jours'))+'</div>') : ovVideMsg('Aucune date enregistr\u00e9e'));
    }
  }
}

// ----------------------------------------------------------------------
// Point d'entree -- appele depuis vues/absences.js (buildTodayAbs),
// metier/arrets.js (loadArretsInpak), metier/bulk.js (loadBulkData),
// vues/bradford.js (updKPI) et vues/ncp.js (buildNCPTab) a chaque
// rafraichissement de leurs donnees respectives.
// ----------------------------------------------------------------------

function buildOvResume(){
  var greetEl = document.getElementById('ov-greet');
  if(greetEl){
    var emp = (typeof monEspaceTrouverEmpActuel === 'function') ? monEspaceTrouverEmpActuel() : null;
    var prenom = (emp && emp.n) ? emp.n.split(' ')[0] : ((typeof currentUser !== 'undefined' && currentUser && currentUser.nom) ? currentUser.nom.split(' ')[0] : '');
    greetEl.textContent = prenom ? ('Bonjour ' + prenom + ' \u2014 briefing rapide AW3 P5') : 'Briefing rapide AW3 P5';
  }
  ovBuildWatchlist();
  ovBuildNCP();
  ovBuildBradfordWatch();
  ovBuildWeekendAbs();
  ovBuildArretsP5();
  ovBuildBulkP5();
  ovBuildAVenir();
}
