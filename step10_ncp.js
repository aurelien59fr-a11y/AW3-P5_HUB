/* imports/ncp.js -- import manuel de fiches NCP depuis un export externe
   (copier-coller). Extrait de app.js a l'Etape 10 du plan Phase 2 (differe
   depuis l'Etape 7). Code d'import actuel deplace tel quel -- sans
   automatisation, sans API, sans cron (points 14, 15, 19 du prompt initial). */

function openImportNCPModal(){
  document.getElementById('ncp-import-modal').style.display = 'flex';
}

   function importerNCP(){
  var txt = document.getElementById('ncp-import-txt').value.trim();
  var errEl = document.getElementById('ncp-import-err');
  errEl.textContent = '';
  if(!txt){ errEl.textContent = 'Colle le JSON avant d\'importer.'; return; }
  var arr;
  try {
    arr = JSON.parse(txt);
    if(!Array.isArray(arr)) throw new Error('Le JSON doit etre un tableau (liste de NCP).');
  } catch(e){
    errEl.textContent = 'JSON invalide : ' + e.message;
    return;
  }
  // Deduplication par numero de notification : si le meme NCP apparait
  // plusieurs fois (ex: exports qui se chevauchent), on garde la version
  // la plus complete (le plus de versions/historique), pas juste la derniere.
  var parNotif = {};
  var doublonsTrouves = 0;
  var sansNotification = 0;
  arr.forEach(function(r){
    var notif = r.notification;
    if(!notif){ sansNotification++; return; }
    if(parNotif[notif]){
      doublonsTrouves++;
      var existant = parNotif[notif];
      var existantScore = existant.nb_versions || 1;
      var nouveauScore = r.nb_versions || 1;
      if(nouveauScore >= existantScore) parNotif[notif] = r;
    } else {
      parNotif[notif] = r;
    }
  });

  // GARDE-FOU 1 : ce fichier n'a pas l'air d'etre des notifications NCP du
  // tout (aucune entree n'a de champ "notification", ex: fichier degustations
  // Mendix colle par erreur ici). On bloque plutot que d'ecraser avec du vide.
  if(Object.keys(parNotif).length === 0){
    errEl.textContent = 'Aucune entree valide trouvee (champ "notification" absent partout, ' + sansNotification + ' ligne(s) ignoree(s)). Ce n\'est probablement pas le bon fichier pour cet import -- rien n\'a ete modifie.';
    return;
  }

  var obj = {};
  Object.keys(parNotif).forEach(function(notif){
    var key = notif.toString().replace(/[.#$/\[\]]/g, '_');
    obj[key] = parNotif[notif];
  });
  if(!db){ errEl.textContent = 'Pas de connexion Firebase.'; return; }

  // IMPORT FUSIONNE (non destructeur) : on ne remplace plus jamais tout le
  // noeud ncp_data d'un coup. On relit l'existant, on fusionne champ par
  // champ par-dessus chaque fiche deja en base, et les NCP absents de ce
  // fichier restent totalement intouches (equipe_override, corrections
  // manuelles, etc. sont preserves). Le champ type_ncp (deja corrige
  // manuellement par le passe sur plusieurs centaines de fiches) n'est
  // jamais ecrase silencieusement s'il differe : on le protege et on
  // liste les conflits pour verification avant d'ecrire.
  db.ref('ncp_data').once('value').then(function(snap){
    var actuel = snap.val() || {};
    var delta = {};
    var conflitsTypeNcp = [];
    var nouveauxNotifs = 0;
    var majNotifs = 0;
    Object.keys(obj).forEach(function(key){
      var existant = actuel[key];
      var importe = obj[key];
      if(!existant){
        delta[key] = importe;
        nouveauxNotifs++;
        return;
      }
      // Fusion NON destructive : l'import complete, il n'efface jamais. Une valeur
      // vide / nulle / tableau vide dans le fichier importe ne peut pas ecraser une
      // valeur deja presente en base (ex: unite ou ligne vides dans un export brut).
      // Les champs absents de l'import (equipe_override, de_cote, degustationsLiees...)
      // sont conserves d'office puisquon part d'une copie de l'existant.
      var fusion = Object.assign({}, existant);
      Object.keys(importe).forEach(function(champ){
        var v = importe[champ];
        if(v === undefined || v === null || v === '') return;
        if(Array.isArray(v) && v.length === 0) return;
        fusion[champ] = v;
      });
      if(existant.type_ncp && importe.type_ncp && existant.type_ncp !== importe.type_ncp){
        fusion.type_ncp = existant.type_ncp; // on garde la valeur corrigee/existante en base
        conflitsTypeNcp.push(importe.notification + ' (garde "' + existant.type_ncp + '", import proposait "' + importe.type_ncp + '")');
      }
      delta[key] = fusion;
      majNotifs++;
    });

    function ecrire(){
      var updates = {};
      Object.keys(delta).forEach(function(key){ updates['ncp_data/' + key] = delta[key]; });
      db.ref().update(updates).then(function(){
        document.getElementById('ncp-import-modal').style.display = 'none';
        document.getElementById('ncp-import-txt').value = '';
        var msg = nouveauxNotifs + ' nouveau(x), ' + majNotifs + ' mis a jour';
        if(doublonsTrouves > 0) msg += ' (' + doublonsTrouves + ' doublons fusionnes)';
        if(sansNotification > 0) msg += ' (' + sansNotification + ' ligne(s) ignoree(s), sans numero de notification)';
        if(conflitsTypeNcp.length > 0) msg += ' -- ' + conflitsTypeNcp.length + ' conflit(s) type_ncp conserve(s) tel quel';
        toast(msg, '#10b981');
        if(conflitsTypeNcp.length > 0){
          console.warn('Conflits type_ncp non ecrases lors de l\'import :', conflitsTypeNcp);
        }
      }).catch(function(err){
        errEl.textContent = 'Erreur Firebase : ' + err.message;
      });
    }

    if(conflitsTypeNcp.length > 0){
      var ok = confirm(
        conflitsTypeNcp.length + ' NCP ont un type_ncp different entre la base actuelle et ce fichier importe.\n'
        + 'La valeur DEJA EN BASE sera conservee pour ces fiches (pas d\'ecrasement automatique) :\n\n'
        + conflitsTypeNcp.slice(0, 15).join('\n')
        + (conflitsTypeNcp.length > 15 ? '\n... (' + (conflitsTypeNcp.length - 15) + ' de plus, voir la console)' : '')
        + '\n\nContinuer l\'import (le reste des champs sera quand meme mis a jour) ?'
      );
      if(!ok){ errEl.textContent = 'Import annule -- aucune donnee modifiee.'; return; }
    }
    ecrire();
  }).catch(function(err){
    errEl.textContent = 'Erreur lecture Firebase : ' + err.message;
  });
}
