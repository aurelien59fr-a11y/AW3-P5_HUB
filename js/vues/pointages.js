/* ====================================================================
 * vues/pointages.js — Domaine Pointages (onglet "pt")
 * Extrait de app.js a l'Etape 9 du plan de refactorisation (Phase 2).
 *
 * Contenu : import et rapprochement des pointages horloge (buildPT2,
 * updPointagesBanner, markAllPtDone), commentaires/statut par pointage
 * (openPtComment/setPtStatut/savePtComment), import depuis fichier
 * (openImportPointages/importerPointages), et l'ecart pointage-vs-shift
 * planifie (pointageEcartAvantShift).
 *
 * Variable emportee : PT_DATA (donnees de pointages chargees).
 *
 * Fonctions differees a l'Etape 10 (imports/protime.js), NON incluses ici
 * bien que physiquement proches ou logiquement liees aux pointages :
 * loadPointages (chargement Firebase, meme logique que loadBulkData en
 * Etape 8 : reste avec le cluster d'import Protime), parseProtimeJson,
 * protimeDateToDDMM, protimeDateToYear, previewProtimeImport,
 * purgeAllProtimeAbsences, purgeUntypedAbsences, purgeProtimeAbsences,
 * applyProtimeImport, detectMissingWeeks, matchNomProtime,
 * classifierTypeAbsence, importerAbsencesProtime, ptKey — soit 14
 * fonctions au total, qui forment le cluster complet d'import Protime et
 * seront extraites ensemble a l'Etape 10.
 * ==================================================================== */

var PT_DATA = {};

function pointageEcartAvantShift(a){
if(!a || a.type !== 'pointage' || a.sousType !== 'Entrée' || !a.heure) return false;
var p = String(a.heure).split(':');
var mins = parseInt(p[0],10)*60 + parseInt(p[1],10);
if(isNaN(mins)) return false;
var starts = [5*60, 13*60, 17*60, 21*60];
for(var i=0;i<starts.length;i++){
var delta = starts[i] - mins;
if(delta >= 0 && delta <= 20) return true;
}
return false;
}

function openImportPointages(){
  document.getElementById('pt-import-txt').value = '';
  document.getElementById('pt-import-err').textContent = '';
  document.getElementById('pt-import-modal').style.display = 'flex';
}

