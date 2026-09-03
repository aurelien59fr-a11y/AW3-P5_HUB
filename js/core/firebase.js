/* core/firebase.js — connexion Firebase Realtime Database et ecouteurs partages.
   Extrait de app.js a l'etape 3 du plan Phase 2 (aucune regle metier changee,
   aucun chemin Firebase renomme). Point de passage de tout le reste de
   l'application : les 62 appels db.ref( du fichier dependent tous de la
   variable db initialisee ici. Les ecouteurs propres a un domaine (arrets_inpak,
   ncp_data, bulk_data...) restent pour l'instant dans app.js -- ils sortiront
   avec leur module metier respectif aux etapes suivantes. */

var db=null;

function initFirebase(app){db=firebase.database(app);db.ref('planning/shifts2026').on('value',function(snap){if(isSyncing)return;var data=snap.val();if(!data)return;var changed=false;SHIFTS26.forEach(function(emp){if(data[emp.n]&&data[emp.n].length){emp.s=data[emp.n];changed=true;}});if(changed){buildPT();recalc();buildBT();updKPI();refreshCharts();}updSlbl(new Date().toISOString());});
  db.ref('planning/shifts2027').on('value',function(snap){if(isSyncing)return;var data=snap.val();if(!data)return;SHIFTS27.forEach(function(emp){if(data[emp.n]&&data[emp.n].length)emp.s=data[emp.n];});if(curYear==='2027')buildPT();});db.ref('planning/shifts2025').on('value',function(snap){if(isSyncing)return;var data=snap.val();if(!data)return;SHIFTS25.forEach(function(emp){if(data[emp.n]&&data[emp.n].length)emp.s=data[emp.n];});});if(currentUser&&(currentUser.role==='admin'||currentUser.role==='visiteur')){db.ref('planning/absences').on('value',function(snap){if(isSyncing)return;var data=snap.val();ABS_CHARGEES=true;if(!data)return;var arr=Array.isArray(data)?data:Object.values(data);ABS.splice(0,ABS.length);arr.forEach(function(a){if(a)ABS.push(a);});buildAbs(document.querySelector('.fb.on')?document.querySelector('.fb.on').dataset.f:'all');updAbsLbl();recalc();buildBT();updKPI();refreshCharts();});}db.ref('planning/extraHistorique').on('value',function(snap){var data=snap.val();if(Array.isArray(data)){EXTRA_HIST=data.filter(Boolean);}});
  db.ref('.info/connected').on('value',function(snap){var el=document.getElementById('conn-status');if(!el)return;if(snap.val()){el.textContent='En ligne';el.style.color='var(--green)';}else{el.textContent='Hors ligne';el.style.color='var(--amber)';}});
  db.ref('bradford/comments').on('value',function(snap){var data=snap.val();if(!data)return;BD_COMMENTS={};Object.keys(data).forEach(function(k){BD_COMMENTS[k]=data[k];});buildBT();});
  db.ref('bradford/import_ts').on('value',function(snap){var v=snap.val();var el=document.getElementById('protime-last-import');if(el&&v)el.textContent='Dernier import : '+new Date(v).toLocaleString('fr-BE');});}
