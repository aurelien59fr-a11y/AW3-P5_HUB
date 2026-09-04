/* ============================================================
   Domaine NCP (Non-Conformites Produit) — Calculs et deduction
   Deplace tel quel depuis app.js (Etape 7 de la Phase 2), sans
   modification de comportement.

   loadNCPData() est l'ecouteur Firebase 'ncp_data' : il recoit les
   fiches brutes et applique en un seul passage toute la deduction
   (unite, ligne, type, correction/override) avant d'appeler
   buildNCPTab() (vues/ncp.js) pour rafraichir l'affichage — meme
   schema que loadArretsInpak() dans metier/arrets.js (Etape 6).

   ncpEsc() est un echappement HTML specifique a NCP (n'echappe pas
   les guillemets, contrairement a escHtml() de core/ui.js) ; les deux
   coexistent sans conflit, chacun garde son usage d'origine.
============================================================ */

var NCP_DATA = [];

function loadNCPData(){
  if(!db) return;
  db.ref('ncp_data').on('value', function(snap){
    var data = snap.val() || {};
    NCP_DATA = Object.keys(data).map(function(k){ return data[k]; }); /* Lexique des libelles de probleme, construit A CHAUD a chaque chargement a partir des SEULES fiches dont le poste declarant est fiable (INPAK_WB d'un cote, PLOEGCH_WB et AW_EXP de l'autre). Le champ problems est un vocabulaire controle du systeme qualite et certains libelles sont exclusivement Inpak : "open lasnaden / langsnaad open" 80 fois cote Inpak et 0 cote Production, "problemen codering zak/doosje" 71/0, "verpakking andere reden" 25/0. Il sert plus bas a typer les fiches declarees par un nom de personne, pour qui le poste ne dit rien. Construit a chaud plutot qu'en dur : le lexique se met a jour tout seul quand de nouveaux libelles apparaissent. */ var _LEXI = {}, _LEXP = {}; NCP_DATA.forEach(function(r){ var w = String(r.reporter || ''); var eI = /INPAK_WB/i.test(w), eP = /PLOEGCH_WB|AW_EXP/i.test(w); if(!eI && !eP) return; String(r.problems || '').toLowerCase().split('|').forEach(function(t){ t = t.trim(); if(!t) return; if(eI) _LEXI[t] = (_LEXI[t] || 0) + 1; else _LEXP[t] = (_LEXP[t] || 0) + 1; }); }); NCP_DATA.forEach(function(r){ var p = String(r.created_on || '').split('/'); var iso = (p.length === 3) ? (p[2] + '-' + ('0' + p[1]).slice(-2) + '-' + ('0' + p[0]).slice(-2)) : null; r.date_fichier = r.created_date_iso || null; r.heure_fiable = !!(iso && iso === r.date_fichier); if(iso) r.created_date_iso = iso; /* Unite erronee dans la source : on ne corrige QUE si deux indices independants -- le declarant (INPAK_WB<n> / PLOEGCH_WB<n>) et le numero de ligne -- designent tous les deux la MEME autre unite. Un seul indice ne suffit pas : un chef de poste peut declarer un NCP concernant une autre unite (93% de concordance seulement). */ var _mRep = String(r.reporter || '').match(/WB\s*([123])\b/i); var _uRep = _mRep ? ('AW' + _mRep[1]) : null; var _mLig = String(r.ligne || '').match(/(\d{1,3})/); var _nLig = _mLig ? parseInt(_mLig[1], 10) : null; var _uLig = null; if(_nLig !== null){ if(_nLig >= 1 && _nLig <= 12) _uLig = 'AW1'; else if(_nLig >= 21 && _nLig <= 26) _uLig = 'AW2'; else if(_nLig >= 31 && _nLig <= 36) _uLig = 'AW3'; } if(r.unite && _uRep && _uLig && _uRep === _uLig && _uRep !== r.unite){ r.unite_corrigee_depuis = r.unite; r.unite = _uRep; } /* Unite ABSENTE dans la source. Depuis le 08/08/2026 des lots sont importes sans les champs d'enrichissement (unite, unite_source, ligne) : le pipeline amont "ncp_enrichi" ne tourne plus. On rejoue donc ici SES trois regles, par ordre de force de preuve : 1) numero de ligne cite (L31 -> AW3) 2) mention explicite "AW3" dans le texte, uniquement si une seule unite y est citee 3) code du declarant (INPAK_WB3 / PLOEGCH_WB3). La regle 3 est la plus faible (93% de concordance : un chef de poste peut declarer pour une autre unite) d'ou son rang. Verifie sur les 243 fiches sans unite : les trois indices ne se contredisent jamais. La source retenue est tracee dans unite_source et r.unite_deduite marque la deduction, pour rester auditable et reversible. */ if(!r.unite){ var _nDed = (_nLig !== null && _uLig) ? _nLig : null; if(_nDed === null){ var _rxD = /\b(?:L|G|LIGNE|LIJN|LINE)\s*\.?\s*0?(\d{1,2})\b/gi, _mD; while((_mD = _rxD.exec(String(r.description || ''))) !== null){ var _vD = parseInt(_mD[1], 10); if((_vD >= 1 && _vD <= 12) || (_vD >= 21 && _vD <= 26) || (_vD >= 31 && _vD <= 36)){ _nDed = _vD; break; } } } var _uDedLigne = null; if(_nDed !== null){ if(_nDed >= 1 && _nDed <= 12) _uDedLigne = 'AW1'; else if(_nDed >= 21 && _nDed <= 26) _uDedLigne = 'AW2'; else if(_nDed >= 31 && _nDed <= 36) _uDedLigne = 'AW3'; } var _uDedTexte = null, _vusAW = {}, _rxAW = /\bAW\s*([123])\b/gi, _mAW; var _blobAW = String(r.description || '') + ' ' + String(r.ncp_extra_info || ''); while((_mAW = _rxAW.exec(_blobAW)) !== null){ _vusAW['AW' + _mAW[1]] = 1; } var _ksAW = Object.keys(_vusAW); if(_ksAW.length === 1) _uDedTexte = _ksAW[0]; if(_uDedLigne){ r.unite = _uDedLigne; r.unite_source = 'ligne_premier_chiffre'; } else if(_uDedTexte){ r.unite = _uDedTexte; r.unite_source = 'texte_libre'; } else if(_uRep){ r.unite = _uRep; r.unite_source = 'reporter'; } if(r.unite) r.unite_deduite = true; } /* type_ncp errone dans la source : c'est le POSTE DECLARANT qui determine le type. PLOEGCH_WB<n> (chef de poste) et AW_EXP (expedition) declarent de la PRODUCTION ; INPAK_WB<n> declare de l'INPAK. La correspondance est nette dans la base : 470 Ploegchef -> Production et 939 Inpak -> Inpak ; les 31 fiches qui s'en ecartent sont des erreurs de la source, dont 28 sur le seul mois d'aout 2026 -- meme cause que l'unite absente, l'enrichissement amont ne tourne plus. Un type errone fausse tout l'aval : ligne_type, recherche de ligne dans le texte, recherche de l'operateur Inpak et aiguillage dans Mon Espace (un NCP de chef de poste ne doit jamais atterrir chez les operateurs Inpak). L'ancienne valeur est conservee dans type_ncp_source. */ var _wRep = String(r.reporter || ''); if(/PLOEGCH_WB|AW_EXP/i.test(_wRep) && r.type_ncp !== 'Production'){ r.type_ncp_source = r.type_ncp; r.type_ncp = 'Production'; } else if(/INPAK_WB/i.test(_wRep) && r.type_ncp !== 'Inpak'){ r.type_ncp_source = r.type_ncp; r.type_ncp = 'Inpak'; } else if(_wRep && !/INPAK_WB|PLOEGCH_WB|AW_EXP/i.test(_wRep)){ /* Declarant = nom de personne (qualite, planning, magasin...). Le poste ne dit rien sur le type, on tranche donc par le vocabulaire de problems : si TOUS les libelles de la fiche sont des libelles vus au moins 5 fois cote Inpak et au moins 5 fois plus souvent cote Inpak que cote Production, c'est de l'Inpak. Sinon on laisse Production. Critere volontairement strict : 9 fiches sur 280 basculent. */ var _tk = String(r.problems || '').toLowerCase().split('|').map(function(t){ return t.trim(); }).filter(Boolean); if(_tk.length && _tk.every(function(t){ return (_LEXI[t] || 0) >= 5 && (_LEXP[t] || 0) * 5 < (_LEXI[t] || 0); })){ if(r.type_ncp !== 'Inpak'){ r.type_ncp_source = r.type_ncp; r.type_ncp = 'Inpak'; r.type_ncp_deduit = 'problems'; } } } /* Correction manuelle de l'unite. Appliquee AVANT le calcul de VL pour que la validation de la ligne utilise bien la plage de la nouvelle unite. Un override gagne toujours sur la deduction automatique, et l'import ne peut pas l'ecraser : importerNCP part d'une copie de l'existant et ne recopie que les champs presents dans le fichier importe. */ if(r.unite_override){ if(r.unite && r.unite !== r.unite_override) r.unite_avant_override = r.unite; r.unite = r.unite_override; r.unite_source = 'manuel'; r.unite_deduite = false; } var VL = (r.unite === 'AW1') ? [1,2,3,4,5,6,7,8,9,10,11,12] : (r.unite === 'AW2') ? [21,22,23,24,25,26] : (r.unite === 'AW3') ? [31,32,33,34,35,36] : [1,2,3,4,5,6,7,8,9,10,11,12,21,22,23,24,25,26,31,32,33,34,35,36]; var nl = null; if(r.ligne){ var mn = /(\d{1,3})/.exec(String(r.ligne)); if(mn && VL.indexOf(parseInt(mn[1],10)) !== -1){ nl = parseInt(mn[1],10); } } if(nl === null){ var rex = /\b(?:L|G|LIGNE|LIJN|LINE)\s*\.?\s*0?(\d{1,2})\b/gi, mx; while((mx = rex.exec(String(r.description || ''))) !== null){ var vv = parseInt(mx[1],10); if(VL.indexOf(vv) !== -1){ nl = vv; r.ligne_source = 'texte_description'; break; } } } /* La ligne n'est plus fournie par la source depuis le 08/08/2026 (0% des fiches contre 42% avant). Elle figure pourtant tres souvent dans le texte libre : "lijn 6 van 20u40", "Ligne 25", "ligne 32", "LIJN 7 dwarsnaad". On etend donc la recherche a ncp_extra_info, nettoye de ses en-tetes de mail. Purement additif : +78 fiches sur la base, aucune ligne deja trouvee n'est modifiee. Le filtre par plage de lignes valides de l'unite reste la garde principale contre les faux positifs. */ if(nl === null && r.type_ncp !== 'Production'){ var rex2 = /\b(?:L|G|LIGNE|LIJN|LINE)\s*\.?\s*0?(\d{1,2})\b/gi, mx2, t2 = ncpTexteUtile(r); while((mx2 = rex2.exec(t2)) !== null){ var vv2 = parseInt(mx2[1],10); if(VL.indexOf(vv2) !== -1){ nl = vv2; r.ligne_source = 'texte_info_ncp'; break; } } } if(nl !== null){ r.ligne = 'L' + ('0' + nl).slice(-2); r.ligne_type = (r.type_ncp === 'Production') ? 'unite_production' : 'cause_directe'; } else { r.ligne = null; r.ligne_source = null; r.ligne_type = null; } /* Correction manuelle de la ligne, appliquee apres toute la deduction. 'aucune' permet de forcer une fiche a n'avoir aucune ligne. */ if(r.ligne_override){ if(r.ligne && r.ligne !== r.ligne_override) r.ligne_avant_override = r.ligne; if(r.ligne_override === 'aucune'){ r.ligne = null; r.ligne_source = 'manuel'; } else { r.ligne = r.ligne_override; r.ligne_source = 'manuel'; r.ligne_type = (r.type_ncp === 'Production') ? 'unite_production' : 'cause_directe'; } } r.lignes_multiples = ncpLignesCitees(r); }); NCP_DATA = ncpEclaterLignes(NCP_DATA);
    buildNCPTab();
  }, function(error){
    console.warn('[NCP] Erreur chargement:', error);
  });
}

