/* vues/logbook.js -- Domaine "Logbook" (onglet "lb").
   Vue calendrier annuelle eclatee (12 mois) : un point discret marque les
   jours avec absence/NCP a partir du 1er janvier 2026 (LOGBOOK_DATE_DEBUT,
   metier/logbook.js). Clic sur un jour -> panneau avec le detail par poste
   (P1-P5). Mode comparaison : selectionner 2 jours pour les voir cote a cote.
   Toute l'agregation vient de metier/logbook.js -- ce fichier ne fait que
   du rendu et de l'interaction. */

var LOGBOOK_ANNEE = new Date().getFullYear();
var LOGBOOK_CMP_MODE = false;
var LOGBOOK_CMP_PICKED = []; // [{dateISO}]

/* Dates dans la langue de l'interface (fr-BE / nl-BE / en-GB). */
function logbookLocale(){ var l = (typeof LANG !== 'undefined') ? LANG : 'fr'; return l === 'nl' ? 'nl-BE' : (l === 'en' ? 'en-GB' : 'fr-BE'); }
function logbookMois(m){ var s = new Date(2026, m, 1).toLocaleDateString(logbookLocale(), { month: 'long' }); return s.charAt(0).toUpperCase() + s.slice(1); }
function logbookJoursCourts(){
    // lundi -> dimanche, initiale dans la langue courante (L M M J V S D / M D W D V Z Z / M T W T F S S)
    return [5,6,7,8,9,10,11].map(function(d){ return new Date(2026, 0, d).toLocaleDateString(logbookLocale(), { weekday: 'narrow' }).toUpperCase(); });
}
/* Libelle traduit, avec repli si la cle manque. */
function lbT(cle, repli){ var v = (typeof t === 'function') ? t(cle) : cle; return (v === cle && repli !== undefined) ? repli : v; }
function lbPluriel(n, un, plusieurs){ return n + ' ' + (n > 1 ? lbT(plusieurs) : lbT(un)); }

function logbookIso(y, m, d){
    return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
}

