/* ====================================================================
 * vues/recrutement.js — Domaine Recrutement (onglet "recrutement")
 * Extrait de app.js a l'Etape 9 du plan de refactorisation (Phase 2).
 *
 * Contenu : module IIFE complet et autonome (deja isole dans app.js
 * derriere "(function(){ ... })();"), couvrant toute la gestion des
 * candidats (formulaire, scoring pondere par axes, brouillons,
 * comparaison, graphiques, export PDF/HTML, questionnaire d'entretien).
 * Expose seulement deux points d'entree globaux : window.recAppliquerLangue
 * (i18n) et window.buildRecrutementTab (point d'entree appele par le
 * routeur d'onglets). Les ~40 fonctions et variables internes (AXES,
 * editId, currentScores, etc.) sont des closures privees du module et ne
 * peuvent pas etre extraites individuellement sans casser leurs
 * references mutuelles au sein de la closure.
 *
 * A la difference des autres domaines de l'Etape 9, ce fichier est deplace
 * comme un bloc atomique unique (voir true_depth_scan.js / call_graph.js :
 * la detection naive par "caractere precedent" de list_all_functions.js
 * classait a tort ces 40 fonctions comme top-level ; l'analyse de
 * profondeur reelle a confirme qu'elles sont toutes a depth=1, imbriquees
 * dans cette IIFE).
 * ==================================================================== */

