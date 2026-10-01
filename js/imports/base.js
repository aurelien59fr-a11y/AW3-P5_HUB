/* imports/base.js -- utilitaires communs aux imports manuels (Grafana, Protime, NCP).
   Extrait de app.js a l'Etape 10 du plan Phase 2. Doit se charger avant les
   autres fichiers imports/*.js qui appellent ptKey(). */

function ptKey(nom, date, type, heure){
  return (nom + '_' + date + '_' + type + '_' + heure)
    .replace(/[.#$\/\[\]\s]/g, '-');
}

/* ---- Import global (Admin) --------------------------------------------
   Point d'entree unique pour coller le JSON produit par n'importe lequel
   des scripts d'extraction externes (Grafana Arrets Inpak, Grafana Bulk &
   Bijlijn, Protime/Pointages, NCP), format standardise en enveloppes
   {source, extraitLe, data}. Ne reimplemente AUCUNE logique d'import :
   se contente de reconnaitre la source de chaque enveloppe et d'appeler
   la fonction d'import existante correspondante (importerArretsInpak(),
   importerBulk(), importerPointages(), importerNCP()), exactement comme
   si le JSON avait ete colle a la main dans son propre onglet -- les
   boutons "Importer" de chaque onglet restent d'ailleurs en place et
   fonctionnent exactement comme avant, Import global est juste un point
   d'entree supplementaire qui les appelle a distance.
   Le tableau peut contenir plusieurs enveloppes de sources differentes
   (une par script lance) : colle-les toutes en une seule fois dans un
   tableau JSON, ou une par une, chaque "Importer tout" les traite. */

var IMPORT_GLOBAL_SOURCES_CONNUES = ['grafana_arrets_inpak', 'grafana_bulk', 'protime_pointages', 'ncp', 'sharepoint_notes', 'protime_planning'];

/* ---- Detection automatique de la source ---------------------------------
   Permet de coller un JSON "brut" (tel quel, sans l'enveloppe {source,data})
   dans Import global : on devine le type a partir des cles presentes, en se
   basant sur les memes signatures que chaque import verifie deja de son
   cote (importerArretsInpak, importerBulk, importerPointages, importerNCP,
   applyProtimeImport). Ne devine que si le format est sans ambiguite ;
   retourne null si rien ne correspond, l'appelant garde alors son message
   "non reconnu" habituel. */
function detecterSourceImport(obj){
  if(Array.isArray(obj)){
    if(obj.length && obj[0] && typeof obj[0] === 'object' && obj[0].notification !== undefined) return 'ncp';
    return null;
  }
  if(!obj || typeof obj !== 'object') return null;
  if(obj.avecRaison !== undefined || obj.microstops !== undefined) return 'grafana_arrets_inpak';
  if(obj.standaard !== undefined || obj.noodafvoer !== undefined || obj.bijlijn1 !== undefined) return 'grafana_bulk';
  if(obj.retards !== undefined || obj.pointages !== undefined || obj.anomaliesPointage !== undefined || obj.absences !== undefined) return 'protime_pointages';
  if(obj.employees !== undefined) return 'protime_planning';
  return null;
}

/* Resultat d'un import : chaque importeur renvoie une promesse qui se resout
   toujours avec {ok, message} (jamais de rejet non gere au clic sur un bouton).
   Utilise par l'import global pour un compte rendu reel, une fois les
   ecritures terminees. */
function echecImport(el, message){
  if(el){ el.style.color = '#ef4444'; el.textContent = message; }
  return Promise.resolve({ ok: false, message: message });
}
function succesImport(message){ return { ok: true, message: message }; }

function importerGlobal(){
  var txt = document.getElementById('global-import-txt');
  var err = document.getElementById('global-import-err');
  err.textContent = '';
  err.style.color = '';
  var raw = txt.value.trim();
  if(!raw){ err.textContent = 'Colle le JSON genere par un des scripts d\'extraction.'; return; }

  var parsed;
  try { parsed = JSON.parse(raw); }
  catch(e){ err.textContent = 'JSON invalide : ' + e.message; return; }

  // Un tableau peut etre soit une liste d'enveloppes {source,data} (on garde
  // le comportement existant), soit directement une liste brute de fiches
  // NCP (pas d'enveloppe) : dans ce dernier cas on la traite comme un seul
  // bloc, pas comme un tableau d'enveloppes a iterer.
  var enveloppes;
  if(Array.isArray(parsed) && parsed.length && parsed.every(function(x){ return x && typeof x === 'object' && typeof x.source === 'string'; })){
    enveloppes = parsed;
  } else {
    enveloppes = [{ source: (parsed && parsed.source) || null, data: (parsed && parsed.source && parsed.data !== undefined) ? parsed.data : parsed }];
  }
  if(!enveloppes.length){ err.textContent = 'Fichier vide.'; return; }

  var traites = [];
  var ignores = [];
  var envois = []; // {libelle, promesse} : imports qui ecrivent dans Firebase

  enveloppes.forEach(function(env){
    if(!env) return;
    if(!env.source){
      var devine = detecterSourceImport(env.data);
      if(!devine){ ignores.push('(format non reconnu -- colle le JSON tel qu\'il sort du script, sans le modifier)'); return; }
      env = { source: devine, data: env.data };
    }
    if(IMPORT_GLOBAL_SOURCES_CONNUES.indexOf(env.source) === -1){
      ignores.push(env.source + ' (source non geree par l\'import global pour l\'instant)');
      return;
    }
    if(env.source === 'protime_planning'){
      if(typeof previewProtimeImport !== 'function'){ ignores.push('protime_planning (module Protime non charge)'); return; }
      document.getElementById('protime-paste').value = JSON.stringify(env.data || {});
      previewProtimeImport();
      var box = document.getElementById('protime-import-box');
      if(box && box.scrollIntoView) box.scrollIntoView({behavior:'smooth', block:'start'});
      traites.push('Planning Protime (apercu a verifier plus bas avant de confirmer)');
    } else if(env.source === 'grafana_arrets_inpak'){
      if(typeof importerArretsInpak !== 'function'){ ignores.push('grafana_arrets_inpak (module Arrets Inpak non charge)'); return; }
      document.getElementById('arrets-import-txt').value = JSON.stringify(env.data || {});
      envois.push({ libelle: 'Arrets Inpak', promesse: importerArretsInpak() });
    } else if(env.source === 'grafana_bulk'){
      if(typeof importerBulk !== 'function'){ ignores.push('grafana_bulk (module Bulk non charge)'); return; }
      document.getElementById('bulk-import-txt').value = JSON.stringify(env.data || {});
      envois.push({ libelle: 'Bulk & Bijlijn', promesse: importerBulk() });
    } else if(env.source === 'protime_pointages'){
      if(typeof importerPointages !== 'function'){ ignores.push('protime_pointages (module Pointages non charge)'); return; }
      document.getElementById('pt-import-txt').value = JSON.stringify(env.data || {});
      envois.push({ libelle: 'Pointages (Protime)', promesse: importerPointages() });
    } else if(env.source === 'ncp'){
      if(typeof importerNCP !== 'function'){ ignores.push('ncp (module NCP non charge)'); return; }
      // importerNCP() attend directement un tableau JSON (pas un objet {data:...})
      document.getElementById('ncp-import-txt').value = JSON.stringify(env.data || []);
      envois.push({ libelle: 'NCP Qualite', promesse: importerNCP() });
    } else if(env.source === 'sharepoint_notes'){
      if(typeof importerSharepointNotes !== 'function'){ ignores.push('sharepoint_notes (module non charge)'); return; }
      envois.push({ libelle: 'Notes SharePoint (' + ((env.data || []).length) + ')', promesse: importerSharepointNotes(env) });
    }
  });

  if(!envois.length){
    var msg0 = traites.length ? traites.join(', ') + '.' : 'Rien a importer.';
    if(ignores.length) msg0 += ' Ignore : ' + ignores.join(' ; ');
    err.style.color = ignores.length ? '#f59e0b' : '#10b981';
    err.textContent = msg0;
    return Promise.resolve();
  }
  // Compte rendu REEL : on attend la fin de chaque import (reussi ou non)
  // avant d'annoncer le resultat, et on ne vide la zone qu'en cas de succes total.
  err.style.color = '#3b82f6';
  err.textContent = 'Import en cours : ' + envois.map(function(e){ return e.libelle; }).join(', ') + '...';
  return Promise.allSettled(envois.map(function(e){ return Promise.resolve(e.promesse); })).then(function(res){
    var lignes = [], echecs = 0;
    res.forEach(function(r, i){
      var v = r.status === 'fulfilled' ? r.value : { ok: false, message: (r.reason && r.reason.message) || String(r.reason) };
      if(v && v.ok === false){ echecs++; lignes.push('ECHEC ' + envois[i].libelle + ' : ' + v.message); }
      else lignes.push('OK ' + ((v && v.message) || envois[i].libelle));
    });
    traites.forEach(function(x){ lignes.push(x); });
    ignores.forEach(function(x){ lignes.push('Ignore : ' + x); });
    if(!echecs) txt.value = '';
    err.style.color = echecs ? '#ef4444' : (ignores.length ? '#f59e0b' : '#10b981');
    err.style.whiteSpace = 'pre-line';
    err.textContent = lignes.join('\n');
    return { echecs: echecs, lignes: lignes };
  });
}