function buildLogbook(){
    var root = document.getElementById('lb-root');
    if(!root) return;

  var anneeMin = logbookAnneeMin();
  if(LOGBOOK_ANNEE < anneeMin) LOGBOOK_ANNEE = anneeMin;

  var indicateurs = logbookIndicateursAnnee(LOGBOOK_ANNEE);
    var today = new Date();

  var html = ''
      + '<div class="lb-yearbar">'
      +   '<div class="lb-yearnav">'
      +     '<button id="lb-prev-y" aria-label="' + escHtml(t('a11y_annee_prec')) + '"' + (LOGBOOK_ANNEE <= anneeMin ? ' disabled' : '') + '>&#8592;</button>'
      +     '<span class="lb-yr">' + LOGBOOK_ANNEE + '</span>'
      +     '<button id="lb-next-y" aria-label="' + escHtml(t('a11y_annee_suiv')) + '">&#8594;</button>'
      +   '</div>'
      +   '<div class="lb-legend">'
      +     '<span><span class="lb-dot lb-dot-red"></span> ' + escHtml(lbT('lb_leg_absence')) + '</span>'
      +     '<span><span class="lb-dot lb-dot-amber"></span> NCP</span>'
      +     '<span><span class="lb-note-mark"></span> ' + escHtml(lbT('lb_leg_note')) + '</span>'
      +   '</div>'
      +   '<label class="lb-trad-auto" title="' + escHtml(lbT('lb_trad_auto_aide')) + '"><input type="checkbox" id="lb-trad-auto"' + (logbookTradAuto() ? ' checked' : '') + '> ' + escHtml(lbT('lb_trad_auto')) + '</label>'
      +   '<button id="lb-cmp-toggle" class="lb-cmp-btn' + (LOGBOOK_CMP_MODE ? ' active' : '') + '">' + escHtml(lbT('lb_cmp_btn')) + '</button>'
      + '</div>'
      + '<p class="lb-cmp-hint' + (LOGBOOK_CMP_MODE ? ' show' : '') + '" id="lb-cmp-hint">' + escHtml(lbT('lb_cmp_hint')) + '</p>'
      + '<div class="lb-months" id="lb-months"></div>';

  root.innerHTML = html;

  var monthsEl = document.getElementById('lb-months');
    for(var m = 0; m < 12; m++){
          var first = new Date(LOGBOOK_ANNEE, m, 1);
          var startDow = (first.getDay() + 6) % 7;
          var nbJours = new Date(LOGBOOK_ANNEE, m + 1, 0).getDate();

      var box = document.createElement('div');
          box.className = 'lb-month';
          var dowRow = '<div class="lb-dowrow">' + logbookJoursCourts().map(function(d){ return '<span>' + d + '</span>'; }).join('') + '</div>';
          box.innerHTML = '<h3>' + escHtml(logbookMois(m)) + '</h3>' + dowRow + '<div class="lb-days"></div>';
          monthsEl.appendChild(box);

      var daysEl = box.querySelector('.lb-days');
          for(var i = 0; i < startDow; i++){
                  var empty = document.createElement('div');
                  empty.className = 'lb-day lb-empty';
                  daysEl.appendChild(empty);
          }
          for(var d = 1; d <= nbJours; d++){
                  (function(m, d){
                            var dateISO = logbookIso(LOGBOOK_ANNEE, m, d);
                            var ev = indicateurs[dateISO];
                            var avantDebut = !logbookApresDebut(dateISO) && !(ev && ev.notes);
                            var el = document.createElement('div');
                            el.className = 'lb-day' + (avantDebut ? ' lb-disabled' : ' lb-worked');
                            el.textContent = d;
                            if(ev){
                                        if(ev.abs && ev.ncp) el.classList.add('lb-has-both');
                                        else if(ev.abs) el.classList.add('lb-has-abs');
                                        else if(ev.ncp) el.classList.add('lb-has-ncp');
                                        if(ev.notes) el.classList.add('lb-has-note');
                            }
                            var dateObj = new Date(LOGBOOK_ANNEE, m, d);
                            if(dateObj.toDateString() === today.toDateString()) el.classList.add('lb-today');
                            if(!avantDebut){
                                        el.addEventListener('click', function(){ logbookHandleDayClick(dateISO, el); });
                            }
                            daysEl.appendChild(el);
                  })(m, d);
          }
    }

  var prevBtn = document.getElementById('lb-prev-y');
    var nextBtn = document.getElementById('lb-next-y');
    if(prevBtn) prevBtn.addEventListener('click', function(){ if(LOGBOOK_ANNEE > anneeMin){ LOGBOOK_ANNEE--; buildLogbook(); } });
    if(nextBtn) nextBtn.addEventListener('click', function(){ LOGBOOK_ANNEE++; buildLogbook(); });

  var tradAuto = document.getElementById('lb-trad-auto');
    if(tradAuto) tradAuto.addEventListener('change', function(){ try { localStorage.setItem('lb_trad_auto', tradAuto.checked ? '1' : '0'); } catch(e){} });
    var cmpToggle = document.getElementById('lb-cmp-toggle');
    if(cmpToggle) cmpToggle.addEventListener('click', function(){
          LOGBOOK_CMP_MODE = !LOGBOOK_CMP_MODE;
          LOGBOOK_CMP_PICKED = [];
          buildLogbook();
    });
}

function logbookHandleDayClick(dateISO, el){
    if(!LOGBOOK_CMP_MODE){ logbookOpenDay(dateISO); return; }
    var already = LOGBOOK_CMP_PICKED.indexOf(dateISO);
    if(already !== -1){ LOGBOOK_CMP_PICKED.splice(already, 1); el.classList.remove('lb-cmp-picked'); return; }
    if(LOGBOOK_CMP_PICKED.length === 2){
          LOGBOOK_CMP_PICKED.shift();
          document.querySelectorAll('.lb-day.lb-cmp-picked').forEach(function(x, idx){ if(idx === 0) x.classList.remove('lb-cmp-picked'); });
    }
    el.classList.add('lb-cmp-picked');
    LOGBOOK_CMP_PICKED.push(dateISO);
    if(LOGBOOK_CMP_PICKED.length === 2) logbookOpenCompare(LOGBOOK_CMP_PICKED[0], LOGBOOK_CMP_PICKED[1]);
}

