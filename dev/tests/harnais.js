// Harnais de test : charge les scripts du dashboard dans un DOM simule (jsdom),
// avec une fausse base Firebase qui ENREGISTRE les ecritures au lieu de les
// envoyer. Aucune connexion reseau n'est possible : fetch et WebSocket levent
// une erreur, et l'objet `firebase` n'existe pas.
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const racine = path.resolve(import.meta.dirname, '..', '..');

export function fausseBase({ donnees = {}, echec = () => false } = {}) {
  // donnees : arbre lu par once() ; echec(op, chemin) -> true pour simuler un refus Firebase.
  const ecritures = [];
  let compteur = 0;
  const lire = (chemin) => chemin.split('/').filter(Boolean).reduce((n, k) => (n == null ? null : n[k]), donnees) ?? null;
  function ref(chemin = '') {
    const enregistrer = (op) => (valeur) => {
      if (echec(op, chemin)) return Promise.reject(new Error('PERMISSION_DENIED (simule)'));
      ecritures.push({ op, chemin, valeur });
      return Promise.resolve();
    };
    const r = {
      key: chemin.split('/').pop() || null,
      set: enregistrer('set'),
      update: enregistrer('update'),
      remove: () => { if (echec('remove', chemin)) return Promise.reject(new Error('PERMISSION_DENIED (simule)')); ecritures.push({ op: 'remove', chemin }); return Promise.resolve(); },
      push: (valeur) => {
        const key = 'cle_test_' + (++compteur);
        const enfant = ref(chemin + '/' + key);
        let p = Promise.resolve(ref(chemin + '/' + key));
        if (valeur !== undefined) {
          if (echec('push', chemin)) p = Promise.reject(new Error('PERMISSION_DENIED (simule)'));
          else ecritures.push({ op: 'push', chemin, valeur, key });
        }
        enfant.then = p.then.bind(p); enfant.catch = p.catch.bind(p);
        return enfant;
      },
      once: () => { const v = lire(chemin); return Promise.resolve({ val: () => v, exists: () => v != null }); },
      on: () => {},
      off: () => {},
      child: (c) => ref(chemin ? chemin + '/' + c : c),
    };
    return r;
  }
  return { ref, ecritures };
}

export function chargerApp(fichiers, { html = '<!doctype html><body></body>', avant } = {}) {
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost/' });
  const w = dom.window;
  w.fetch = () => { throw new Error('Reseau interdit pendant les tests'); };
  w.WebSocket = function () { throw new Error('Reseau interdit pendant les tests'); };
  w.alert = () => {};
  w.confirm = () => false; // toute confirmation est refusee par defaut
  w.prompt = () => null;
  // jsdom ne fournit pas CSS.escape (present dans tous les navigateurs cibles)
  if (!w.CSS) w.CSS = { escape: (v) => String(v).replace(/["\\\]\[#.:>+~*^$|=(),' ]/g, '\\$&') };
  if (avant) avant(w);
  for (const f of fichiers) {
    w.eval(fs.readFileSync(path.join(racine, f), 'utf8') + '\n//# sourceURL=' + f);
  }
  return w;
}

export function lireFichier(f) {
  return fs.readFileSync(path.join(racine, f), 'utf8');
}