(function(){

var AXES = [
  {key:"securite", titre:"1. Sécurité des personnes et de soi-même", q:"Racontez une situation où respecter une consigne de sécurité vous a fait perdre du temps ou gêné la cadence. Qu'avez-vous fait ?",
    a1:"Contourne la règle si personne ne regarde, minimise le risque (\u00ab ça arrive jamais \u00bb).",
    a3:"Respecte les règles pour lui-même mais ne dit rien si un collègue prend un risque.",
    a5:"Respecte systématiquement, et alerte/rappelle la règle à un collègue en danger — exemple concret vécu."},
  {key:"rigueur", titre:"2. Sécurité alimentaire", q:"Un collègue saute une étape d'hygiène par gain de temps, sans conséquence visible. Vous réagissez comment ?",
    a1:"Relativise (\u00ab si ça se voit pas, c'est pas grave \u00bb).",
    a3:"Suit les règles lui-même mais n'intervient pas face aux autres.",
    a5:"Rappelle la règle avec tact, exemple vécu de vigilance réelle."},
  {key:"fiabilite", titre:"3. Fiabilité / ponctualité", q:"Le travail est en horaires postés/tournants. Racontez une période où votre rythme de vie a été bousculé par le travail — comment vous avez géré ?",
    a1:"Aucun exemple concret, minimise ou nie tout problème passé (\u00ab jamais en retard \u00bb sans contexte).",
    a3:"Reconnaît des difficultés passées, quelques ajustements ponctuels mais pas de vraie méthode.",
    a5:"Exemple précis d'organisation proactive (garde, sommeil, trajet géré à l'avance), stabilité dans la durée."},
  {key:"equipe", titre:"4. Esprit d'équipe", q:"Un collègue est clairement en difficulté sur sa cadence et ça ralentit toute la ligne. Vous faites quoi ?",
    a1:"\u00ab C'est pas mon problème \u00bb, indifférence, ou dénonciation agressive.",
    a3:"Aide si on le lui demande mais n'anticipe pas de lui-même.",
    a5:"Aide spontanée, remonte l'info intelligemment, exemple concret d'entraide vécue."},
  {key:"feedback", titre:"5. Réaction à l'erreur / au feedback", q:"Racontez la dernière fois qu'un responsable vous a fait une remarque. Réaction sur le moment, et après ?",
    a1:"Rejette systématiquement la faute sur les autres, sur la défensive, rancunier.",
    a3:"Accepte en surface (\u00ab ok \u00bb) mais sans changement observable derrière.",
    a5:"Reconnaît, explique concrètement ce qu'il/elle a changé après."},
  {key:"stress", titre:"6. Gestion du stress / cadence", q:"Décrivez une journée où tout s'enchaînait mal (retard, panne, sous-effectif). Comment vous avez tenu ?",
    a1:"Dramatise excessivement, ou nie totalement avoir été stressé (peu crédible).",
    a3:"Tient le coup, reconnaît la difficulté mais sans stratégie claire.",
    a5:"Reste factuel, cherche des solutions, exemple concret de sang-froid."},
  {key:"hierarchie", titre:"7. Rapport à la hiérarchie", q:"Qu'attendez-vous d'un chef d'équipe ? Qu'est-ce qui vous déplaît chez un mauvais manager ?",
    a1:"Attentes floues, vision très rigide/soumise, ou au contraire rejet de toute autorité.",
    a3:"Attentes basiques (\u00ab qu'on me dise ce que je dois faire \u00bb).",
    a5:"Attentes claires et matures (communication, reconnaissance) cohérentes avec un vrai collectif."},
  {key:"motivation", titre:"8. Motivation réelle", q:"Pourquoi ce poste, et pourquoi maintenant ? Qu'est-ce que vous cherchez concrètement ?",
    a1:"Réponse évasive, ou en décalage avec le poste (cherche du calme/solo alors que c'est un poste d'équipe en cadence).",
    a3:"Motivation basique (salaire, proximité) sans lien avec le collectif.",
    a5:"Motivation cohérente avec l'équipe et le rythme, réponse honnête et réfléchie."}
];

var QUESTIONNAIRE_I18N = {
  fr: {
    title: "Grille d'entretien — Sécurité, fiabilité & mentalité",
    subtitle: "Merci de répondre en donnant des exemples concrets vécus.",
    nameLabel: "Nom du candidat :",
    dateLabel: "Date :",
    axes: [
      {titre:"1. Sécurité des personnes et de soi-même", q:"Racontez une situation où respecter une consigne de sécurité vous a fait perdre du temps ou gêné la cadence. Qu'avez-vous fait ?"},
      {titre:"2. Sécurité alimentaire", q:"Un collègue saute une étape d'hygiène par gain de temps, sans conséquence visible. Vous réagissez comment ?"},
      {titre:"3. Fiabilité / ponctualité", q:"Le travail est en horaires postés/tournants. Racontez une période où votre rythme de vie a été bousculé par le travail — comment vous avez géré ?"},
      {titre:"4. Esprit d'équipe", q:"Un collègue est clairement en difficulté sur sa cadence et ça ralentit toute la ligne. Vous faites quoi ?"},
      {titre:"5. Réaction à l'erreur / au feedback", q:"Racontez la dernière fois qu'un responsable vous a fait une remarque. Réaction sur le moment, et après ?"},
      {titre:"6. Gestion du stress / cadence", q:"Décrivez une journée où tout s'enchaînait mal (retard, panne, sous-effectif). Comment vous avez tenu ?"},
      {titre:"7. Rapport à la hiérarchie", q:"Qu'attendez-vous d'un chef d'équipe ? Qu'est-ce qui vous déplaît chez un mauvais manager ?"},
      {titre:"8. Motivation réelle", q:"Pourquoi ce poste, et pourquoi maintenant ? Qu'est-ce que vous cherchez concrètement ?"}
    ]
  },
  nl: {
    title: "Interviewgrid — Veiligheid, betrouwbaarheid & mentaliteit",
    subtitle: "Gelieve te antwoorden met concrete, zelf beleefde voorbeelden.",
    nameLabel: "Naam van de kandidaat:",
    dateLabel: "Datum:",
    axes: [
      {titre:"1. Veiligheid van personen en van uzelf", q:"Vertel over een situatie waarin het naleven van een veiligheidsvoorschrift u tijd deed verliezen of het tempo hinderde. Wat heeft u gedaan?"},
      {titre:"2. Voedselveiligheid", q:"Een collega slaat een hygiënestap over om tijd te winnen, zonder zichtbaar gevolg. Hoe reageert u?"},
      {titre:"3. Betrouwbaarheid / stiptheid", q:"Het werk gebeurt in wisselende ploegendiensten. Vertel over een periode waarin uw levensritme verstoord werd door het werk — hoe heeft u dat aangepakt?"},
      {titre:"4. Teamgeest", q:"Een collega heeft duidelijk moeite met het tempo en dat vertraagt de hele lijn. Wat doet u?"},
      {titre:"5. Reactie op fouten / feedback", q:"Vertel over de laatste keer dat een leidinggevende opmerkingen maakte over uw werk. Hoe reageerde u op dat moment, en nadien?"},
      {titre:"6. Omgaan met stress / werktempo", q:"Beschrijf een dag waarop alles fout liep (vertraging, panne, onderbezetting). Hoe hield u vol?"},
      {titre:"7. Verhouding met leidinggevenden", q:"Wat verwacht u van een ploegleider? Wat stoort u aan een slechte manager?"},
      {titre:"8. Echte motivatie", q:"Waarom deze functie, en waarom nu? Wat zoekt u concreet?"}
    ]
  },
  en: {
    title: "Interview grid — Safety, reliability & mindset",
    subtitle: "Please answer with concrete examples from your own experience.",
    nameLabel: "Candidate name:",
    dateLabel: "Date:",
    axes: [
      {titre:"1. Safety of others and yourself", q:"Tell me about a time when following a safety rule cost you time or slowed down the pace. What did you do?"},
      {titre:"2. Food safety", q:"A colleague skips a hygiene step to save time, with no visible consequence. How do you react?"},
      {titre:"3. Reliability / punctuality", q:"The job involves rotating shift work. Tell me about a time your routine was disrupted by your work schedule — how did you handle it?"},
      {titre:"4. Team spirit", q:"A colleague is clearly struggling to keep up the pace and it's slowing down the whole line. What do you do?"},
      {titre:"5. Reaction to mistakes / feedback", q:"Tell me about the last time a supervisor gave you feedback on your work. How did you react in the moment, and afterward?"},
      {titre:"6. Handling stress / pace", q:"Describe a day when everything went wrong (delays, breakdown, understaffing). How did you cope?"},
      {titre:"7. Relationship with management", q:"What do you expect from a team leader? What bothers you about a bad manager?"},
      {titre:"8. Real motivation", q:"Why this job, and why now? What are you actually looking for?"}
    ]
  }
};

var candidats = [];
var editId = null;
var currentScores = {};
var currentNotes = {};
var currentVerdict = null;
var radarChart = null;
var interviewIndex = 0;
var initialized = false;
var listenerAttached = false;

function $(id){ return document.getElementById(id); }

function recToast(msg, col){
  if(typeof toast === 'function') toast(msg, col || '#3b82f6');
}

function firebaseAvailable(){
  return typeof db !== 'undefined' && db;
}

function attacherListenerCandidats(){
  if(listenerAttached) return;
  if(!firebaseAvailable()) return;
  listenerAttached = true;
  db.ref('recrutement/candidats').on('value', function(snap){
    var data = snap.val() || {};
    candidats = Object.keys(data).map(function(k){ return data[k]; });
    candidats.sort(function(a,b){ return (a.id||'').localeCompare(b.id||''); });
    renderListe();
    renderCompareChecklist();
  }, function(err){
    console.warn('[Recrutement] Erreur lecture Firebase:', err);
    recToast('Accès refusé aux données recrutement', '#ef4444');
  });
}

function sauvegarderCandidat(data){
  if(!firebaseAvailable()){ recToast('Firebase non disponible', '#ef4444'); return Promise.reject(new Error('no-db')); }
  return db.ref('recrutement/candidats/'+data.id).set(data);
}

function supprimerCandidatFB(id){
  if(!firebaseAvailable()) return Promise.reject(new Error('no-db'));
  return db.ref('recrutement/candidats/'+id).remove();
}

var AXES_POIDS = { securite: 2.5, rigueur: 2.5, fiabilite: 1.5, equipe: 1, feedback: 1, stress: 1, hierarchie: 0.75, motivation: 1 }; var AXES_CRITIQUES = ['securite', 'rigueur']; var _recDistribChart = null, _recPredChart = null, _recFunnelChart = null, _recMoisChart = null; function recVal(id){ var e = document.getElementById(id); return e ? String(e.value || '').trim() : ''; } function recSet(id, v){ var e = document.getElementById(id); if(e) e.value = v || ''; } function recScorePondere(c){ var s = c.scores || {}; var num = 0, den = 0; Object.keys(AXES_POIDS).forEach(function(k){ if(s[k]){ num += s[k] * AXES_POIDS[k]; den += AXES_POIDS[k]; } }); return den ? (num / den) : null; } function recAlerte(c){ var s = c.scores || {}; for(var i = 0; i < AXES_CRITIQUES.length; i++){ if(s[AXES_CRITIQUES[i]] && s[AXES_CRITIQUES[i]] <= 2) return AXES_CRITIQUES[i]; } return null; } function recLibelleAxe(k){ for(var i = 0; i < AXES.length; i++){ if(AXES[i].key === k) return AXES[i].titre.replace(/^[0-9]+\. /, ''); } return k; } function recIssueLabel(v){ return recT(v === 'non_retenu' ? 'non retenu' : v === 'embauche' ? 'embauche' : v === 'confirme' ? 'confirme apres essai' : v === 'parti' ? 'parti pendant l essai' : 'en cours'); } function recCouleurNote(n){ return n <= 2 ? '#ef4444' : n === 3 ? '#f59e0b' : n === 4 ? '#34d399' : '#10b981'; } function recBarres(c){ var s = c.scores || {}; var h = '<div style="display:flex;gap:3px;margin-top:6px">'; AXES.forEach(function(a){ var n = s[a.key] || 0; h += '<div title="' + a.titre.replace(/"/g, '') + ' : ' + (n || '-') + '/5" style="width:24px;height:6px;border-radius:3px;background:' + (n ? recCouleurNote(n) : 'var(--bd2)') + '"></div>'; }); return h + '</div>'; } function recSauverBrouillon(){ try { localStorage.setItem('rec_brouillon', JSON.stringify({ id: editId, nom: recVal('rec-f-nom'), scores: currentScores, notes: currentNotes, verdict: currentVerdict, ts: Date.now() })); } catch(e){} } function recEffacerBrouillon(){ try { localStorage.removeItem('rec_brouillon'); } catch(e){} } function recRestaurerBrouillon(){ var b = null; try { b = JSON.parse(localStorage.getItem('rec_brouillon') || 'null'); } catch(e){} if(!b || !b.scores || !Object.keys(b.scores).length) return; if(!confirm(recT('Un entretien non enregistre a ete retrouve') + (b.nom ? ' (' + b.nom + ')' : '') + recT('. Le reprendre ?'))){ recEffacerBrouillon(); return; } editId = b.id || null; currentScores = b.scores || {}; currentNotes = b.notes || {}; currentVerdict = b.verdict || null; recSet('rec-f-nom', b.nom); syncFormulaireDepuisState(); } function recRemplirEmployes(){ var sel = document.getElementById('rec-f-empid'); if(!sel || sel.getAttribute('data-fill')) return; sel.setAttribute('data-fill', '1'); var h = '<option value="">-</option>'; (window.EMP || []).forEach(function(e){ if(e.id) h += '<option value="' + e.id + '">' + e.n + '</option>'; }); sel.innerHTML = h; } function recBradford(c){ if(!c.empId) return null; var emp = (window.EMP || []).filter(function(e){ return e.id === c.empId; })[0]; if(!emp) return null; var b = (window.BD || []).filter(function(x){ return x.n === emp.n; })[0]; return (b && typeof b.sc === 'number') ? b.sc : null; } function verdictLabel(v){
  return recT(v==='bon' ? 'Bon fit' : v==='creuser' ? 'À creuser' : v==='incompatible' ? 'Incompatible' : 'En cours');
}
function verdictPillClass(v){
  return v==='bon' ? 'ok' : v==='creuser' ? 'wn' : v==='incompatible' ? 'cr' : 'rec-encours';
}

// ---------- Sous-navigation (Candidats / Entretien / Analyse) ----------
function goToSubnav(name){
  document.querySelectorAll('#pane-recrutement .rec-subtab').forEach(function(b){
    b.classList.toggle('on', b.dataset.recsub === name);
  });
  document.querySelectorAll('#pane-recrutement .rec-section').forEach(function(s){
    s.classList.toggle('on', s.id === 'rec-tab-'+name);
  });
}
var REC_LBL_NL = { 'Candidats': 'Kandidaten', '+ Entretien': '+ Gesprek', 'Analyse': 'Analyse', 'Candidats évalués': 'Beoordeelde kandidaten', 'Identité': 'Identiteit', 'Nom du candidat': 'Naam kandidaat', 'Date de l\'entretien': 'Datum gesprek', 'Poste vise': 'Functie', 'Unite': 'Unit', 'Regime horaire': 'Uurregeling', 'Evaluateur': 'Beoordelaar', 'Suite donnee': 'Resultaat', 'Employe lie (suivi a 12 mois)': 'Gelinkte medewerker', 'Annuler': 'Annuleren', 'Enregistrer': 'Opslaan', 'Verdict global de compatibilité': 'Algemeen besluit', 'Vérification des références — assiduité': 'Referentiecheck aanwezigheid', 'Comparer des candidats': 'Kandidaten vergelijken', 'Détail des scores': 'Detail van de scores', 'Distribution des notes par axe': 'Spreiding van de scores per as', 'Prediction contre realite': 'Voorspelling tegenover realiteit', 'Entonnoir de recrutement': 'Wervingsfunnel', 'Entretiens par mois': 'Gesprekken per maand', 'Grille d’évaluation': 'Evaluatieraster', 'Questionnaire imprimable (candidat)': 'Printbare vragenlijst (kandidaat)', 'Mode entretien (plein écran)': 'Gespreksmodus (volledig scherm)' , "Voir les rep\u00e8res de notation": "Bekijk de scoringsrichtlijnen", "Masquer les rep\u00e8res": "Verberg de richtlijnen", "Alerte": "Waarschuwing", "Excellent": "Uitstekend", "Exemple concret donn\u00e9 (optionnel)": "Concreet gegeven voorbeeld (optioneel)", "Bon fit": "Goede match", "\u00c0 creuser": "Nader te bekijken", "Incompatible": "Niet compatibel", "En cours": "Lopend", "non retenu": "niet weerhouden", "embauche": "aangeworven", "confirme apres essai": "bevestigd na proefperiode", "parti pendant l essai": "vertrokken tijdens proefperiode", "en cours": "lopend", "Crit\u00e8re": "Criterium", "Pr\u00e9c\u00e9dent": "Vorige", "Ajoute au moins 2 candidats pour comparer.": "Voeg minstens 2 kandidaten toe om te vergelijken.", "Aucun candidat pour l'instant.": "Nog geen kandidaat.", "Lance un entretien pour commencer.": "Start een gesprek om te beginnen.", "Exporter PDF": "PDF exporteren", "Supprimer": "Verwijderen", "Exporter (JSON)": "Exporteren (JSON)", "Importer": "Importeren", "Point \u00e0 v\u00e9rifier en p\u00e9riode d'essai": "Aandachtspunt tijdens de proefperiode", "Statut de la v\u00e9rification": "Status van de controle", "Notes (optionnel)": "Notities (optioneel)", "Pas encore v\u00e9rifi\u00e9": "Nog niet gecontroleerd", "Contact\u00e9e \u2014 retour positif sur l'assiduit\u00e9": "Gecontacteerd — positieve feedback over aanwezigheid", "Contact\u00e9e \u2014 point d'attention signal\u00e9": "Gecontacteerd — aandachtspunt gemeld", "Ancien employeur injoignable / refus": "Vorige werkgever onbereikbaar / weigering", "Candidat supprim\u00e9": "Kandidaat verwijderd", "Fichier t\u00e9l\u00e9charg\u00e9 \u2014 ouvre-le pour imprimer": "Bestand gedownload — open het om af te drukken", "Impossible de g\u00e9n\u00e9rer le fichier": "Kan het bestand niet genereren", "Entretien enregistr\u00e9": "Gesprek opgeslagen", "Erreur lors de l\u2019enregistrement": "Fout bij het opslaan", "Ajoute un nom": "Voeg een naam toe", "Export t\u00e9l\u00e9charg\u00e9": "Export gedownload", "Erreur export": "Fout bij export", "Fichier invalide": "Ongeldig bestand", "Rien de nouveau \u00e0 importer": "Niets nieuws om te importeren", "Import r\u00e9ussi": "Import geslaagd", "Erreur import": "Importfout", "Renseigne le verdict pour terminer": "Vul het besluit in om af te ronden", "Supprimer l\u2019entretien de": "Verwijder het gesprek met", "? Cette action est irr\u00e9versible.": "? Deze actie is onomkeerbaar.", "Une fiche existe deja pour": "Er bestaat al een fiche voor", "(entretien du": "(gesprek van", "). Creer une seconde fiche quand meme ?": "). Toch een tweede fiche aanmaken?", "Note eliminatoire (1 ou 2) sur": "Uitsluitende score (1 of 2) op", ". En agroalimentaire ce critere ne se compense pas par les autres. Enregistrer quand meme en Bon fit ?": ". In de voedingsindustrie wordt dit criterium niet gecompenseerd door de andere. Toch opslaan als Goede match?", "Le verdict \u00ab Bon fit \u00bb semble en d\u00e9calage avec des scores plut\u00f4t bas sur certains crit\u00e8res. Enregistrer quand m\u00eame ?": "Het besluit \"Goede match\" lijkt niet overeen te komen met eerder lage scores op bepaalde criteria. Toch opslaan?", "Le verdict \u00ab Incompatible \u00bb semble en d\u00e9calage avec des scores plut\u00f4t hauts. Enregistrer quand m\u00eame ?": "Het besluit \"Niet compatibel\" lijkt niet overeen te komen met eerder hoge scores. Toch opslaan?", "nouveau(x) candidat(s) trouv\u00e9(s). Les ajouter ?": "nieuwe kandida(a)t(en) gevonden. Toevoegen?", "Un entretien non enregistre a ete retrouve": "Er is een niet-opgeslagen gesprek teruggevonden", ". Le reprendre ?": ". Hervatten?", "Terminer": "Voltooien", "Suivant": "Volgende", "Ce que le candidat a r\u00e9pondu concr\u00e8tement...": "Wat de kandidaat concreet heeft geantwoord...", "Note eliminatoire sur": "Uitsluitende score op", "ALERTE SECURITE": "VEILIGHEIDSWAARSCHUWING", "Point d\u2019attention assiduit\u00e9": "Aandachtspunt aanwezigheid", "Uniquement les questions, sans les rep\u00e8res de notation. T\u00e9l\u00e9charge un fichier \u00e0 ouvrir puis imprimer depuis ton navigateur.": "Alleen de vragen, zonder de scoringsrichtlijnen. Download een bestand om te openen en af te drukken vanuit je browser.", "\u00c0 renseigner apr\u00e8s contact avec l'ancien employeur, pas une question pos\u00e9e directement au candidat.": "In te vullen na contact met de vorige werkgever, geen vraag die rechtstreeks aan de kandidaat wordt gesteld.", "Sur tous les candidats evalues. Un axe ou tout le monde a la meme note ne discrimine rien et doit etre reformule.": "Over alle beoordeelde kandidaten. Een as waarop iedereen dezelfde score heeft, onderscheidt niets en moet worden herschreven.", "Evalues, juges bon fit, embauches, puis confirmes apres la periode d essai.": "Beoordeeld, als goede match beoordeeld, aangeworven, en vervolgens bevestigd na de proefperiode.", "Charge d entretiens sur les 12 derniers mois.": "Aantal gesprekken over de laatste 12 maanden." };
var REC_LBL_EN = { 'Candidats': 'Candidates', '+ Entretien': '+ Interview', 'Analyse': 'Analysis', 'Candidats évalués': 'Assessed candidates', 'Identité': 'Identity', 'Nom du candidat': 'Candidate name', 'Date de l\'entretien': 'Interview date', 'Poste vise': 'Target position', 'Unite': 'Unit', 'Regime horaire': 'Shift schedule', 'Evaluateur': 'Assessor', 'Suite donnee': 'Outcome', 'Employe lie (suivi a 12 mois)': 'Linked employee', 'Annuler': 'Cancel', 'Enregistrer': 'Save', 'Verdict global de compatibilité': 'Overall fit verdict', 'Vérification des références — assiduité': 'Reference check — attendance', 'Comparer des candidats': 'Compare candidates', 'Détail des scores': 'Score detail', 'Distribution des notes par axe': 'Score distribution per axis', 'Prediction contre realite': 'Prediction vs reality', 'Entonnoir de recrutement': 'Recruitment funnel', 'Entretiens par mois': 'Interviews per month', 'Grille d’évaluation': 'Assessment grid', 'Questionnaire imprimable (candidat)': 'Printable questionnaire (candidate)', 'Mode entretien (plein écran)': 'Interview mode (full screen)' , "Voir les rep\u00e8res de notation": "View scoring guidelines", "Masquer les rep\u00e8res": "Hide guidelines", "Alerte": "Alert", "Excellent": "Excellent", "Exemple concret donn\u00e9 (optionnel)": "Concrete example given (optional)", "Bon fit": "Good fit", "\u00c0 creuser": "To dig into", "Incompatible": "Incompatible", "En cours": "In progress", "non retenu": "not selected", "embauche": "hired", "confirme apres essai": "confirmed after trial", "parti pendant l essai": "left during trial", "en cours": "in progress", "Crit\u00e8re": "Criterion", "Pr\u00e9c\u00e9dent": "Previous", "Ajoute au moins 2 candidats pour comparer.": "Add at least 2 candidates to compare.", "Aucun candidat pour l'instant.": "No candidate yet.", "Lance un entretien pour commencer.": "Start an interview to begin.", "Exporter PDF": "Export PDF", "Supprimer": "Delete", "Exporter (JSON)": "Export (JSON)", "Importer": "Import", "Point \u00e0 v\u00e9rifier en p\u00e9riode d'essai": "Point to verify during trial period", "Statut de la v\u00e9rification": "Verification status", "Notes (optionnel)": "Notes (optional)", "Pas encore v\u00e9rifi\u00e9": "Not yet verified", "Contact\u00e9e \u2014 retour positif sur l'assiduit\u00e9": "Contacted — positive feedback on attendance", "Contact\u00e9e \u2014 point d'attention signal\u00e9": "Contacted — concern flagged", "Ancien employeur injoignable / refus": "Previous employer unreachable / refused", "Candidat supprim\u00e9": "Candidate deleted", "Fichier t\u00e9l\u00e9charg\u00e9 \u2014 ouvre-le pour imprimer": "File downloaded — open it to print", "Impossible de g\u00e9n\u00e9rer le fichier": "Unable to generate the file", "Entretien enregistr\u00e9": "Interview saved", "Erreur lors de l\u2019enregistrement": "Error while saving", "Ajoute un nom": "Add a name", "Export t\u00e9l\u00e9charg\u00e9": "Export downloaded", "Erreur export": "Export error", "Fichier invalide": "Invalid file", "Rien de nouveau \u00e0 importer": "Nothing new to import", "Import r\u00e9ussi": "Import successful", "Erreur import": "Import error", "Renseigne le verdict pour terminer": "Fill in the verdict to finish", "Supprimer l\u2019entretien de": "Delete the interview with", "? Cette action est irr\u00e9versible.": "? This action cannot be undone.", "Une fiche existe deja pour": "A record already exists for", "(entretien du": "(interview from", "). Creer une seconde fiche quand meme ?": "). Create a second record anyway?", "Note eliminatoire (1 ou 2) sur": "Disqualifying score (1 or 2) on", ". En agroalimentaire ce critere ne se compense pas par les autres. Enregistrer quand meme en Bon fit ?": ". In food manufacturing this criterion cannot be offset by others. Save as Good fit anyway?", "Le verdict \u00ab Bon fit \u00bb semble en d\u00e9calage avec des scores plut\u00f4t bas sur certains crit\u00e8res. Enregistrer quand m\u00eame ?": "The \"Good fit\" verdict seems inconsistent with rather low scores on some criteria. Save anyway?", "Le verdict \u00ab Incompatible \u00bb semble en d\u00e9calage avec des scores plut\u00f4t hauts. Enregistrer quand m\u00eame ?": "The \"Incompatible\" verdict seems inconsistent with rather high scores. Save anyway?", "nouveau(x) candidat(s) trouv\u00e9(s). Les ajouter ?": "new candidate(s) found. Add them?", "Un entretien non enregistre a ete retrouve": "An unsaved interview was found", ". Le reprendre ?": ". Resume it?", "Terminer": "Finish", "Suivant": "Next", "Ce que le candidat a r\u00e9pondu concr\u00e8tement...": "What the candidate concretely answered...", "Note eliminatoire sur": "Disqualifying score on", "ALERTE SECURITE": "SAFETY ALERT", "Point d\u2019attention assiduit\u00e9": "Attendance concern", "Uniquement les questions, sans les rep\u00e8res de notation. T\u00e9l\u00e9charge un fichier \u00e0 ouvrir puis imprimer depuis ton navigateur.": "Questions only, without the scoring guidelines. Download a file to open and print from your browser.", "\u00c0 renseigner apr\u00e8s contact avec l'ancien employeur, pas une question pos\u00e9e directement au candidat.": "To fill in after contacting the previous employer, not a question asked directly to the candidate.", "Sur tous les candidats evalues. Un axe ou tout le monde a la meme note ne discrimine rien et doit etre reformule.": "Across all assessed candidates. An axis where everyone has the same score discriminates nothing and should be reworded.", "Evalues, juges bon fit, embauches, puis confirmes apres la periode d essai.": "Assessed, judged good fit, hired, then confirmed after the trial period.", "Charge d entretiens sur les 12 derniers mois.": "Interview load over the last 12 months." };
function recTexteFR(el){ if(!el.getAttribute('data-fr')) el.setAttribute('data-fr', el.textContent.trim()); return el.getAttribute('data-fr'); }
function recT(fr){ var l = (typeof LANG !== 'undefined' ? LANG : 'fr'); var m = l === 'nl' ? REC_LBL_NL : (l === 'en' ? REC_LBL_EN : null); return (m && m[fr]) ? m[fr] : fr; }
window.recAppliquerLangue = function(){
  var pane = document.getElementById('pane-recrutement'); if(!pane) return;
  var l = (typeof LANG !== 'undefined' ? LANG : 'fr');
  var recLbl = l === 'nl' ? REC_LBL_NL : (l === 'en' ? REC_LBL_EN : null);
  pane.querySelectorAll('.cct, label, .rec-subtab, .rec-empty-line, .rec-hint, #rec-f-ref-statut option, #rec-btn-annuler, #rec-btn-enregistrer, #rec-btn-mode-entretien, #rec-btn-pdf, #rec-btn-supprimer, #rec-btn-export-json, #rec-btn-import-json, #rec-io-prev, #rec-verdict-choix button').forEach(function(el){
    var fr = recTexteFR(el);
    var m2 = fr.match(/^([^\p{L}]*)(.*)$/u);
    var prefix = m2 ? m2[1] : '', core = m2 ? m2[2] : fr;
    var translated = (recLbl && recLbl[core]) ? recLbl[core] : core;
    el.textContent = prefix + translated;
  });
  var qi = QUESTIONNAIRE_I18N[l] || QUESTIONNAIRE_I18N.fr;
  if(qi && qi.axes){
    pane.querySelectorAll('.rec-axe').forEach(function(div, i){
      if(!qi.axes[i]) return;
      var tEl = div.querySelector('.rec-axe-titre');
      var qEl = div.querySelector('.rec-axe-question');
      if(tEl) tEl.textContent = qi.axes[i].titre;
      if(qEl) qEl.textContent = qi.axes[i].q;
    });
  }
  if(typeof renderListe === 'function' && document.getElementById('rec-liste-items')) renderListe();
  if(typeof renderAnalyse === 'function' && document.getElementById('rec-radar')) renderAnalyse();
}; function initSubnav(){
  document.querySelectorAll('#pane-recrutement .rec-subtab').forEach(function(btn){
    btn.addEventListener('click', function(){ goToSubnav(btn.dataset.recsub); });
  });
}

// ---------- Grille d'axes ----------
function buildAxes(){
  var c = $('rec-axes-container');
  if(!c) return;
  c.innerHTML = '<div class="cch"><div class="cct">'+recT('Grille d\u2019évaluation')+'</div></div>';
  AXES.forEach(function(axe){
    var div = document.createElement('div');
    div.className = 'rec-axe';
    div.innerHTML =
      '<div class="rec-axe-titre">'+axe.titre+'</div>'+
      '<div class="rec-axe-question">'+axe.q+'</div>'+
      '<button type="button" class="rec-toggle-reperes">'+recT('Voir les repères de notation')+' \u25be</button>'+
      '<div class="rec-reperes rec-hidden">'+
        '<div class="rec-repere"><span class="rec-repere-n rec-s1">1</span>'+axe.a1+'</div>'+
        '<div class="rec-repere"><span class="rec-repere-n rec-s3">3</span>'+axe.a3+'</div>'+
        '<div class="rec-repere"><span class="rec-repere-n rec-s4">5</span>'+axe.a5+'</div>'+
      '</div>'+
      '<div class="rec-scale" data-axe="'+axe.key+'">'+
        [1,2,3,4,5].map(function(n){ return '<button type="button" data-n="'+n+'">'+n+'</button>'; }).join('')+
      '</div>'+
      '<div class="rec-scale-labels"><span>'+recT('Alerte')+'</span><span>'+recT('Excellent')+'</span></div>'+
      '<div class="rec-axe-note-label">'+recT('Exemple concret donné (optionnel)')+'</div>'+
      '<textarea class="rec-axe-note" data-axe="'+axe.key+'" placeholder="'+recT('Ce que le candidat a répondu concrètement...')+'"></textarea>';
    c.appendChild(div);
  });
  c.querySelectorAll('.rec-toggle-reperes').forEach(function(t){
    t.addEventListener('click', function(){
      var rep = t.nextElementSibling;
      rep.classList.toggle('rec-hidden');
      t.textContent = rep.classList.contains('rec-hidden') ? (recT('Voir les repères de notation')+' \u25be') : (recT('Masquer les repères')+' \u25b4');
    });
  });
  c.querySelectorAll('.rec-scale').forEach(function(scale){
    scale.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click', function(){
        scale.querySelectorAll('button').forEach(function(x){ x.classList.remove('sel'); });
        b.classList.add('sel');
        currentScores[scale.dataset.axe] = parseInt(b.dataset.n, 10); recSauverBrouillon();
      });
    });
  });
  c.querySelectorAll('.rec-axe-note').forEach(function(t){
    t.addEventListener('input', function(){ currentNotes[t.dataset.axe] = t.value; recSauverBrouillon(); });
  });
}

// ---------- Formulaire ----------
function resetFormulaire(){
  editId = null;
  currentScores = {};
  currentNotes = {};
  currentVerdict = null;
  $('rec-f-nom').value = '';
  $('rec-f-date').value = new Date().toISOString().slice(0,10);
  $('rec-f-suivi').value = '';
  $('rec-f-ref-statut').value = '';
  $('rec-f-ref-notes').value = '';  ['rec-f-poste','rec-f-unite','rec-f-shift','rec-f-evaluateur','rec-f-issue','rec-f-empid'].forEach(function(id){ recSet(id, ''); });
  document.querySelectorAll('#pane-recrutement .rec-scale button').forEach(function(b){ b.classList.remove('sel'); });
  document.querySelectorAll('#pane-recrutement .rec-verdict-choix button').forEach(function(b){ b.className=''; });
  document.querySelectorAll('#pane-recrutement .rec-axe-note').forEach(function(t){ t.value=''; });
  $('rec-edit-actions').style.display = 'none';
}

function ouvrirCandidat(id){
  var c = candidats.filter(function(x){ return x.id===id; })[0];
  if(!c) return;
  resetFormulaire();
  editId = c.id;
  currentScores = Object.assign({}, c.scores || {});
  currentNotes = Object.assign({}, c.notes || {});
  currentVerdict = c.verdict;
  $('rec-f-nom').value = c.nom;
  $('rec-f-date').value = c.date;
  $('rec-f-suivi').value = c.suivi || '';
  $('rec-f-ref-statut').value = (c.reference && c.reference.statut) || '';
  $('rec-f-ref-notes').value = (c.reference && c.reference.notes) || '';  recRemplirEmployes(); recSet('rec-f-poste', c.poste); recSet('rec-f-unite', c.unite); recSet('rec-f-shift', c.shift); recSet('rec-f-evaluateur', c.evaluateur); recSet('rec-f-issue', c.issue); recSet('rec-f-empid', c.empId);
  document.querySelectorAll('#pane-recrutement .rec-scale').forEach(function(scale){
    var val = currentScores[scale.dataset.axe];
    scale.querySelectorAll('button').forEach(function(b){
      b.classList.toggle('sel', parseInt(b.dataset.n,10)===val);
    });
  });
  document.querySelectorAll('#pane-recrutement .rec-axe-note').forEach(function(t){
    t.value = currentNotes[t.dataset.axe] || '';
  });
  if(currentVerdict){
    var btn = document.querySelector('#pane-recrutement .rec-verdict-choix button[data-v="'+currentVerdict+'"]');
    if(btn) btn.classList.add('sel-'+currentVerdict);
  }
  $('rec-edit-actions').style.display = 'flex';
  goToSubnav('formulaire');
}

// ---------- Liste ----------
function renderListe(){
  var wrap = $('rec-liste-items');
  var vide = $('rec-liste-vide');
  if(!wrap || !vide) return;
  wrap.innerHTML = '';
  if(!candidats.length){ vide.style.display='block'; return; }
  vide.style.display='none';
  candidats.slice().reverse().forEach(function(c){
    var vals = Object.keys(c.scores||{}).map(function(k){ return c.scores[k]; });
    var moyenne = vals.length ? (vals.reduce(function(a,b){return a+b;},0)/vals.length).toFixed(1) : '-';
    var outer = document.createElement('div');
    outer.className = 'rec-liste-item-wrap';
    var div = document.createElement('div');
    div.className = 'rec-liste-item';
    div.innerHTML =
      '<div style="flex:1"><div class="rec-nom">'+c.nom+(recAlerte(c) ? ' <span title="'+recT('Note eliminatoire sur')+' '+recLibelleAxe(recAlerte(c))+'" style="color:#ef4444;font-size:11px;font-weight:700">&#9888; '+recT('ALERTE SECURITE')+'</span>' : '')+'</div><div class="rec-meta">'+c.date+' &middot; pondere '+(recScorePondere(c)!==null?recScorePondere(c).toFixed(1):'-')+'/5 &middot; brut '+moyenne+'/5'+(c.poste?' &middot; '+c.poste:'')+(c.unite?' '+c.unite:'')+' &middot; '+recIssueLabel(c.issue)+'</div>'+recBarres(c)+'</div>'+
      '<div style="display:flex;align-items:center;gap:6px">'+
      (c.reference && c.reference.statut==='surveiller' ? '<span title="'+recT('Point d\u2019attention assiduité')+'" style="font-size:14px">\u26a0\ufe0f</span>' : '')+
      '<span class="pill '+verdictPillClass(c.verdict)+'">'+verdictLabel(c.verdict)+'</span>'+
      '</div>';
    div.addEventListener('click', function(){ ouvrirCandidat(c.id); });
    var del = document.createElement('button');
    del.className = 'rec-btn-suppr-mini';
    del.textContent = '\ud83d\uddd1';
    del.addEventListener('click', function(e){
      e.stopPropagation();
      if(confirm(recT('Supprimer l\u2019entretien de')+' '+c.nom+' '+recT('? Cette action est irréversible.'))){
        supprimerCandidatFB(c.id).then(function(){ recToast(recT('Candidat supprimé'), '#ef4444'); });
      }
    });
    outer.appendChild(div);
    outer.appendChild(del);
    wrap.appendChild(outer);
  });
}

// ---------- Impression (téléchargement HTML autonome) ----------
function enveloppeImprimable(titre, corps){
  return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>'+titre+'</title><style>'+
    'body{font-family:Arial,Helvetica,sans-serif;color:#111;max-width:760px;margin:30px auto;padding:0 16px}'+
    'h1{font-size:21px;margin-bottom:2px}.pa-meta{font-size:12.5px;color:#555;margin-bottom:18px}'+
    '.pa-verdict{font-size:14px;font-weight:bold;margin-bottom:14px}.pa-field{font-size:13.5px;margin-bottom:10px}'+
    'table{width:100%;border-collapse:collapse;margin-bottom:16px}'+
    'th,td{border:1px solid #ccc;padding:7px 9px;text-align:left;font-size:12.5px;vertical-align:top}th{background:#f0f0f0}'+
    '.q-block{margin-bottom:22px;page-break-inside:avoid}.q-num{font-weight:bold;font-size:14px;margin-bottom:4px}'+
    '.q-text{font-size:12.5px;color:#333;margin-bottom:8px;line-height:1.45}.q-box{border:1px solid #999;border-radius:4px;height:78px}'+
    '.print-hint{background:#FFF6DD;border:1px solid #F0D98C;border-radius:8px;padding:10px 14px;font-size:12.5px;margin-bottom:22px;color:#5a4a1a}'+
    '@media print{.print-hint{display:none}}'+
    '</style></head><body>'+
    '<div class="print-hint">Ouvre le menu de ton navigateur puis choisis <strong>Imprimer</strong> ou <strong>Enregistrer en PDF</strong>.</div>'+
    corps+'</body></html>';
}
function telechargerHTML(filename, htmlContent){
  try{
    var blob = new Blob([htmlContent], {type:'text/html'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    recToast('Fichier téléchargé — ouvre-le pour imprimer', '#10b981');
  }catch(e){
    recToast('Impossible de générer le fichier', '#ef4444');
  }
}
function exporterFichePDF(){
  if(!editId) return;
  var c = candidats.filter(function(x){ return x.id===editId; })[0];
  if(!c) return;
  var rows = AXES.map(function(a){
    var score = (c.scores && c.scores[a.key]) ? c.scores[a.key] : '-';
    var note = (c.notes && c.notes[a.key]) ? c.notes[a.key] : '';
    return '<tr><td>'+a.titre+'</td><td style="text-align:center">'+score+'/5</td><td>'+note+'</td></tr>';
  }).join('');
  var refLabels = {positif:"Retour positif sur l'assiduité", surveiller:"Point d'attention signalé", injoignable:"Ancien employeur injoignable / refus"};
  var refLabel = (c.reference && c.reference.statut) ? refLabels[c.reference.statut] : 'Non vérifié';
  var corps =
    '<h1>Évaluation mentalité — '+c.nom+'</h1>'+
    '<div class="pa-meta">Entretien du '+c.date+' &middot; Ploeg 5 — AW3</div>'+
    '<div class="pa-verdict">Verdict global : '+verdictLabel(c.verdict)+'</div>'+
    '<table><tr><th>Critère</th><th>Score</th><th>Exemple concret / notes</th></tr>'+rows+'</table>'+
    '<div style="margin-bottom:10px"><strong>Vérification référence — assiduité :</strong> '+refLabel+(c.reference && c.reference.notes ? '<br>'+c.reference.notes : '')+'</div>'+
    (c.suivi ? '<div><strong>Point à vérifier en période d\u2019essai :</strong><br>'+c.suivi+'</div>' : '');
  var html = enveloppeImprimable('Fiche — '+c.nom, corps);
  var nomFichier = 'fiche-'+c.nom.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')+'.html';
  telechargerHTML(nomFichier, html);
}
function imprimerQuestionnaire(lang){
  var t = QUESTIONNAIRE_I18N[lang];
  var blocks = t.axes.map(function(a){
    return '<div class="q-block"><div class="q-num">'+a.titre+'</div><div class="q-text">'+a.q+'</div><div class="q-box"></div></div>';
  }).join('');
  var corps =
    '<h1>'+t.title+'</h1><div class="pa-meta">'+t.subtitle+'</div>'+
    '<div class="pa-field">'+t.nameLabel+' ____________________________________</div>'+
    '<div class="pa-field">'+t.dateLabel+' ____________________________________</div>'+
    '<div style="margin-top:14px">'+blocks+'</div>';
  var html = enveloppeImprimable(t.title, corps);
  telechargerHTML('questionnaire-candidat-'+lang+'.html', html);
}

// ---------- Mode entretien plein écran ----------
function syncFormulaireDepuisState(){
  document.querySelectorAll('#rec-axes-container .rec-scale').forEach(function(scale){
    var key = scale.dataset.axe;
    scale.querySelectorAll('button').forEach(function(b){
      b.classList.toggle('sel', parseInt(b.dataset.n,10)===currentScores[key]);
    });
  });
  document.querySelectorAll('#rec-axes-container .rec-axe-note').forEach(function(t){
    t.value = currentNotes[t.dataset.axe] || '';
  });
}
function openInterviewStep(){
  var axe = AXES[interviewIndex];
  var body = $('rec-io-body');
  var noteVal = currentNotes[axe.key] || '';
  body.innerHTML =
    '<div class="rec-io-question-titre">'+axe.titre+'</div>'+
    '<div class="rec-io-question-txt">'+axe.q+'</div>'+
    '<button type="button" class="rec-toggle-reperes" id="rec-io-toggle-reperes">'+recT('Voir les repères de notation')+' \u25be</button>'+
    '<div class="rec-reperes rec-hidden" id="rec-io-reperes">'+
      '<div class="rec-repere"><span class="rec-repere-n rec-s1">1</span>'+axe.a1+'</div>'+
      '<div class="rec-repere"><span class="rec-repere-n rec-s3">3</span>'+axe.a3+'</div>'+
      '<div class="rec-repere"><span class="rec-repere-n rec-s4">5</span>'+axe.a5+'</div>'+
    '</div>'+
    '<div class="rec-scale" data-axe="'+axe.key+'" id="rec-io-scale">'+
      [1,2,3,4,5].map(function(n){ return '<button type="button" data-n="'+n+'" class="'+(currentScores[axe.key]===n?'sel':'')+'">'+n+'</button>'; }).join('')+
    '</div>'+
    '<div class="rec-scale-labels"><span>'+recT('Alerte')+'</span><span>'+recT('Excellent')+'</span></div>'+
    '<label>'+recT('Exemple concret donné (optionnel)')+'</label>'+
    '<textarea id="rec-io-note" placeholder="'+recT('Ce que le candidat a répondu concrètement...')+'">'+noteVal+'</textarea>';
  $('rec-io-progress').textContent = (interviewIndex+1)+' / '+AXES.length;
  $('rec-io-toggle-reperes').addEventListener('click', function(){ $('rec-io-reperes').classList.toggle('rec-hidden'); var hid = $('rec-io-reperes').classList.contains('rec-hidden'); $('rec-io-toggle-reperes').textContent = (hid?recT('Voir les repères de notation'):recT('Masquer les repères')) + ' ' + (hid?'\u25be':'\u25b4'); });
  $('rec-io-scale').querySelectorAll('button').forEach(function(b){
    b.addEventListener('click', function(){
      $('rec-io-scale').querySelectorAll('button').forEach(function(x){ x.classList.remove('sel'); });
      b.classList.add('sel');
      currentScores[axe.key] = parseInt(b.dataset.n,10);
    });
  });
  $('rec-io-note').addEventListener('input', function(e){ currentNotes[axe.key] = e.target.value; });
  $('rec-io-prev').disabled = (interviewIndex===0);
  $('rec-io-next').textContent = (interviewIndex===AXES.length-1) ? (recT('Terminer')+' \u2713') : (recT('Suivant')+' \u25b8');
}

// ---------- Analyse (radar) ----------
var COULEURS = ['#10b981','#f59e0b','#ef4444','#8b5cf6','#3b82f6'];
function renderCompareChecklist(){ recBuildGraphiques();
  var wrap = $('rec-compare-checklist');
  if(!wrap) return;
  wrap.innerHTML = '';
  candidats.forEach(function(c){
    var div = document.createElement('label');
    div.className = 'rec-cc-item';
    div.innerHTML = '<input type="checkbox" value="'+c.id+'" class="rec-cc-check"><span>'+c.nom+'</span>';
    wrap.appendChild(div);
  });
  wrap.querySelectorAll('.rec-cc-check').forEach(function(chk){
    chk.addEventListener('change', renderAnalyse);
  });
  var checks = wrap.querySelectorAll('.rec-cc-check');
  if(checks.length){
    checks[checks.length-1].checked = true;
    if(checks.length>1) checks[checks.length-2].checked = true;
  }
  renderAnalyse();
}
function recBuildGraphiques(){ if(typeof Chart === 'undefined') return; var all = candidats || []; var cd = document.getElementById('rec-distrib'); if(cd){ var ds = AXES.map(function(a){ var arr = [0, 0, 0, 0, 0]; all.forEach(function(c){ var n = (c.scores || {})[a.key]; if(n) arr[n - 1]++; }); return arr; }); var sets = [1, 2, 3, 4, 5].map(function(n, i){ return { label: n + '/5', data: AXES.map(function(a, j){ return ds[j][i]; }), backgroundColor: recCouleurNote(n), stack: 's' }; }); if(_recDistribChart){ _recDistribChart.destroy(); } _recDistribChart = new Chart(cd, { type: 'bar', data: { labels: AXES.map(function(a){ return a.titre.replace(/^[0-9]+\. /, '').slice(0, 18); }), datasets: sets }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#8b90a4', boxWidth: 10, font: { size: 10 } } } }, scales: { x: { stacked: true, grid: { display: false }, ticks: { color: '#8b90a4', maxRotation: 45, minRotation: 45, font: { size: 9 } } }, y: { stacked: true, beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4', precision: 0 } } } } }); } var cp = document.getElementById('rec-pred'); if(cp){ var pts = []; all.forEach(function(c){ var x = recScorePondere(c); var y = recBradford(c); if(x !== null && y !== null) pts.push({ x: Number(x.toFixed(2)), y: y, nom: c.nom }); }); var info = document.getElementById('rec-pred-info'); if(info) info.textContent = pts.length ? (pts.length + ' candidat(s) relie(s) a un employe. Score pondere de l entretien en X, score Bradford actuel en Y : un nuage qui descend vers la droite valide la grille.') : 'Aucun candidat relie a un employe pour le moment. Renseigne le champ Employe lie sur une fiche embauchee pour alimenter ce graphique.'; if(_recPredChart){ _recPredChart.destroy(); } _recPredChart = new Chart(cp, { type: 'scatter', data: { datasets: [{ data: pts, backgroundColor: '#3b82f6', pointRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(ctx){ var p = ctx.raw; return p.nom + ' : entretien ' + p.x + '/5, Bradford ' + p.y; } } } }, scales: { x: { min: 1, max: 5, title: { display: true, text: 'Score entretien pondere', color: '#8b90a4' }, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } }, y: { beginAtZero: true, title: { display: true, text: 'Score Bradford', color: '#8b90a4' }, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4' } } } } }); } var cf = document.getElementById('rec-funnel'); if(cf){ var nEv = all.length; var nBon = all.filter(function(c){ return c.verdict === 'bon'; }).length; var nEmb = all.filter(function(c){ return c.issue === 'embauche' || c.issue === 'confirme'; }).length; var nCon = all.filter(function(c){ return c.issue === 'confirme'; }).length; if(_recFunnelChart){ _recFunnelChart.destroy(); } _recFunnelChart = new Chart(cf, { type: 'bar', data: { labels: ['Evalues', 'Bon fit', 'Embauches', 'Confirmes'], datasets: [{ data: [nEv, nBon, nEmb, nCon], backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'], borderRadius: 4 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4', precision: 0 } }, y: { grid: { display: false }, ticks: { color: '#8b90a4' } } } } }); } var cm = document.getElementById('rec-mois'); if(cm){ var mois = [], cnt = []; var d0 = new Date(); for(var k = 11; k >= 0; k--){ var dd = new Date(d0.getFullYear(), d0.getMonth() - k, 1); mois.push(dd.getFullYear() + '-' + ('0' + (dd.getMonth() + 1)).slice(-2)); cnt.push(0); } all.forEach(function(c){ var i = mois.indexOf(String(c.date || '').slice(0, 7)); if(i >= 0) cnt[i]++; }); if(_recMoisChart){ _recMoisChart.destroy(); } _recMoisChart = new Chart(cm, { type: 'bar', data: { labels: mois, datasets: [{ data: cnt, backgroundColor: '#8b5cf6', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#8b90a4', font: { size: 9 } } }, y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b90a4', precision: 0 } } } } }); } } function renderAnalyse(){ recRemplirEmployes(); recBuildGraphiques();
  var checked = document.querySelectorAll('#pane-recrutement .rec-cc-check:checked');
  var ids = Array.prototype.map.call(checked, function(c){ return c.value; });
  var selected = candidats.filter(function(c){ return ids.indexOf(c.id) !== -1; });
  var canvas = $('rec-radar');
  var vide = $('rec-analyse-vide');
  var tableauCard = $('rec-tableau-card');
  if(!canvas || !vide || !tableauCard) return;

  if(!selected.length){
    vide.style.display = 'block';
    canvas.style.display = 'none';
    tableauCard.style.display = 'none';
    if(radarChart){ radarChart.destroy(); radarChart = null; }
    return;
  }
  vide.style.display = 'none';
  canvas.style.display = 'block';
  tableauCard.style.display = 'block';

  var labels = AXES.map(function(a){ return a.titre.replace(/^[0-9]+\. /,''); });
  var datasets = selected.map(function(c,i){
    return {
      label: c.nom,
      data: AXES.map(function(a){ return (c.scores && c.scores[a.key]) ? c.scores[a.key] : 0; }),
      borderColor: COULEURS[i % COULEURS.length],
      backgroundColor: COULEURS[i % COULEURS.length]+'33',
      borderWidth: 2,
      pointBackgroundColor: COULEURS[i % COULEURS.length]
    };
  });

  if(candidats.length > 1){ var moyRef = AXES.map(function(a){ var n = 0, s = 0; candidats.forEach(function(c){ var v = (c.scores || {})[a.key]; if(v){ s += v; n++; } }); return n ? Number((s / n).toFixed(2)) : 0; }); datasets.push({ label: 'Moyenne de tous les candidats', data: moyRef, borderColor: 'rgba(255,255,255,.4)', backgroundColor: 'rgba(255,255,255,.05)', borderWidth: 1, borderDash: [5, 4], pointRadius: 2, pointBackgroundColor: 'rgba(255,255,255,.5)' }); }  if(radarChart) radarChart.destroy();
  if(typeof Chart !== 'undefined'){
    radarChart = new Chart(canvas, {
      type: 'radar',
      data: { labels: labels, datasets: datasets },
      options: {
        scales: { r: { min:0, max:5, ticks:{ stepSize:1, color:'#8b90a4', backdropColor:'transparent' }, pointLabels:{ font:{ size:10 }, color:'#8b90a4' }, grid:{ color:'rgba(255,255,255,.08)' }, angleLines:{ color:'rgba(255,255,255,.08)' } } },
        plugins: { legend: { position:'bottom', labels:{ boxWidth:12, font:{ size:11 }, color:'#e8eaf0' } } },
        maintainAspectRatio:false
      }
    });
  }

  var table = $('rec-tableau-scores');
  var html = '<thead><tr><th>'+recT('Critère')+'</th>'+selected.map(function(c){ return '<th>'+c.nom+'</th>'; }).join('')+'</tr></thead><tbody>';
  AXES.forEach(function(a){
    html += '<tr><td>'+a.titre.replace(/^[0-9]+\. /,'')+'</td>';
    selected.forEach(function(c){
      var v = c.scores && c.scores[a.key];
      html += v ? '<td><span class="rec-score-cell rec-s'+v+'">'+v+'</span></td>' : '<td>-</td>';
    });
    html += '</tr>';
  });
  html += '</tbody>';
  table.innerHTML = html;
}

// ---------- Attache des écouteurs (une seule fois) ----------
function attachListenersOnce(){
  document.querySelectorAll('#pane-recrutement .rec-verdict-choix button').forEach(function(b){
    b.addEventListener('click', function(){
      document.querySelectorAll('#pane-recrutement .rec-verdict-choix button').forEach(function(x){ x.className=''; });
      currentVerdict = b.dataset.v;
      b.classList.add('sel-'+b.dataset.v);
    });
  });

  $('rec-btn-annuler').addEventListener('click', function(){
    resetFormulaire();
    goToSubnav('liste');
  });

  $('rec-btn-enregistrer').addEventListener('click', function(){
    var nom = $('rec-f-nom').value.trim();
    if(!nom){ recToast(recT('Ajoute un nom'), '#ef4444'); return; }    var dbl = candidats.filter(function(x){ return x.id !== editId && String(x.nom || '').trim().toLowerCase() === nom.toLowerCase(); }); if(dbl.length && !confirm(recT('Une fiche existe deja pour') + ' ' + nom + ' ' + recT('(entretien du') + ' ' + dbl[0].date + recT('). Creer une seconde fiche quand meme ?'))) return;

    var scoresArr = Object.keys(currentScores).map(function(k){ return currentScores[k]; });
    var moyenne = scoresArr.length ? scoresArr.reduce(function(a,b){return a+b;},0)/scoresArr.length : null;
    var nbBas = scoresArr.filter(function(s){ return s<=2; }).length;
    var alerteK = recAlerte({ scores: currentScores }); if(alerteK && currentVerdict === 'bon' && !confirm(recT('Note eliminatoire (1 ou 2) sur') + ' ' + recLibelleAxe(alerteK) + recT('. En agroalimentaire ce critere ne se compense pas par les autres. Enregistrer quand meme en Bon fit ?'))) return;    if(currentVerdict==='bon' && moyenne!==null && (moyenne<3 || nbBas>=2)){
      if(!confirm(recT('Le verdict \u00ab Bon fit \u00bb semble en décalage avec des scores plutôt bas sur certains critères. Enregistrer quand même ?'))) return;
    }
    if(currentVerdict==='incompatible' && moyenne!==null && moyenne>=4){
      if(!confirm(recT('Le verdict \u00ab Incompatible \u00bb semble en décalage avec des scores plutôt hauts. Enregistrer quand même ?'))) return;
    }

    var data = {
      id: editId || (Date.now()+''),
      nom: nom,
      date: $('rec-f-date').value || new Date().toISOString().slice(0,10),
      scores: Object.assign({}, currentScores),
      notes: Object.assign({}, currentNotes),
      verdict: currentVerdict,
      suivi: $('rec-f-suivi').value.trim(), poste: recVal('rec-f-poste'), unite: recVal('rec-f-unite'), shift: recVal('rec-f-shift'), evaluateur: recVal('rec-f-evaluateur'), issue: recVal('rec-f-issue'), empId: recVal('rec-f-empid'), pondere: recScorePondere({ scores: currentScores }),
      reference: {
        statut: $('rec-f-ref-statut').value,
        notes: $('rec-f-ref-notes').value.trim()
      }
    };

    sauvegarderCandidat(data).then(function(){ recEffacerBrouillon();
      recToast(recT('Entretien enregistré'), '#10b981');
      resetFormulaire();
      goToSubnav('liste');
    }).catch(function(err){
      console.error('[Recrutement] Erreur sauvegarde:', err);
      recToast(recT('Erreur lors de l\u2019enregistrement'), '#ef4444');
    });
  });

  $('rec-btn-supprimer').addEventListener('click', function(){
    if(!editId) return;
    var c = candidats.filter(function(x){ return x.id===editId; })[0];
    if(!c) return;
    if(confirm(recT('Supprimer l\u2019entretien de')+' '+c.nom+' '+recT('? Cette action est irréversible.'))){
      supprimerCandidatFB(editId).then(function(){
        resetFormulaire();
        goToSubnav('liste');
        recToast(recT('Candidat supprimé'), '#ef4444');
      });
    }
  });

  $('rec-btn-export-json').addEventListener('click', function(){
    var json = JSON.stringify(candidats, null, 2);
    try{
      var blob = new Blob([json], {type:'application/json'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'candidats-recrutement-aw3.json';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      recToast(recT('Export téléchargé'), '#10b981');
    }catch(e){
      recToast(recT('Erreur export'), '#ef4444');
    }
  });

  $('rec-btn-import-json').addEventListener('click', function(){ $('rec-file-import').click(); });
  $('rec-file-import').addEventListener('change', function(e){
    var file = e.target.files[0];
    if(!file) return;
    file.text().then(function(text){
      var imported;
      try{ imported = JSON.parse(text); }catch(err){ recToast(recT('Fichier invalide'), '#ef4444'); return; }
      if(!Array.isArray(imported)){ recToast(recT('Fichier invalide'), '#ef4444'); return; }
      var nouveaux = imported.filter(function(c){
        return c && c.id && !candidats.some(function(x){ return x.id===c.id; });
      });
      if(!nouveaux.length){ recToast(recT('Rien de nouveau à importer'), '#f59e0b'); return; }
      if(confirm(nouveaux.length+' '+recT('nouveau(x) candidat(s) trouvé(s). Les ajouter ?'))){
        var updates = {};
        nouveaux.forEach(function(c){ updates[c.id] = c; });
        db.ref('recrutement/candidats').update(updates).then(function(){
          recToast(recT('Import réussi'), '#10b981');
        }).catch(function(){ recToast(recT('Erreur import'), '#ef4444'); });
      }
    });
    e.target.value = '';
  });

  $('rec-btn-pdf').addEventListener('click', exporterFichePDF);
  $('rec-btn-print-fr').addEventListener('click', function(){ imprimerQuestionnaire('fr'); });
  $('rec-btn-print-nl').addEventListener('click', function(){ imprimerQuestionnaire('nl'); });
  $('rec-btn-print-en').addEventListener('click', function(){ imprimerQuestionnaire('en'); });

  $('rec-btn-mode-entretien').addEventListener('click', function(){
    interviewIndex = 0;
    openInterviewStep();
    $('rec-io-overlay').classList.remove('rec-hidden');
  });
  $('rec-io-close').addEventListener('click', function(){
    $('rec-io-overlay').classList.add('rec-hidden');
    syncFormulaireDepuisState();
  });
  $('rec-io-prev').addEventListener('click', function(){
    if(interviewIndex>0){ interviewIndex--; openInterviewStep(); }
  });
  $('rec-io-next').addEventListener('click', function(){
    if(interviewIndex < AXES.length-1){
      interviewIndex++; openInterviewStep();
    } else {
      $('rec-io-overlay').classList.add('rec-hidden');
      syncFormulaireDepuisState();
      recToast(recT('Renseigne le verdict pour terminer'), '#f59e0b');
      var vc = $('rec-verdict-choix');
      if(vc) vc.scrollIntoView({behavior:'smooth', block:'center'});
    }
  });
}

function initRecrutementUI(){
  if(initialized) return;
  initialized = true;
  buildAxes();
  initSubnav();
  attachListenersOnce(); recRemplirEmployes(); window.recAppliquerLangue(); setTimeout(recRestaurerBrouillon, 900);
  $('rec-f-date').value = new Date().toISOString().slice(0,10);
}

// Hook global appelé au clic sur l'onglet "Recrutement"
window.buildRecrutementTab = function(){
  initRecrutementUI();
  attacherListenerCandidats();
};

})();