function logbookDateLabel(dateISO){
    var s = new Date(dateISO + 'T12:00:00').toLocaleDateString(logbookLocale(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function logbookSemaine(dateISO){ return lbT('lb_semaine') + ' ' + getISOWeek(new Date(dateISO + 'T00:00:00')); }

function logbookOverlayHtml(){
    return '<div class="overlay" id="lb-overlay"><div class="panel" id="lb-panel">'
      + '<div class="panel-head"><div><h2 id="lb-panel-date">-</h2><p class="panel-sub" id="lb-panel-week">-</p></div>'
      + '<button class="close" id="lb-close" aria-label="' + escHtml(lbT('a11y_fermer')) + '">&times;</button></div>'
      + '<div id="lb-panel-body"></div>'
      + '</div></div>';
}

function logbookEnsureOverlay(){
    if(document.getElementById('lb-overlay')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = logbookOverlayHtml();
    document.body.appendChild(wrap.firstChild);
    document.getElementById('lb-close').addEventListener('click', logbookCloseOverlay);
    document.getElementById('lb-overlay').addEventListener('click', function(e){
          if(e.target.id === 'lb-overlay') logbookCloseOverlay(); }); document.addEventListener('keydown', function(e){ if(e.key === 'Escape') logbookCloseOverlay();
    });
}

function logbookCloseOverlay(){
    var ov = document.getElementById('lb-overlay');
    if(ov) ov.classList.remove('open');
}

function logbookBadge(cls, texte){
    return '<span class="badge ' + cls + '">* ' + texte + '</span>';
}

/* ---------- Notes SharePoint : champs affiches + traduction ---------- */
var LOGBOOK_SP_INDEX = {};
var LOGBOOK_SP_MASQUES = ['ID', 'Ploeg', 'Balise de couleur', 'Tag', 'Datum'];
// Delegue a escHtml (core/ui.js) : logbookEsc sert aussi dans des attributs (href, data-*).
function logbookEsc(x){ return escHtml(x); }
function logbookSpChamps(n){
    var out = {};
    Object.keys(n.valeurs || {}).forEach(function(k){
          if(LOGBOOK_SP_MASQUES.indexOf(k) !== -1 || /^Datum\s*\(/.test(k)) return;
          var v = logbookNettoyer(n.valeurs[k]);
          if(v !== '') out[k] = v;
    });
    return out;
}
/* Mise en forme lisible d'une note SharePoint :
   - champs courts (Afgehandeld, Operator...) -> petites etiquettes en ligne
   - champs longs -> bloc titre + texte, une ligne par horodatage
     ("*14u28 ...", "05h45: ...") pour que le deroule du poste se lise
     comme une chronologie, et repli au-dela de ~8 lignes. */
function logbookSpDecouper(v){
    return String(v)
          .replace(/\s*\*\s*(?=\d{1,2}\s*[uUhH:.]\s*\d{2})/g, '\n')
          .replace(/([^\n])\s*(?=\b\d{1,2}[hHuU]\d{2}\s*[:\-])/g, '$1\n')
          .split('\n').map(function(l){ return l.trim(); }).filter(Boolean);
}
function logbookSpLignesHtml(champs, langue){
    langue = langue || logbookLangueAffichage();
    var courts = [], longs = [];
    Object.keys(champs).forEach(function(k){
          var v = String(champs[k]);
          (v.length <= 45 && v.indexOf('\n') === -1 ? courts : longs).push(k);
    });
    var html = '';
    if(courts.length){
          html += '<div class="lb-sp-meta">' + courts.map(function(k){
                return '<span class="lb-sp-chip"><span class="lb-sp-k">' + logbookEsc(logbookSpLibelle(k, langue)) + '</span> ' + logbookEsc(champs[k]) + '</span>';
          }).join('') + '</div>';
    }
    longs.forEach(function(k){
          var lignes = logbookSpDecouper(champs[k]);
          var corps = lignes.map(function(l){
                var m = l.match(/^(\d{1,2}\s*[uUhH:.]\s*\d{2})\s*(?::|-\s)?\s*(.*)$/);
                return m ? '<div class="lb-sp-ligne"><span class="lb-sp-h">' + logbookEsc(m[1].replace(/\s/g, '')) + '</span><span>' + logbookEsc(m[2]) + '</span></div>'
                         : '<div class="lb-sp-ligne"><span></span><span>' + logbookEsc(l) + '</span></div>';
          }).join('');
          var long = lignes.length > 8 || String(champs[k]).length > 700;
          html += '<div class="lb-sp-bloc' + (long ? ' lb-sp-replie' : '') + '"><div class="lb-sp-titre">' + logbookEsc(logbookSpLibelle(k, langue)) + '</div>'
                + '<div class="lb-sp-corps">' + corps + '</div>'
                + (long ? '<button class="lb-sp-plus" data-plus="' + logbookEsc(lbT('lb_lire_suite')) + '" data-moins="' + logbookEsc(lbT('lb_replier')) + '" onclick="this.parentNode.classList.toggle(\'lb-sp-replie\');this.textContent=this.parentNode.classList.contains(\'lb-sp-replie\')?this.dataset.plus:this.dataset.moins">' + logbookEsc(lbT('lb_lire_suite')) + '</button>' : '')
                + '</div>';
    });
    return html;
}
// Champs a ne pas traduire : noms de personnes.
var LOGBOOK_SP_NON_TRAD = ['Ploegchef', 'Operator productie', 'Title', 'Titre'];

/* Libelles des colonnes SharePoint : traduction FIXE (pas de traduction
   automatique, toujours juste et instantanee). Colonne inconnue -> nom
   d'origine. */
var LOGBOOK_SP_LIBELLES = {
    'Gebeurtenissen':                { fr: 'Evenements',                       nl: 'Gebeurtenissen',                en: 'Events' },
    'Ploegchef':                     { fr: "Chef d'equipe",                    nl: 'Ploegchef',                     en: 'Shift leader' },
    'Productie proces':              { fr: 'Processus de production',          nl: 'Productieproces',               en: 'Production process' },
    'Operator productie':            { fr: 'Operateur production',             nl: 'Operator productie',            en: 'Production operator' },
    'Andere':                        { fr: 'Autres',                           nl: 'Andere',                        en: 'Other' },
    'Technische storingen':          { fr: 'Pannes techniques',                nl: 'Technische storingen',          en: 'Technical failures' },
    'Afgehandeld':                   { fr: 'Traite',                           nl: 'Afgehandeld',                   en: 'Handled' },
    'Controle materiaalkast':        { fr: 'Controle armoire a materiel',      nl: 'Controle materiaalkast',        en: 'Equipment cabinet check' },
    'Vragen voor proces ingenieur?': { fr: "Questions pour l'ingenieur process", nl: 'Vragen voor procesingenieur?', en: 'Questions for the process engineer?' },
    'Title':                         { fr: 'Titre',                            nl: 'Titel',                         en: 'Title' },
    'Titre':                         { fr: 'Titre',                            nl: 'Titel',                         en: 'Title' }
};
function logbookSpLibelle(k, langue){
    var e = LOGBOOK_SP_LIBELLES[k];
    return e ? (e[langue] || k) : k;
}

// Reponses courtes des listes de choix (trop courtes pour le traducteur).
var LOGBOOK_SP_COURTS = {
    'ja': { fr: 'Oui', nl: 'Ja', en: 'Yes' }, 'oui': { fr: 'Oui', nl: 'Ja', en: 'Yes' }, 'yes': { fr: 'Oui', nl: 'Ja', en: 'Yes' },
    'nee': { fr: 'Non', nl: 'Nee', en: 'No' }, 'non': { fr: 'Non', nl: 'Nee', en: 'No' }, 'no': { fr: 'Non', nl: 'Nee', en: 'No' },
    'ok': { fr: 'OK', nl: 'OK', en: 'OK' }, 'niet ok': { fr: 'Pas OK', nl: 'Niet OK', en: 'Not OK' }, 'pas ok': { fr: 'Pas OK', nl: 'Niet OK', en: 'Not OK' },
    'nok': { fr: 'Pas OK', nl: 'Niet OK', en: 'Not OK' },
    'andere': { fr: 'Autre', nl: 'Andere', en: 'Other' }, 'autre': { fr: 'Autre', nl: 'Andere', en: 'Other' },
    'reiniging': { fr: 'Nettoyage', nl: 'Reiniging', en: 'Cleaning' }, 'nettoyage': { fr: 'Nettoyage', nl: 'Reiniging', en: 'Cleaning' },
    'cip': { fr: 'CIP', nl: 'CIP', en: 'CIP' }
};

/* Abreviations et fautes frequentes des notes, developpees AVANT traduction
   (le traducteur ne les connait pas). Uniquement des formes sures. */
var LOGBOOK_NL_ABREV = [
    [/\bTD\b/g, 'technische dienst'],
    [/\bivm\b/gi, 'in verband met'],
    [/\bmbt\b/gi, 'met betrekking tot'],
    [/\btss\b/gi, 'tussen'],
    [/\bkapoet\b/gi, 'kapot'],
    [/\bmom\.?(?=\s)/gi, 'momenteel']
];

/* Traduction INTERNE (core/traduction.js : API Translator du navigateur,
   rien ne sort du PC). Ameliorations par rapport a la premiere version :
   - chaque ligne de la chronologie est traduite seule, l'heure ("14u28",
     "05h45") est mise de cote puis remise telle quelle (elle etait abimee :
     "09u25" devenait "09: 25h") ;
   - les morceaux separes par "->" sont traduits separement ;
   - la langue est detectee LIGNE PAR LIGNE (les notes melangent FR, NL, EN) :
     une ligne deja dans la langue voulue n'est pas touchee ;
   - libelles de colonnes : dictionnaire fixe ;
   - caracteres invisibles (U+200B) retires.
   Resultat garde dans sharepoint_trad3/<liste>/<id>/<langue> (admin) : une
   note n'est traduite qu'une fois. */
var LOGBOOK_TRAD_VERSION = 'sharepoint_trad3';
var LOGBOOK_RX_HEURE = /^(\d{1,2}\s*[uUhH:.]\s*\d{2}\s*(?:[uUhH])?)\s*(?::|-\s)?\s*(.*)$/;

function logbookNettoyer(v){ return String(v == null ? '' : v).replace(/[\u200B-\u200D\uFEFF]/g, '').trim(); }
function logbookPrepNl(txt){ var r = txt; LOGBOOK_NL_ABREV.forEach(function(x){ r = r.replace(x[0], x[1]); }); return r; }

/* Traduit un morceau de phrase (sans heure). */
function logbookTraduireMorceau(m, dst){
    var brut = m.trim();
    if(!brut) return Promise.resolve(m);
    var court = LOGBOOK_SP_COURTS[brut.toLowerCase()];
    if(court) return Promise.resolve(court[dst] || brut);
    // Trop court ou sans mots (codes, numeros d'article, "OK", "L31") : tel quel.
    if(brut.replace(/[^A-Za-zÀ-ÿ]/g, '').length < 4) return Promise.resolve(m);
    return tradDetecterLangue(brut, 'nl').then(function(src){
        if(src === dst) return brut;
        var entree = (src === 'nl') ? logbookPrepNl(brut) : brut;
        return tradTraducteur(src, dst).then(function(tr){ return tr.translate(entree); });
    });
}
/* Traduit une ligne : heure conservee, morceaux "->" traduits a part. */
function logbookTraduireLigne(ligne, dst){
    var m = ligne.match(LOGBOOK_RX_HEURE), heure = '', corps = ligne;
    if(m){ heure = m[1].replace(/\s/g, ''); corps = m[2]; }
    var morceaux = corps.split(/\s*-+>\s*/);
    return Promise.all(morceaux.map(function(x){ return logbookTraduireMorceau(x, dst); })).then(function(tr){
        var txt = tr.join(' → ');
        return heure ? heure + ' ' + txt : txt;
    });
}
function logbookTraduireValeur(v, dst){
    var lignes = logbookSpDecouper(v);
    // Sequentiel : le modele local traite une phrase a la fois, inutile de l'engorger.
    return lignes.reduce(function(p, l){
        return p.then(function(acc){ return logbookTraduireLigne(l, dst).then(function(x){ acc.push(x); return acc; }); });
    }, Promise.resolve([])).then(function(acc){ return acc.join('\n'); });
}
function logbookTraduireNote(n, dst){
    var chemin = LOGBOOK_TRAD_VERSION + '/' + n.cle + '/' + n.id + '/' + dst;
    return db.ref(chemin).once('value').then(function(s){
          if(s.val()) return s.val();
          if(!traductionLocaleDisponible()) throw tradErreurIndisponible();
          var champs = logbookSpChamps(n), res = {};
          return Object.keys(champs).reduce(function(p, k){
                return p.then(function(){
                      var v = champs[k];
                      var valeur = (LOGBOOK_SP_NON_TRAD.indexOf(k) !== -1) ? Promise.resolve(v) : logbookTraduireValeur(v, dst);
                      return valeur.then(function(x){ res[k] = x; });
                });
          }, Promise.resolve()).then(function(){
                // Les cles restent les noms de colonnes d'origine ; le libelle est traduit a l'affichage.
                return db.ref(chemin).set(res).then(function(){ return res; }, function(){ return res; });
          });
    });
}

/* Traduction automatique des notes dans la langue de l'interface
   (case a cocher du logbook, memorisee sur ce PC ; active par defaut). */
function logbookTradAuto(){
    try { return localStorage.getItem('lb_trad_auto') !== '0'; } catch(e){ return true; }
}
function logbookLangueAffichage(){ return (typeof LANG !== 'undefined' && LANG) ? LANG : 'fr'; }

function logbookPosteCardHtml(resume, debut, fin){
    if(!resume) return '';
    var isAdmin = typeof currentUser !== 'undefined' && currentUser && currentUser.role === 'admin';
    var badges = [];
    if(resume.absences.length) badges.push(logbookBadge('abs', lbPluriel(resume.absences.length, 'lb_absence', 'lb_absences') + ' (' + resume.absences.map(function(a){ return escHtml(a.n); }).join(', ') + ')'));
    if(resume.ncp.length) badges.push(logbookBadge('ncp', resume.ncp.length + ' NCP'));
    if(resume.arretsDureeTotale) badges.push('<span class="badge arret">' + escHtml(lbT('lb_arrets')) + ' : ' + resume.arretsDureeTotale + ' min</span>');
    if(!badges.length) badges.push(logbookBadge('ok', escHtml(lbT('lb_ras'))));
    if(resume.ncpSansPostePrecis && resume.ncpSansPostePrecis.length){
          badges.push('<span class="badge ncp" title="' + escHtml(lbT('lb_ncp_incertain_aide')) + '">' + resume.ncpSansPostePrecis.length + ' NCP (' + escHtml(lbT('lb_ncp_incertain')) + ')</span>');
    }

  var notesHtml = resume.notes.map(function(n){
        var dt = new Date(n.horodatage_saisie);
        var dtTxt = isNaN(dt.getTime()) ? '' : (' - ' + String(dt.getDate()).padStart(2,'0') + '/' + String(dt.getMonth()+1).padStart(2,'0'));
        var photosHtml = (n.photos || []).map(function(src, i){
              return '<img class="lb-photo" src="' + src + '" alt="Photo ' + (i + 1) + '" data-note="' + n.id + '" data-idx="' + i + '">';
        }).join('');
        return '<div class="note"><b>' + String(n.auteur || 'admin').replace(/</g,'&lt;') + dtTxt + '</b>'
              + (n.texte ? '<div class="lb-note-txt">' + String(n.texte).replace(/</g,'&lt;') + '</div>' : '')
              + (photosHtml ? '<div class="lb-photos">' + photosHtml + '</div>' : '')
              + '</div>';
  }).join('');

  var spHtml = (resume.notesSP || []).map(function(n){
        var esc = logbookEsc;
        LOGBOOK_SP_INDEX[n.cle + '/' + n.id] = n;
        var lignes = logbookSpLignesHtml(logbookSpChamps(n));
        var quand = (n.date !== resume.date ? n.date.split('-').reverse().slice(0,2).join('/') + ' ' : '') + (n.heure || '');
        var fichiers = (n.fichiers || []).map(function(f){
              return '<a class="lb-sp-fichier" href="' + safeUrl(f.url) + '" target="_blank" rel="noopener">' + esc(f.nom) + '</a>';
        }).join(' ');
        var photos = n.nbPhotos ? '<button class="lb-sp-photos-btn" data-cle="' + esc(n.cle) + '" data-id="' + esc(n.id) + '">' + esc(lbT('lb_voir')) + ' ' + esc(lbPluriel(n.nbPhotos, 'lb_photo', 'lb_photos')) + '</button><div class="lb-photos"></div>' : '';
        return '<div class="note lb-sp-note"><b>' + esc(n.auteur || 'SharePoint') + (quand ? ' - ' + quand : '') + (n.ploeg ? ' - ' + esc(n.ploeg) : '') + '</b>'
              + '<span class="lb-sp-src">' + esc(n.liste || 'SharePoint') + '</span>'
              + '<div class="lb-sp-trad" data-k="' + esc(n.cle + '/' + n.id) + '">'
              +   '<button data-l="orig" class="on">' + esc(lbT('lb_original')) + '</button><button data-l="fr">FR</button><button data-l="nl">NL</button><button data-l="en">EN</button>'
              +   '<span class="lb-sp-trad-etat"></span></div>'
              + '<div class="lb-note-txt">' + lignes + '</div>'
              + (fichiers ? '<div class="lb-sp-fichiers">' + fichiers + '</div>' : '')
              + photos + '</div>';
  }).join('');

  var addNoteHtml = isAdmin
      ? '<div class="lb-addnote-wrap">'
          + '<textarea class="lb-addnote-input" aria-label="' + escHtml(lbT('lb_note_ph')) + '" placeholder="' + escHtml(lbT('lb_note_ph')) + '" data-date="' + resume.date + '" data-poste="' + resume.poste + '"></textarea>'
          + '<label class="lb-addphoto">+ ' + escHtml(lbT('lb_photos')) + ' <input type="file" accept="image/*" multiple class="lb-addnote-files"></label>'
          + '<span class="lb-addnote-count"></span>'
          + '<button class="addnote lb-addnote-btn" data-date="' + resume.date + '" data-poste="' + resume.poste + '">+ ' + escHtml(lbT('lb_ajouter_note')) + '</button>'
          + '</div>'
        : '';

  return '<div class="poste">'
      + '<div class="poste-head"><span class="poste-tag">' + resume.poste + '</span><span class="poste-heure">' + debut + '-' + fin + '</span></div>'
      + '<div class="badges">' + badges.join('') + '</div>'
      + spHtml
      + notesHtml
      + addNoteHtml
      + '</div>';
}

function logbookOpenDay(dateISO){
    logbookEnsureOverlay();
    document.getElementById('lb-panel').classList.remove('cmp-panel');
    document.getElementById('lb-panel-date').textContent = logbookDateLabel(dateISO);
    document.getElementById('lb-panel-week').textContent = logbookSemaine(dateISO);

  var postes = logbookPostesDuJour(dateISO);
    var body = postes.map(function(p){
          var resume = logbookPosteResume(dateISO, p.poste);
          return logbookPosteCardHtml(resume, p.debut, p.fin);
    }).join('');
    document.getElementById('lb-panel-body').innerHTML = '<div class="postes">' + body + '</div>';
    document.getElementById('lb-panel').classList.toggle('lb-wide', body.indexOf('lb-sp-note') !== -1);

  logbookWireNoteButtons();
    document.getElementById('lb-overlay').classList.add('open');
    logbookTraduireJourAuto();
}

function logbookWireNoteButtons(){
    document.querySelectorAll('.lb-addnote-btn').forEach(function(btn){
          btn.addEventListener('click', function(){
                  var wrap = btn.closest('.lb-addnote-wrap');
                  var input = wrap.querySelector('.lb-addnote-input');
                  var files = wrap.querySelector('.lb-addnote-files');
                  var texte = input.value.trim();
                  var liste = files ? Array.prototype.slice.call(files.files || []) : [];
                  if(!texte && !liste.length) return;
                  btn.disabled = true; btn.textContent = lbT('lb_enregistrement');
                  Promise.all(liste.map(logbookCompresserPhoto)).then(function(photos){
                        return logbookAjouterNote(btn.dataset.date, btn.dataset.poste, texte, photos);
                  }).then(function(){
                        input.value = ''; if(files) files.value = '';
                        if(typeof toast === 'function') toast(lbT('lb_note_ok'), '#10b981');
                  }).catch(function(err){
                        console.error('[Logbook] note', err);
                        if(typeof toast === 'function') toast(lbT('lb_note_erreur'), '#ef4444');
                  }).then(function(){ btn.disabled = false; btn.textContent = '+ ' + lbT('lb_ajouter_note'); });
          });
    });
    document.querySelectorAll('.lb-addnote-files').forEach(function(f){
          f.addEventListener('change', function(){
                var c = f.closest('.lb-addnote-wrap').querySelector('.lb-addnote-count');
                if(c) c.textContent = f.files.length ? (f.files.length + ' ' + lbT('lb_photos_choisies')) : '';
          });
    });
    // Photos SharePoint : chargees a la demande (elles sont stockees a part).
    document.querySelectorAll('#lb-panel .lb-sp-photos-btn').forEach(function(b){
          b.addEventListener('click', function(){
                var box = b.nextElementSibling;
                b.disabled = true; b.textContent = lbT('lb_chargement');
                db.ref('sharepoint_photos/' + b.dataset.cle + '/' + b.dataset.id).once('value').then(function(s){
                      var liste = s.val() || [];
                      if(!Array.isArray(liste)) liste = Object.keys(liste).map(function(k){ return liste[k]; });
                      box.innerHTML = liste.length ? liste.map(function(src){ return '<img class="lb-photo" src="' + src + '" alt="Photo">'; }).join('') : '<span style="font-size:11px;color:var(--tx3)">' + escHtml(lbT('lb_photos_absentes')) + '</span>';
                      box.querySelectorAll('.lb-photo').forEach(function(img){ img.addEventListener('click', function(){ logbookVoirPhoto(img.src); }); });
                      b.style.display = 'none';
                }).catch(function(e){ b.disabled = false; b.textContent = lbT('lb_reessayer'); console.error(e); });
          });
    });
    document.querySelectorAll('#lb-panel .lb-sp-trad button').forEach(function(b){
          b.addEventListener('click', function(){ logbookAfficherNote(b.parentNode, b.dataset.l); });
    });
    document.querySelectorAll('#lb-panel .lb-photo').forEach(function(img){
          img.addEventListener('click', function(){ logbookVoirPhoto(img.src); });
    });
}

/* Affiche une note SharePoint dans la langue demandee ('orig' = texte d'origine). */
function logbookAfficherNote(barre, langue){
    var n = LOGBOOK_SP_INDEX[barre.dataset.k];
    var txt = barre.nextElementSibling, etat = barre.querySelector('.lb-sp-trad-etat');
    if(!n) return Promise.resolve();
    barre.querySelectorAll('button').forEach(function(x){ x.classList.toggle('on', x.dataset.l === langue); });
    if(langue === 'orig'){ txt.innerHTML = logbookSpLignesHtml(logbookSpChamps(n)); etat.textContent = ''; return Promise.resolve(); }
    etat.textContent = lbT('lb_traduction_en_cours');
    // Lance tout de suite (pendant le clic) le telechargement des modeles :
    // le navigateur l'exige au premier usage.
    try { if(traductionLocaleDisponible()) ['fr','nl','en'].forEach(function(src){ if(src !== langue) tradTraducteur(src, langue).catch(function(){}); }); } catch(e){}
    return logbookTraduireNote(n, langue).then(function(res){
          if(barre.querySelector('button.on') && barre.querySelector('button.on').dataset.l !== langue) return; // l'utilisateur a change d'avis
          txt.innerHTML = logbookSpLignesHtml(res, langue); etat.textContent = '';
    }).catch(function(e){
          console.error('[Logbook] traduction', e);
          barre.querySelectorAll('button').forEach(function(x){ x.classList.toggle('on', x.dataset.l === 'orig'); });
          etat.textContent = /create translator|download|user activation/i.test((e && e.message) || '')
                ? lbT('lb_trad_premiere')
                : ((e && e.message) || lbT('lb_trad_erreur'));
    });
}
/* A l'ouverture d'un jour : notes traduites dans la langue de l'interface si
   la case « traduire automatiquement » est cochee. Une note a la fois. */
function logbookTraduireJourAuto(){
    if(!logbookTradAuto() || !traductionLocaleDisponible()) return;
    var langue = logbookLangueAffichage();
    var barres = [].slice.call(document.querySelectorAll('#lb-panel .lb-sp-trad'));
    barres.reduce(function(p, barre){ return p.then(function(){ return logbookAfficherNote(barre, langue); }); }, Promise.resolve());
}

/* Visionneuse plein ecran d'une photo de note (clic ou Echap pour fermer). */
function logbookVoirPhoto(src){
    var v = document.getElementById('lb-photo-viewer');
    if(!v){
          v = document.createElement('div');
          v.id = 'lb-photo-viewer';
          v.innerHTML = '<img alt="Photo">';
          v.addEventListener('click', function(){ v.classList.remove('open'); });
          document.addEventListener('keydown', function(e){ if(e.key === 'Escape') v.classList.remove('open'); }, true);
          document.body.appendChild(v);
    }
    v.querySelector('img').src = src;
    v.classList.add('open');
}

function logbookStatsOf(dateISO){
    var postes = logbookPostesDuJour(dateISO);
    var totalAbs = 0, totalNcp = 0, totalArret = 0;
    postes.forEach(function(p){
          var r = logbookPosteResume(dateISO, p.poste);
          if(!r) return;
          totalAbs += r.absences.length;
          totalNcp += r.ncp.length;
          totalArret += r.arretsDureeTotale;
    });
    return { abs: totalAbs, ncp: totalNcp, arret: totalArret };
}

function logbookOpenCompare(dateA, dateB){
    logbookEnsureOverlay();
    document.getElementById('lb-panel').classList.add('cmp-panel');
    document.getElementById('lb-panel-date').textContent = lbT('lb_cmp_titre');
    document.getElementById('lb-panel-week').textContent = logbookSemaine(dateA) + ' / ' + logbookSemaine(dateB);

  var sa = logbookStatsOf(dateA), sb = logbookStatsOf(dateB);
    function col(dateISO, s){
          return '<div><div class="cmp-col-head"><h3>' + escHtml(logbookDateLabel(dateISO)) + '</h3><p>' + escHtml(logbookSemaine(dateISO)) + '</p></div>'
            + '<div class="badges">'
            + '<span class="badge ' + (s.abs ? 'abs' : 'ok') + '">* ' + escHtml(lbPluriel(s.abs, 'lb_absence', 'lb_absences')) + '</span>'
            + '<span class="badge ' + (s.ncp ? 'ncp' : 'ok') + '">* ' + s.ncp + ' NCP</span>'
            + '<span class="badge arret">' + escHtml(lbT('lb_arrets')) + ' : ' + s.arret + ' min</span>'
            + '</div></div>';
    }
    function delta(label, va, vb, unite){
          var dd = vb - va;
          var cls = dd > 0 ? 'up' : (dd < 0 ? 'down' : '');
          var signe = dd > 0 ? '+' : '';
          return '<div>' + label + ' : <b>' + va + unite + '</b> -&gt; <b>' + vb + unite + '</b> <span class="' + cls + '">(' + signe + dd + unite + ')</span></div>';
    }

  document.getElementById('lb-panel-body').innerHTML =
        '<div class="cmp-cols">' + col(dateA, sa) + col(dateB, sb) + '</div>'
      + '<div class="cmp-delta">'
      + delta(escHtml(lbT('lb_absences_titre')), sa.abs, sb.abs, '')
      + delta('NCP', sa.ncp, sb.ncp, '')
      + delta(escHtml(lbT('lb_temps_arret')), sa.arret, sb.arret, ' min')
      + '</div>';

  document.getElementById('lb-overlay').classList.add('open');
}
