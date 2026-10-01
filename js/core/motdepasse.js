/* core/motdepasse.js — Chaque personne gere SON mot de passe, sans l'admin.

   1. Premiere connexion (ou compte sans users/<uid>/mdpChangeLe) : fenetre
      obligatoire « choisis ton mot de passe ». Le mot de passe provisoire
      donne par l'admin ne sert donc qu'une fois.
   2. Bouton « Mon mot de passe » (barre du haut) : changer son mot de passe
      et, si on le souhaite, ajouter une adresse e-mail personnelle de
      recuperation.
   3. Avec cette adresse, « Mot de passe oublie ? » sur l'ecran de connexion
      envoie un lien de reinitialisation : plus besoin de l'admin.

   Tout passe par Firebase Authentication depuis le navigateur : personne
   (ni l'admin, ni le code) ne voit ni ne stocke le mot de passe. */

var MDP_LONGUEUR_MIN = 8;

function mdpT(cle){ return (typeof t === 'function') ? t(cle) : cle; }

/* Regles : 8 caracteres minimum, au moins une lettre et un chiffre, et pas
   le nom du compte. Renvoie '' si correct, sinon le message d'erreur. */
function mdpVerifier(nouveau, confirmation, email){
  nouveau = String(nouveau || '');
  if(nouveau.length < MDP_LONGUEUR_MIN) return mdpT('mdp_err_longueur');
  if(!/[A-Za-z]/.test(nouveau) || !/[0-9]/.test(nouveau)) return mdpT('mdp_err_lettre_chiffre');
  // Prenom et nom du compte (prenom.nom@...) : interdits dans le mot de passe.
  var morceaux = String(email || '').split('@')[0].toLowerCase().split(/[^a-z]+/).filter(function(m){ return m.length >= 3; });
  var bas = nouveau.toLowerCase();
  if(morceaux.some(function(m){ return bas.indexOf(m) !== -1; })) return mdpT('mdp_err_nom');
  if(confirmation !== undefined && nouveau !== confirmation) return mdpT('mdp_err_confirmation');
  return '';
}

/* Message clair pour les erreurs Firebase courantes. */
function mdpMessageErreur(e){
  var c = (e && e.code) || '';
  if(c === 'auth/wrong-password' || c === 'auth/invalid-credential' || c === 'auth/invalid-login-credentials') return mdpT('mdp_err_actuel');
  if(c === 'auth/weak-password') return mdpT('mdp_err_longueur');
  if(c === 'auth/too-many-requests') return mdpT('mdp_err_trop');
  if(c === 'auth/invalid-email') return mdpT('mdp_err_email');
  if(c === 'auth/email-already-in-use') return mdpT('mdp_err_email_pris');
  if(c === 'auth/network-request-failed') return mdpT('mdp_err_reseau');
  return (e && e.message) || String(e);
}

function mdpReauthentifier(actuel){
  var u = firebase.auth().currentUser;
  if(!u) return Promise.reject(new Error(mdpT('mdp_err_session')));
  var cred = firebase.auth.EmailAuthProvider.credential(u.email, actuel);
  return u.reauthenticateWithCredential(cred).then(function(){ return u; });
}

/* Change le mot de passe puis note la date (sert a ne plus redemander). */
function mdpChanger(actuel, nouveau){
  return mdpReauthentifier(actuel).then(function(u){
    return u.updatePassword(nouveau).then(function(){
      try { localStorage.setItem('mdp_ok_' + u.uid, '1'); } catch(e){}
      var note = (typeof db !== 'undefined' && db) ? db.ref('users/' + u.uid + '/mdpChangeLe').set(Date.now()).catch(function(err){ console.warn('[mot de passe] date non enregistree :', err && err.message); }) : Promise.resolve();
      if(typeof journaliser === 'function') journaliser('mot_de_passe_change', {});
      return note;
    });
  });
}

/* Adresse de recuperation : Firebase envoie un lien de confirmation a cette
   adresse ; une fois le lien clique, c'est elle qui sert a se connecter et a
   recevoir les liens « mot de passe oublie ». */
function mdpAjouterEmail(actuel, emailPerso){
  emailPerso = String(emailPerso || '').trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailPerso)) return Promise.reject(new Error(mdpT('mdp_err_email')));
  return mdpReauthentifier(actuel).then(function(u){
    return u.verifyBeforeUpdateEmail(emailPerso).then(function(){
      if(typeof journaliser === 'function') journaliser('email_recuperation_demande', {});
    });
  });
}

function mdpCompteSansEmail(email){ return /@aw3p5\.local$/i.test(String(email || '')); }

/* ---------- Fenetre ---------- */
function mdpFermer(){ var f = document.getElementById('mdp-fenetre'); if(f) f.remove(); }