function ncpLignesValides(u){ if(u === 'AW1') return [1,2,3,4,5,6,7,8,9,10,11,12]; if(u === 'AW2') return [21,22,23,24,25,26]; if(u === 'AW3') return [31,32,33,34,35,36]; return [1,2,3,4,5,6,7,8,9,10,11,12,21,22,23,24,25,26,31,32,33,34,35,36]; }

function ncpLignesCitees(r){ if(r.type_ncp === 'Production') return []; var V = ncpLignesValides(r.unite || ''); var rex = /\b(?:L|G|LIGNE|LIJN|LINE)\s*\.?\s*0?(\d{1,2})\b/gi, m, vus = []; while((m = rex.exec(String(r.description || ''))) !== null){ var v = parseInt(m[1],10); if(V.indexOf(v) !== -1 && vus.indexOf(v) === -1) vus.push(v); } return vus.map(function(v){ return 'L' + ('0' + v).slice(-2); }); }

function ncpEclaterLignes(list){ var out = []; list.forEach(function(r){ var lg = r.lignes_multiples || []; if(lg.length < 2){ out.push(r); return; } lg.forEach(function(l){ var c = {}; for(var k in r){ c[k] = r[k]; } c.ligne = l; c.ligne_type = 'cause_directe'; c.ligne_source = 'multi_lignes'; c.ncp_partage = lg.length; c.total_pallets = (Number(r.total_pallets) || 0) / lg.length; c.total_tonnes = (Number(r.total_tonnes) || 0) / lg.length; c.total_kg = (Number(r.total_kg) || 0) / lg.length; out.push(c); }); }); return out; }

