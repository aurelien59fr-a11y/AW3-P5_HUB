/* core/ui.js — utilitaires DOM sans aucune dependance metier.
   Extrait de app.js a l'etape 2 du plan Phase 2. */

function toast(msg,col){var t=document.createElement('div');t.className='toast';t.innerHTML='<div class="tdot" style="background:'+col+'"></div>'+msg;document.body.appendChild(t);setTimeout(function(){t.style.opacity='0';t.style.transition='opacity .3s';setTimeout(function(){t.remove();},300);},2500);}
function escHtml(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
