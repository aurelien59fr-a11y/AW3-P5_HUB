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

var LOGBOOK_MOIS_FR = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];
var LOGBOOK_DOW = ['L','M','M','J','V','S','D'];
var LOGBOOK_JOURS_NOMS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];

function logbookIso(y, m, d){
    return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
}

function buildLogbook(){
    var root = document.getElementById('lb-root');
    if(!root) return;

  if(LOGBOOK_ANNEE < 2026) LOGBOOK_ANNEE = 2026; // rien avant LOGBOOK_DATE_DEBUT

  var indicateurs = logbookIndicateursAnnee(LOGBOOK_ANNEE);
    var today = new Date();

  var html = ''
      + '<div class="lb-yearbar">'
      +   '<div class="lb-yearnav">'
      +     '<button id="lb-prev-y"' + (LOGBOOK_ANNEE <= 2026 ? ' disabled' : '') + '>&#8592;</button>'
      +     '<span class="lb-yr">' + LOGBOOK_ANNEE + '</span>'
      +     '<button id="lb-next-y">&#8594;</button>'
      +   '</div>'
      +   '<div class="lb-legend">'
      +     '<span><span class="lb-dot lb-dot-red"></span> absence</span>'
      +     '<span><span class="lb-dot lb-dot-amber"></span> NCP</span>'
      +     '<span><span class="lb-note-mark"></span> note</span>'
      +   '</div>'
      +   '<button id="lb-cmp-toggle" class="lb-cmp-btn' + (LOGBOOK_CMP_MODE ? ' active' : '') + '">Comparer 2 jours</button>'
      + '</div>'
      + '<p class="lb-cmp-hint' + (LOGBOOK_CMP_MODE ? ' show' : '') + '" id="lb-cmp-hint">Mode comparaison actif - clique deux jours pour les mettre cote a cote.</p>'
      + '<div class="lb-months" id="lb-months"></div>';

  root.innerHTML = html;

  var monthsEl = document.getElementById('lb-months');
    for(var m = 0; m < 12; m++){
          var first = new Date(LOGBOOK_ANNEE, m, 1);
          var startDow = (first.getDay() + 6) % 7;
          var nbJours = new Date(LOGBOOK_ANNEE, m + 1, 0).getDate();

      var box = document.createElement('div');
          box.className = 'lb-month';
          var dowRow = '<div class="lb-dowrow">' + LOGBOOK_DOW.map(function(d){ return '<span>' + d + '</span>'; }).join('') + '</div>';
          box.innerHTML = '<h3>' + LOGBOOK_MOIS_FR[m] + '</h3>' + dowRow + '<div class="lb-days"></div>';
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
                            var avantDebut = !logbookApresDebut(dateISO);
                            var ev = indicateurs[dateISO];
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
    if(prevBtn) prevBtn.addEventListener('click', function(){ if(LOGBOOK_ANNEE > 2026){ LOGBOOK_ANNEE--; buildLogbook(); } });
    if(nextBtn) nextBtn.addEventListener('click', function(){ LOGBOOK_ANNEE++; buildLogbook(); });

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
    var d = new Date(dateISO + 'T00:00:00');
    var jn = LOGBOOK_JOURS_NOMS[d.getDay()];
    return jn.charAt(0).toUpperCase() + jn.slice(1) + ' ' + d.getDate() + ' ' + LOGBOOK_MOIS_FR[d.getMonth()].toLowerCase() + ' ' + d.getFullYear();
}

function logbookOverlayHtml(){
    return '<div class="overlay" id="lb-overlay"><div class="panel" id="lb-panel">'
      + '<div class="panel-head"><div><h2 id="lb-panel-date">-</h2><p class="panel-sub" id="lb-panel-week">-</p></div>'
      + '<button class="close" id="lb-close">&times;</button></div>'
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

function logbookPosteCardHtml(resume, debut, fin){
    if(!resume) return '';
    var isAdmin = typeof currentUser !== 'undefined' && currentUser && currentUser.role === 'admin';
    var badges = [];
    if(resume.absences.length) badges.push(logbookBadge('abs', resume.absences.length + ' absence' + (resume.absences.length > 1 ? 's' : '') + ' (' + resume.absences.map(function(a){ return a.n; }).join(', ') + ')'));
    if(resume.ncp.length) badges.push(logbookBadge('ncp', resume.ncp.length + ' NCP'));
    if(resume.arretsDureeTotale) badges.push('<span class="badge arret">arrets : ' + resume.arretsDureeTotale + ' min</span>');
    if(!badges.length) badges.push(logbookBadge('ok', 'RAS'));
    if(resume.ncpSansPostePrecis && resume.ncpSansPostePrecis.length){
          badges.push('<span class="badge ncp" title="Heure non fiable, non rattache a ce poste precis">' + resume.ncpSansPostePrecis.length + ' NCP (jour, heure incertaine)</span>');
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
        var esc = function(x){ return String(x == null ? '' : x).replace(/&/g,'&amp;').replace(/</g,'&lt;'); };
        var lignes = Object.keys(n.valeurs || {}).map(function(k){
              return '<div><span class="lb-sp-k">' + esc(k) + ' :</span> ' + esc(n.valeurs[k]) + '</div>';
        }).join('');
        var quand = (n.date !== resume.date ? n.date.split('-').reverse().slice(0,2).join('/') + ' ' : '') + (n.heure || '');
        return '<div class="note lb-sp-note"><b>' + esc(n.auteur || 'SharePoint') + (quand ? ' - ' + quand : '') + '</b>'
              + '<span class="lb-sp-src">' + esc(n.liste || 'SharePoint') + '</span>'
              + '<div class="lb-note-txt">' + lignes + '</div></div>';
  }).join('');

  var addNoteHtml = isAdmin
      ? '<div class="lb-addnote-wrap">'
          + '<textarea class="lb-addnote-input" placeholder="Ajouter une note / observation..." data-date="' + resume.date + '" data-poste="' + resume.poste + '"></textarea>'
          + '<label class="lb-addphoto">+ photos <input type="file" accept="image/*" multiple class="lb-addnote-files"></label>'
          + '<span class="lb-addnote-count"></span>'
          + '<button class="addnote lb-addnote-btn" data-date="' + resume.date + '" data-poste="' + resume.poste + '">+ ajouter une note</button>'
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
    document.getElementById('lb-panel-week').textContent = 'Semaine ISO ' + getISOWeek(new Date(dateISO + 'T00:00:00'));

  var postes = logbookPostesDuJour(dateISO);
    var body = postes.map(function(p){
          var resume = logbookPosteResume(dateISO, p.poste);
          return logbookPosteCardHtml(resume, p.debut, p.fin);
    }).join('');
    document.getElementById('lb-panel-body').innerHTML = '<div class="postes">' + body + '</div>';

  logbookWireNoteButtons();
    document.getElementById('lb-overlay').classList.add('open');
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
                  btn.disabled = true; btn.textContent = 'Enregistrement...';
                  Promise.all(liste.map(logbookCompresserPhoto)).then(function(photos){
                        return logbookAjouterNote(btn.dataset.date, btn.dataset.poste, texte, photos);
                  }).then(function(){
                        input.value = ''; if(files) files.value = '';
                        if(typeof toast === 'function') toast('Note enregistree', '#10b981');
                  }).catch(function(err){
                        console.error('[Logbook] note', err);
                        if(typeof toast === 'function') toast('Erreur : note non enregistree', '#ef4444');
                  }).then(function(){ btn.disabled = false; btn.textContent = '+ ajouter une note'; });
          });
    });
    document.querySelectorAll('.lb-addnote-files').forEach(function(f){
          f.addEventListener('change', function(){
                var c = f.closest('.lb-addnote-wrap').querySelector('.lb-addnote-count');
                if(c) c.textContent = f.files.length ? (f.files.length + ' photo(s) choisie(s)') : '';
          });
    });
    document.querySelectorAll('#lb-panel .lb-photo').forEach(function(img){
          img.addEventListener('click', function(){ logbookVoirPhoto(img.src); });
    });
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
    document.getElementById('lb-panel-date').textContent = 'Comparaison de 2 jours';
    document.getElementById('lb-panel-week').textContent = 'Semaine ISO ' + getISOWeek(new Date(dateA + 'T00:00:00')) + ' vs ' + getISOWeek(new Date(dateB + 'T00:00:00'));

  var sa = logbookStatsOf(dateA), sb = logbookStatsOf(dateB);
    function col(dateISO, s){
          return '<div><div class="cmp-col-head"><h3>' + logbookDateLabel(dateISO) + '</h3><p>Semaine ISO ' + getISOWeek(new Date(dateISO + 'T00:00:00')) + '</p></div>'
            + '<div class="badges">'
            + '<span class="badge ' + (s.abs ? 'abs' : 'ok') + '">* ' + s.abs + ' absence' + (s.abs > 1 ? 's' : '') + '</span>'
            + '<span class="badge ' + (s.ncp ? 'ncp' : 'ok') + '">* ' + s.ncp + ' NCP</span>'
            + '<span class="badge arret">arrets : ' + s.arret + ' min</span>'
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
      + delta('Absences', sa.abs, sb.abs, '')
      + delta('NCP', sa.ncp, sb.ncp, '')
      + delta('Temps d\'arret', sa.arret, sb.arret, ' min')
      + '</div>';

  document.getElementById('lb-overlay').classList.add('open');
}