function ncpNomCle(w){ return String(w||'').trim().toLowerCase().replace(/\s+/g,' '); }

function ncpNomAff(w){ return ncpNomCle(w).replace(/(^|[- ])([a-zà-ÿ])/g, function(m,a,b){ return a + b.toUpperCase(); }); }

function ncpEstNonClasse(r){ var w = String(r.reporter || ''); return !!w && !/INPAK_WB|PLOEGCH_WB|AW_EXP/i.test(w); }

function ncpOperateurs(r){
  /* Operateur saisi a la main : prioritaire sur tout, et disponible sur TOUS les
     NCP y compris Production, ou le planning ne peut rien deduire. */
  if(r.operateur_override) return r.operateur_override;
  if(r.type_ncp !== 'Inpak') return null;
  // On s'aligne sur la meme base horaire que l'equipe affichee (ncpEquipesMulti
  // -> ncpFenetre). Avant, si ncpHeureInfo ne rendait pas d'heure (cas
  // heure_fiable === false, ex: PDF exporte plusieurs jours apres le defaut),
  // on abandonnait ici -- alors que la fenetre du defaut, elle, suffisait deja
  // a deduire l'equipe. Resultat : une equipe P5 affichee sans jamais pouvoir
  // nommer l'operateur, alors que le planning du jour le donne.
  var _hi = ncpHeureInfo(r);
  var dateISO = null, heure = null;
  if(_hi.heure){ dateISO = _hi.date_iso || r.created_date_iso; heure = _hi.heure; }
  else { var f = ncpFenetre(r); if(f){ dateISO = f.dateDebut; heure = f.heureDebut; } }
  if(!dateISO || !heure) return null;
  var ligneNum = String(r.ligne || '').replace(/[^0-9]/g, '');
  if(!ligneNum) return null;
  return getOperateur(dateISO, heure, ligneNum);
}

