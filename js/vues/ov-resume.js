/* ====================================================================
 * vues/ov-resume.js -- Cockpit "Vue d'ensemble" (refonte "briefing rapide"
 * du 09/09/2026, restructuree le 22/09/2026 -- etape 2 de la refonte
 * UI/UX validee avec Aurelien : voir Obsidian "Refonte UI-UX.md").
 * Agregateur visuel uniquement : ne recalcule et n'invente AUCUNE regle
 * metier, ne relit que des globales et fonctions deja calculees ailleurs :
 *  - EMP/ABS/SHIFTS25-27/WEEKS25-27 (deja charges par app.js)
 *  - BD + scSt()/scColor() (metier/bradford.js -- score et seuils Bradford
 *    inchanges, meme fonction que l'onglet Bradford)
 *  - NCP_DATA + ncpEquipesMulti() (metier/ncp.js -- meme deduction
 *    unite/equipe que l'onglet NCP Qualite, uniquement pour l'item "NCP
 *    recent" de la liste A traiter)
 *  - ARRETS_DATA + equipeReelle()/arretCat()/arretRaisonTexte() (metier/
 *    arrets.js -- meme filtre equipe et memes categories que l'onglet
 *    Arrets Inpak)
 *  - FORMATIONS + getBirthdays() (deja charges/exposes ailleurs)
 * Quatre sections fixes : (1) A traiter -- liste unique triee par gravite,
 * (2) Absences week-end a venir -- repliable, (3) Production -- anomalie
 * du jour uniquement si un seuil est depasse (voir OV_SEUIL_ANOMALIE_MIN
 * plus bas, tranche le 22/09/2026), (4) Rappels discrets (formation +
 * anniversaire, une ligne). Les details Bradford/NCP/Bulk & Bijlijn
 * retires de l'accueil restent consultables dans leurs onglets respectifs
 * (rien n'est supprime, seulement retire de cette page).
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
      byPerson[a.n].push({jour:DOW[day.getDay()],date:ddmm(day),t:a.t});
    });
  });
  return byPerson;
}

function ovVideMsg(txt){
  return '<div style="color:var(--tx3);font-size:13px;padding:12px 0;text-align:center">'+txt+'</div>';
}

// ----------------------------------------------------------------------
// Section 1 -- A traiter (max 5, agrege Bradford critique/preoccupant,
// NCP AW3 P5 recent, absences week-end importantes, formation proche)
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
// Section 2 -- Absences week-end a venir (liste complete, sans limite)
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
    // Jour + date a cote du nom (ex. "Sam. 26/09 + Dim. 27/09").
    var jours=entries.map(function(e){return e.jour.slice(0,3)+'. '+(e.date||'');});
    var t0=entries[0].t;
    var tc = t0==='ziek'?'#ef4444':t0==='verlof'?'#3b82f6':'#10b981';
    var tl = t0==='ziek'?'Maladie':t0==='verlof'?'Cong\u00e9':'R\u00e9cup';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd2)">'
      +'<div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">'
      +'<span style="font-size:13px;font-weight:600;color:var(--tx1)">'+n+'</span>'
      +'<span style="font-size:12px;color:var(--tx2);font-variant-numeric:tabular-nums">'+jours.join(' + ')+'</span>'
      +'</div>'
      +'<div style="display:flex;align-items:center;gap:8px">'
      +'<span style="font-size:11px;padding:2px 9px;border-radius:99px;background:'+tc+'22;color:'+tc+';border:1px solid '+tc+'44">'+tl+'</span>'
      +'</div></div>';
  }).join('');
}

// ----------------------------------------------------------------------
// Section 3 -- Production : anomalie du jour uniquement (P5, Arrets Inpak).
// Seuil TRANCHE le 22/09/2026 avec Aurelien : 120 min cumulees pour la
// MEME cause, sur une seule journee de production (le champ a.date des
// arrets Inpak represente deja la journee de production telle qu'exportee
// depuis Grafana -- aucune conversion supplementaire), categories "00"
// (Reinigen/Nettoyage) et "01" (Wissel/Changement = Ombouw) exclues du
// calcul (voir ARRETS_REF_CAT dans metier/arrets.js). Section masquee tant
// qu'aucune cause ne depasse ce seuil sur la derniere journee disponible --
// pas de "rien a signaler" ici, juste rien affiche (cf. proposition du
// 22/09/2026 : "retirer ces blocs de l'accueil plutot que de les afficher
// sans regle claire" -- desormais la regle existe, donc affichage
// uniquement quand elle se declenche).
// ----------------------------------------------------------------------

var OV_SEUIL_ANOMALIE_MIN = 120;
var OV_CAT_EXCLUES = ['00','01'];

function ovBuildProdAnomaly(){
  var wrap=document.getElementById('ov-prod-wrap');
  var el=document.getElementById('ov-prod-anomaly');
  if(!wrap||!el) return;
  if(typeof ARRETS_DATA==='undefined' || typeof equipeReelle!=='function' || typeof arretCat!=='function'){ wrap.style.display='none'; return; }
  var all = Object.keys(ARRETS_DATA).map(function(k){return ARRETS_DATA[k];}).filter(function(a){
    return a && a.type==='avec_raison' && a.raison && equipeReelle(a.date,a.heure)==='P5';
  });
  if(!all.length){ wrap.style.display='none'; return; }
  var lastDate=null;
  all.forEach(function(a){ if(!lastDate||a.date>lastDate) lastDate=a.date; });
  var jour = all.filter(function(a){
    if(a.date!==lastDate) return false;
    var cat = arretCat(a.raison);
    return OV_CAT_EXCLUES.indexOf(cat)===-1;
  });
  var parRaison={};
  jour.forEach(function(a){ parRaison[a.raison]=(parRaison[a.raison]||0)+(a.duree||0); });
  var causes = Object.keys(parRaison).map(function(r){ return {raison:r, min:parRaison[r]}; })
    .filter(function(x){ return x.min>=OV_SEUIL_ANOMALIE_MIN; })
    .sort(function(a,b){ return b.min-a.min; });
  if(!causes.length){ wrap.style.display='none'; return; }
  wrap.style.display='block';
  el.innerHTML = '<div style="font-size:11px;color:var(--tx3);margin-bottom:8px">'+(typeof dFR==='function'?dFR(lastDate):lastDate)+'</div>'
    + causes.map(function(c){
        var lbl = typeof arretRaisonTexte==='function' ? arretRaisonTexte(c.raison) : c.raison;
        var h=Math.floor(c.min/60), m=c.min%60;
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd2)">'
          +'<span style="font-size:13px;font-weight:600;color:var(--tx1)">'+lbl+'</span>'
          +'<span style="font-size:12px;font-weight:600;color:var(--amber);font-family:var(--mo)">'+h+'h'+String(m).padStart(2,'0')+'</span>'
          +'</div>';
      }).join('');
  el.onclick=function(){ var tab=document.querySelector('.tab[data-tab="arrets"]'); if(tab) tab.click(); };
  el.style.cursor='pointer';
}

// ----------------------------------------------------------------------
// Section 4 -- Rappels discrets (formation la plus proche + prochain
// anniversaire, une seule ligne, plus de bandeaux/cartes permanents).
// ----------------------------------------------------------------------

function ovBuildRappels(){
  var el=document.getElementById('ov-rappels');
  if(!el) return;
  var parts=[];
  if(typeof FORMATIONS!=='undefined'){
    var now=new Date(); var today0=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    var soon = FORMATIONS.filter(function(f){ return new Date(f.date+'T00:00:00')>=today0; })
      .sort(function(a,b){ return (a.date+(a.heureDebut||'')).localeCompare(b.date+(b.heureDebut||'')); })[0];
    if(soon) parts.push({txt:'\uD83C\uDF93 '+(soon.titre||'Formation')+' \u2014 '+(typeof fmtDateFormation==='function'?fmtDateFormation(soon.date):soon.date), tab:'formations'});
  }
  if(typeof getBirthdays==='function'){
    var now2=new Date(); var today02=new Date(now2.getFullYear(),now2.getMonth(),now2.getDate());
    var upcoming = getBirthdays().map(function(b){
      var thisYear=new Date(now2.getFullYear(),b.month-1,b.day);
      var nextYear=new Date(now2.getFullYear()+1,b.month-1,b.day);
      var next = thisYear>=today02 ? thisYear : nextYear;
      return {n:b.n, daysUntil:Math.floor((next-today02)/86400000)};
    }).sort(function(a,b){return a.daysUntil-b.daysUntil;})[0];
    if(upcoming) parts.push({txt:'\uD83C\uDF82 '+upcoming.n.split(' ')[0]+' \u2014 '+(upcoming.daysUntil===0?'aujourd\u2019hui':('dans '+upcoming.daysUntil+' j')), tab:null});
  }
  if(!parts.length){ el.innerHTML=''; return; }
  window._ovRappelsActions = parts.map(function(p){
    return function(){ if(p.tab){ var t=document.querySelector('.tab[data-tab="'+p.tab+'"]'); if(t) t.click(); } };
  });
  el.innerHTML = parts.map(function(p,i){
    return '<span'+(p.tab?' onclick="window._ovRappelsActions['+i+']()" style="cursor:pointer"':'')+'>'+p.txt+'</span>';
  }).join('');
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
  ovBuildWeekendAbs();
  ovBuildProdAnomaly();
  ovBuildRappels();
}
