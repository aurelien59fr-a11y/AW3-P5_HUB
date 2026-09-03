/* core/auth.js -- role, droits d'edition et connexion Firebase Auth.
   Extrait de app.js a l'etape 4 du plan Phase 2 (aucune regle metier changee).
   canEdit() existait en double dans app.js (ligne 2387, jamais executee car
   ecrasee par la redefinition ligne 2697, et ligne 2697, celle qui s'executait
   reellement) -- decision validee avec l'utilisateur : on ne garde que la
   version ligne 2697 (ci-dessous), la copie morte est supprimee. isAdmin()
   n'a aucun appelant dans le fichier (deja le cas avant cette extraction --
   la variable locale du meme nom dans applyRole() le masque partout ou elle
   est utilisee) ; conservee telle quelle, sans changement de comportement.
   Le bootstrap (window.addEventListener('load', ...) qui initialise Firebase
   et ecoute onAuthStateChanged) reste dans app.js pour cette etape : ce n'est
   pas une fonction nommee, et le deplacer creerait un risque de double
   inscription d'ecouteur pendant la fenetre de deploiement -- reporte a plus
   tard si besoin. */

function canEdit(){
  if(!currentUser){toast('Non connecte','#ef4444');return false;}
  // Admin et sous-chef peuvent modifier le planning
  if(currentUser.role==='admin'||currentUser.role==='subchef'||currentUser.editPlanning) return true;
  toast('Acces non autorise','#ef4444');
  return false;
}

function isAdmin(){
  return currentUser && currentUser.role === 'admin';
}