function ncpEsc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function ncpTraduireTexte(txt){
  if(!txt || !txt.trim()) return Promise.resolve(txt);
  var morceaux = [];
  var reste = txt;
  while(reste.length > 480){
    var coupe = reste.lastIndexOf('\n', 480);
    if(coupe < 50) coupe = 480;
    morceaux.push(reste.slice(0, coupe));
    reste = reste.slice(coupe);
  }
  morceaux.push(reste);
  return Promise.all(morceaux.map(function(m){
    if(!m.trim()) return m;
    var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(m) + '&langpair=autodetect|fr';
    return fetch(url).then(function(r){ return r.json(); }).then(function(d){
      var t = d && d.responseData && d.responseData.translatedText;
      return t || m;
    }).catch(function(){ return m; });
  })).then(function(parts){ return parts.join(''); });
}

function ncpISO(dt){
  return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
}

var NCP_JOURS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];

function ncpJour(dateStr){
  if(!dateStr) return '';
  var iso;
  if(/^\d{4}-\d{2}-\d{2}/.test(dateStr)) iso = dateStr.slice(0,10);
  else { var p = dateStr.split('/'); if(p.length !== 3) return ''; iso = p[2] + '-' + p[1] + '-' + p[0]; }
  var d = new Date(iso + 'T00:00:00');
  if(isNaN(d.getTime())) return '';
  return NCP_JOURS[d.getDay()];
}

