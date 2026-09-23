/* metier/logbook.js -- Domaine "Logbook" (onglet "lb").
   Calendrier de synthese retrospective par poste (P1-P5) : absences, NCP,
   temps d'arret et notes manuelles agreges par poste travaille, avec
   comparaison entre deux postes/jours.

   Reutilise EXCLUSIVEMENT la logique metier deja en place ailleurs dans le
   dashboard (equipeReelle(), horaireWeekendJour(), ARRETS_DATA, NCP_DATA,
   ABS) -- aucune nouvelle regle de rattachement equipe n'est inventee ici.

   Perimetre : donnees a partir du 1er janvier 2026 uniquement (decision
   d'Aurelien, 23/09/2026) -- avant cette date, l'enrichissement des sources
   (NCP notamment) est trop incomplet/instable pour etre fiable poste par
   poste. LOGBOOK_DATE_DEBUT sert de garde sur toutes les fonctions
   d'agregation ci-dessous.
*/

var LOGBOOK_DATE_DEBUT = '2026-01-01';
var LOGBOOK_NOTES = {}; // {id: {poste, date, auteur, texte, horodatage_saisie}}

function logbookApresDebut(dateISO){
    return !!dateISO && dateISO >= LOGBOOK_DATE_DEBUT;
}

/* ============================================================
   Ecoute Firebase du noeud dedie aux notes manuelles.
   Ecriture reservee a l'admin (verifiee cote UI ET par les regles
   Firebase, comme le reste du dashboard) -- voir logbookAjouterNote(). */
function loadLogbookNotes(){
    if(!db) return;
    db.ref('logbook_notes').on('value', function(snap){
          LOGBOOK_NOTES = snap.val() || {};
          if(typeof buildLogbook === 'function') buildLogbook();
    }, function(error){
          console.error('[Logbook] Erreur de lecture Firebase :', error);
    });
}

function logbookAjouterNote(dateISO, poste, texte){
    if(!db){ if(typeof toast === 'function') toast(t('pt_firebase_unavailable'), '#ef4444'); return; }
    if(!currentUser || currentUser.role !== 'admin'){
          if(typeof toast === 'function') toast('Reserve a l\'admin', '#ef4444');
          return;
    }
    texte = String(texte || '').trim();
    if(!texte) return;
    db.ref('logbook_notes').push({
          date: dateISO,
          poste: poste,
          auteur: (currentUser && currentUser.email) || 'admin',
          texte: texte,
          horodatage_saisie: new Date().toISOString()
    });
}

/* ============================================================
   Postes travailles un jour donne, avec leur fenetre horaire.
   Semaine : P1/P2 (05h-13h/13h-21h selon parite) + P3 (21h-05h).
   Weekend/ferie/pont (horaireWeekendJour) : P4/P5 (05h-17h/17h-05h).
   Ne reinvente rien : delegue a equipeSemaine()/equipeWeekend()
   (core/format.js) pour savoir QUI tient chaque bloc. */
function logbookPostesDuJour(dateISO){
    var d = new Date(dateISO + 'T00:00:00');
    var dow = d.getDay();
    var estWeekendCalendaire = (dow === 0 || dow === 6);
    var horaireSpecial = (typeof horaireWeekendJour === 'function') ? horaireWeekendJour(dateISO) : undefined;
    var estWeekend = estWeekendCalendaire || !!horaireSpecial;

  if(estWeekend){
        return [
          { poste: equipeWeekend(dateISO, '05h-17h'), debut: '05:00', fin: '17:00', traverseMinuit: false },
          { poste: equipeWeekend(dateISO, '17h-05h'), debut: '17:00', fin: '05:00', traverseMinuit: true }
              ];
  }
    return [
      { poste: equipeSemaine(dateISO, '05h-13h'), debut: '05:00', fin: '13:00', traverseMinuit: false },
      { poste: equipeSemaine(dateISO, '13h-21h'), debut: '13:00', fin: '21:00', traverseMinuit: false },
      { poste: equipeSemaine(dateISO, '21h-05h'), debut: '21:00', fin: '05:00', traverseMinuit: true }
        ];
}

/* Le poste (P1-P5) qui tenait une date/heure donnee -- pure delegation a
   equipeReelle(), deja la source de verite unique du dashboard (gere
   feries/ponts). Pas de logique dupliquee ici. */
function logbookPosteDe(dateISO, heureStr){
    if(typeof equipeReelle !== 'function' || !dateISO || !heureStr) return null;
    return equipeReelle(dateISO, heureStr);
}

/* ============================================================
   Absences chevauchant un poste : ABS n'a que des bornes de jour
   (dd/mm/yyyy), donc on rattache une absence a TOUS les postes du jour
   qu'elle couvre -- pas de fausse precision horaire inventee ici. */
function logbookAbsencesDuPoste(dateISO){
    if(typeof ABS === 'undefined' || !ABS.length) return [];
    var p = dateISO.split('-'); // YYYY-MM-DD
  var jourISOms = new Date(dateISO + 'T00:00:00').getTime();
    function pFR(s){ var pp = String(s).split('/'); return new Date(Number(pp[2]), Number(pp[1]) - 1, Number(pp[0])).getTime(); }
    return ABS.filter(function(a){
          if(!a.a || !a.b) return false;
          var deb = pFR(a.a), fin = pFR(a.b);
          return deb <= jourISOms && fin >= jourISOms;
    });
}

