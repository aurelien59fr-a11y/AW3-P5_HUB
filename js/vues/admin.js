/* ====================================================================
 * vues/admin.js — Domaine Admin (onglet "admin")
 * Extrait de app.js a l'Etape 9 du plan de refactorisation (Phase 2).
 *
 * Contenu : gestion des employes (buildEmpTable/showAddEmp/editEmp/
 * closeEmpModal/saveEmp/deactivateEmp), migration de donnees (migrLog/
 * migrProg/runMigration), rapport Excel trimestriel (calcStatsTrimestreNvsN1/
 * genererRapportExcel), test de connexion Firebase (testFirebaseConnection),
 * et gestion des comptes/permissions employes (posteVersPermissions/
 * genLoginInterne/buildComptesEmpListe/toggleComptePermPanel/
 * creerCompteEmployeUI/creerCompteEmploye/toggleAccesEdit/
 * enregistrerAccesEmploye).
 *
 * Variables emportees : editingEmpId (id employe en cours d'edition dans
 * la modale de gestion employes), ALL_TABS (liste de tous les onglets de
 * l'app — utilisee uniquement par le code de permissions ci-dessous pour
 * generer une case a cocher par onglet ; c'est le seul point d'usage reel
 * dans tout le code, verifie par grep).
 *
 * Variables NON emportees malgre un lien apparent avec Admin :
 *  - ACCOUNTS : reste dans app.js (variable partagee entre startApp,
 *    Mon Espace et ce fichier — voir correction de plan documentee dans
 *    le header de vues/formations.js).
 *  - TAB_LABELS : declaree juste apres ALL_TABS dans app.js mais jamais
 *    lue nulle part dans le code (verifie par grep sur tout le fichier) ;
 *    laissee telle quelle dans app.js, code mort preexistant sans lien
 *    avec cette extraction.
 * ==================================================================== */

var editingEmpId = null;

function buildEmpTable(){
  var tbody = document.getElementById('empTbody');
  if(!tbody) return;
  var grpColors = {TL:'rgba(99,102,241,.2)',INPAK:'rgba(59,130,246,.15)',Prod:'rgba(249,115,22,.15)',Unit:'rgba(16,185,129,.15)',Manager:'rgba(168,85,247,.15)',RH:'rgba(236,72,153,.15)'};
  var grpText = {TL:'#a5b4fc',INPAK:'#7eb3ff',Prod:'#fda96a',Unit:'#5eddb7',Manager:'#c4b5fd',RH:'#f9a8d4'};
  tbody.innerHTML = EMP.map(function(e,i){
    var bg = grpColors[e.g]||'rgba(255,255,255,.05)';
    var col = grpText[e.g]||'var(--tx2)';
    return '<tr>'
      +'<td style="padding:10px 12px;font-size:13px;font-weight:500;border-bottom:1px solid var(--bd)">'+e.n+'</td>'
      +'<td style="padding:10px 12px;border-bottom:1px solid var(--bd)"><span style="font-size:11px;font-weight:500;padding:2px 8px;border-radius:20px;background:'+bg+';color:'+col+'">'+e.g+'</span></td>'
      +'<td style="padding:10px 12px;font-size:12px;color:var(--tx2);border-bottom:1px solid var(--bd)">'+e.r+'</td>'
      +'<td style="padding:10px 12px;text-align:center;border-bottom:1px solid var(--bd)">'
      +'<button onclick="editEmp('+i+')" style="padding:3px 10px;border-radius:6px;border:1px solid var(--bd2);background:none;color:var(--tx2);font-size:11px;cursor:pointer;font-family:var(--fn);margin-right:4px">'+t('adm_btn_edit')+'</button>'
      +'<button onclick="deactivateEmp('+i+')" style="padding:3px 10px;border-radius:6px;border:1px solid rgba(239,68,68,.3);background:none;color:var(--red);font-size:11px;cursor:pointer;font-family:var(--fn)">'+t('adm_btn_remove')+'</button>'
      +'</td></tr>';
  }).join('');
}

function showAddEmp(){
  editingEmpId = null;
  document.getElementById('emp-modal-title').textContent = t('adm_emp_modal_add_title');
  document.getElementById('emp-name').value = '';
  document.getElementById('emp-group').value = 'INPAK';
  document.getElementById('emp-role').value = '';
  document.getElementById('emp-modal-err').textContent = '';
  document.getElementById('emp-modal').style.display = 'flex';
}

