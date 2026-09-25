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

var IMPORT_GLOBAL_SOURCES_CONNUES = ['grafana_arrets_inpak', 'grafana_bulk', 'protime_pointages', 'ncp', 'sharepoint_notes'];

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

  var enveloppes = Array.isArray(parsed) ? parsed : [parsed];
  if(!enveloppes.length){ err.textContent = 'Fichier vide.'; return; }

  var traites = [];
  var ignores = [];

  enveloppes.forEach(function(env){
    if(!env || !env.source){ ignores.push('(enveloppe sans champ "source")'); return; }
    if(IMPORT_GLOBAL_SOURCES_CONNUES.indexOf(env.source) === -1){
      ignores.push(env.source + ' (source non geree par l\'import global pour l\'instant)');
      return;
    }
    if(env.source === 'grafana_arrets_inpak'){
      if(typeof importerArretsInpak !== 'function'){ ignores.push('grafana_arrets_inpak (module Arrets Inpak non charge)'); return; }
      document.getElementById('arrets-import-txt').value = JSON.stringify(env.data || {});
      importerArretsInpak();
      traites.push('Arrets Inpak');
    } else if(env.source === 'grafana_bulk'){
      if(typeof importerBulk !== 'function'){ ignores.push('grafana_bulk (module Bulk non charge)'); return; }
      document.getElementById('bulk-import-txt').value = JSON.stringify(env.data || {});
      importerBulk();
      traites.push('Bulk & Bijlijn');
    } else if(env.source === 'protime_pointages'){
      if(typeof importerPointages !== 'function'){ ignores.push('protime_pointages (module Pointages non charge)'); return; }
      document.getElementById('pt-import-txt').value = JSON.stringify(env.data || {});
      importerPointages();
      traites.push('Pointages (Protime)');
    } else if(env.source === 'ncp'){
      if(typeof importerNCP !== 'function'){ ignores.push('ncp (module NCP non charge)'); return; }
      // importerNCP() attend directement un tableau JSON (pas un objet {data:...})
      document.getElementById('ncp-import-txt').value = JSON.stringify(env.data || []);
      importerNCP();
      traites.push('NCP Qualite');
    } else if(env.source === 'sharepoint_notes'){
      if(typeof importerSharepointNotes !== 'function'){ ignores.push('sharepoint_notes (module non charge)'); return; }
      importerSharepointNotes(env).catch(function(e){ err.style.color = '#ef4444'; err.textContent = 'Notes SharePoint : ' + e.message; });
      traites.push('Notes SharePoint (' + ((env.data || []).length) + ')');
    }
  });

  txt.value = '';
  var msg = traites.length ? ('Import lance pour : ' + traites.join(', ') + '.') : 'Rien a importer.';
  if(ignores.length) msg += ' Ignore : ' + ignores.join(' ; ');
  err.style.color = ignores.length ? '#f59e0b' : '#10b981';
  err.textContent = msg;
}
