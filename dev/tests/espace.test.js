// Mon espace : chaque employe ne recoit que SES donnees (espace/<uid>).
import { describe, it, expect } from 'vitest';
import { chargerApp, fausseBase } from './harnais.js';

function app(role) {
  const base = fausseBase();
  const w = chargerApp(['js/core/ui.js', 'js/vues/planning.js', 'js/vues/espace.js', 'js/metier/espace-perso.js'], {
    avant: (w) => { w.db = base; w.t = (k) => k; w.currentUser = { uid: 'u-' + role, role, email: role + '@exemple.test' }; },
  });
  w.db = base;
  Object.assign(w, {
    EMP: [{ id: 'e1', n: 'Alex Exemple' }, { id: 'e2', n: 'Sam Fictif' }],
    ACCOUNTS: { e1: { uid: 'uid-alex' }, e2: { uid: 'uid-sam' } },
    ABS: [{ n: 'Alex Exemple', a: '02/03/2026', b: '02/03/2026', d: 1, t: 'ziek', _k: '0' }, { n: 'Sam Fictif', a: '05/03/2026', b: '05/03/2026', d: 1, t: 'verlof', _k: '1' }],
    PT_DATA: { p1: { nom: 'Alex Exemple', type: 'retard' }, p2: { nom: 'Sam Fictif', type: 'retard' } },
    BD: [{ n: 'Alex Exemple', S: 1, D: 1, sc: 1, T: [0, 0, 0, 1] }, { n: 'Sam Fictif', S: 0, D: 0, sc: 0, T: [0, 0, 0, 0] }],
  });
  w.ABS_CHARGEES = true; w.ESPACE_PT_CHARGES = true;
  return { w, base };
}

describe("Publication par l'admin", () => {
  it('chaque compte recoit uniquement ses propres absences, pointages et score', async () => {
    const { w, base } = app('admin');
    expect(await w.publierEspacesPersonnels()).toBe(2);
    const u = base.ecritures.find((e) => e.op === 'update').valeur;
    expect(Object.keys(u).sort()).toEqual(['espace/uid-alex', 'espace/uid-sam']);
    const alex = u['espace/uid-alex'];
    expect(alex.absences.map((a) => a.n)).toEqual(['Alex Exemple']);
    expect(alex.absences[0]._k).toBeUndefined();
    expect(Object.keys(alex.pointages)).toEqual(['p1']);
    expect(alex.bradford).toMatchObject({ S: 1, D: 1, sc: 1 });
    expect(JSON.stringify(alex)).not.toContain('Sam Fictif');
  });
  it("rien n'est renvoye si rien n'a change ; seul l'espace modifie part ensuite", async () => {
    const { w, base } = app('admin');
    await w.publierEspacesPersonnels();
    expect(await w.publierEspacesPersonnels()).toBe(0);
    w.PT_DATA.p3 = { nom: 'Sam Fictif', type: 'retard' };
    expect(await w.publierEspacesPersonnels()).toBe(1);
    expect(Object.keys(base.ecritures.at(-1).valeur)).toEqual(['espace/uid-sam']);
  });
  it('ne publie rien tant que les donnees completes ne sont pas chargees', async () => {
    const { w, base } = app('admin');
    w.ESPACE_PT_CHARGES = false;
    expect(await w.publierEspacesPersonnels()).toBe(0);
    expect(base.ecritures).toHaveLength(0);
  });
  it("un compte non admin ne publie jamais", async () => {
    const { w, base } = app('subchef');
    expect(await w.publierEspacesPersonnels()).toBe(0);
    expect(base.ecritures).toHaveLength(0);
  });
});

describe('Lecture cote employe', () => {
  it("l'employe lit son espace, pas les listes de l'equipe", () => {
    const { w } = app('custom');
    w.ESPACE_PERSO = { absences: [{ n: 'Alex Exemple', t: 'ziek' }], pointages: { p1: { nom: 'Alex Exemple' } }, bradford: { S: 1, D: 1, sc: 1 } };
    expect(w.espaceAbsences()).toHaveLength(1);
    expect(Object.keys(w.espacePointages())).toEqual(['p1']);
    expect(w.espaceBradford('alex exemple')).toMatchObject({ sc: 1 });
  });
  it('le sous-chef garde les donnees completes', () => {
    const { w } = app('subchef');
    expect(w.espaceAbsences()).toBe(w.ABS);
    expect(Object.keys(w.espacePointages())).toEqual(['p1', 'p2']);
  });
});
