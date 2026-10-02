/* core/demarrage.js — filet de securite du splash (sorti de index.html :
   la CSP n'autorise plus aucun script ecrit dans la page). */
/* Filet de securite INDEPENDANT de app.js : garantit que le splash
   disparait toujours, meme si app.js plante completement pour une
   raison quelconque (Firebase indisponible, erreur JS, reseau...).
   Place ici, tout en haut, pour ne jamais dependre du reste du script. */
(function(){
  var DELAI_MAX_MS = 10000;
  var DELAI_VERIF_2 = 13000; // 2e verif si le dismissal etait en cours mais pas fini
  var dejaTraite = false;
  function afficherErreurChargement(){
    if(dejaTraite) return; dejaTraite = true;
    var el = document.getElementById('splash-screen');
    if(!el) return;
    el.innerHTML = '<div style="position:relative;z-index:1;text-align:center;color:#fff;font-family:Inter,sans-serif;padding:0 24px">'
      + '<div style="font-size:15px;font-weight:600;margin-bottom:8px">Le chargement prend plus de temps que prevu</div>'
      + '<div style="font-size:13px;color:rgba(255,255,255,.7);margin-bottom:20px">Verifie ta connexion, ou reessaie.</div>'
      + '<button data-on-click="location.reload()" style="padding:10px 22px;border-radius:8px;border:none;background:#3b82f6;color:#fff;font-family:Inter,sans-serif;font-size:14px;font-weight:600;cursor:pointer">Recharger la page</button>'
      + '</div>';
  }
  // Si l'app a demarre normalement, app.js retire lui-meme #splash-screen
  // du DOM (voir plus bas dans app.js). On verifie aussi el.dataset.hidden,
  // pose par app.js DES qu'il commence a fermer le splash (avant meme
  // l'animation de fondu) -- si c'est deja pose, app.js a bien reussi,
  // on lui laisse juste un peu plus de temps pour finir l'animation,
  // plutot que d'afficher une fausse alerte pendant qu'il termine.
  setTimeout(function(){
    var el = document.getElementById('splash-screen');
    if(!el) return; // deja retire -> tout est ok
    if(el.dataset.hidden){
      // app.js a bien demarre la fermeture, on lui laisse un peu plus de temps
      setTimeout(function(){
        var el2 = document.getElementById('splash-screen');
        if(el2) afficherErreurChargement(); // toujours la apres le delai supplementaire -> vrai probleme
      }, DELAI_VERIF_2 - DELAI_MAX_MS);
    } else {
      afficherErreurChargement(); // rien n'a demarre du tout -> vrai probleme
    }
  }, DELAI_MAX_MS);
})();
