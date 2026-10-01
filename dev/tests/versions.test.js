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
