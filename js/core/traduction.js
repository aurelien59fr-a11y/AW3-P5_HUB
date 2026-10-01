/* core/traduction.js — Traduction INTERNE (sur l'appareil).

   Utilise l'API Translator / LanguageDetector integree a Chrome et Edge
   recents : le modele de traduction est telecharge une fois par le navigateur
   puis tout se fait sur le PC. Aucun texte (NCP, notes du planning, logbook)
   n'est envoye a un service externe.

   Si le navigateur ne propose pas cette API (Firefox, Safari, ancien Chrome),
   la traduction est simplement indisponible : on le dit, on ne bascule jamais
   vers un service en ligne. */

var TRAD_LANGUES = ['fr', 'nl', 'en', 'de'];
var TRAD_TRADUCTEURS = {};   // 'nl>fr' -> Promise<Translator>
var TRAD_DETECTEUR = null;   // Promise<LanguageDetector>

function traductionLocaleDisponible(){
  return typeof Translator !== 'undefined' && typeof Translator.create === 'function';
}

function tradErreurIndisponible(){
  return new Error(typeof t === 'function' && t('trad_indisponible') !== 'trad_indisponible'
    ? t('trad_indisponible')
    : 'Traduction interne indisponible dans ce navigateur (utilise Chrome ou Edge a jour).');
}

function tradTraducteur(source, cible){
  var k = source + '>' + cible;
  if(!TRAD_TRADUCTEURS[k]){
    TRAD_TRADUCTEURS[k] = Translator.create({ sourceLanguage: source, targetLanguage: cible })
      .catch(function(e){ delete TRAD_TRADUCTEURS[k]; throw e; });
  }
  return TRAD_TRADUCTEURS[k];
}

/* Langue d'un texte parmi TRAD_LANGUES ; `parDefaut` si inconnue. */
function tradDetecterLangue(texte, parDefaut){
  if(typeof LanguageDetector === 'undefined' || typeof LanguageDetector.create !== 'function') return Promise.resolve(parDefaut);
  if(!TRAD_DETECTEUR){
    TRAD_DETECTEUR = LanguageDetector.create().catch(function(e){ TRAD_DETECTEUR = null; throw e; });
  }
  return TRAD_DETECTEUR.then(function(d){ return d.detect(texte); }).then(function(r){
    var l = r && r[0] && r[0].detectedLanguage;
    return TRAD_LANGUES.indexOf(l) !== -1 ? l : parDefaut;
  }).catch(function(){ return parDefaut; });
}

/* Traduit `texte` vers `cible`. `source` facultative (detectee sinon, 'nl'
   par defaut). Ligne par ligne pour garder la mise en forme. Rejette si la
   traduction interne n'est pas disponible. */
function traduireLocal(texte, cible, source){
  texte = String(texte == null ? '' : texte);
  if(!texte.trim()) return Promise.resolve(texte);
  if(!traductionLocaleDisponible()) return Promise.reject(tradErreurIndisponible());
  var src = source ? Promise.resolve(source) : tradDetecterLangue(texte, 'nl');
  return src.then(function(s){
    if(s === cible) return texte;
    return tradTraducteur(s, cible).then(function(tr){
      return Promise.all(texte.split('\n').map(function(l){ return l.trim() ? tr.translate(l) : Promise.resolve(l); }))
        .then(function(lignes){ return lignes.join('\n'); });
    });
  });
}