function importerPointages(){
  var raw = document.getElementById('pt-import-txt').value.trim();
  var err = document.getElementById('pt-import-err');
  if(!raw){ err.textContent = 'Colle le JSON ici.'; return; }

  var data;
  try { data = JSON.parse(raw); }
  catch(e){ err.textContent = 'JSON invalide : ' + e.message; return; }

  if(!data || (!data.retards && !data.pointages && !data.anomaliesPointage && !data.absences)){
    err.textContent = 'Format non reconnu. Utilise exportEnrichiJSON() dans la console Protime.'; return;
  }

  var ajoutes = 0, doublons = 0;
  var updates = {};

  // Traiter retards
  var retards = data.retards || [];
  retards.forEach(function(a){
    var k = ptKey(a.nom, a.date, 'retard', a.heure);
    if(PT_DATA[k]){ doublons++; return; }
    updates[k] = {
      nom: a.nom, date: a.date, type: 'retard',
      detail: 'Arrivée ' + a.heure + ' (prévu ' + a.heureDebut + ') → ' + a.retardMin + ' min',
      retardMin: a.retardMin, heureDebut: a.heureDebut, heure: a.heure,
      statut: 'open', commentaire: '', ts: Date.now()
    };
    ajoutes++;
  });

  // Traiter anomalies pointage
  var anomalies = data.pointages || data.anomaliesPointage || [];
  anomalies.forEach(function(a){
    var k = ptKey(a.nom, a.date, a.type || 'pointage', a.pointeuse || a.heure);
    if(PT_DATA[k]){ doublons++; return; }
    updates[k] = {
      nom: a.nom, date: a.date, type: 'pointage',
      sousType: a.type || '',
      detail: (a.type || '') + ' : pointeuse ' + (a.pointeuse||'') + ' / tourniquet ' + (a.tourniquet||'') + ' = ' + a.ecart + ' min',
      ecart: a.ecart, heure: a.pointeuse || a.heure,
      statut: 'open', commentaire: '', ts: Date.now()
    };
    ajoutes++;
  });

  // Traiter absences (ziek/verlof/recup) : remplit le planning directement
  var resultatAbsences = null;
  if(data.absences && data.absences.length){
    resultatAbsences = importerAbsencesProtime(data.absences);
  }

  if(!ajoutes && !doublons && !resultatAbsences){
    err.textContent = 'Aucune anomalie ni absence trouvée dans ce JSON.'; return;
  }

  // Sauvegarder dans Firebase
  if(!db){
    err.textContent = 'Connexion Firebase non disponible. Recharge la page et réessaie.';
    return;
  }

  var toutesLesEcritures = Promise.resolve();
  if(Object.keys(updates).length){
    toutesLesEcritures = toutesLesEcritures.then(function(){ return db.ref('pointages').update(updates); });
  }
  if(resultatAbsences){
    var updPlanning = {};
    var d26 = {}; SHIFTS26.forEach(function(e){ d26[e.n] = e.s; });
    var d25 = {}; SHIFTS25.forEach(function(e){ d25[e.n] = e.s; });
    var d27 = {}; SHIFTS27.forEach(function(e){ d27[e.n] = e.s; });
    updPlanning['planning/shifts2026'] = d26;
    updPlanning['planning/shifts2025'] = d25;
    updPlanning['planning/shifts2027'] = d27;
    updPlanning['planning/absences'] = ABS;
    toutesLesEcritures = toutesLesEcritures.then(function(){ return db.ref().update(updPlanning); });
  }

  toutesLesEcritures.then(function(){
    document.getElementById('pt-import-modal').style.display = 'none';
    var msg = ajoutes + ' anomalie(s) importée(s)' + (doublons ? ' · ' + doublons + ' doublon(s) ignoré(s)' : '');
    if(resultatAbsences){
      msg += ' · ' + resultatAbsences.casesRemplies + ' jour(s) d\'absence rempli(s) (' + resultatAbsences.periodesCreees + ' periode(s))';
      if(resultatAbsences.nomsNonTrouves.length){
        console.warn('[Absences Protime] Noms non reconnus (verifie l\'orthographe) :', resultatAbsences.nomsNonTrouves);
        msg += ' · ' + resultatAbsences.nomsNonTrouves.length + ' nom(s) non reconnu(s), voir console';
      }
      if(resultatAbsences.typesInconnus){
        msg += ' · ' + resultatAbsences.typesInconnus + ' type(s) d\'absence non reconnu(s)';
      }
    }
    toast(msg, '#10b981');
  }).catch(function(e){
    console.error('[Pointages] Erreur import Firebase :', e);
    err.textContent = 'Erreur Firebase : ' + e.message;
  });
}