/* ============================================================
   NCP rattaches a un poste precis (heure fiable requise), plus ceux
   du jour sans heure fiable, retournes a part -- decision de conception
   documentee dans Obsidian (Calendrier logbook - design.md) : mieux vaut
   un bloc "non rattache" visible qu'un rattachement invente. */
function logbookNcpDuPoste(dateISO, poste){
    if(typeof NCP_DATA === 'undefined' || !NCP_DATA.length) return { rattaches: [], sansPostePrecis: [] };
    var rattaches = [], sansPostePrecis = [];
    NCP_DATA.forEach(function(r){
          if(!logbookApresDebut(r.created_date_iso)) return;
          if(r.created_date_iso !== dateISO) return;
          var heure = r.heure_fiable !== false ? r.created_heure : null;
          if(!heure){ sansPostePrecis.push(r); return; }
          var p = logbookPosteDe(dateISO, heure);
          if(p === poste) rattaches.push(r);
          else if(!p) sansPostePrecis.push(r);
    });
    return { rattaches: rattaches, sansPostePrecis: sansPostePrecis };
}

/* ============================================================
   Temps d'arret rattaches a un poste precis, via equipeReelle() (deja
   utilisee ailleurs dans le dashboard pour la meme association, ex.
   vues/arrets-inpak.js). Couvre les arrets "avec raison" (duree en
   minutes) ET les micro-arrets agreges (champ "nombre"). */
function logbookArretsDuPoste(dateISO, poste){
    if(typeof ARRETS_DATA === 'undefined') return { avecRaison: [], microstops: [], dureeTotale: 0 };
    var avecRaison = [], microstops = [], dureeTotale = 0;
    Object.keys(ARRETS_DATA).forEach(function(k){
          var a = ARRETS_DATA[k];
          if(!a || !a.date || !a.heure) return;
          if(!logbookApresDebut(a.date)) return;
          if(a.date !== dateISO) return;
          if(logbookPosteDe(a.date, a.heure) !== poste) return;
          if(a.type === 'microstop') microstops.push(a);
          else { avecRaison.push(a); dureeTotale += (a.duree || 0); }
    });
    return { avecRaison: avecRaison, microstops: microstops, dureeTotale: dureeTotale };
}

/* Notes manuelles ecrites sur ce poste precis (cf. loadLogbookNotes()). */
function logbookNotesDuPoste(dateISO, poste){
    return Object.keys(LOGBOOK_NOTES)
      .map(function(id){ return Object.assign({ id: id }, LOGBOOK_NOTES[id]); })
      .filter(function(n){ return n.date === dateISO && n.poste === poste; })
      .sort(function(x, y){ return String(y.horodatage_saisie).localeCompare(String(x.horodatage_saisie)); });
}

/* ============================================================
   Fiche complete d'un poste : point d'entree unique pour la vue. */
function logbookPosteResume(dateISO, poste){
    if(!logbookApresDebut(dateISO)) return null;
    var ncp = logbookNcpDuPoste(dateISO, poste);
    var arrets = logbookArretsDuPoste(dateISO, poste);
    return {
          date: dateISO,
          poste: poste,
          absences: logbookAbsencesDuPoste(dateISO),
          ncp: ncp.rattaches,
          ncpSansPostePrecis: ncp.sansPostePrecis,
          arretsAvecRaison: arrets.avecRaison,
          arretsMicro: arrets.microstops,
          arretsDureeTotale: arrets.dureeTotale,
          notes: logbookNotesDuPoste(dateISO, poste)
    };
}

/* Resume de tous les postes d'un jour, dans l'ordre chronologique. */
function logbookJourResume(dateISO){
    if(!logbookApresDebut(dateISO)) return [];
    return logbookPostesDuJour(dateISO).map(function(p){
          return Object.assign({ debut: p.debut, fin: p.fin }, logbookPosteResume(dateISO, p.poste));
    });
}

/* ============================================================
   Indicateurs compacts pour la vue annuelle (un point rouge/orange par
   jour ayant absence/NCP) -- calcule sur l'annee entiere en une passe,
   plutot que d'appeler logbookJourResume() jour par jour (couteux). */
function logbookIndicateursAnnee(annee){
    var out = {}; // { 'YYYY-MM-DD': {abs:bool, ncp:number} }
  var debutAnnee = annee + '-01-01', finAnnee = annee + '-12-31';
    var debutEffectif = debutAnnee > LOGBOOK_DATE_DEBUT ? debutAnnee : LOGBOOK_DATE_DEBUT;
    if(debutEffectif > finAnnee) return out;

  if(typeof ABS !== 'undefined'){
        function pFR(s){ var pp = String(s).split('/'); return new Date(Number(pp[2]), Number(pp[1]) - 1, Number(pp[0])); }
        function iso(d){ return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
        ABS.forEach(function(a){
                if(!a.a || !a.b) return;
                var cur = pFR(a.a), fin = pFR(a.b);
                var garde = 0;
                while(cur <= fin && garde < 400){
                          var k = iso(cur);
                          if(k >= debutEffectif && k <= finAnnee){
                                      if(!out[k]) out[k] = { abs: false, ncp: 0 };
                                      out[k].abs = true;
                          }
                          cur.setDate(cur.getDate() + 1);
                          garde++;
                }
        });
  }

  if(typeof NCP_DATA !== 'undefined'){
        NCP_DATA.forEach(function(r){
                var k = r.created_date_iso;
                if(!k || k < debutEffectif || k > finAnnee) return;
                if(!out[k]) out[k] = { abs: false, ncp: 0 };
                out[k].ncp++;
        });
  }

  return out;
}
