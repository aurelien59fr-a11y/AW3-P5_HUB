/* core/format.js — equipe (rotation P1..P5) et formatage de dates.
   Extrait de app.js a l'etape 2 du plan Phase 2 (aucune regle metier changee).
   Depend des globales WEEKS25/26/27, SHIFTS25/26/27, H2025/26/27 (declarees
   dans app.js). Utilise par Bradford, Planning, Arrets Inpak, Comparaison,
   Bulk et NCP -- voir la cartographie des onglets. */

// --- Rotation des equipes AW3 ---
// Semaine (lun-ven) : P1/P2 alternent 05h-13h / 13h-21h d'une semaine a
// l'autre, P3 fixe la nuit 21h-05h.
// Weekend (sam-dim) : P4/P5 alternent 05h-17h / 17h-05h d'une semaine a l'autre.
// Regle : une equipe ne fait JAMAIS deux fois le meme horaire deux semaines
// d'affilee. On compte donc les semaines depuis un lundi de reference, et non
// la parite du numero de semaine ISO, qui se repete quand une annee a 53
// semaines (S53 de 2026 puis S01 de 2027 : deux fois la meme parite).
/* Date locale au format AAAA-MM-JJ. A utiliser a la place de
   toISOString().slice(0,10), qui convertit en UTC et donne la veille pour
   une date a minuit en Belgique. */
