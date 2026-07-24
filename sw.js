/* ============================================================
   Service Worker — Bradford Dashboard AW3 Ploeg 5
   Stratégie :
   - App shell (html/js/icônes) → cache-first avec mise à jour en fond
   - Firebase / API externes → toujours réseau (jamais de cache)
   - Bump CACHE_VERSION à chaque déploiement pour forcer la mise à jour
============================================================ */

const CACHE_VERSION = 'bradford-v8';
const APP_SHELL = [
  './',
  './index.html',
  './js/app.js',
  './manifest.json',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Domaines à ne JAMAIS mettre en cache (données live)
const NEVER_CACHE = [
  'firebaseio.com',
  'googleapis.com',
  'gstatic.com',
  'cloudflare.com'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache){
      // addAll échoue en bloc si UNE seule ressource 404 → on ajoute une par une
      // pour ne jamais bloquer l'installation du service worker
      return Promise.all(
        APP_SHELL.map(function(url){
          return cache.add(url).catch(function(e){
            console.warn('[SW] Impossible de mettre en cache : ' + url, e);
          });
        })
      );
    }).then(function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_VERSION; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event){
  var url = event.request.url;

  // Ne jamais intercepter Firebase / CDN externes → laisser passer normalement
  if(NEVER_CACHE.some(function(d){ return url.indexOf(d) !== -1; })){
    return;
  }

  // Seulement GET
  if(event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(cached){
      var fetchPromise = fetch(event.request).then(function(networkResp){
        if(networkResp && networkResp.status === 200){
          var respClone = networkResp.clone();
          caches.open(CACHE_VERSION).then(function(cache){
            cache.put(event.request, respClone);
          });
        }
        return networkResp;
      }).catch(function(){
        return cached; // offline → on retombe sur le cache si dispo
      });

      // Cache-first : réponse immédiate si en cache, sinon on attend le réseau
      return cached || fetchPromise;
    })
  );
}); 
