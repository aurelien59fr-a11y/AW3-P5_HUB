/* core/actions.js — Gestionnaires d'evenements SANS code inline.

   Avant : <button onclick (attribut)="ncpDetail('123')">. La politique de securite du
   navigateur (CSP) devait alors autoriser 'unsafe-inline', ce qui laisse
   aussi passer un script injecte. Maintenant : <button data-on-click=
   "ncpDetail('123')">. Ce fichier lit l'attribut et appelle la fonction,
   SANS eval : seule une syntaxe tres limitee est comprise (appel d'une
   fonction globale avec des valeurs simples), tout le reste est refuse.

   Syntaxe acceptee (instructions separees par ;) :
     nomFonction(arg, arg...)      fonction globale (window.nomFonction)
     return false                  -> preventDefault()
     event.stopPropagation()       event.preventDefault()
     window.print()                location.reload()
   Arguments : 'texte' "texte" (echappements \' \" \\), nombres, true,
   false, null, this, event, this.value, this.checked, this.dataset.xxx.

   Les ecouteurs sont poses sur document (phase de bouillonnement), avant
   ceux de app.js : l'ordre d'execution reste celui des attributs inline. */

var ACTIONS_EVENEMENTS = ['click', 'change', 'input', 'keydown'];
var ACTIONS_SPECIALES = {
  'return false': function(el, ev){ ev.preventDefault(); },
  'event.stopPropagation()': function(el, ev){ ev.stopPropagation(); },
  'event.preventDefault()': function(el, ev){ ev.preventDefault(); },
  'window.print()': function(){ window.print(); },
  'location.reload()': function(){ location.reload(); }
};

/* Decoupe sur un separateur hors des chaines entre guillemets. */
function actionsDecouper(txt, sep){
  var out = [], cur = '', q = null;
  for(var i = 0; i < txt.length; i++){
    var c = txt[i];
    if(q){
      cur += c;
      if(c === '\\' && i + 1 < txt.length){ cur += txt[++i]; continue; }
      if(c === q) q = null;
      continue;
    }
    if(c === '\'' || c === '"'){ q = c; cur += c; continue; }
    if(c === sep){ out.push(cur); cur = ''; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}

function actionsValeur(a, el, ev){
  a = a.trim();
  var m;
  if((m = /^'((?:[^'\\]|\\.)*)'$/.exec(a)) || (m = /^"((?:[^"\\]|\\.)*)"$/.exec(a))) return m[1].replace(/\\(.)/g, '$1');
  if(/^-?\d+(\.\d+)?$/.test(a)) return parseFloat(a);
  if(a === 'true') return true;
  if(a === 'false') return false;
  if(a === 'null') return null;
  if(a === 'this') return el;
  if(a === 'event') return ev;
  if(a === 'this.value') return el.value;
  if(a === 'this.checked') return el.checked;
  if((m = /^this\.dataset\.([A-Za-z]\w*)$/.exec(a))) return el.dataset[m[1]];
  throw new Error('argument non autorise : ' + a);
}

/* Transforme le texte de l'attribut en liste d'operations (ou erreur). */
function actionsAnalyser(code){
  return actionsDecouper(String(code || ''), ';').map(function(s){ return s.trim(); }).filter(Boolean).map(function(s){
    var sp = ACTIONS_SPECIALES[s.replace(/;$/, '')];
    if(sp) return { speciale: sp };
    var m = /^([A-Za-z_$][\w$]*)\(([\s\S]*)\)$/.exec(s);
    if(!m || /^(if|for|while|switch|return|new|function|var|let|const|delete|typeof|void|eval)$/.test(m[1])) throw new Error('instruction non autorisee : ' + s);
    var args = m[2].trim() ? actionsDecouper(m[2], ',') : [];
    return { fonction: m[1], args: args };
  });
}

function actionsExecuter(el, code, ev){
  var ops;
  try { ops = actionsAnalyser(code); }
  catch(e){ console.error('[actions]', e.message); return; }
  ops.forEach(function(op){
    if(op.speciale){ op.speciale(el, ev); return; }
    var f = window[op.fonction];
    if(typeof f !== 'function'){ console.error('[actions] fonction inconnue : ' + op.fonction); return; }
    var args;
    try { args = op.args.map(function(a){ return actionsValeur(a, el, ev); }); }
    catch(e){ console.error('[actions]', e.message); return; }
    f.apply(el, args);
  });
}

ACTIONS_EVENEMENTS.forEach(function(type){
  var attr = 'data-on-' + type;
  document.addEventListener(type, function(ev){
    // Du plus profond au plus haut, comme le bouillonnement des onclick.
    var el = ev.target && ev.target.closest ? ev.target.closest('[' + attr + ']') : null;
    while(el && !ev.cancelBubble){
      actionsExecuter(el, el.getAttribute(attr), ev);
      el = el.parentElement ? el.parentElement.closest('[' + attr + ']') : null;
    }
  });
});

/* ---- Petites actions qui etaient ecrites en ligne dans le HTML ---- */
/* Clic sur le fond d'une fenetre (pas sur son contenu) : ferme la fenetre. */
function siCibleDirecte(ev, el, nom){ if(ev.target === el && typeof window[nom] === 'function') window[nom](); }
function allerOnglet(id){ var b = document.querySelector('.tab[data-tab="' + id + '"]'); if(b) b.click(); }
function retirerElement(id){ var e = document.getElementById(id); if(e) e.remove(); }
function masquerElement(id){ var e = document.getElementById(id); if(e) e.style.display = 'none'; }
function fermerFenetreFixe(el){ var f = el.closest('div[style*=fixed]'); if(f) f.remove(); }
function toucheEntreeFocus(ev, id){ if(ev.key === 'Enter'){ var e = document.getElementById(id); if(e) e.focus(); } }
function toucheEntreeAppel(ev, nom){ if(ev.key === 'Enter' && typeof window[nom] === 'function') window[nom](); }
