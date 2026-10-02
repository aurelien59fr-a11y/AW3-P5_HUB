/* core/pwa.js — enregistrement du service worker (sorti de index.html). */
if('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('sw.js')
      .then(function(reg){ console.log('[PWA] SW enregistré:', reg.scope); })
      .catch(function(err){ console.warn('[PWA] SW erreur:', err); });
  });
}
  