function applyRole(role){
  var isAdmin = role === 'admin';
  var isSubchef = role === 'subchef';
  var isVisiteur = role === 'visiteur';
  var isEmploye = role === 'employe';

  // Toujours repartir d'un etat "tout visible" avant d'appliquer les
  // restrictions du role courant — indispensable si on change de compte
  // (ex: visiteur -> admin) sans recharger completement la page.
  document.querySelectorAll('[onclick*="openImportPointages"], [onclick*="openImportArretsModal"], [onclick*="markAllPtDone"], [onclick*="nettoyerDoublonsArrets"], [onclick*="openImportNCPModal"]').forEach(function(el){
    el.style.display = '';
  });
  ['ov','br','ab'].forEach(function(tab){
    var btn = document.querySelector('.tab[data-tab="'+tab+'"]');
    if(btn) btn.style.display = 'flex';
  });

  // Employe — acces limite a Planning + Formations
  if(isEmploye){
    ['ov','br','ab'].forEach(function(tab){
      var btn = document.querySelector('.tab[data-tab="'+tab+'"]');
      if(btn) btn.style.display = 'none';
    });
    var activeTabBtn = document.querySelector('.tab.on');
    if(activeTabBtn && activeTabBtn.dataset.tab !== 'pl' && activeTabBtn.dataset.tab !== 'formations'){
      var plBtn = document.querySelector('.tab[data-tab="pl"]');
      if(plBtn) plBtn.click();
    }
  }

  // Badge role
  var badge = document.getElementById('role-badge');
  if(badge){
    if(isAdmin){
      badge.textContent=t('badge_role_admin');
      badge.style.background='rgba(16,185,129,.15)';
      badge.style.color='var(--green)';
      badge.style.borderColor='rgba(16,185,129,.3)';
    } else if(isVisiteur){
      badge.textContent=t('role_visiteur');
      badge.style.background='rgba(139,146,164,.15)';
      badge.style.color='var(--tx2)';
      badge.style.borderColor='rgba(139,146,164,.3)';
    } else if(isEmploye){
      badge.textContent=t('role_employe');
      badge.style.background='rgba(249,115,22,.15)';
      badge.style.color='var(--orange)';
      badge.style.borderColor='rgba(249,115,22,.3)';
    } else {
      badge.textContent=t('role_souschef');
      badge.style.background='rgba(59,130,246,.15)';
      badge.style.color='var(--blue)';
      badge.style.borderColor='rgba(59,130,246,.3)';
    }
  }

  // Onglet Admin — admin seulement (jamais visiteur ni sous-chef)
  var adminTab = document.getElementById('tab-admin-btn');
  if(adminTab) adminTab.style.display = isAdmin ? 'flex' : 'none';
  // Pointages et Arrets Inpak — admin ET visiteur (lecture), pas sous-chef
  var ptTab = document.getElementById('tab-pt-btn');
  if(ptTab) ptTab.style.display = (isAdmin || isVisiteur) ? 'flex' : 'none';
  var arretsTab = document.getElementById('tab-arrets-btn');
  if(arretsTab) arretsTab.style.display = (isAdmin || isVisiteur) ? 'flex' : 'none';
  var bulkTab = document.getElementById('tab-bulk-btn');
  if(bulkTab) bulkTab.style.display = (isAdmin || isVisiteur) ? 'flex' : 'none';
  var cmp2Tab = document.getElementById('tab-cmp2-btn');
  if(cmp2Tab) cmp2Tab.style.display = (isAdmin || isVisiteur) ? 'flex' : 'none';
  var ncpTab = document.getElementById('tab-ncp-btn');
  if(ncpTab) ncpTab.style.display = (isAdmin || isVisiteur) ? 'flex' : 'none';
  var recTab = document.getElementById('tab-recrutement-btn');
  if(recTab) recTab.style.display = isAdmin ? 'flex' : 'none';
  canEditFormations = isAdmin || isSubchef;
  var formAddBtn = document.getElementById('form-btn-add');
  if(formAddBtn) formAddBtn.style.display = canEditFormations ? 'inline-flex' : 'none';

  // Acces personnalise par onglet (defini par l'admin dans Comptes employes)
  if(!isAdmin && role !== 'subchef' && currentUser && currentUser.tabs){
    var tCfg = currentUser.tabs;
    ['ov','br','pl','ab','formations','pt','arrets','bulk','ncp','recrutement','espace'].forEach(function(t){
      var tBtn = document.querySelector('.tab[data-tab="'+t+'"]');
      var visible = (t === 'espace') ? (tCfg[t] !== false) : !!tCfg[t];
      if(tBtn) tBtn.style.display = visible ? 'flex' : 'none';
    });
    var badge2 = document.getElementById('role-badge');
    if(badge2){
      badge2.textContent=t('role_acces_perso');
      badge2.style.background='rgba(249,115,22,.15)';
      badge2.style.color='var(--orange)';
      badge2.style.borderColor='rgba(249,115,22,.3)';
    }
    var activeTabBtn2 = document.querySelector('.tab.on');
    if(activeTabBtn2 && !tCfg[activeTabBtn2.dataset.tab]){
      var order2 = ['pl','espace','ov','formations','br','ab','pt','arrets','bulk','ncp','recrutement'];
      var firstOk = null;
      for(var i2=0;i2<order2.length;i2++){ if(tCfg[order2[i2]]){ firstOk = order2[i2]; break; } }
      var firstBtn = firstOk && document.querySelector('.tab[data-tab="'+firstOk+'"]');
      if(firstBtn) firstBtn.click();
    }
  }

  // Email dans panneau admin
  var ae = document.getElementById('admin-email-display');
  if(ae && currentUser) ae.textContent = currentUser.email;

  // Visiteur : acces en lecture a tout (sauf Admin), aucune ecriture possible.
  // Depuis la publication des regles Firebase du 02/09/2026, le blocage est
  // aussi applique cote serveur : meme si un bouton d'ecriture restait visible
  // quelque part, la base refuserait l'ecriture. Double securite reelle — avant
  // cette date, seule l'interface bloquait et la base acceptait tout.
  if(isVisiteur){
    document.querySelectorAll('.tab[data-tab="admin"]').forEach(function(b){ b.style.display = 'none'; });

    // Masquer les boutons d'action principaux, pour une experience propre
    document.querySelectorAll('[onclick*="openImportPointages"], [onclick*="openImportArretsModal"], [onclick*="markAllPtDone"], [onclick*="nettoyerDoublonsArrets"], [onclick*="openImportNCPModal"]').forEach(function(el){
      el.style.display = 'none';
    });

    document.addEventListener('click', function(e){
      var tab = e.target.closest('.tab');
      if(tab && tab.dataset.tab === 'admin'){
        e.stopImmediatePropagation();
        e.preventDefault();
        toast('Acces non autorise (compte visiteur)', '#ef4444');
      }
    }, true);

    return;
  }

  // Sous-chef : accès Planning uniquement
  if(!isAdmin){
    // Masquer les onglets non autorisés
    ['ov','br','ab'].forEach(function(tab){
      var btn = document.querySelector('.tab[data-tab="'+tab+'"]');
      if(btn) btn.style.display = 'none';
    });

    // Forcer l'onglet Planning actif au démarrage
    setTimeout(function(){
      document.querySelectorAll('.tab').forEach(function(b){b.classList.remove('on');});
      document.querySelectorAll('.pane').forEach(function(p){p.classList.remove('on');});
      var plTab = document.querySelector('.tab[data-tab="pl"]');
      var plPane = document.getElementById('pane-pl');
      if(plTab) plTab.classList.add('on');
      if(plPane) plPane.classList.add('on');
    }, 100);

    // Intercepter les clics directs sur les panes interdits
    document.addEventListener('click', function(e){
      var tab = e.target.closest('.tab');
      if(tab && ['ov','br','ab','admin'].indexOf(tab.dataset.tab) !== -1){
        e.stopImmediatePropagation();
        e.preventDefault();
        toast('Acces non autorise', '#ef4444');
      }
    }, true);

    // Sous-chef PEUT modifier le planning (ziek/verlof/postes)
    // Aucun blocage sur applyShift
  }
}

function doLogin(){var email=document.getElementById('li-email').value.trim();var pass=document.getElementById('li-pass').value;var btn=document.getElementById('li-btn');var err=document.getElementById('li-err');if(!email||!pass){err.textContent='Remplis tous les champs.';return;}btn.textContent=t('topbar_connecting');btn.disabled=true;err.textContent='';firebase.auth().signInWithEmailAndPassword(email,pass).catch(function(e){err.textContent=e.code==='auth/wrong-password'||e.code==='auth/user-not-found'?'Email ou mot de passe incorrect.':'Erreur: '+e.message;btn.textContent=t('login_btn');btn.disabled=false;});}

function doForgotPassword(){
  var email=document.getElementById('li-email').value.trim();
  var err=document.getElementById('li-err');
  if(!email){ err.style.color='#ef4444'; err.textContent='Renseigne ton email dans le champ ci-dessus, puis clique a nouveau sur "Mot de passe oublie ?".'; return; }
  err.style.color='var(--tx3)'; err.textContent='Envoi en cours...';
  firebase.auth().sendPasswordResetEmail(email).then(function(){
    err.style.color='#10b981';
    err.textContent='Email envoye a '+email+' (verifie aussi tes spams).';
  }).catch(function(e){
    err.style.color='#ef4444';
    err.textContent = e.code==='auth/user-not-found' ? 'Aucun compte avec cet email.' : 'Erreur: '+e.message;
  });
}

function doLogout(){firebase.auth().signOut();}
