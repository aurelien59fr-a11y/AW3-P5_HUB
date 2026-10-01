/* vues/journal.js — « Journal de securite » (onglet Admin).
   Affiche les 200 dernieres entrees de audit_log : connexions, changements
   de mot de passe, droits modifies, imports, suppressions... Lecture
   reservee a l'admin par les regles Firebase. Les entrees ne peuvent pas
   etre modifiees (regle .validate), seulement ajoutees. */

var JOURNAL_LIMITE = 200;

function journalLibelle(action){
  var cle = 'journal_act_' + String(action || '').replace(/[^a-z_]/gi, '');
  var v = (typeof t === 'function') ? t(cle) : cle;
  return v === cle ? String(action || '?') : v;
}

function journalDate(iso){
  var d = new Date(iso);
  if(isNaN(d.getTime())) return String(iso || '');
  return d.toLocaleString((typeof LANG !== 'undefined' && LANG === 'nl') ? 'nl-BE' : (typeof LANG !== 'undefined' && LANG === 'en') ? 'en-GB' : 'fr-BE',
    { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function journalDetails(d){
  if(!d || typeof d !== 'object') return '';
  return Object.keys(d).map(function(k){
    var v = d[k];
    return k + ' : ' + (typeof v === 'object' ? JSON.stringify(v) : String(v));
  }).join(' · ').slice(0, 300);
}

/* Construit le tableau (entrees deja triees, la plus recente en premier). */
function journalHtml(entrees, filtre){
  filtre = String(filtre || '').toLowerCase();
  var lignes = entrees.filter(function(e){
    if(!filtre) return true;
    return (String(e.par) + ' ' + journalLibelle(e.action) + ' ' + e.action + ' ' + journalDetails(e.details)).toLowerCase().indexOf(filtre) !== -1;
  });
  if(!lignes.length) return '<div class="journal-vide">' + escHtml(t('journal_vide')) + '</div>';
  return '<table class="journal-table"><thead><tr><th>' + escHtml(t('journal_col_date')) + '</th><th>' + escHtml(t('journal_col_qui')) + '</th><th>'
    + escHtml(t('journal_col_action')) + '</th><th>' + escHtml(t('journal_col_details')) + '</th></tr></thead><tbody>'
    + lignes.map(function(e){
        var sensible = /admin|role|acces|droit|supprim|purge|mot_de_passe|email|inactivite/i.test(String(e.action));
        return '<tr' + (sensible ? ' class="journal-sensible"' : '') + '><td>' + escHtml(journalDate(e.at)) + '</td><td>' + escHtml(e.par || '?')
          + '</td><td>' + escHtml(journalLibelle(e.action)) + '</td><td>' + escHtml(journalDetails(e.details)) + '</td></tr>';
      }).join('')
    + '</tbody></table>';
}

var JOURNAL_ENTREES = [];

function chargerJournalSecurite(){
  var zone = document.getElementById('journal-securite');
  if(!zone || !db || !currentUser || currentUser.role !== 'admin') return Promise.resolve();
  zone.innerHTML = '<div class="journal-vide">' + escHtml(t('journal_chargement')) + '</div>';
  return db.ref('audit_log').limitToLast(JOURNAL_LIMITE).once('value').then(function(s){
    var v = s.val() || {};
    JOURNAL_ENTREES = Object.keys(v).map(function(k){ return v[k]; }).filter(Boolean)
      .sort(function(a, b){ return String(b.at).localeCompare(String(a.at)); });
    var f = document.getElementById('journal-filtre');
    zone.innerHTML = journalHtml(JOURNAL_ENTREES, f ? f.value : '');
  }, function(e){
    zone.innerHTML = '<div class="journal-vide">' + escHtml(t('journal_erreur')) + ' ' + escHtml(e && e.message) + '</div>';
  });
}

function filtrerJournalSecurite(){
  var zone = document.getElementById('journal-securite'), f = document.getElementById('journal-filtre');
  if(zone) zone.innerHTML = journalHtml(JOURNAL_ENTREES, f ? f.value : '');
}
