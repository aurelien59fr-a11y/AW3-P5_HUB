/* metier/bradford.js -- calcul du score Bradford et fonctions de calcul associees.
   Extrait de app.js a l'etape 5 du plan Phase 2 (aucune regle metier changee).
   recalc() garde sa signature actuelle (aucun parametre, ne retourne rien,
   lit le global ABS et ecrit le global BD par effet de bord) -- la rendre
   pure (parametres en entree, retour en sortie) est note en TODO Phase 3,
   pas fait ici, pour ne pas melanger extraction et refonte.
   scColor()/scSt() sont aussi lues par d'autres domaines pas encore extraits
   (Planning, Recrutement) via les globales partagees -- comportement inchange,
   la portee globale du script fait qu'aucun ordre de chargement n'est requis.
   calcSaisons() n'a aucun appelant dans le fichier (deja le cas avant cette
   extraction) ; conservee telle quelle, sans changement de comportement --
   signale dans TODO_PHASE_FUTURE.md. */

function scColor(s){return s<=50?'#10b981':s<=200?'#f59e0b':s<=500?'#f97316':'#ef4444';}

function scSt(s){return s<=50?{l:t('status_ok'),c:'ok'}:s<=200?{l:t('status_wn'),c:'wn'}:s<=500?{l:t('status_al'),c:'al'}:{l:t('status_cr'),c:'cr'};}

function recalc(){
  var now=new Date(),cut=new Date(now);cut.setFullYear(cut.getFullYear()-1);
  function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
  function addDays(d,n){var r=new Date(d);r.setDate(r.getDate()+n);return r;}

  // 1) Regrouper, par personne, uniquement les absences maladie (t==='ziek')
  //    qui tombent dans la fenetre glissante des 365 derniers jours.
  var byPerson={};
  EMP.forEach(function(e){byPerson[e.n]=[];});
  ABS.forEach(function(a){
    if(a.t!=='ziek') return; // seules les maladies comptent pour Bradford (legacy sans t = ignore, pas de supposition)
    var deb=pFR(a.a),fin=pFR(a.b);
    if(fin<cut||deb>now) return; // hors fenetre 365 jours
    if(!byPerson[a.n]) return;
    byPerson[a.n].push({deb:deb,fin:fin,d:a.d});
  });

  // 2) Pour chaque personne, fusionner les intervalles maladie qui se
  //    touchent ou ne sont separes que par un week-end (samedi+dimanche),
  //    afin qu'un vendredi malade + lundi malade ne forment qu'un seul episode.
  function mergeEpisodes(intervals){
    if(!intervals.length) return {S:0,D:0};
    intervals.sort(function(a,b){return a.deb-b.deb;});
    var episodes=[];
    var cur={deb:intervals[0].deb, fin:intervals[0].fin, days:intervals[0].d};
    for(var i=1;i<intervals.length;i++){
      var iv=intervals[i];
      var gapStart=addDays(cur.fin,1);
      var bridgesWeekend=true;
      var d=new Date(gapStart);
      while(d<=addDays(iv.deb,-1)){
        var dow=d.getDay(); // 0=dimanche, 6=samedi
        if(dow!==0&&dow!==6){bridgesWeekend=false;break;}
        d=addDays(d,1);
      }
      if(iv.deb<=addDays(cur.fin,1) || bridgesWeekend){
        // chevauchement, contigu, ou separe uniquement par un week-end : meme episode
        if(iv.fin>cur.fin) cur.fin=iv.fin;
        cur.days+=iv.d;
      } else {
        episodes.push(cur);
        cur={deb:iv.deb, fin:iv.fin, days:iv.d};
      }
    }
    episodes.push(cur);
    var totalD=0;
    episodes.forEach(function(ep){totalD+=ep.days;});
    return {S:episodes.length, D:totalD};
  }

  var results={};
  Object.keys(byPerson).forEach(function(name){
    results[name]=mergeEpisodes(byPerson[name]);
  });

  // 3) Appliquer le resultat : Bradford = S^2 * D
  BD.forEach(function(e){
    var r=results[e.n]||{S:0,D:0};
    e.S=r.S; e.D=r.D; e.sc=e.S*e.S*e.D;
  });
}

function calcTrend(name){
  var now=new Date();
  var cut90=new Date(now);cut90.setDate(cut90.getDate()-90);
  var cut180=new Date(now);cut180.setDate(cut180.getDate()-180);
  function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
  function addDays(d,n){var r=new Date(d);r.setDate(r.getDate()+n);return r;}
  function calcScore(eps){
    if(!eps.length) return 0;
    eps.sort(function(a,b){return a.deb-b.deb;});
    var merged=[],cur={deb:eps[0].deb,fin:eps[0].fin,days:eps[0].d};
    for(var i=1;i<eps.length;i++){
      var iv=eps[i];var gap=true;var d=new Date(cur.fin);d.setDate(d.getDate()+1);
      while(d<iv.deb){var dow=d.getDay();if(dow!==0&&dow!==6){gap=false;break;}d.setDate(d.getDate()+1);}
      if(iv.deb<=addDays(cur.fin,1)||gap){if(iv.fin>cur.fin)cur.fin=iv.fin;cur.days+=iv.d;}
      else{merged.push(cur);cur={deb:iv.deb,fin:iv.fin,days:iv.d};}
    }
    merged.push(cur);
    var D=0;merged.forEach(function(ep){D+=ep.days;});
    return merged.length*merged.length*D;
  }
  var recent=[],older=[];
  ABS.filter(function(a){return a.n===name&&a.t==='ziek';}).forEach(function(a){
    function p2(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
    var deb=p2(a.a),fin=p2(a.b);
    if(fin>=cut90&&deb<=now) recent.push({deb:deb,fin:fin,d:a.d});
    else if(fin>=cut180&&deb<cut90) older.push({deb:deb,fin:fin,d:a.d});
  });
  var s1=calcScore(recent),s2=calcScore(older);
  if(s1===0&&s2===0) return 'stable';
  if(s1<s2) return 'down';
  if(s1>s2) return 'up';
  return 'stable';
}

function calcSaisons(name){
  function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
  var s={Hiver:0,Printemps:0,Ete:0,Automne:0};
  ABS.filter(function(a){return a.n===name&&a.t==='ziek';}).forEach(function(a){
    var m=pFR(a.a).getMonth();
    if(m===11||m<=1) s.Hiver+=a.d;
    else if(m<=4) s.Printemps+=a.d;
    else if(m<=7) s.Ete+=a.d;
    else s.Automne+=a.d;
  });
  return s;
}