function isoLocal(d){
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
/* Ajoute n jours CALENDAIRES (insensible aux changements d'heure, contrairement
   a +/- 86400000 ms). */
function ajouterJours(d, n){
  var r = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
  r.setDate(r.getDate() + n);
  return r;
}

function getISOWeek(date){
  var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/* Lundi 30/12/2024 = lundi de la semaine ISO 1 de 2025 (semaine de rotation 0,
   cale sur les plannings officiels 2025 et 2026). */
var ROTATION_LUNDI_REF = Date.UTC(2024, 11, 30);

/* Numero de la semaine de rotation (lundi -> dimanche) d'une date AAAA-MM-JJ :
   0, 1, 2... depuis le lundi de reference (negatif avant). */
function semaineRotation(dateStr){
  var p = String(dateStr).slice(0,10).split('-');
  var jour = Date.UTC(+p[0], +p[1] - 1, +p[2]);
  var dow = (new Date(jour).getUTCDay() + 6) % 7; // 0 = lundi
  return Math.round((jour - dow * 86400000 - ROTATION_LUNDI_REF) / (7 * 86400000));
}
function semaineRotationPaire(dateStr){
  return ((semaineRotation(dateStr) % 2) + 2) % 2 === 0;
}

function equipeSemaine(dateStr, bloc){
  if(bloc === '21h-05h') return 'P3';
  var paire = semaineRotationPaire(dateStr);
  if(bloc === '05h-13h') return paire ? 'P1' : 'P2';
  return paire ? 'P2' : 'P1'; // bloc 13h-21h
}

/* Bloc tenu par P5 un jour en horaire week-end (alternance stricte chaque semaine).
   Samedi et dimanche : par la rotation. Ferie ou pont en semaine : il prolonge
   un week-end et prend son horaire -- lundi/mardi : le week-end qui precede,
   jeudi/vendredi : le week-end qui suit. Mercredi (rare) : table H<annee>. */
function blocP5Weekend(dateStr){
  var iso = String(dateStr).slice(0,10), p = iso.split('-');
  var jour = Date.UTC(+p[0], +p[1] - 1, +p[2]);
  var dow = new Date(jour).getUTCDay();
  var ref = iso;
  if(dow === 1 || dow === 2) ref = new Date(jour - (dow + 1) * 86400000).toISOString().slice(0,10);
  else if(dow === 4 || dow === 5) ref = new Date(jour + (6 - dow) * 86400000).toISOString().slice(0,10);
  else if(dow === 3 && typeof horaireWeekendJour === 'function'){
    var hor = horaireWeekendJour(iso);
    if(hor === '05h-17h' || hor === '17h-05h') return hor;
  }
  return semaineRotationPaire(ref) ? '05h-17h' : '17h-05h';
}

function equipeWeekend(dateStr, bloc){
  return (bloc === blocP5Weekend(dateStr)) ? 'P5' : 'P4';
}

// Renvoie l'equipe (P1 a P5) qui travaillait a une date/heure donnee.
// Lie une ligne d'arret a son groupe de planning (31/32, 33/34, 35/36),
// puis retrouve qui etait affecte a ce groupe ce jour-la — pour repondre
// a "c'est l'arret de qui ?"
function getGroupePourLigne(ligne){
  var l = String(ligne);
  if(l === '31' || l === '32') return '31/32';
  if(l === '33' || l === '34') return '33/34';
  if(l === '35' || l === '36') return '35/36';
  return null;
}

function getOperateur(dateISO, heureISO, ligne){
  var groupe = getGroupePourLigne(ligne);
  if(!groupe) return null;

  // Le weekend, deux equipes (P4/P5) se partagent la meme journee sur
  // 2 blocs (05h-17h / 17h-05h). Cette dashboard ne suit que P5 — si
  // l'heure de l'arret tombe dans le bloc couvert par P4 cette
  // semaine-la, on ne connait pas l'operateur (personne d'autre suivi ici).
  var d = new Date(dateISO + 'T00:00:00');
  var dow = d.getDay();
  var estWeekend = (dow === 0 || dow === 6);
  if(estWeekend && heureISO){
    var equipeArret = equipeReelle(dateISO, heureISO);
    if(equipeArret !== 'P5') return null;
  }

  var parts = dateISO.split('-'); // YYYY-MM-DD
  var year = parts[0], mm = parts[1], dd = parts[2];
  var ddmm = dd + '/' + mm;
  var weeks = weeksPourAnnee(year);
  var shifts = shiftsPourAnnee(year);
  if(!weeks || !shifts) return null; // annee hors planning : operateur inconnu
  var allD = weeks.reduce(function(a,w){ return a.concat(w.d); }, []);
  var idx = allD.indexOf(ddmm);
  if(idx === -1) return null;
  var noms = shifts.filter(function(e){ return e.s[idx] === groupe; }).map(function(e){ return e.n; });
  return noms.length ? noms.join(', ') : null;
}

function getEquipe(dateStr, heureStr){
  var d = new Date(dateStr + 'T00:00:00');
  var dow = d.getDay(); // 0=dim,6=sam
  var estWeekend = (dow === 0 || dow === 6);
  var hh = parseInt(heureStr.split(':')[0], 10);

  if(hh >= 5){
    if(estWeekend) return equipeWeekend(dateStr, hh < 17 ? '05h-17h' : '17h-05h');
    if(hh < 13) return equipeSemaine(dateStr, '05h-13h');
    if(hh < 21) return equipeSemaine(dateStr, '13h-21h');
    return equipeSemaine(dateStr, '21h-05h');
  }
  // hh < 5 : appartient a la nuit demarree la veille
  var veille = new Date(d); veille.setDate(veille.getDate() - 1);
  var veilleDow = veille.getDay();
  var veilleStr = isoLocal(veille); // et non toISOString() : decalait d'un jour (minuit local = veille en UTC)
  var veilleEstWeekend = (veilleDow === 0 || veilleDow === 6);
  if(veilleEstWeekend) return equipeWeekend(veilleStr, '17h-05h');
  return equipeSemaine(veilleStr, '21h-05h');
}

/* --- Jours en horaire week-end : samedis, dimanches, mais aussi feries et ponts ---
   Ces jours-la l'atelier tourne en 2 postes (05h-17h / 17h-05h) tenus par P4 et P5.
   La liste de reference existe deja dans H2025/H2026/H2027, les tables du planning,
   ou la valeur indique le bloc tenu par P5.

   getEquipe() ne connait que samedi et dimanche : il reste volontairement inchange,
   toute l'application passe desormais par equipeReelle(), qui l'enveloppe et ne
   corrige que les feries et les ponts. Sur tous les autres jours elle renvoie
   exactement ce que renvoie getEquipe(). */
function horaireWeekendJour(dateStr){
  var p = String(dateStr).split('-');
  if(p.length !== 3) return undefined;
  var m = null;
  if(p[0] === '2027') m = (typeof H2027 !== 'undefined') ? H2027 : null;
  else if(p[0] === '2026') m = (typeof H2026 !== 'undefined') ? H2026 : null;
  else if(p[0] === '2025') m = (typeof H2025 !== 'undefined') ? H2025 : null;
  return m ? m[p[2] + '/' + p[1]] : undefined;
}

function equipeReelle(dateStr, heureStr){
  if(!dateStr || !heureStr) return getEquipe(dateStr, heureStr);
  var hh = parseInt(String(heureStr).split(':')[0], 10);
  if(!isFinite(hh)) return getEquipe(dateStr, heureStr);
  /* avant 05h on appartient a la nuit demarree la veille */
  var ref = String(dateStr).slice(0,10);
  if(hh < 5){
    var d = new Date(ref + 'T12:00:00');
    if(isNaN(d.getTime())) return getEquipe(dateStr, heureStr);
    d.setDate(d.getDate() - 1);
    ref = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  var hor = horaireWeekendJour(ref);
  if(!hor) return getEquipe(dateStr, heureStr);   /* jour ordinaire : inchange */
  var bloc = (hh >= 5 && hh < 17) ? '05h-17h' : '17h-05h';
  return equipeWeekend(ref, bloc);
}

// ==============================================================
// Formatage des dates -- toujours a la francaise (JJ/MM/AAAA)
// ==============================================================
// dFR() est tolerante : elle accepte une date ISO (2026-08-05), une date
// ISO horodatee (2026-08-05T14:30 ou 2026-08-05 14:30) et laisse passer
// telle quelle toute valeur qui n est pas une date ISO.
function dFR(v){
  if(v === undefined || v === null || v === '') return '-';
  var s = String(v);
  var m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(m) return m[3] + '/' + m[2] + '/' + m[1];
  var mh = s.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}:\d{2})/);
  if(mh) return mh[3] + '/' + mh[2] + '/' + mh[1] + ' ' + mh[4];
  return s;
}