function mdpOuvrir(options){
  options = options || {};
  mdpFermer();
  var u = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
  var email = u ? u.email : '';
  var obligatoire = !!options.obligatoire;
  var champ = function(id, cle, type, auto){
    return '<label class="mdp-label" for="' + id + '">' + escHtml(mdpT(cle)) + '</label>'
      + '<input id="' + id + '" class="mdp-input" type="' + type + '" autocomplete="' + auto + '">';
  };
  var html = '<div class="mdp-boite" role="dialog" aria-modal="true" aria-labelledby="mdp-titre">'
    + '<h2 id="mdp-titre">' + escHtml(mdpT(obligatoire ? 'mdp_titre_premier' : 'mdp_titre')) + '</h2>'
    + '<p class="mdp-aide">' + escHtml(mdpT(obligatoire ? 'mdp_aide_premier' : 'mdp_aide')) + '</p>'
    + '<input type="text" autocomplete="username" aria-label="' + escHtml(mdpT('login_email')) + '" value="' + escHtml(email) + '" hidden>'
    + champ('mdp-actuel', obligatoire ? 'mdp_actuel_provisoire' : 'mdp_actuel', 'password', 'current-password')
    + champ('mdp-nouveau', 'mdp_nouveau', 'password', 'new-password')
    + champ('mdp-confirm', 'mdp_confirmer', 'password', 'new-password')
    + '<p class="mdp-regles">' + escHtml(mdpT('mdp_regles')) + '</p>'
    + '<div class="mdp-erreur" id="mdp-erreur" role="alert"></div>'
    + '<div class="mdp-actions">'
    +   (obligatoire ? '<button type="button" class="mdp-secondaire" id="mdp-deco">' + escHtml(mdpT('topbar_logout')) + '</button>'
                     : '<button type="button" class="mdp-secondaire" id="mdp-annuler">' + escHtml(mdpT('mdp_annuler')) + '</button>')
    +   '<button type="button" class="mdp-principal" id="mdp-valider">' + escHtml(mdpT('mdp_valider')) + '</button>'
    + '</div>'
    + (obligatoire ? '' :
        '<hr class="mdp-sep"><h3>' + escHtml(mdpT('mdp_recup_titre')) + '</h3>'
      + '<p class="mdp-aide">' + escHtml(mdpT(mdpCompteSansEmail(email) ? 'mdp_recup_aide' : 'mdp_recup_deja')) + '</p>'
      + champ('mdp-email', 'mdp_recup_email', 'email', 'email')
      + '<div class="mdp-actions"><button type="button" class="mdp-principal" id="mdp-email-valider">' + escHtml(mdpT('mdp_recup_btn')) + '</button></div>')
    + '</div>';
  var f = document.createElement('div');
  f.id = 'mdp-fenetre';
  f.className = 'mdp-fond';
  f.innerHTML = html;
  document.body.appendChild(f);
  var err = document.getElementById('mdp-erreur');
  var afficher = function(msg, ok){ err.textContent = msg; err.className = 'mdp-erreur' + (ok ? ' mdp-ok' : ''); };
  document.getElementById('mdp-actuel').focus();

  document.getElementById('mdp-valider').addEventListener('click', function(){
    var b = this;
    var actuel = document.getElementById('mdp-actuel').value;
    var nouveau = document.getElementById('mdp-nouveau').value;
    var confirmation = document.getElementById('mdp-confirm').value;
    if(!actuel){ afficher(mdpT('mdp_err_actuel_vide')); return; }
    var pb = mdpVerifier(nouveau, confirmation, email);
    if(!pb && nouveau === actuel) pb = mdpT('mdp_err_identique');
    if(pb){ afficher(pb); return; }
    b.disabled = true; afficher(mdpT('mdp_en_cours'), true);
    mdpChanger(actuel, nouveau).then(function(){
      mdpFermer();
      if(typeof toast === 'function') toast(mdpT('mdp_change_ok'), '#10b981');
      if(typeof options.ensuite === 'function') options.ensuite();
    }, function(e){ b.disabled = false; afficher(mdpMessageErreur(e)); });
  });
  var annuler = document.getElementById('mdp-annuler');
  if(annuler) annuler.addEventListener('click', mdpFermer);
  var deco = document.getElementById('mdp-deco');
  if(deco) deco.addEventListener('click', function(){ if(typeof doLogout === 'function') doLogout(); });
  var emailBtn = document.getElementById('mdp-email-valider');
  if(emailBtn) emailBtn.addEventListener('click', function(){
    var b = this;
    var actuel = document.getElementById('mdp-actuel').value;
    var adresse = document.getElementById('mdp-email').value;
    if(!actuel){ afficher(mdpT('mdp_err_actuel_vide')); document.getElementById('mdp-actuel').focus(); return; }
    b.disabled = true; afficher(mdpT('mdp_en_cours'), true);
    mdpAjouterEmail(actuel, adresse).then(function(){
      b.disabled = false; afficher(mdpT('mdp_recup_envoye').replace('{email}', adresse.trim()), true);
    }, function(e){ b.disabled = false; afficher(mdpMessageErreur(e)); });
  });
  if(!obligatoire){
    f.addEventListener('click', function(e){ if(e.target === f) mdpFermer(); });
    f.addEventListener('keydown', function(e){ if(e.key === 'Escape') mdpFermer(); });
  }
}

/* Apres connexion : mot de passe provisoire jamais change -> fenetre
   obligatoire. (Si la date n'a pas pu etre enregistree, le navigateur s'en
   souvient pour ne pas redemander en boucle.) */
function mdpVerifierPremiereConnexion(fiche, uid){
  if(!fiche || fiche.mdpChangeLe) return false;
  try { if(localStorage.getItem('mdp_ok_' + uid) === '1') return false; } catch(e){}
  mdpOuvrir({ obligatoire: true });
  return true;
}
