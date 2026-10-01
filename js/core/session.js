/* core/session.js — Securite de la session.

   1. Deconnexion automatique apres SESSION_INACTIVITE_MIN minutes sans
      activite (souris, clavier, toucher), avec un avertissement 2 minutes
      avant. L'activite est partagee entre les onglets ouverts (localStorage) :
      travailler dans un onglet garde les autres connectes.
      Utile sur les PC partages de l'atelier : un poste oublie ouvert se
      referme tout seul.
   2. Journal : chaque connexion et chaque deconnexion automatique sont
      ajoutees a audit_log (une seule fois par session de navigateur). */

var SESSION_INACTIVITE_MIN = 60;
var SESSION_AVERTISSEMENT_MIN = 2;
var SESSION_CLE = 'aw3_derniere_activite';
var SESSION_MINUTERIE = null;
var SESSION_DERNIERE = Date.now();
var SESSION_AVERTI = false;

function sessionMaintenant(){ return Date.now(); }

function sessionNoterActivite(){
  var t = sessionMaintenant();
  if(t - SESSION_DERNIERE < 5000) return; // au plus une ecriture toutes les 5 s
  SESSION_DERNIERE = t;
  try { localStorage.setItem(SESSION_CLE, String(t)); } catch(e){}
  if(SESSION_AVERTI) sessionRetirerAvertissement();
}

function sessionDerniereActivite(){
  var autre = 0;
  try { autre = parseInt(localStorage.getItem(SESSION_CLE), 10) || 0; } catch(e){}
  return Math.max(SESSION_DERNIERE, autre);
}

function sessionRetirerAvertissement(){
  SESSION_AVERTI = false;
  var b = document.getElementById('session-avertissement');
  if(b) b.remove();
}

function sessionAvertir(minutes){
  if(SESSION_AVERTI) return;
  SESSION_AVERTI = true;
  var b = document.createElement('div');
  b.id = 'session-avertissement';
  b.setAttribute('role', 'alert');
  b.className = 'session-avertissement';
  var texte = (typeof t === 'function' ? t('session_avertissement') : 'Deconnexion automatique dans {min} min sans activite.').replace('{min}', minutes);
  var bouton = document.createElement('button');
  bouton.type = 'button';
  bouton.textContent = (typeof t === 'function' ? t('session_rester') : 'Rester connecte');
  bouton.addEventListener('click', function(){ SESSION_DERNIERE = 0; sessionNoterActivite(); });
  var span = document.createElement('span');
  span.textContent = texte;
  b.appendChild(span); b.appendChild(bouton);
  document.body.appendChild(b);
}

/* Verifie l'inactivite ; renvoie 'deconnecte', 'averti' ou 'actif'. */
function sessionVerifier(){
  if(typeof currentUser === 'undefined' || !currentUser) return 'actif';
  var inactif = sessionMaintenant() - sessionDerniereActivite();
  var limite = SESSION_INACTIVITE_MIN * 60000;
  if(inactif >= limite){
    sessionArreter();
    var fin = function(){ if(typeof doLogout === 'function') doLogout(); };
    if(typeof journaliser === 'function') journaliser('deconnexion_inactivite', { minutes: SESSION_INACTIVITE_MIN }).then(fin, fin);
    else fin();
    return 'deconnecte';
  }
  if(inactif >= limite - SESSION_AVERTISSEMENT_MIN * 60000){
    sessionAvertir(Math.max(1, Math.ceil((limite - inactif) / 60000)));
    return 'averti';
  }
  if(SESSION_AVERTI) sessionRetirerAvertissement();
  return 'actif';
}

function sessionArreter(){
  if(SESSION_MINUTERIE){ clearInterval(SESSION_MINUTERIE); SESSION_MINUTERIE = null; }
}

/* Appelee une fois la personne connectee (et son role lu). */
function demarrerSurveillanceSession(user){
  SESSION_DERNIERE = 0; sessionNoterActivite();
  if(!SESSION_MINUTERIE){
    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel', 'scroll'].forEach(function(ev){
      document.addEventListener(ev, sessionNoterActivite, { passive: true, capture: true });
    });
    SESSION_MINUTERIE = setInterval(sessionVerifier, 30000);
  }
  // Une entree « connexion » par session de navigateur (pas a chaque rechargement).
  try {
    var cle = 'aw3_connexion_journalisee_' + (user && user.uid);
    if(user && !sessionStorage.getItem(cle) && typeof journaliser === 'function'){
      sessionStorage.setItem(cle, '1');
      journaliser('connexion', {});
    }
  } catch(e){}
}
