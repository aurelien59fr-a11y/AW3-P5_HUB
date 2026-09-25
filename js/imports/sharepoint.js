/* imports/sharepoint.js -- Import des notes d'une liste SharePoint Agristo
   (notes ecrites par les operateurs et les coordinateurs).

   Le fichier vient du script extraction_sharepoint_notes.js, lance dans Edge
   sur la page de la liste : il produit une enveloppe
   {source:'sharepoint_notes', extraitLe, liste:{id,titre,url}, colonneDate,
    colonnes:[...], data:[{id,date,heure,cree,modifie,auteur,modifiePar,valeurs}]}.

   Stockage Firebase : sharepoint_notes/<cle liste>/items/<id SharePoint>.
   Re-importer la meme liste met a jour les elements existants (meme id) et
   ajoute les nouveaux : pas de doublon.
   Lecture ET ecriture : admin seul (noeud non declare dans
   database.rules.json -> herite de la racine). Affichage : onglet Logbook,
   rattache au poste via logbookPosteDe(date, heure). */

function spNotesCleListe(liste){
  return String((liste && (liste.id || liste.titre)) || 'liste')
    .replace(/[{}]/g, '').replace(/[.#$\/\[\]\s]/g, '-');
}

/* Ecrit une enveloppe en base. Renvoie une Promise<{liste, nb}>. */
function importerSharepointNotes(env){
  if(!db) return Promise.reject(new Error('Firebase indisponible'));
  if(!currentUser || currentUser.role !== 'admin') return Promise.reject(new Error('Reserve a l\'admin'));
  if(!env || env.source !== 'sharepoint_notes' || !Array.isArray(env.data)){
    return Promise.reject(new Error('Ce fichier ne vient pas du script d\'extraction des notes SharePoint.'));
  }
  var cle = spNotesCleListe(env.liste);
  // Firebase refuse . # $ / [ ] dans les noms de cles : on les remplace dans
  // les noms de colonnes (ex. "N° lot / ligne" -> "N° lot - ligne").
  function propre(obj){
    var o = {};
    Object.keys(obj || {}).forEach(function(k){
      var k2 = String(k).replace(/[.#$\[\]]/g, ' ').replace(/\//g, '-').trim() || '_';
      o[k2] = String(obj[k]).slice(0, 20000);
    });
    return o;
  }
  var maj = {};
  var nb = 0;
  env.data.forEach(function(n){
    if(n == null || n.id == null) return;
    maj['sharepoint_notes/' + cle + '/items/' + n.id] = {
      id: n.id,
      date: n.date || '',
      heure: n.heure || '',
      auteur: n.auteur || '',
      modifiePar: n.modifiePar || '',
      cree: n.cree || '',
      modifie: n.modifie || '',
      valeurs: propre(n.valeurs)
    };
    nb++;
  });
  maj['sharepoint_notes/' + cle + '/info'] = {
    titre: (env.liste && env.liste.titre) || cle,
    url: (env.liste && env.liste.url) || '',
    colonneDate: env.colonneDate || '',
    colonnes: (env.colonnes || []).map(function(c){ return { titre: String(c.titre || ''), type: String(c.type || '') }; }),
    extraitLe: env.extraitLe || '',
    importeLe: new Date().toISOString(),
    nb: nb
  };
  return db.ref().update(maj).then(function(){
    return { liste: (env.liste && env.liste.titre) || cle, nb: nb };
  });
}

/* Bouton Admin : choisir le fichier .json cree par le script. */
function importerSharepointNotesFichier(input){
  var etat = document.getElementById('sp-import-etat');
  var fichiers = Array.prototype.slice.call((input && input.files) || []);
  if(!fichiers.length) return;
  function msg(t, col){ if(etat){ etat.textContent = t; etat.style.color = col || 'var(--tx2)'; } }
  msg('Lecture de ' + fichiers.length + ' fichier(s)...');
  Promise.all(fichiers.map(function(f){ return f.text().then(JSON.parse); }))
    .then(function(envs){
      // un fichier peut contenir une liste ou un tableau de listes (Inpak + Productie)
      envs = [].concat.apply([], envs.map(function(e){ return Array.isArray(e) ? e : [e]; }));
      return envs.reduce(function(p, env){
        return p.then(function(acc){ return importerSharepointNotes(env).then(function(r){ acc.push(r); return acc; }); });
      }, Promise.resolve([]));
    })
    .then(function(res){
      msg('Importe : ' + res.map(function(r){ return r.nb + ' notes de "' + r.liste + '"'; }).join(', ') + '. Visible dans l\'onglet Logbook.', '#10b981');
      if(typeof toast === 'function') toast('Notes SharePoint importees', '#10b981');
    })
    .catch(function(e){
      console.error('[Notes SharePoint]', e);
      msg('Erreur : ' + e.message, '#ef4444');
    })
    .then(function(){ input.value = ''; });
}