function buildPT2(){
  var tbody = document.getElementById('pt-tbody');
  if(!tbody) return;

  try{
    var filterPerson = document.getElementById('pt-filter-person') ? document.getElementById('pt-filter-person').value : 'all';
    var filterType   = document.getElementById('pt-filter-type')   ? document.getElementById('pt-filter-type').value   : 'all';
    var filterStatus = document.getElementById('pt-filter-status') ? document.getElementById('pt-filter-status').value : 'all';

    // Remplir le filtre personnes
    var selPerson = document.getElementById('pt-filter-person');
    if(selPerson && selPerson.options.length <= 1){
      var noms = [...new Set(Object.values(PT_DATA).map(function(a){return a.nom;}))].sort();
      noms.forEach(function(n){
        var opt = document.createElement('option');
        opt.value = n; opt.textContent = n;
        selPerson.appendChild(opt);
      });
    }

    // Filtrer et trier
    var rows = Object.entries(PT_DATA).filter(function(entry){
      var a = entry[1];
      if(filterPerson !== 'all' && a.nom !== filterPerson) return false;
      if(filterType !== 'all' && a.type !== filterType) return false;
      if(filterStatus !== 'all' && a.statut !== filterStatus) return false;
if(pointageEcartAvantShift(a)) return false;
      return true;
    }).sort(function(a, b){
      // Trier : non traités d'abord, puis par date décroissante
      if(a[1].statut !== b[1].statut) return a[1].statut === 'open' ? -1 : 1;
      return (b[1].date||'').localeCompare(a[1].date||'');
    });

    if(!rows.length){
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--tx3);padding:20px">'+t('pt_empty')+'</td></tr>';
      updPointagesBanner();
      return;
    }

    tbody.innerHTML = rows.map(function(entry){
      var k = entry[0], a = entry[1];
      var isOpen = a.statut === 'open';
      var typeCol = a.type === 'retard' ? '#f59e0b' : '#ef4444';
      var typeLabel = a.type === 'retard' ? t('pt_type_retard') : t('pt_type_tourniquet');
      var statutBadge = isOpen
        ? '<span style="font-size:11px;padding:2px 8px;border-radius:99px;background:#ef444422;color:#ef4444;border:1px solid #ef444455">'+t('pt_status_open')+'</span>'
        : '<span style="font-size:11px;padding:2px 8px;border-radius:99px;background:#10b98122;color:#10b981;border:1px solid #10b98155">'+t('pt_status_done')+'</span>';
      var cmIcon = a.commentaire
        ? '<span style="color:#f59e0b;font-size:14px" title="' + a.commentaire.replace(/"/g,'&quot;') + '">&#9997;</span>'
        : '<span style="color:var(--tx3);font-size:14px">&#9998;</span>';
      // Garde-fou : anomalie pointage matinale (00h-05h59) SANS mention (J+1)
      // = pattern du bug de comparaison avec le tourniquet de la veille sur shift de nuit
      var isSuspect = false;
      if(a.type === 'pointage' && a.heure){
        var hh = parseInt((a.heure+'').split(':')[0], 10);
        if(!isNaN(hh) && hh >= 0 && hh < 6 && a.detail && a.detail.indexOf('(J+1)') === -1){
          isSuspect = true;
        }
      }
      var suspectIcon = isSuspect
        ? '<span style="color:#f59e0b;font-size:13px;margin-left:6px;cursor:help" title="'+t('pt_suspect_tooltip')+'">&#9888;</span>'
        : '';
      return '<tr style="' + (isOpen ? '' : 'opacity:.6') + '">'
        + '<td><b style="font-size:13px">' + a.nom + '</b></td>'
        + '<td style="font-family:var(--mo);font-size:12px">' + dFR(a.date) + '</td>'
        + '<td><span style="font-size:12px;font-weight:600;color:' + typeCol + '">' + typeLabel + '</span></td>'
        + '<td style="font-size:12px;color:var(--tx2)">' + a.detail + suspectIcon + '</td>'
        + '<td>' + statutBadge + '</td>'
        + '<td style="text-align:center"><span style="cursor:pointer" onclick="openPtComment(\'' + k + '\')">' + cmIcon + '</span></td>'
        + '</tr>';
    }).join('');

    updPointagesBanner();
  } catch(e){
    console.error('[Pointages] Erreur de rendu buildPT2 :', e);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#ef4444;padding:20px">'+t('pt_render_error') + e.message + '</td></tr>';
  }
}

function updPointagesBanner(){
  var banner = document.getElementById('pt-alerts-banner');
  var text = document.getElementById('pt-alerts-text');
  if(!banner || !text) return;
  var open = Object.values(PT_DATA).filter(function(a){return a.statut === 'open' && !pointageEcartAvantShift(a);});
  var retards = open.filter(function(a){return a.type === 'retard';}).length;
  var ptgs = open.filter(function(a){return a.type === 'pointage';}).length;
  var suspects = open.filter(function(a){
    if(a.type !== 'pointage' || !a.heure) return false;
    var hh = parseInt((a.heure+'').split(':')[0], 10);
    return !isNaN(hh) && hh >= 0 && hh < 6 && a.detail && a.detail.indexOf('(J+1)') === -1;
  }).length;
  if(!open.length){ banner.style.display = 'none'; return; }
  banner.style.display = 'flex';
  var msg = open.length + t('pt_banner_open_suffix');
  if(retards) msg += ' · ' + retards + t('pt_banner_retards');
  if(ptgs) msg += ' · ' + ptgs + t('pt_banner_tourniquet');
  if(suspects) msg += ' · <span style="color:#f59e0b">⚠ ' + suspects + t('pt_banner_suspect') + '</span>';
  text.innerHTML = msg;
}