function editEmp(idx){
  var e = EMP[parseInt(idx)];
  if(!e) return;
  editingEmpId = e.id || e.n.toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_');
  document.getElementById('emp-modal-title').textContent = t('adm_emp_modal_edit_prefix') + e.n;
  document.getElementById('emp-name').value = e.n;
  document.getElementById('emp-group').value = e.g;
  document.getElementById('emp-role').value = e.r;
  var bdEl = document.getElementById('emp-birthday');
  if(bdEl) bdEl.value = e.birthday || '';
  document.getElementById('emp-modal-err').textContent = '';
  document.getElementById('emp-modal').style.display = 'flex';
}

function closeEmpModal(){
  document.getElementById('emp-modal').style.display = 'none';
  editingEmpId = null;
}

function saveEmp(){
  var name = document.getElementById('emp-name').value.trim();
  var group = document.getElementById('emp-group').value;
  var role = document.getElementById('emp-role').value.trim();
  var err = document.getElementById('emp-modal-err');
  if(!name){ err.textContent = t('adm_err_name_required'); return; }
  if(!role){ err.textContent = t('adm_err_role_required'); return; }
  if(!db){ err.textContent = t('adm_err_firebase_disconnected'); return; }

  var id = editingEmpId || name.toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_');
  var order = editingEmpId ? (EMP.find(function(e){return e.id===editingEmpId;})||{}).order||99 : EMP.length;

  var bday = document.getElementById('emp-birthday')?document.getElementById('emp-birthday').value:'';
  var empData = {name:name, group:group, role:role, active:true, order:order};
  empData.birthday = bday || '';
  document.getElementById('emp-save-btn').disabled = true;
  document.getElementById('emp-save-btn').textContent = t('adm_saving');

  db.ref('employees/'+id).set(empData).then(function(){
    // Mettre a jour EMP local
    var existing = EMP.findIndex(function(e){return (e.id||e.n.toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_'))===id;});
    if(existing !== -1){
      EMP[existing] = {n:name, g:group, r:role, id:id, birthday: bday || ''};
    } else {
      var newEmp = {n:name, g:group, r:role, id:id, birthday: bday || ''};
      EMP.push(newEmp);
      // Ajouter dans SHIFTS26 et SHIFTS25
      var nbDates26 = WEEKS26.reduce(function(a,w){return a+w.d.length;},0);
      var nbDates25 = WEEKS25.reduce(function(a,w){return a+w.d.length;},0);
      var nbDates27 = WEEKS27.reduce(function(a,w){return a+w.d.length;},0);
      SHIFTS26.push({n:name, g:group, s:new Array(nbDates26).fill('')});
      SHIFTS25.push({n:name, g:group, s:new Array(nbDates25).fill('')});
      SHIFTS27.push({n:name, g:group, s:new Array(nbDates27).fill('')});
    }
    closeEmpModal();
    buildEmpTable();
    buildPT();
    buildBT();
    buildBirthdayNotif();
    buildBirthdayCal();
    toast(name + t('adm_toast_saved_suffix'), '#10b981');
    document.getElementById('emp-save-btn').disabled = false;
    document.getElementById('emp-save-btn').textContent = t('btn_save');
  }).catch(function(e){
    err.textContent = t('err_generic_prefix') + e.message;
    document.getElementById('emp-save-btn').disabled = false;
    document.getElementById('emp-save-btn').textContent = t('btn_save');
  });
}

function deactivateEmp(idx){
  var e = EMP[parseInt(idx)];
  if(!e) return;
  if(!confirm(t('adm_confirm_remove1') + e.n + t('adm_confirm_remove2'))) return;
  var id = e.id || e.n.toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_');
  if(!db){ toast(t('adm_err_firebase_disconnected'),'#ef4444'); return; }
  db.ref('employees/'+id+'/active').set(false).then(function(){
    EMP.splice(parseInt(idx), 1);
    SHIFTS26.splice(SHIFTS26.findIndex(function(s){return s.n===e.n;}), 1);
    SHIFTS25.splice(SHIFTS25.findIndex(function(s){return s.n===e.n;}), 1);
    SHIFTS27.splice(SHIFTS27.findIndex(function(s){return s.n===e.n;}), 1);
    buildEmpTable();
    buildPT();
    buildBT();
    updKPI();
    toast(e.n + t('adm_toast_removed_suffix'), '#f59e0b');
  }).catch(function(err){ toast(t('err_generic_prefix')+err.message,'#ef4444'); });
}

function migrLog(msg,col){
  var log=document.getElementById('migr-log');
  if(!log)return;
  log.style.display='block';
  var line=document.createElement('div');
  var icon=col==='#10b981'?'✓':col==='#ef4444'?'✗':col==='#f59e0b'?'⚠':'→';
  line.innerHTML='<span style="color:'+col+'">'+icon+'</span> '+msg;
  log.appendChild(line);
  log.scrollTop=log.scrollHeight;
}

function migrProg(pct){
  var bar=document.getElementById('migr-bar');
  var prog=document.getElementById('migr-prog');
  if(prog)prog.style.display='block';
  if(bar)bar.style.width=pct+'%';
}

function runMigration(){
  if(!db){toast('Firebase non connecte','#ef4444');return;}
  var btn=document.getElementById('migr-btn');
  var status=document.getElementById('migr-status');
  btn.disabled=true;btn.textContent='Migration en cours...';
  migrLog('Debut de la migration...','#3b82f6');
  migrProg(5);

  // Construire les objets shifts
  var d26={},d25={};
  SHIFTS26.forEach(function(e){d26[e.n]=e.s;});
  SHIFTS25.forEach(function(e){d25[e.n]=e.s;});

  // Construire les employes pour Firebase
  var empData={};
  EMP.forEach(function(e,idx){
    var id=e.n.toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_');
    empData[id]={name:e.n,group:e.g,role:e.r,active:true,order:idx};
  });

  var updates={};
  var d27m={};SHIFTS27.forEach(function(e){d27m[e.n]=e.s;});
  updates['planning/shifts2026']=d26;
  updates['planning/shifts2025']=d25;
  updates['planning/shifts2027']=d27m;
  updates['planning/absences']=ABS;
  updates['employees']=empData;
  updates['planning/lastUpdate']={
    at:new Date().toISOString(),
    by:currentUser?currentUser.email:'admin',
    version:'3.0-migration'
  };

  migrLog('Ecriture de '+Object.keys(d26).length+' employes (2026)...','#8b90a4');
  migrProg(30);

  db.ref().update(updates).then(function(){
    migrProg(100);
    migrLog('Shifts 2026 OK ('+Object.keys(d26).length+' employes)','#10b981');
    migrLog('Shifts 2025 OK ('+Object.keys(d25).length+' employes)','#10b981');
    migrLog('Absences OK ('+ABS.length+' entrees)','#10b981');
    migrLog('Migration terminee avec succes !','#10b981');
    if(status)status.textContent='Effectuee le '+new Date().toLocaleDateString('fr-BE');
    if(status)status.style.color='var(--green)';
    btn.textContent='Migration effectuee ✓';
    btn.style.background='var(--green)';
    toast('Migration Firebase reussie !','#10b981');
  }).catch(function(err){
    migrLog('ERREUR: '+err.message,'#ef4444');
    btn.disabled=false;btn.textContent='Reessayer';
    toast('Erreur migration: '+err.message,'#ef4444');
  });
}

function calcStatsTrimestreNvsN1(){
  var now=new Date(),yr=now.getFullYear();
  function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
  var stats={N:{Q1:0,Q2:0,Q3:0,Q4:0},N1:{Q1:0,Q2:0,Q3:0,Q4:0}};
  ABS.filter(function(a){return a.t==='ziek';}).forEach(function(a){
    var deb=pFR(a.a),y=deb.getFullYear(),m=deb.getMonth();
    var q=m<3?'Q1':m<6?'Q2':m<9?'Q3':'Q4';
    if(y===yr) stats.N[q]+=a.d; else if(y===yr-1) stats.N1[q]+=a.d;
  });
  return {stats:stats,yr:yr};
}

function genererRapportExcel(){
  if(typeof JSZip==='undefined'){toast('JSZip non charge','#ef4444');return;}
  var mois=parseInt(document.getElementById('rapport-mois').value);
  var annee=parseInt(document.getElementById('rapport-annee').value);
  var MN=['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];
  var nomMois=MN[mois];
  function pFR(s){var p=s.split('/');return new Date(Number(p[2]),Number(p[1])-1,Number(p[0]));}
  function scSty(sc){return sc===0?7:sc<=50?3:sc<=200?4:sc<=500?5:6;}
  function stLbl(sc){return sc===0?'Parfait':sc<=50?'OK':sc<=200?'A surveiller':sc<=500?'Preoccupant':'Critique';}
  var str=[],sm={};
  function si(s){s=String(s);if(sm[s]===undefined){sm[s]=str.length;str.push(s);}return sm[s];}
  function cell(r,col,v,s){var ref=String.fromCharCode(65+col)+r;if(typeof v==='number')return '<c r="'+ref+'" s="'+s+'"><v>'+v+'</v></c>';return '<c r="'+ref+'" t="s" s="'+s+'"><v>'+si(String(v))+'</v></c>';}
  var styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="3"><font><sz val="11"/><name val="Calibri"/></font><font><sz val="11"/><name val="Calibri"/><b/><color rgb="FFFFFFFF"/></font><font><sz val="14"/><name val="Calibri"/><b/><color rgb="FF1E3A5F"/></font></fonts><fills count="10"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1E3A5F"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1E40AF"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD1FAE5"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFEF3C7"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFED7AA"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFEE2E2"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD1FAE5"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/></border><border><left style="thin"><color rgb="FFE2E8F0"/></left><right style="thin"><color rgb="FFE2E8F0"/></right><top style="thin"><color rgb="FFE2E8F0"/></top><bottom style="thin"><color rgb="FFE2E8F0"/></bottom></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="11"><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="5" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="6" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="8" borderId="1" xfId="0" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="9" borderId="1" xfId="0" applyFill="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"><alignment horizontal="center" vertical="center"/></xf></cellXfs></styleSheet>';
  var r1=[],r=1;
  r1.push('<row r="'+r+'" ht="20">'+cell(r,0,'Bradford Dashboard AW3 Ploeg 5',1)+'</row>');r++;
  r1.push('<row r="'+r+'">'+cell(r,0,'Rapport '+nomMois+' '+annee,0)+'</row>');r++;
  r1.push('<row r="'+r+'"></row>');r++;
  r1.push('<row r="'+r+'" ht="18">'+cell(r,0,'Employe',1)+cell(r,1,'Groupe',1)+cell(r,2,'Role',1)+cell(r,3,'Jours',1)+cell(r,4,'Episodes',1)+cell(r,5,'Score',1)+cell(r,6,'Statut',1)+'</row>');r++;
  ['TL','INPAK','Prod','Unit'].forEach(function(g){
    var em=BD.filter(function(e){var f=EMP.find(function(x){return x.n===e.n;});return f&&f.g===g;});
    if(!em.length)return;
    r1.push('<row r="'+r+'">'+cell(r,0,g,2)+cell(r,1,'',2)+cell(r,2,'',2)+cell(r,3,'',2)+cell(r,4,'',2)+cell(r,5,'',2)+cell(r,6,'',2)+'</row>');r++;
    em.forEach(function(e,idx){var emp=EMP.find(function(x){return x.n===e.n;});var ss=scSty(e.sc);r1.push('<row r="'+r+'">'+cell(r,0,e.n+(e.sc===0?' *':''),idx%2?9:0)+cell(r,1,g,10)+cell(r,2,emp?emp.r:'',idx%2?9:0)+cell(r,3,e.D,10)+cell(r,4,e.S,10)+cell(r,5,e.sc,ss)+cell(r,6,stLbl(e.sc),ss)+'</row>');r++;});
  });
  var absM=ABS.filter(function(a){var d=pFR(a.a);return d.getMonth()===mois&&d.getFullYear()===annee&&a.t==='ziek';});
  absM.sort(function(a,b){return pFR(a.a)-pFR(b.a);});
  var r2=[],rx=1,tJ=0;
  r2.push('<row r="'+rx+'" ht="20">'+cell(rx,0,'Absences Maladie - '+nomMois+' '+annee,1)+'</row>');rx++;
  r2.push('<row r="'+rx+'"></row>');rx++;
  r2.push('<row r="'+rx+'" ht="18">'+cell(rx,0,'Employe',1)+cell(rx,1,'Debut',1)+cell(rx,2,'Fin',1)+cell(rx,3,'Jours',1)+'</row>');rx++;
  absM.forEach(function(a,idx){tJ+=a.d;r2.push('<row r="'+rx+'">'+cell(rx,0,a.n,idx%2?9:0)+cell(rx,1,a.a,10)+cell(rx,2,a.b,10)+cell(rx,3,a.d,6)+'</row>');rx++;});
  if(absM.length)r2.push('<row r="'+rx+'">'+cell(rx,0,'TOTAL',1)+cell(rx,1,'',1)+cell(rx,2,'',1)+cell(rx,3,tJ,1)+'</row>');
  else r2.push('<row r="'+rx+'">'+cell(rx,0,'Aucune absence ce mois',3)+'</row>');
  var res=calcStatsTrimestreNvsN1(),stats=res.stats,yr=res.yr;
  var r3=[],ry=1;
  r3.push('<row r="'+ry+'" ht="20">'+cell(ry,0,'Statistiques '+yr+' vs '+(yr-1),1)+'</row>');ry++;
  r3.push('<row r="'+ry+'"></row>');ry++;
  r3.push('<row r="'+ry+'" ht="18">'+cell(ry,0,'Trimestre',1)+cell(ry,1,''+yr,1)+cell(ry,2,''+(yr-1),1)+cell(ry,3,'Evolution',1)+'</row>');ry++;
  var tN=0,tN1=0;
  ['Q1','Q2','Q3','Q4'].forEach(function(q,i){var n=stats.N[q],n1=stats.N1[q];tN+=n;tN1+=n1;var pct=n1===0?'N/A':(n>n1?'+':'')+Math.round((n-n1)/(n1||1)*100)+'%';r3.push('<row r="'+ry+'">'+cell(ry,0,['T1 Jan-Mar','T2 Avr-Jun','T3 Jul-Sep','T4 Oct-Dec'][i],i%2?9:0)+cell(ry,1,n,10)+cell(ry,2,n1,10)+cell(ry,3,pct,n>n1?6:3)+'</row>');ry++;});
  r3.push('<row r="'+ry+'">'+cell(ry,0,'TOTAL',1)+cell(ry,1,tN,1)+cell(ry,2,tN1,1)+cell(ry,3,(tN>tN1?'+':'')+Math.round((tN-tN1)/(tN1||1)*100)+'%',tN>tN1?6:3)+'</row>');
  function mkSh(rows,cols){return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetFormatPr defaultRowHeight="15"/>'+cols+'<sheetData>'+rows.join('')+'</sheetData></worksheet>';}
  var sh1=mkSh(r1,'<cols><col min="1" max="1" width="28" customWidth="1"/><col min="2" max="2" width="10" customWidth="1"/><col min="3" max="3" width="18" customWidth="1"/><col min="4" max="7" width="12" customWidth="1"/></cols>');
  var sh2=mkSh(r2,'<cols><col min="1" max="1" width="28" customWidth="1"/><col min="2" max="3" width="14" customWidth="1"/><col min="4" max="4" width="10" customWidth="1"/></cols>');
  var sh3=mkSh(r3,'<cols><col min="1" max="1" width="24" customWidth="1"/><col min="2" max="4" width="14" customWidth="1"/></cols>');
  var sst='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="'+str.length+'" uniqueCount="'+str.length+'">'+str.map(function(s){return '<si><t xml:space="preserve">'+s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</t></si>';}).join('')+'</sst>';
  var wb='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Bradford" sheetId="1" r:id="rId1"/><sheet name="Absences '+nomMois+'" sheetId="2" r:id="rId2"/><sheet name="Statistiques" sheetId="3" r:id="rId3"/></sheets></workbook>';
  var wbR='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
  var pR='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  var ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>';
  var zip=new JSZip();zip.file('[Content_Types].xml',ct);zip.file('_rels/.rels',pR);zip.file('xl/workbook.xml',wb);zip.file('xl/_rels/workbook.xml.rels',wbR);zip.file('xl/styles.xml',styles);zip.file('xl/sharedStrings.xml',sst);zip.file('xl/worksheets/sheet1.xml',sh1);zip.file('xl/worksheets/sheet2.xml',sh2);zip.file('xl/worksheets/sheet3.xml',sh3);
  zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}).then(function(blob){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Bradford_AW3P5_'+nomMois+'_'+annee+'.xlsx';a.click();toast('Rapport Excel : '+nomMois+' '+annee,'#10b981');});
}

function testFirebaseConnection(){
  var el = document.getElementById('fb-test-results');
  if(!el) return;
  if(!db){
    el.innerHTML = '<div style="color:#ef4444">✗ Aucune connexion Firebase (db non initialise)</div>';
    return;
  }
  el.innerHTML = '<div style="color:var(--tx3)">Test en cours…</div>';

  var paths = [
    {label: 'Lecture users', ref: 'users', mode: 'read'},
    {label: 'Lecture employees', ref: 'employees', mode: 'read'},
    {label: 'Lecture planning/shifts2026', ref: 'planning/shifts2026', mode: 'read'},
    {label: 'Lecture planning/absences', ref: 'planning/absences', mode: 'read'},
    {label: 'Lecture pointages', ref: 'pointages', mode: 'read'},
    {label: 'Ecriture pointages (test)', ref: 'pointages/_test_connexion', mode: 'write'},
    {label: 'Connexion temps reel (.info/connected)', ref: '.info/connected', mode: 'realtime'}
  ];

  var results = paths.map(function(p){ return {label: p.label, status: 'pending'}; });

  function render(){
    el.innerHTML = results.map(function(r){
      var icon = r.status === 'pending' ? '<span style="color:var(--tx3)">…</span>'
        : r.status === 'ok' ? '<span style="color:#10b981">✓</span>'
        : '<span style="color:#ef4444">✗</span>';
      var extra = r.error ? ' <span style="color:#ef4444;font-size:11px">(' + r.error + ')</span>' : '';
      return '<div>' + icon + ' ' + r.label + extra + '</div>';
    }).join('');
  }
  render();

  paths.forEach(function(p, idx){
    if(p.mode === 'read'){
      db.ref(p.ref).once('value').then(function(){
        results[idx].status = 'ok'; render();
      }).catch(function(e){
        results[idx].status = 'error'; results[idx].error = e.message; render();
      });
    } else if(p.mode === 'write'){
      db.ref(p.ref).set({ts: Date.now(), by: currentUser?currentUser.email:'test'}).then(function(){
        return db.ref(p.ref).remove();
      }).then(function(){
        results[idx].status = 'ok'; render();
      }).catch(function(e){
        results[idx].status = 'error'; results[idx].error = e.message; render();
      });
    } else if(p.mode === 'realtime'){
      db.ref(p.ref).once('value').then(function(snap){
        results[idx].status = snap.val() ? 'ok' : 'error';
        if(!snap.val()) results[idx].error = 'hors ligne';
        render();
      }).catch(function(e){
        results[idx].status = 'error'; results[idx].error = e.message; render();
      });
    }
  });
}

function posteVersPermissions(poste){
  if(poste === 'Team Leader') return {role:'admin', tabs:null, editPlanning:false};
  if(poste === 'Coordinateur') return {role:'custom', tabs:{ov:true,br:true,pl:true,ab:true,formations:true,pt:false,arrets:true,ncp:true,recrutement:false,espace:true}, editPlanning:true};
  return {role:'custom', tabs:{ov:false,br:false,pl:true,ab:false,formations:true,pt:false,arrets:false,ncp:false,recrutement:false,espace:true}, editPlanning:false};
}

var ALL_TABS = ['ov','br','pl','ab','formations','pt','arrets','ncp','recrutement','espace'];

function genLoginInterne(nomComplet){
  var parts = (nomComplet||'').trim().split(/\s+/);
  var prenom = parts[0] || '';
  var nom = parts.slice(1).join(' ') || prenom;
  function strip(s){
    return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z]/g,'');
  }
  var p = strip(prenom), n = strip(nom);
  var email = (p||'x')+'.'+(n||'x')+'@aw3p5.local';
  var pass = (p.charAt(0)||'x')+(p.charAt(p.length-1)||'x')+(n.charAt(0)||'x')+(n.charAt(n.length-1)||'x')+'2026';
  return {email: email, password: pass};
}

function buildComptesEmpListe(){
  var cont = document.getElementById('comptes-emp-liste');
  if(!cont) return;
  var items = EMP.filter(function(e){ return e.id; });
  if(!items.length){ cont.innerHTML = '<div style="color:var(--tx2);padding:12px">'+t('comptes_emp_empty')+'</div>'; return; }
  cont.innerHTML = items.map(function(e){
    var acc = ACCOUNTS[e.id];
    var perm = posteVersPermissions(e.r);
    var rowId = 'cpt-'+e.id;
    if(acc){
      var accLabel = acc.role === 'admin' ? t('role_admin') : (acc.role === 'subchef' ? t('role_subchef') : (acc.role === 'visiteur' ? t('role_visiteur') : t('role_custom')));
      return '<div class="cc" style="margin-bottom:8px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px">'
        +'<div><div style="font-weight:600">'+e.n+'</div><div style="font-size:12px;color:var(--tx2)">'+e.r+' &middot; '+accLabel+'</div></div>'
        +'<div style="display:flex;align-items:center;gap:8px"><span style="font-size:12px;color:var(--green)">&#9679; '+t('comptes_actif')+'</span><span style="font-size:11px;color:var(--tx3);font-family:var(--mo)">'+acc.email+'</span>'
        +'<button onclick="toggleAccesEdit(\''+e.id+'\')" style="padding:4px 10px;border-radius:6px;border:1px solid var(--bd);background:transparent;color:var(--tx2);font-size:11px;cursor:pointer">'+t('comptes_btn_modif_acces')+'</button>'
        +'</div>'
        +'</div>'
        +'<div id="acc-edit-'+e.id+'" style="display:none;margin:-4px 0 8px;padding:12px 16px;background:rgba(255,255,255,.03);border-radius:8px"></div>';
    }
    var tabsHtml = ALL_TABS.map(function(tk){
      var checked = perm.tabs && perm.tabs[tk] ? ' checked' : '';
      return '<label style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--tx2);margin-right:10px;margin-bottom:4px"><input type="checkbox" id="'+rowId+'-tab-'+tk+'"'+checked+' style="accent-color:var(--blue)">'+t('tab_'+tk)+'</label>';
    }).join('');
    return '<div class="cc" style="margin-bottom:8px;padding:12px 16px" id="'+rowId+'">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px">'
      +'<div><div style="font-weight:600">'+e.n+'</div><div style="font-size:12px;color:var(--tx2)">'+e.r+'</div></div>'
      +'<div style="display:flex;align-items:center;gap:8px">'
      +'<select id="'+rowId+'-role" onchange="toggleComptePermPanel(\''+e.id+'\')" style="background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:var(--tx);border:1px solid var(--bd2);border-radius:6px;padding:4px 8px;font-size:12px">'
      +'<option value="custom"'+(perm.role==='custom'?' selected':'')+'>'+t('role_custom')+'</option>'
      +'<option value="subchef"'+(perm.role==='subchef'?' selected':'')+'>'+t('role_subchef')+'</option>'
      +'<option value="visiteur"'+(perm.role==='visiteur'?' selected':'')+'>'+t('role_visiteur')+'</option>'
      +'<option value="admin"'+(perm.role==='admin'?' selected':'')+'>'+t('role_admin')+'</option>'
      +'</select>'
      +'<button onclick="creerCompteEmployeUI(\''+e.id+'\')" style="padding:5px 12px;border-radius:6px;border:1px solid var(--bd2);background:var(--bg3);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:var(--tx);font-size:12px;cursor:pointer">'+t('comptes_btn_creer')+'</button>'
      +'</div></div>'
      +'<div id="'+rowId+'-permpanel" style="display:'+(perm.role==='custom'?'block':'none')+';padding-top:8px;border-top:1px solid var(--bd)">'
      +'<div style="margin-bottom:6px">'+tabsHtml+'</div>'
      +'<label style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--tx2)"><input type="checkbox" id="'+rowId+'-editplanning"'+(perm.editPlanning?' checked':'')+' style="accent-color:var(--blue)">'+t('comptes_edit_planning')+'</label>'
      +'</div>'
      +'</div>';
  }).join('');
}

function toggleComptePermPanel(empId){
  var sel = document.getElementById('cpt-'+empId+'-role');
  var panel = document.getElementById('cpt-'+empId+'-permpanel');
  if(!sel || !panel) return;
  panel.style.display = sel.value === 'custom' ? 'block' : 'none';
}

function creerCompteEmployeUI(empId){
  var emp = EMP.find(function(e){ return e.id === empId; });
  if(!emp) return;
  var rowId = 'cpt-'+empId;
  var sel = document.getElementById(rowId+'-role');
  var role = sel ? sel.value : 'custom';
  var tabs = null, editPlanning = false;
  if(role === 'custom'){
    tabs = {};
    ALL_TABS.forEach(function(t){
      var cb = document.getElementById(rowId+'-tab-'+t);
      tabs[t] = !!(cb && cb.checked);
    });
    var epCb = document.getElementById(rowId+'-editplanning');
    editPlanning = !!(epCb && epCb.checked);
  }
  var login = genLoginInterne(emp.n);
  var recap = t('comptes_confirm_creer')+emp.n+' ?\n\n'+t('comptes_confirm_email')+login.email+'\n'+t('comptes_confirm_pass')+login.password+'\n'+t('comptes_confirm_role')+(role==='admin'?t('role_admin'):(role==='subchef'?t('role_subchef'):(role==='visiteur'?t('role_visiteur'):t('role_custom'))));
  if(role === 'custom'){
    recap += '\n'+t('comptes_confirm_onglets')+ALL_TABS.filter(function(tt){return tabs[tt];}).map(function(tt){return t('tab_'+tt);}).join(', ');
    recap += '\n'+t('comptes_confirm_planning')+(editPlanning?t('comptes_oui'):t('comptes_non'));
  }
  if(!confirm(recap)) return;
  creerCompteEmploye(emp, role, login, tabs, editPlanning).then(function(res){
    toast(t('comptes_toast_cree')+emp.n, '#10b981');
    alert(t('comptes_alert_cree')+res.email+t('comptes_alert_pass')+res.password+t('comptes_alert_communique')+emp.n+'.');
  }).catch(function(err){
    console.error('[COMPTES] Erreur creation compte :', err);
    toast(t('comptes_toast_err_creation')+(err && err.message ? err.message : err), '#ef4444');
  });
}

function creerCompteEmploye(emp, role, login, tabs, editPlanning){
  login = login || genLoginInterne(emp.n);
  var secApp;
  try{ secApp = firebase.app('Secondary'); }
  catch(e){ secApp = firebase.initializeApp(firebase.app().options, 'Secondary'); }
  var secAuth = secApp.auth();
  return secAuth.createUserWithEmailAndPassword(login.email, login.password).then(function(cred){
    var uid = cred.user.uid;
    return secAuth.signOut().then(function(){
      var rec = {
        role: role,
        email: login.email,
        employeId: emp.id,
        nom: emp.n,
        createdAt: Date.now()
      };
      if(role === 'custom'){
        rec.tabs = tabs || {};
        rec.editPlanning = !!editPlanning;
      }
      return db.ref('users/'+uid).set(rec);
    }).then(function(){
      return db.ref('employees/'+emp.id+'/accountUid').set(uid);
    }).then(function(){
      return {email: login.email, password: login.password, uid: uid};
    });
  });
}

function toggleAccesEdit(empId){
  var box = document.getElementById('acc-edit-'+empId);
  if(!box) return;
  if(box.style.display !== 'none'){ box.style.display='none'; box.innerHTML=''; return; }
  var acc = ACCOUNTS[empId];
  if(!acc || !acc.uid){ return; }
  box.style.display = 'block';
  box.innerHTML = '<div style="color:var(--tx2);font-size:12px">Chargement...</div>';
  db.ref('users/'+acc.uid).once('value').then(function(snap){
    var u = snap.val() || {};
    var role = u.role || 'custom';
    var tabs = u.tabs || {};
    var editPlanning = !!u.editPlanning;
    var selHtml = '<select id="acc-edit-role-'+empId+'" style="padding:6px 10px;border-radius:6px;background:var(--bg2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--bd);color:var(--tx1);font-size:12px;margin-bottom:10px">'
      +'<option value="custom"'+(role==='custom'?' selected':'')+'>'+t('role_custom')+'</option>'
      +'<option value="subchef"'+(role==='subchef'?' selected':'')+'>'+t('role_subchef')+'</option>'
      +'<option value="admin"'+(role==='admin'?' selected':'')+'>'+t('role_admin')+'</option>'
      +'</select>';
    var tabsHtml = ALL_TABS.map(function(tk){
      var checked = tabs[tk] ? ' checked' : '';
      return '<label style="display:inline-flex;align-items:center;gap:4px;font-size:11px;margin:0 10px 6px 0"><input type="checkbox" id="acc-edit-tab-'+empId+'-'+tk+'"'+checked+' style="accent-color:var(--blue)">'+t('tab_'+tk)+'</label>';
    }).join('');
    var editPlanHtml = '<label style="display:inline-flex;align-items:center;gap:4px;font-size:11px;margin:8px 0"><input type="checkbox" id="acc-edit-editplanning-'+empId+'"'+(editPlanning?' checked':'')+' style="accent-color:var(--blue)"> '+t('comptes_edit_planning')+'</label>';
    box.innerHTML = selHtml
      +'<div style="margin-bottom:6px">'+tabsHtml+'</div>'
      +editPlanHtml
      +'<div style="margin-top:8px;display:flex;gap:8px">'
      +'<button onclick="enregistrerAccesEmploye(\''+empId+'\')" style="padding:6px 14px;border-radius:6px;border:none;background:var(--blue);color:#fff;font-size:12px;cursor:pointer">Enregistrer</button>'
      +'<button onclick="toggleAccesEdit(\''+empId+'\')" style="padding:6px 14px;border-radius:6px;border:1px solid var(--bd);background:transparent;color:var(--tx2);font-size:12px;cursor:pointer">Annuler</button>'
      +'</div>';
  });
}

function enregistrerAccesEmploye(empId){
  var acc = ACCOUNTS[empId];
  if(!acc || !acc.uid) return;
  var roleSel = document.getElementById('acc-edit-role-'+empId);
  if(!roleSel) return;
  var role = roleSel.value;
  var upd = {role: role};
  if(role === 'custom'){
    var tabs = {};
    ALL_TABS.forEach(function(t){
      var cb = document.getElementById('acc-edit-tab-'+empId+'-'+t);
      if(cb && cb.checked) tabs[t] = true;
    });
    var editCb = document.getElementById('acc-edit-editplanning-'+empId);
    upd.tabs = tabs;
    upd.editPlanning = !!(editCb && editCb.checked);
  } else {
    upd.tabs = null;
    upd.editPlanning = null;
  }
  db.ref('users/'+acc.uid).update(upd).then(function(){
    alert('Accès mis à jour.');
    var box = document.getElementById('acc-edit-'+empId);
    if(box){ box.style.display='none'; box.innerHTML=''; }
    acc.role = role;
  }).catch(function(e){
    alert('Erreur: '+e.message);
  });
}
