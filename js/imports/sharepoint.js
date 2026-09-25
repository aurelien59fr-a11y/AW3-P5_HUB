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

/* Ecrit par paquets pour ne pas envoyer un seul enorme update a Firebase. */
function spEcrireParPaquets(maj, taillePaquet){
  var cles = Object.keys(maj), paquets = [];
  for(var i = 0; i < cles.length; i += taillePaquet){
    var p = {};
    cles.slice(i, i + taillePaquet).forEach(function(k){ p[k] = maj[k]; });
    paquets.push(p);
  }
  return paquets.reduce(function(prom, p){ return prom.then(function(){ return db.ref().update(p); }); }, Promise.resolve());
}

// Firebase refuse . # $ / [ ] dans les noms de cles : on les remplace dans
// les noms de colonnes (ex. "N° lot / ligne" -> "N° lot - ligne").
function spCleePropre(k){ return String(k).replace(/[.#$\[\]]/g, ' ').replace(/\//g, '-').trim() || '_'; }

/* Ecrit une enveloppe (notes OU photos) en base. Renvoie une Promise<{liste, nb, type}>. */
function importerSharepointNotes(env){
  if(!db) return Promise.reject(new Error('Firebase indisponible'));
  if(!currentUser || currentUser.role !== 'admin') return Promise.reject(new Error('Reserve a l\'admin'));
  if(env && env.source === 'sharepoint_photos') return importerSharepointPhotos(env);
  if(!env || env.source !== 'sharepoint_notes' || !Array.isArray(env.data)){
    return Promise.reject(new Error('Ce fichier ne vient pas du script d\'extraction des logboeken SharePoint.'));
  }
  var cle = spNotesCleListe(env.liste);
  var maj = {}, nb = 0;
  env.data.forEach(function(n){
    if(n == null || n.id == null) return;
    var valeurs = {};
    Object.keys(n.valeurs || {}).forEach(function(k){ valeurs[spCleePropre(k)] = String(n.valeurs[k]).slice(0, 50000); });
    maj['sharepoint_notes/' + cle + '/items/' + n.id] = {
      id: n.id,
      date: n.date || '',
      heure: n.heure || '',
      ploeg: n.ploeg || '',
      auteur: n.auteur || '',
      modifiePar: n.modifiePar || '',
      cree: n.cree || '',
      modifie: n.modifie || '',
      valeurs: valeurs,
      nbPhotos: n.nbPhotos || 0,
      fichiers: (n.fichiers || []).map(function(f){ return { nom: String(f.nom || ''), url: String(f.url || '') }; })
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
  return spEcrireParPaquets(maj, 400).then(function(){
    return { liste: (env.liste && env.liste.titre) || cle, nb: nb, type: 'notes' };
  });
}

/* Photos : sharepoint_photos/<cle liste>/<id ligne> = [dataURL, ...]
   Stockees a part des notes pour que le Logbook reste rapide ; chargees a
   la demande quand on clique "Voir les photos". */
function importerSharepointPhotos(env){
  var maj = {}, nb = 0, titres = [];
  Object.keys(env.listes || {}).forEach(function(idListe){
    var L = env.listes[idListe], cle = spNotesCleListe({ id: idListe });
    titres.push(L.titre || cle);
    Object.keys(L.items || {}).forEach(function(idItem){
      maj['sharepoint_photos/' + cle + '/' + idItem] = L.items[idItem];
      nb += (L.items[idItem] || []).length;
    });
  });
  return spEcrireParPaquets(maj, 15).then(function(){ return { liste: titres.join(' + '), nb: nb, type: 'photos' }; });
}

/* Bouton Admin : choisir le fichier .json cree par le script. */
function importerSharepointNotesFichier(input){
  var etat = document.getElementById('sp-import-etat');
  var fichiers = Array.prototype.slice.call((input && input.files) || []);
  if(!fichiers.length) return;
  function msg(t, col){ if(etat){ etat.textContent = t; etat.style.color = col || 'var(--tx2)'; } }
  msg('Import de ' + fichiers.length + ' fichier(s) en cours, patiente (les photos peuvent prendre quelques minutes)...');
  Promise.all(fichiers.map(function(f){ return f.text().then(JSON.parse); }))
    .then(function(envs){
      // un fichier peut contenir une liste ou un tableau de listes (Inpak + Productie)
      envs = [].concat.apply([], envs.map(function(e){ return Array.isArray(e) ? e : [e]; }));
      return envs.reduce(function(p, env){
        return p.then(function(acc){ return importerSharepointNotes(env).then(function(r){ acc.push(r); return acc; }); });
      }, Promise.resolve([]));
    })
    .then(function(res){
      msg('Importe : ' + res.map(function(r){ return r.nb + ' ' + (r.type || 'notes') + ' (' + r.liste + ')'; }).join(', ') + '. Visible dans l\'onglet Logbook.', '#10b981');
      if(typeof toast === 'function') toast('Notes SharePoint importees', '#10b981');
    })
    .catch(function(e){
      console.error('[Notes SharePoint]', e);
      msg('Erreur : ' + e.message, '#ef4444');
    })
    .then(function(){ input.value = ''; });
}