var NCP_FAMILLES = [['Soudure / etancheite', /lasna|langsnaad|dwarsnaad|sealing|seal|niet dicht|lek|naad/i], ['Codage / impression', /coder|codering|gedrukt|geprint|print|etiket|label|sticker|datum|mhd|barcode|ean/i], ['Corps etranger', /vreemd|metaal|plastic|hout|glas|insect|haar|steen/i], ['Emballage / carton', /karton|omdo|doos|doz|zak|verpakking|folie|pallet|palet/i], ['Aspect produit', /zwart|grauw|kleur|colour|vet|defect|stootblauw|kruiden|snit|snijpositie|lengte|producteigen|oorzaak product|ingredi|olie|dosage|fractie|gamma|calibr|structuur|smaak|geur|agtron|droge stof|vochtgehalte|ffa\b|polaire|zuurgraad|peroxide/i], ['Poids / quantite', /gewicht|aantal|te weinig|te veel|stuks/i], ['Temperature / froid', /temp|vriezer|frigo|ontdooid|t°/i], ['Process / panne', /storing|productie andere reden|machine|panne|opstart|stilstand/i], ['Stock / logistique', /stock|magazijn|retour|levering|transport/i], ['Controle / test', /standaardtest|test|controle|monster|staal/i]];

function ncpFamille(lib){ var s = String(lib || ''); for(var i = 0; i < NCP_FAMILLES.length; i++){ if(NCP_FAMILLES[i][1].test(s)) return NCP_FAMILLES[i][0]; } return 'Autre'; }

function ncpBakorder(r){ if(r._bo !== undefined) return r._bo; var t = [r.description, r.ncp_extra_info, r.measures, r.toutes_mesures, JSON.stringify(r.historique_actions || '')].join(' '); var m = String(t).match(/(?:bakorder|ordre|order)[^0-9]{0,20}(\d{6,8})/i); r._bo = m ? m[1] : null; return r._bo; }

function ncpBakorderLien(r){ var bo = ncpBakorder(r); if(!bo) return null; var out = []; NCP_DATA.forEach(function(x){ if(x === r || ncpBakorder(x) !== bo || ncpEstNonClasse(x)) return; var eq = ncpGetEquipe(x); if(eq && out.length < 4) out.push(eq + ' (NCP ' + x.notification + ' du ' + x.created_on + ')'); }); return out.length ? out : null; }

function ncpTexteRecherche(r){ if(!r._srch) r._srch = [r.notification, r.created_on, r.unite, r.ligne, r.type_ncp, r.code_produit, r.famille_produit, r.reporter, r.status, r.description, r.problems, ncpBakorder(r)].join(' ').toLowerCase(); return r._srch; }

