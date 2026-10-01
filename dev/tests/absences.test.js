// C. Absences : ecritures unitaires (push / remove), annees non prises en
// charge rejetees. Fausse base, donnees fictives.
import { describe, it, expect } from 'vitest';
import { chargerApp, fausseBase } from './harnais.js';

function app(role = 'subchef') {
  const base = fausseBase();
  const w = chargerApp(['js/core/format.js', 'js/core/ui.js', 'js/vues/planning.js'], {
    html: '<body><span class="sp" id="pill" data-n="Alex Exemple" data-i="1" data-s="L">L</span></body>',
    avant: (w) => {
      w.db = base; w.t = (k) => k; w.currentUser = { email: 'test@exemple.test', role };
      w.SHIFTS25 = [{ n: 'Alex Exemple', s: [] }]; w.SHIFTS26 = [{ n: 'Alex Exemple', s: ['L', 'L'] }]; w.SHIFTS27 = [{ n: 'Alex Exemple', s: [] }];
      w.WEEKS25 = [{ d: ['01/01'] }]; w.WEEKS26 = [{ d: ['01/01', '02/01'] }]; w.WEEKS27 = [{ d: ['01/01'] }];
      w.ABS = [{ n: 'Ancienne Donnee', a: '01/01/2025', b: '01/01/2025', d: 1, t: 'ziek' }]; // liste codee en dur
      w.EXTRA_HIST = []; w.EMP = []; w.updSlbl = () => {};
    },
  });
  Object.assign(w, { canEdit: () => true, allDates: () => ['01/01', '02/01'], sCls: () => 's', sLbl: (v) => v,
    recalc() {}, buildBT() {}, updKPI() {}, refreshCharts() {}, buildAbs() {}, updAbsLbl() {}, scColor: () => '#fff' });
  w.BD = [];
  w.curYear = '2026';
  return { w, base };
}

describe('Chargement', () => {
  it('garde la cle Firebase de chaque absence et remplace la liste codee en dur', () => {
    const { w } = app();
    w.absChargerDepuis([{ n: 'Alex Exemple', a: '02/03/2026', b: '04/03/2026', d: 3, t: 'ziek' }, null, { n: 'Sam Fictif', a: '05/03/2026', b: '05/03/2026', d: 1, t: 'verlof' }]);
    expect(w.ABS.map((a) => a._k)).toEqual(['0', '2']);
    expect(w.ABS.find((a) => a.n === 'Ancienne Donnee')).toBeUndefined();
    expect(w.ABS_CHARGEES).toBe(true);
  });
  it('un noeud vide donne une liste vide (plus de donnees codees en dur)', () => {
    const { w } = app();
    w.absChargerDepuis(null);
    expect(w.ABS).toHaveLength(0);
  });
  it('le sous-chef et les coordinateurs lisent les absences, pas un employe', () => {
    expect(app('subchef').w.peutLireAbsences()).toBe(true);
    expect(app('admin').w.peutLireAbsences()).toBe(true);
    expect(app('custom').w.peutLireAbsences()).toBe(false);
  });
});

describe('Maladie saisie dans le planning (sous-chef)', () => {
  it("ajoute l'absence par push(), sans reecrire la liste", async () => {
    const { w, base } = app();
    w.absChargerDepuis([{ n: 'Sam Fictif', a: '05/03/2026', b: '05/03/2026', d: 1, t: 'verlof' }]);
    w.activePill = w.document.getElementById('pill');
    w.applyShift('ziek');
    const push = base.ecritures.filter((e) => e.op === 'push');
    expect(push).toHaveLength(1);
    expect(push[0].chemin).toBe('planning/absences');
    expect(push[0].valeur).toMatchObject({ n: 'Alex Exemple', a: '02/01/2026', d: 1, t: 'ziek' });
    expect(push[0].valeur._k).toBeUndefined();
    const updates = base.ecritures.filter((e) => e.op === 'update');
    expect(updates.every((u) => !Object.keys(u.valeur).includes('planning/absences'))).toBe(true);
    expect(w.ABS.find((a) => a.n === 'Alex Exemple')._k).toBeTruthy();
  });

  it('retire la maladie par sa cle (remove), sans toucher aux autres', async () => {
    const { w, base } = app();
    w.absChargerDepuis({ k1: { n: 'Alex Exemple', a: '02/01/2026', b: '02/01/2026', d: 1, t: 'ziek' }, k2: { n: 'Sam Fictif', a: '05/03/2026', b: '05/03/2026', d: 1, t: 'verlof' } });
    const pill = w.document.getElementById('pill'); pill.dataset.s = 'ziek';
    w.activePill = pill;
    w.applyShift('L');
    const rm = base.ecritures.filter((e) => e.op === 'remove');
    expect(rm.map((e) => e.chemin)).toEqual(['planning/absences/k1']);
    expect(w.ABS.map((a) => a.n)).toEqual(['Sam Fictif']);
  });
});

describe('Import (administration)', () => {
  it("absEnregistrerTout ecrit la liste sans les cles et renumerote", async () => {
    const { w, base } = app('admin');
    w.absChargerDepuis({ x: { n: 'A', a: '01/01/2026', b: '01/01/2026', d: 1, t: 'ziek' }, y: { n: 'B', a: '02/01/2026', b: '02/01/2026', d: 1, t: 'ziek' } });
    await w.absEnregistrerTout();
    const set = base.ecritures.find((e) => e.op === 'set');
    expect(set.chemin).toBe('planning/absences');
    expect(set.valeur.every((a) => a._k === undefined)).toBe(true);
    expect(w.ABS.map((a) => a._k)).toEqual(['0', '1']);
  });
  it('refuse si les absences du serveur ne sont pas chargees', async () => {
    const { w, base } = app('admin');
    await expect(w.absEnregistrerTout()).rejects.toThrow('non chargees');
    expect(base.ecritures).toHaveLength(0);
  });
});

describe('Annees prises en charge', () => {
  it('shiftsPourAnnee / weeksPourAnnee rejettent 2024 et 2028', () => {
    const { w } = app();
    expect(w.shiftsPourAnnee('2026')).toBe(w.SHIFTS26);
    expect(w.shiftsPourAnnee('2028')).toBeNull();
    expect(w.weeksPourAnnee('2024')).toBeNull();
    expect(w.indexPourDate('2028-01-01').idx).toBe(-1);
  });
});