function markAllPtDone(){
  try{
    console.log('[markAllPtDone] Déclenché. PT_DATA contient', Object.keys(PT_DATA).length, 'entrée(s).');

    var filterPerson = document.getElementById('pt-filter-person') ? document.getElementById('pt-filter-person').value : 'all';
    var filterType   = document.getElementById('pt-filter-type')   ? document.getElementById('pt-filter-type').value   : 'all';

    var toMark = Object.entries(PT_DATA).filter(function(entry){
      var a = entry[1];
      if(a.statut !== 'open') return false;
      if(filterPerson !== 'all' && a.nom !== filterPerson) return false;
      if(filterType !== 'all' && a.type !== filterType) return false;
      return true;
    });

    console.log('[markAllPtDone]', toMark.length, 'anomalie(s) à marquer.');

    if(!toMark.length){
      toast(t('pt_none_open_filtered'), '#f59e0b');
      return;
    }

    var label = (filterPerson !== 'all' ? filterPerson : t('pt_everyone'))
      + (filterType !== 'all' ? ' · ' + (filterType === 'retard' ? t('pt_opt_retards').toLowerCase() : t('pt_opt_anomalies_tourniquet').toLowerCase()) : '');
    var ok = window.confirm(t('pt_confirm_mark1') + toMark.length + t('pt_confirm_mark2') + label + t('pt_confirm_mark3'));
    console.log('[markAllPtDone] confirm() a renvoyé :', ok);
    if(!ok) return;

    var updates = {};
    var now = new Date().toLocaleString('fr-BE');
    var auteur = currentUser ? currentUser.email : '';
    var pushPromises = [];
    toMark.forEach(function(entry){
      var k = entry[0];
      updates['pointages/' + k + '/statut'] = 'done';
      if(!entry[1].commentaire){
        updates['pointages/' + k + '/commentaire'] = 'Traité en masse';
        if(db){
          pushPromises.push(db.ref('pointages/' + k + '/historique').push({
            texte: 'Traité en masse', date: now, auteur: auteur
          }));
        }
      }
    });

    if(!db){
      toast(t('pt_firebase_unavailable'), '#ef4444');
      return;
    }

    Promise.all([db.ref().update(updates)].concat(pushPromises)).then(function(){
      console.log('[markAllPtDone] Mise à jour Firebase réussie.');
      toast(toMark.length + t('pt_marked_done_suffix'), '#10b981');
    }).catch(function(e){
      console.error('[markAllPtDone] Erreur Firebase :', e);
      toast(t('pt_firebase_error_prefix') + e.message, '#ef4444');
    });
  } catch(e){
    console.error('[markAllPtDone] Erreur inattendue :', e);
    toast(t('pt_generic_error_prefix') + e.message, '#ef4444');
  }
}