function ncpParseFR(s){ var m = String(s || '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null; }

function ncpDelai(r){ var c = ncpParseFR(r.created_on); var h = r.historique_actions || []; var last = null; for(var i = 0; i < h.length; i++){ var d = ncpParseFR(h[i].date_version); if(d && (!last || d > last)) last = d; } if(!c || !last) return null; var j = Math.round((last - c) / 86400000); return j < 0 ? null : j; }

function ncpEstSoldee(r){ return String(r.status || '').toLowerCase().indexOf('vrijgave') >= 0; }

function ncpTexteUtile(r){ var lignes = String(r.ncp_extra_info || '').split(/\r?\n/).filter(function(L){ if(/^\s*(Van|From|Verzonden|Sent|Aan|To|CC|Bcc|Onderwerp|Subject|Datum|Date)\s*:/i.test(L)) return false; if(/^\s*[TM]\s*\+\s*\d/.test(L)) return false; if(/\S+@\S+\.\w{2,}/.test(L)) return false; if(/^\s*www\./i.test(L)) return false; return true; }); return lignes.join(' '); }

function ncpHeureTexte(r){ var t = String(r.description || '') + ' ' + ncpTexteUtile(r); var m = t.match(/\b([01]?\d|2[0-3])[:uh]([0-5]\d)\b/); if(!m) return null; return ('0' + m[1]).slice(-2) + ':' + m[2]; }

function ncpHeureLocale(dp){                       // ISO -> { date, heure } heure d'usine
  var d = new Date(dp);
  if(isNaN(d.getTime())) return null;
  var p = new Intl.DateTimeFormat('fr-BE',{timeZone:'Europe/Brussels',year:'numeric',
          month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(d);
  var g = function(k){ return p.find(function(x){ return x.type === k; }).value; };
  return { date: g('year')+'-'+g('month')+'-'+g('day'),
           heure: (g('hour') === '24' ? '00' : g('hour'))+':'+g('minute') };
}

function ncpHeureDegustation(r){
  var deg = r.degustationsLiees || [];
  if(!deg.length) return null;
  var wanted = r.created_date_iso, match = null;
  for(var i = 0; i < deg.length; i++){
    var loc = deg[i].dateProduction ? ncpHeureLocale(deg[i].dateProduction) : null;
    if(!loc) continue;
    if(!match) match = loc;
    if(wanted && loc.date === wanted){ match = loc; break; }
  }
  if(!match) return null;
  return { heure: match.heure, date_iso: match.date };
}

function ncpHeureInfo(r){
  if(!r.created_date_iso) return { heure: null, src: null, date_iso: null };
  // Priorite : 1) heure reelle d'une degustation liee (vrai horodatage systeme)
  //            2) heure ecrite dans le texte du NCP (le moment reel du defaut, tel que decrit)
  //            3) heure de la fiche, seulement si aucune des deux precedentes n'existe
  //               (c'est souvent juste l'heure de saisie papier, pas celle du defaut)
  var dg = ncpHeureDegustation(r);
  if(dg) return { heure: dg.heure, src: 'degustation', date_iso: dg.date_iso };
  var h = ncpHeureTexte(r);
  if(h) return { heure: h, src: 'texte', date_iso: r.created_date_iso };
  if(r.created_heure && r.heure_fiable !== false) return { heure: r.created_heure, src: 'fiche', date_iso: r.created_date_iso };
  return { heure: null, src: null, date_iso: null };
}

var NCP_SEUIL_PART = 0.15;

var NCP_MAX_PLAGE_TEXTE_H = 6;

var NCP_EQM_CACHE = new WeakMap();

function ncpHeuresTexteToutes(r){                  // toutes les heures citees, dans l'ordre
  var t = String([r.description, r.ncp_extra_info].join(' '));
  var re = /\b([01]?\d|2[0-3])[:uh.]([0-5]\d)\b/g, m, out = [];
  while((m = re.exec(t)) !== null){
    var v = ('0'+m[1]).slice(-2)+':'+m[2];
    if(out.indexOf(v) < 0) out.push(v);
  }
  return out;
}

function ncpFenetre(r){                            // fenetre debut -> fin du defaut
  var mins = function(hh){ return (+hh.slice(0,2))*60 + (+hh.slice(3,5)); };
  var locs = (r.degustationsLiees || []).map(function(d){
    return d.dateProduction ? ncpHeureLocale(d.dateProduction) : null;
  }).filter(Boolean).sort(function(x,y){
    return (x.date+x.heure) < (y.date+y.heure) ? -1 : 1;
  });
  if(locs.length){
    var lA = locs[0], lB = locs[locs.length-1];
    var dur = (new Date(lB.date+'T'+lB.heure+':00') - new Date(lA.date+'T'+lA.heure+':00'))/60000;
    return { dateDebut:lA.date, heureDebut:lA.heure, dateFin:lB.date, heureFin:lB.heure,
             duree:dur, src:(dur > 0 ? 'degustation-plage' : 'degustation'), n:locs.length };
  }
  var hs = ncpHeuresTexteToutes(r);
  if(hs.length && r.created_date_iso){
    var h1 = hs[0], h2 = hs[hs.length-1];
    var span = mins(h2) - mins(h1); if(span < 0) span += 1440;
    if(hs.length > 1 && span > 0 && span <= NCP_MAX_PLAGE_TEXTE_H*60){
      var fin = mins(h2) < mins(h1)
        ? new Date(new Date(r.created_date_iso+'T00:00:00').getTime()+86400000).toISOString().slice(0,10)
        : r.created_date_iso;
      return { dateDebut:r.created_date_iso, heureDebut:h1, dateFin:fin, heureFin:h2,
               duree:span, src:'texte-plage', n:hs.length };
    }
    return { dateDebut:r.created_date_iso, heureDebut:h1, dateFin:r.created_date_iso,
             heureFin:h1, duree:0, src:'texte', n:1 };
  }
  if(r.created_date_iso && r.created_heure)
    return { dateDebut:r.created_date_iso, heureDebut:r.created_heure, dateFin:r.created_date_iso,
             heureFin:r.created_heure, duree:0, src:'fiche', n:1 };
  return null;
}

function ncpEquipesMulti(r){        // { principale, equipes:[{equipe,minutes,part}], multi, src }
  if(r.equipe_override)
    return { equipes:[{equipe:r.equipe_override,minutes:0,part:1}], toutes:[],
             principale:r.equipe_override, multi:false, src:'manuel', duree:0 };
  if(NCP_EQM_CACHE.has(r)) return NCP_EQM_CACHE.get(r);
  var res;
  if(ncpEstNonClasse(r)) res = { equipes:[], toutes:[], principale:null, multi:false, src:'declarant' };
  else {
    var f = ncpFenetre(r);
    if(!f) res = { equipes:[], toutes:[], principale:null, multi:false, src:null };
    else {
      var start = new Date(f.dateDebut+'T'+f.heureDebut+':00');
      var end   = new Date(f.dateFin  +'T'+f.heureFin  +':00');
      if(end < start) end = new Date(end.getTime()+86400000);
      var span = Math.min((end-start)/60000, 24*60), pas = 5, acc = {}, tot = 0;
      for(var m = 0; m <= span; m += pas){
        var cur = new Date(start.getTime()+m*60000);
        var iso = cur.getFullYear()+'-'+('0'+(cur.getMonth()+1)).slice(-2)+'-'+('0'+cur.getDate()).slice(-2);
        var hh  = ('0'+cur.getHours()).slice(-2)+':'+('0'+cur.getMinutes()).slice(-2);
        var eq  = equipeReelle(iso, hh);
        if(eq){ acc[eq] = (acc[eq] || 0) + pas; tot += pas; }
        if(span === 0) break;
      }
      var list = Object.keys(acc).map(function(k){
        return { equipe:k, minutes:acc[k], part: tot ? acc[k]/tot : 0 };
      }).sort(function(x,y){ return y.part - x.part; });
      var keep = list.filter(function(x){ return x.part >= NCP_SEUIL_PART; });
      if(!keep.length && list.length) keep = [list[0]];
      res = { equipes:keep, toutes:list, principale: keep.length ? keep[0].equipe : null,
              multi: keep.length > 1, src:f.src, duree:f.duree };
    }
  }
  NCP_EQM_CACHE.set(r, res);
  return res;
}

function ncpConcerneEquipe(r, eq){
  return ncpEquipesMulti(r).equipes.some(function(x){ return x.equipe === eq; });
}

function ncpTonnagePondere(r, eq){                 // tonnage au pro-rata du temps
  var x = ncpEquipesMulti(r).equipes.find(function(e){ return e.equipe === eq; });
  return x ? (Number(r.total_tonnes) || 0) * x.part : 0;
}

function ncpEstDebloquee(r){ return ncpEstSoldee(r); }

function ncpLibelleSrc(r){ var i = ncpHeureInfo(r); if(i.src === 'degustation') return 'heure reelle de la degustation liee (' + i.heure + ') - la plus fiable'; if(i.src === 'texte') return 'heure ecrite dans le texte du NCP (' + i.heure + ') - prioritaire sur la fiche'; if(i.src === 'fiche') return 'heure de la fiche (' + i.heure + ')'; return 'aucune heure exploitable'; }

function ncpGetEquipe(r){
  if(r.equipe_override) return r.equipe_override;
  if(ncpEstNonClasse(r)) return null; var _hi = ncpHeureInfo(r); if(!_hi.heure) return null;
  return equipeReelle(_hi.date_iso || r.created_date_iso, _hi.heure);
}

var NCP_ACTIONS_RESTANTES = /strippen|dierenvoeding|kwaliteit|stickeren|ompakken|overstapelen|metaaldetector|vergisting|speciale bestemming|tape|bid|bulken|onderneem actie/i;

function ncpMesures(r){
  return String(r.toutes_mesures || r.measures || '').split(/[|,]/).map(function(s){ return s.trim(); }).filter(Boolean);
}

function ncpEstDebloque(r){
  var m = ncpMesures(r);
  if(!m.some(function(x){ return /^vrijgave$/i.test(x); })) return false;
  return !m.some(function(x){ return NCP_ACTIONS_RESTANTES.test(x); });
}

function ncpBlocShift(dateISO, heure){
  if(!dateISO || !heure) return null;
  var hh = parseInt(String(heure).split(':')[0], 10);
  if(isNaN(hh)) return null;
  var d = new Date(dateISO + 'T00:00:00');
  if(isNaN(d.getTime())) return null;
  var jour = function(x){ return x.getFullYear()+'-'+('0'+(x.getMonth()+1)).slice(-2)+'-'+('0'+x.getDate()).slice(-2); };
  var mk = function(ds, h){ return new Date(ds + 'T' + ('0'+h).slice(-2) + ':00:00'); };
  var dow = d.getDay(), we = (dow === 0 || dow === 6);
  if(hh >= 5){
    if(we){
      if(hh < 17) return { d: mk(dateISO,5), f: mk(dateISO,17), b: '05h-17h' };
      return { d: mk(dateISO,17), f: mk(jour(new Date(d.getTime()+86400000)),5), b: '17h-05h' };
    }
    if(hh < 13) return { d: mk(dateISO,5),  f: mk(dateISO,13), b: '05h-13h' };
    if(hh < 21) return { d: mk(dateISO,13), f: mk(dateISO,21), b: '13h-21h' };
    return { d: mk(dateISO,21), f: mk(jour(new Date(d.getTime()+86400000)),5), b: '21h-05h' };
  }
  var v = new Date(d.getTime() - 86400000), vs = jour(v), vdow = v.getDay();
  if(vdow === 0 || vdow === 6) return { d: mk(vs,17), f: mk(dateISO,5), b: '17h-05h' };
  return { d: mk(vs,21), f: mk(dateISO,5), b: '21h-05h' };
}

function ncpHorsShift(r){
  if(!r.created_date_iso || !r.created_heure) return false;
  var hi = ncpHeureInfo(r);
  if(!hi || !hi.heure) return false;
  var bloc = ncpBlocShift(hi.date_iso || r.created_date_iso, hi.heure);
  if(!bloc) return false;
  var crea = new Date(r.created_date_iso + 'T' + r.created_heure + ':00');
  if(isNaN(crea.getTime())) return false;
  return crea < bloc.d || crea >= bloc.f;
}

function ncpSansLabo(r){ return ncpHorsShift(r); }

function ncpSansLaboInpak(r){ return ncpHorsShift(r) && r.type_ncp === 'Inpak'; }

function ncpSansLaboProd(r){ return ncpHorsShift(r) && r.type_ncp === 'Production'; }

function ncpBaseKPI(){
  return (NCP_VUE || []).filter(function(r){ return r.famille_produit !== 'BLK'; });
}

function ncpNonDirigeable(r){
  if(!r.unite) return true;
  if(r.type_ncp === 'Inpak' && !r.ligne) return true;
  return false;
}

function ncpPrioriteRang(r){
  var m = String(r.priority || '').match(/^\s*(\d)/);
  return m ? parseInt(m[1], 10) : 9;
}

function ncpCleDate(r){
  return String(r.created_date_iso || '') + ' ' + String(r.created_heure || '');
}

function ncpTrierListe(rows){
  var c = rows.slice();
  if(NCP_LISTE_TRI === 'priorite'){
    c.sort(function(a, b){
      var d = ncpPrioriteRang(a) - ncpPrioriteRang(b);
      if(d) return d;
      return ncpCleDate(b).localeCompare(ncpCleDate(a));
    });
  } else {
    c.sort(function(a, b){ return ncpCleDate(b).localeCompare(ncpCleDate(a)); });
  }
  return c;
}

function ncpAppliquerFiltreUnite(rows){
  if(NCP_LISTE_FILTRE_UNITE === 'toutes') return rows;
  return rows.filter(function(r){ return r.unite === NCP_LISTE_FILTRE_UNITE; });
}
