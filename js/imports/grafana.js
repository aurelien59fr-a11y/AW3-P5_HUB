/* imports/grafana.js -- import manuel des arrets Inpak depuis Grafana (copier-coller).
   Extrait de app.js a l'etape 6 du plan Phase 2. Code d'import actuel deplace
   tel quel -- sans automatisation, sans API, sans cron (points 14, 15, 19 du
   prompt initial). */

function openImportArretsModal(){
  document.getElementById('arrets-import-modal').style.display = 'flex';
  document.getElementById('arrets-import-err').textContent = '';
}

function importerArretsInpak(){
  var err = document.getElementById('arrets-import-err');
  err.textContent = '';
  var raw = document.getElementById('arrets-import-txt').value.trim();
  if(!raw){ return echecImport(err, 'Colle le JSON genere par le script.'); }

  var parsed;
  try { parsed = JSON.parse(raw); }
  catch(e){ return echecImport(err, 'JSON invalide : ' + e.message); }

  if(!parsed.avecRaison && !parsed.microstops){
    return echecImport(err, 'Format inattendu (cles "avecRaison"/"microstops" manquantes).');
  }

  var now = new Date().toLocaleString('fr-BE');
  var auteur = currentUser ? currentUser.email : '';
  var entries = [];

  (parsed.avecRaison || []).forEach(function(a){
    if(!a.ligne || !a.date || !a.heure) return;
    var key = ptKey('arret-' + a.ligne, a.date, 'raison', a.heure);
    entries.push([key, { ligne: a.ligne, date: a.date, heure: a.heure, raison: a.raison || '', duree: (a.duree != null ? a.duree : null), type: 'avec_raison', auteur: auteur, ts: Date.now(), importeLe: now }]);
  });
  (parsed.microstops || []).forEach(function(a){
    if(!a.ligne || !a.date || a.nombre == null) return;
    var key = ptKey('arret-' + a.ligne, a.date, 'micro', '00-00');
    entries.push([key, { ligne: a.ligne, date: a.date, nombre: a.nombre, type: 'microstop', auteur: auteur, ts: Date.now(), importeLe: now }]);
  });

  if(!entries.length){ return echecImport(err, 'Aucune ligne valide trouvee dans le JSON.'); }
  if(!db){ return echecImport(err, 'Connexion Firebase non disponible.'); }

  var TAILLE_LOT = 100;
  var lots = [];
  for(var i = 0; i < entries.length; i += TAILLE_LOT) lots.push(entries.slice(i, i + TAILLE_LOT));

  err.style.color = '#3b82f6';
  err.textContent = 'Import en cours… 0 / ' + entries.length;
  var fait = 0;
  var terminer;
  var resultat = new Promise(function(r){ terminer = r; });

  function envoyerLot(idx){
    if(idx >= lots.length){
      document.getElementById('arrets-import-modal').style.display = 'none';
      document.getElementById('arrets-import-txt').value = '';
      err.style.color = '#ef4444';
      err.textContent = '';
      toast(entries.length + ' arret(s) importe(s)', '#10b981');
      journaliser('import_arrets_inpak', { lignes: entries.length });
      terminer(succesImport('Arrets Inpak : ' + entries.length + ' arret(s) importe(s)'));
      return;
    }
    var updates = {};
    lots[idx].forEach(function(e){ updates['arrets_inpak/' + e[0]] = e[1]; });
    db.ref().update(updates).then(function(){
      fait += lots[idx].length;
      err.textContent = 'Import en cours… ' + fait + ' / ' + entries.length;
      envoyerLot(idx + 1);
    }).catch(function(e){
      if(e.message && e.message.indexOf('WRITE_TOO_BIG') !== -1 && lots[idx].length > 5){
        console.warn('[Arrets Inpak] Lot trop gros, decoupe en deux et reessaie...');
        var moitie = Math.ceil(lots[idx].length / 2);
        var lotA = lots[idx].slice(0, moitie);
        var lotB = lots[idx].slice(moitie);
        lots.splice(idx, 1, lotA, lotB);
        envoyerLot(idx);
        return;
      }
      console.error('[Arrets Inpak] Erreur import lot ' + idx + ' :', e);
      err.style.color = '#ef4444';
      err.textContent = 'Erreur Firebase (lot ' + (idx+1) + '/' + lots.length + ') : ' + e.message;
      terminer({ ok: false, message: 'Arrets Inpak : ' + err.textContent + ' (' + fait + ' / ' + entries.length + ' deja ecrits)' });
    });
  }
  envoyerLot(0);
  return resultat;
}

