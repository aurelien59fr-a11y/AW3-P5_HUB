// Matrice de tests des REGLES PROPOSEES, a lancer contre l'emulateur local
// Firebase (jamais contre la production). Donnees fictives uniquement.
//
// Prerequis (PC avec Node 18+ et Java 11+) :
//   cd dev && npm i -D @firebase/rules-unit-testing firebase firebase-tools
//   npx firebase emulators:exec --only database --project demo-aw3 "node firebase/regles.emulateur.test.mjs"
// Le projet "demo-aw3" (prefixe demo-) garantit qu'aucune ressource reelle n'est touchee.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { ref, get, set, update, push, remove } from 'firebase/database';

const regles = fs.readFileSync(path.join(import.meta.dirname, 'database.rules.proposition.json'), 'utf8');
const env = await initializeTestEnvironment({ projectId: 'demo-aw3', database: { rules: regles, host: '127.0.0.1', port: 9000 } });

await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.database();
  await set(ref(db), {
    users: {
      admin: { role: 'admin' }, souschef: { role: 'subchef' }, visiteur: { role: 'visiteur' },
      employe: { role: 'custom', tabs: { espace: true } }, coord: { role: 'custom', editPlanning: true },
    },
    employees: { e1: { name: 'Alex Exemple', group: 'Prod' } },
    planning: {
      shifts2026: { 'Alex Exemple': ['V', 'V'] },
      absences: [{ n: 'Alex Exemple', a: '02/03/2026', b: '04/03/2026', d: 3, t: 'ziek', y: '2026' }],
      lastUpdate: { at: 'x', by: 'y' },
    },
    pointages: { p1: { nom: 'Alex Exemple', date: '2026-03-02' } },
    recrutement: { candidats: { c1: { nom: 'Candidat Fictif' } } },
    bradford: { comments: { 'Alex Exemple': { text: 'x' } } },
    espace: { employe: { nom: 'Alex Exemple', absences: [] }, coord: { nom: 'Coord Fictif' } },
    audit_log: { e1: { action: 'origine', par: 'x', uid: 'admin', at: '2026-10-01' } },
  });
});

const qui = {
  admin: env.authenticatedContext('admin'),
  'sous-chef': env.authenticatedContext('souschef'),
  visiteur: env.authenticatedContext('visiteur'),
  employe: env.authenticatedContext('employe'),
  coordinateur: env.authenticatedContext('coord'),
  'compte absent de /users': env.authenticatedContext('inconnu'),
  'non connecte': env.unauthenticatedContext(),
};
const db = (r) => qui[r].database();
const OK = assertSucceeds, NON = assertFails;
const absence = { n: 'Alex Exemple', a: '05/03/2026', b: '05/03/2026', d: 1, t: 'ziek', y: '2026' };

// [role, description, operation, attendu]
const cas = [];
for (const r of Object.keys(qui)) {
  const membre = !['compte absent de /users', 'non connecte'].includes(r);
  const edit = ['admin', 'sous-chef', 'coordinateur'].includes(r);
  cas.push([r, 'lire employees', () => get(ref(db(r), 'employees')), membre]);
  cas.push([r, 'lire planning 2026', () => get(ref(db(r), 'planning/shifts2026')), membre]);
  cas.push([r, 'lire absences', () => get(ref(db(r), 'planning/absences')), ['admin', 'sous-chef', 'visiteur', 'coordinateur'].includes(r)]);
  cas.push([r, 'lire pointages', () => get(ref(db(r), 'pointages')), ['admin', 'sous-chef', 'visiteur'].includes(r)]);
  cas.push([r, 'lire recrutement', () => get(ref(db(r), 'recrutement')), r === 'admin']);
  cas.push([r, 'lire commentaires Bradford', () => get(ref(db(r), 'bradford/comments')), ['admin', 'sous-chef', 'visiteur'].includes(r)]);
  cas.push([r, 'lire la liste des users', () => get(ref(db(r), 'users')), r === 'admin']);
  cas.push([r, 'modifier une cellule 2026', () => set(ref(db(r), 'planning/shifts2026/Alex Exemple/1'), 'N'), edit]);
  cas.push([r, 'ajouter une absence (push)', () => push(ref(db(r), 'planning/absences'), absence), edit]);
  cas.push([r, 'ecrire pointages/_test_connexion', () => set(ref(db(r), 'pointages/_test_connexion'), { ts: 1 }), r === 'admin']);
  cas.push([r, 'ajouter une entree audit_log a son nom', () => push(ref(db(r), 'audit_log'), { action: 'test', par: 'x', uid: r === 'non connecte' ? 'anonyme' : ({ admin: 'admin', 'sous-chef': 'souschef', visiteur: 'visiteur', employe: 'employe', coordinateur: 'coord', 'compte absent de /users': 'inconnu' })[r], at: '2026-10-01' }), membre]);
  cas.push([r, 'lire audit_log', () => get(ref(db(r), 'audit_log')), r === 'admin']);
}
cas.push(['employe', 'lire son propre espace', () => get(ref(db('employe'), 'espace/employe')), true]);
cas.push(['employe', "lire l'espace d'un autre", () => get(ref(db('employe'), 'espace/coord')), false]);
cas.push(['employe', 'ecrire dans son espace', () => set(ref(db('employe'), 'espace/employe/nom'), 'x'), false]);
cas.push(['admin', "lire l'espace d'un employe", () => get(ref(db('admin'), 'espace/employe')), true]);
// Validations et roles
cas.push(['sous-chef', 'absence invalide (date mal formee)', () => push(ref(db('sous-chef'), 'planning/absences'), { ...absence, a: '2026-03-05' }), false]);
cas.push(['sous-chef', 'absence avec champ inconnu (_k)', () => push(ref(db('sous-chef'), 'planning/absences'), { ...absence, _k: 'x' }), false]);
cas.push(['sous-chef', 'cellule non texte', () => set(ref(db('sous-chef'), 'planning/shifts2026/Alex Exemple/1'), 42), false]);
cas.push(['employe', 'se donner le role admin', () => set(ref(db('employe'), 'users/employe/role'), 'admin'), false]);
cas.push(['admin', 'role inconnu refuse', () => set(ref(db('admin'), 'users/employe/role'), 'superadmin'), false]);
cas.push(['employe', 'entree audit_log au nom d\'un autre', () => push(ref(db('employe'), 'audit_log'), { action: 'x', par: 'x', uid: 'admin', at: 'x' }), false]);
cas.push(['admin', 'modifier une entree audit_log existante', () => set(ref(db('admin'), 'audit_log/e1/action'), 'efface'), false]);
cas.push(['admin', 'reecrire toute la liste des absences', () => set(ref(db('admin'), 'planning/absences'), [absence]), true]);

let echecs = 0;
for (const [r, desc, op, attendu] of cas) {
  try { await (attendu ? OK(op()) : NON(op())); console.log(`OK   ${r.padEnd(24)} ${desc} -> ${attendu ? 'autorise' : 'refuse'}`); }
  catch (e) { echecs++; console.log(`ECHEC ${r.padEnd(24)} ${desc} (attendu : ${attendu ? 'autorise' : 'refuse'})`); }
}
await env.cleanup();
console.log(`\n${cas.length - echecs}/${cas.length} cas conformes`);
assert.equal(echecs, 0);
