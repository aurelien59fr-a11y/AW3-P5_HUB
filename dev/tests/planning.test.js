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
