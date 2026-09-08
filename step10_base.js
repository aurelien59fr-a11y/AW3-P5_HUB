/* imports/base.js -- utilitaires communs aux imports manuels (Grafana, Protime, NCP).
   Extrait de app.js a l'Etape 10 du plan Phase 2. Doit se charger avant les
   autres fichiers imports/*.js qui appellent ptKey(). */

function ptKey(nom, date, type, heure){
  return (nom + '_' + date + '_' + type + '_' + heure)
    .replace(/[.#$\/\[\]\s]/g, '-');
}