function openPtComment(key){
  var a = PT_DATA[key];
  if(!a) return;
  var hist = a.historique ? Object.keys(a.historique).sort().map(function(k){ return a.historique[k]; }) : [];
  var histHtml = hist.length
    ? hist.slice().reverse().map(function(h){
        return '<div style="padding:8px 10px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:8px;margin-bottom:6px">'
          + '<div style="font-size:11px;color:var(--tx3);margin-bottom:3px">' + (h.date||'') + (h.auteur?' · '+h.auteur:'') + '</div>'
          + '<div style="font-size:13px;color:var(--tx1);white-space:pre-wrap">' + (h.texte||'').replace(/</g,'&lt;') + '</div>'
          + '</div>';
      }).join('')
    : '<div style="font-size:12px;color:var(--tx3);font-style:italic">Aucun commentaire pour le moment</div>';
  var d = document.createElement('div');
  d.id = 'pt-comment-popup';
  d.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center';
  d.innerHTML = '<div style="background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:12px;padding:24px;width:440px;max-width:95vw;max-height:85vh;display:flex;flex-direction:column">'
    + '<div style="font-weight:700;font-size:15px;margin-bottom:4px">' + a.nom + '</div>'
    + '<div style="font-size:12px;color:var(--tx3);margin-bottom:4px">' + dFR(a.date) + ' — ' + a.detail + '</div>'
    + '<div style="display:flex;gap:8px;margin-bottom:14px">'
    + '<button onclick="setPtStatut(\'' + key + '\',\'open\')" id="btn-open" style="padding:5px 12px;border-radius:var(--r);border:1px solid #ef4444;background:' + (a.statut==='open'?'#ef4444':'none') + ';color:' + (a.statut==='open'?'#fff':'#ef4444') + ';font-family:var(--fn);font-size:12px;cursor:pointer">Non traité</button>'
    + '<button onclick="setPtStatut(\'' + key + '\',\'done\')" id="btn-done" style="padding:5px 12px;border-radius:var(--r);border:1px solid #10b981;background:' + (a.statut==='done'?'#10b981':'none') + ';color:' + (a.statut==='done'?'#fff':'#10b981') + ';font-family:var(--fn);font-size:12px;cursor:pointer">Traité ✓</button>'
    + '</div>'
    + '<div style="font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Historique</div>'
    + '<div style="overflow-y:auto;max-height:200px;margin-bottom:14px">' + histHtml + '</div>'
    + '<div style="font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Ajouter un commentaire</div>'
    + '<textarea id="pt-cm-txt" placeholder="Ecrire un nouveau commentaire..." style="width:100%;height:70px;background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd2);border-radius:8px;color:var(--tx1);font-family:var(--fn);font-size:13px;padding:10px;resize:vertical"></textarea>'
    + '<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end">'
    + '<button onclick="document.getElementById(\'pt-comment-popup\').remove()" style="padding:8px 16px;border-radius:var(--r);border:1px solid var(--bd2);background:none;color:var(--tx2);font-family:var(--fn);cursor:pointer">Fermer</button>'
    + '<button onclick="savePtComment(\'' + key + '\')" style="padding:8px 16px;border-radius:var(--r);border:none;background:var(--blue);color:#fff;font-family:var(--fn);font-weight:600;cursor:pointer">Enregistrer</button>'
    + '</div></div>';
  document.body.appendChild(d);
  d.addEventListener('click', function(e){ if(e.target===d) d.remove(); });
  document.getElementById('pt-cm-txt').focus();
}

function setPtStatut(key, statut){
  if(PT_DATA[key]) PT_DATA[key].statut = statut;
  // Mettre à jour les boutons visuellement
  var btnOpen = document.getElementById('btn-open');
  var btnDone = document.getElementById('btn-done');
  if(btnOpen){
    btnOpen.style.background = statut==='open'?'#ef4444':'none';
    btnOpen.style.color = statut==='open'?'#fff':'#ef4444';
  }
  if(btnDone){
    btnDone.style.background = statut==='done'?'#10b981':'none';
    btnDone.style.color = statut==='done'?'#fff':'#10b981';
  }
}

function savePtComment(key){
  var txt = document.getElementById('pt-cm-txt').value.trim();
  var statut = PT_DATA[key] ? PT_DATA[key].statut : 'open';
  var updates = {};
  updates['pointages/' + key + '/statut'] = statut;
  if(!db) return;
  var chain = db.ref().update(updates);
  if(txt){
    var entry = {
      texte: txt,
      date: new Date().toLocaleString('fr-BE'),
      auteur: currentUser ? currentUser.email : ''
    };
    chain = chain.then(function(){
      return db.ref('pointages/' + key + '/historique').push(entry);
    }).then(function(){
      // Garder 'commentaire' à jour avec le dernier texte pour l'aperçu rapide dans le tableau
      return db.ref('pointages/' + key + '/commentaire').set(txt);
    });
  }
  chain.then(function(){
    document.getElementById('pt-comment-popup').remove();
    toast(txt ? 'Commentaire ajouté' : 'Statut mis à jour', '#10b981');
  }).catch(function(e){
    toast('Erreur : ' + e.message, '#ef4444');
  });
}
