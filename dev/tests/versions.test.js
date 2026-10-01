// Les versions ?v= du service worker doivent correspondre a celles d'index.html,
// sinon les utilisateurs gardent d'anciens fichiers en cache.
import { it, expect } from 'vitest';
import { lireFichier } from './harnais.js';

it('APP_SHELL de sw.js = scripts et styles references par index.html', () => {
  const ix = lireFichier('index.html');
  const sw = lireFichier('sw.js');
  const dansIndex = [...ix.matchAll(/(?:src|href)="((?:js|css)\/[^"]+\?v=\d+)"/g)].map((m) => m[1]).sort();
  const dansSw = [...sw.matchAll(/'\.\/((?:js|css)\/[^']+\?v=\d+)'/g)].map((m) => m[1]).sort();
  expect(dansSw).toEqual(dansIndex);
});

// Aucun fichier publie sur le site ne doit contenir de donnees personnelles
// (noms + absences, scores Bradford, plannings) : elles viennent de Firebase.
import { lireFichier as lire2 } from './harnais.js';
import { describe as d2, it as it2, expect as ex2 } from 'vitest';
d2('Fichiers publics sans donnees personnelles', () => {
  it2('EMP, ABS, BD vides et plannings sans lignes employes dans app.js', () => {
    const app = lire2('js/app.js');
    ex2(app).toMatch(/^var EMP=\[\]; /m);
    ex2(app).toMatch(/^var ABS=\[\]; /m);
    ex2(app).toMatch(/^var BD=\[\]; /m);
    for (const y of ['25', '26', '27']) {
      const bloc = app.slice(app.indexOf('var SHIFTS' + y + ' = ['), app.indexOf('];', app.indexOf('var SHIFTS' + y + ' = [')));
      ex2(bloc.match(/\{n:"/g).length).toBe(3); // seulement les 3 lignes EXTRA
      ex2(bloc).not.toMatch(/ziek|verlof/);
    }
    ex2(lire2('js/imports/protime.js')).toMatch(/var PROTIME_PERSON_MAP = \{\};/);
  });
});
