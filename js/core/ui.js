/* core/ui.js — utilitaires DOM sans aucune dependance metier.
   Extrait de app.js a l'etape 2 du plan Phase 2. */

/* Notification courte. Le message est insere comme TEXTE (jamais comme HTML) :
   un nom ou un message d'erreur contenant des balises s'affiche tel quel.
   role="status" + aria-live : annoncee par les lecteurs d'ecran. */
/* JSZip (~100 Ko) n'est utile qu'aux exports Excel : charge a la demande. */
var URL_JSZIP = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
var PROMESSE_JSZIP = null;
function chargerJSZip(){
  if(typeof JSZip !== 'undefined') return Promise.resolve();
  if(!PROMESSE_JSZIP){
    PROMESSE_JSZIP = new Promise(function(ok, ko){
      var sc = document.createElement('script');
      sc.src = URL_JSZIP;
      sc.onload = function(){ typeof JSZip !== 'undefined' ? ok() : ko(new Error('JSZip absent')); };
      sc.onerror = function(){ PROMESSE_JSZIP = null; ko(new Error('JSZip non charge')); };
      document.head.appendChild(sc);
    });
  }
  return PROMESSE_JSZIP;
}
/* Relance fn une fois JSZip disponible ; true si l'appelant doit s'arreter. */
function attendreJSZip(fn, args){
  if(typeof JSZip !== 'undefined') return false;
  chargerJSZip().then(function(){ fn.apply(null, args || []); }, function(){ toast('JSZip non charge', '#ef4444'); });
  return true;
}

function toast(msg,col){
  var t=document.createElement('div');t.className='toast';
  t.setAttribute('role','status');t.setAttribute('aria-live','polite');
  var dot=document.createElement('div');dot.className='tdot';dot.style.background=col;
  t.appendChild(dot);t.appendChild(document.createTextNode(msg==null?'':String(msg)));
  document.body.appendChild(t);
  setTimeout(function(){t.style.opacity='0';t.style.transition='opacity .3s';setTimeout(function(){t.remove();},300);},2500);
}

/* Echappement unique pour inserer une donnee dans du HTML (texte ou valeur
   d'attribut entre guillemets simples ou doubles). A utiliser pour TOUTE
   donnee venant de Firebase, d'un import ou d'une saisie. */
function escHtml(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

/* Echappement d'une valeur placee dans une chaine JS entre apostrophes, elle-meme
   dans un attribut HTML (ex. onclick="f('...')"). */
function escJsAttr(s){return escHtml(String(s==null?'':s).replace(/\\/g,'\\\\').replace(/'/g,"\\'"));}

/* N'accepte que les liens https:// (ou relatifs au site) ; tout autre schema
   (javascript:, data:, http:) est remplace par '#'. Resultat deja echappe. */
function safeUrl(u){
  var s=String(u==null?'':u).trim();
  if(/^https:\/\//i.test(s)) return escHtml(s);
  if(/^\/(?!\/)/.test(s)) return escHtml(s);
  return '#';
}

/* --- Accessibilite (phase 4) ---
   Beaucoup de champs ont un libelle visible (<label>) qui ne leur est pas
   relie : un lecteur d'ecran annonce alors « zone d'edition » sans nom. On
   relie chaque <label> sans « for » au champ qui le suit dans le meme bloc. */
function lierLibellesChamps(racine){
  var champs = 'input:not([type=hidden]),select,textarea';
  (racine || document).querySelectorAll('label:not([for])').forEach(function(l){
    if(l.querySelector(champs)) return; // le champ est dans le label : deja relie
    var c = l.nextElementSibling;
    while(c && !c.matches(champs) && !c.querySelector(champs) && c.tagName !== 'LABEL') c = c.nextElementSibling;
    if(c && !c.matches(champs)) c = (c.tagName === 'LABEL') ? null : c.querySelector(champs);
    if(!c || !c.id) return;
    if(document.querySelector('label[for="' + (window.CSS && CSS.escape ? CSS.escape(c.id) : c.id) + '"]')) return;
    l.setAttribute('for', c.id);
  });
}

/* Onglets : role tab / tabpanel et onglet courant annonce (aria-selected). */
function majAriaOnglets(){
  document.querySelectorAll('.tab[data-tab]').forEach(function(b){
    var on = b.classList.contains('on');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', on ? 'true' : 'false');
    b.setAttribute('aria-controls', 'pane-' + b.dataset.tab);
    var p = document.getElementById('pane-' + b.dataset.tab);
    if(p){ p.setAttribute('role', 'tabpanel'); }
  });
}