// AAAA-MM -> 'aout 2026' (libelle court pour les axes de graphiques)
var MOIS_COURTS_FR = ['janv.','fevr.','mars','avr.','mai','juin','juil.','aout','sept.','oct.','nov.','dec.'];
function moisFR(ym){
  var m = String(ym).match(/^(\d{4})-(\d{2})$/);
  if(!m) return String(ym);
  return MOIS_COURTS_FR[parseInt(m[2], 10) - 1] + ' ' + m[1];
}

// Conservee pour compatibilite : delegue desormais a dFR()
function dateISOtoFR(iso){
  return dFR(iso);
}

// Trouve l'index (dans WEEKS/SHIFTS de l'annee correspondante) d'une date ISO
function indexPourDate(dateISO){
  var parts = dateISO.split('-');
  var year = parts[0], ddmm = parts[2] + '/' + parts[1];
  var weeks = weeksPourAnnee(year);
  if(!weeks) return { idx: -1, year: year }; // annee non prise en charge
  var allD = weeks.reduce(function(a,w){ return a.concat(w.d); }, []);
  return { idx: allD.indexOf(ddmm), year: year };
}

/* Annees de planning prises en charge. Toute autre annee est REJETEE (null) :
   avant, une date 2024 ou 2028 retombait silencieusement sur 2025. */
var ANNEES_PLANNING = ['2025','2026','2027'];
function shiftsPourAnnee(annee){
  var y = String(annee);
  if(y==='2025') return SHIFTS25;
  if(y==='2026') return SHIFTS26;
  if(y==='2027') return SHIFTS27;
  return null;
}
function weeksPourAnnee(annee){
  var y = String(annee);
  if(y==='2025') return WEEKS25;
  if(y==='2026') return WEEKS26;
  if(y==='2027') return WEEKS27;
  return null;
}
