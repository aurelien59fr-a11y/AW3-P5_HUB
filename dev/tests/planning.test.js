// B. Sauvegardes du planning : fausse base, donnees fictives, aucune ecriture reelle.
import { describe, it, expect } from 'vitest';
import { chargerApp, fausseBase } from './harnais.js';

function appPlanning() {
  const base = fausseBase();
  const w = chargerApp(['js/core/ui.js', 'js/vues/planning.js'], {
    avant: (w) => {
      w.db = base; w.t = (k) => k; w.currentUser = { email: 'test@exemple.test', role: 'subchef' };
      w.SHIFTS25 = [{ n: 'Alex Exemple', s: ['V', 'V'] }];
      w.SHIFTS26 = [{ n: 'Alex Exemple', s: ['L', 'L'] }];
      w.SHIFTS27 = [{ n: 'Alex Exemple', s: ['N', 'N'] }];
      w.ABS = []; w.EXTRA_HIST = [];
      w.updSlbl = () => {};
    },
  });
  return { w, base };
}

describe('save()', () => {
  it('inclut planning/shifts2027', async () => {
    const { w, base } = appPlanning();
    await w.save();
    const upd = base.ecritures.find((e) => e.op === 'update');
    expect(Object.keys(upd.valeur)).toContain('planning/shifts2027');
    expect(upd.valeur['planning/shifts2027']['Alex Exemple']).toEqual(['N', 'N']);
  });
});

function appCellule() {
  const base = fausseBase();
  const w = chargerApp(['js/core/format.js', 'js/core/ui.js', 'js/vues/planning.js'], {
    html: '<body><span class="sp" id="pill" data-n="Alex Exemple" data-i="1" data-s="L">L</span></body>',
    avant: (w) => {
      w.db = base; w.t = (k) => k; w.currentUser = { email: 'test@exemple.test', role: 'subchef' };
      w.SHIFTS25 = [{ n: 'Alex Exemple', s: ['V', 'V'] }];
      w.SHIFTS26 = [{ n: 'Alex Exemple', s: ['L', 'L'] }, { n: 'Sam Fictif', s: ['L', 'L'] }];
      w.SHIFTS27 = [{ n: 'Alex Exemple', s: ['N', 'N'] }];
      w.ABS = []; w.EXTRA_HIST = []; w.EMP = [];
      w.updSlbl = () => {};
    },
  });
  // Dependances d'interface simulees
  Object.assign(w, { canEdit: () => true, allDates: () => ['01/01', '02/01'], sCls: () => 's', sLbl: (v) => v,
    recalc() {}, buildBT() {}, updKPI() {}, refreshCharts() {}, buildAbs() {}, updAbsLbl() {} });
  w.curYear = '2026';
  w.activePill = w.document.getElementById('pill');
  return { w, base };
}

describe('saveCell() et applyShift()', () => {
  it("un changement de poste n'ecrit que la cellule et lastUpdate", async () => {
    const { w, base } = appCellule();
    w.applyShift('N');
    await new Promise((r) => setTimeout(r, 0));
    expect(base.ecritures).toHaveLength(1);
    expect(Object.keys(base.ecritures[0].valeur).sort()).toEqual(['planning/lastUpdate', 'planning/shifts2026/Alex Exemple/1']);
    expect(base.ecritures[0].valeur['planning/shifts2026/Alex Exemple/1']).toBe('N');
    expect(w.SHIFTS26[0].s[1]).toBe('N');
    expect(w.SHIFTS26[1].s[1]).toBe('L'); // autre employe intact
  });

  it('2027 est ecrit dans planning/shifts2027', async () => {
    const { w, base } = appCellule();
    w.curYear = '2027';
    w.applyShift('V');
    expect(Object.keys(base.ecritures[0].valeur)).toContain('planning/shifts2027/Alex Exemple/1');
  });

  it('une annee non prise en charge est rejetee sans ecriture', async () => {
    const { w, base } = appCellule();
    await expect(w.saveCell('2028', 'Alex Exemple', 1, 'N')).rejects.toThrow('Annee non prise en charge');
    w.curYear = '2024';
    w.applyShift('N');
    expect(base.ecritures).toHaveLength(0);
  });
});

describe('Ouverture du planning sur aujourd\'hui', () => {
  const dates = ['26/09', '27/09', '03/10', '04/10', '10/10', '11/10', '11/11', '14/11'];
  const app = () => appPlanning().w;

  it('un vendredi : le week-end qui arrive (samedi + dimanche)', () => {
    expect(app().planningProchainBloc(dates, '2026', new Date(2026, 9, 2, 20, 15))).toEqual([2, 3]);
  });
  it('un dimanche : le week-end en cours, depuis le samedi', () => {
    expect(app().planningProchainBloc(dates, '2026', new Date(2026, 9, 4, 8, 0))).toEqual([2, 3]);
  });
  it('un lundi : le week-end suivant', () => {
    expect(app().planningProchainBloc(dates, '2026', new Date(2026, 9, 5))).toEqual([4, 5]);
  });
  it('un ferie isole en semaine est un bloc a lui seul', () => {
    expect(app().planningProchainBloc(dates, '2026', new Date(2026, 10, 9))).toEqual([6]);
  });
  it('plus rien a venir : aucun bloc', () => {
    expect(app().planningProchainBloc(dates, '2026', new Date(2026, 11, 31))).toEqual([]);
  });
  it('annee : l\'annee en cours, ou la suivante si elle est terminee', () => {
    const w = appPlanning({}).w;
    w.WEEKS26 = [{ d: ['03/10', '04/10'] }];
    w.WEEKS27 = [{ d: ['02/01', '03/01'] }];
    expect(w.planningAnneeDuJour(new Date(2026, 9, 2))).toBe('2026');
    expect(w.planningAnneeDuJour(new Date(2026, 11, 20))).toBe('2027');
  });
});
