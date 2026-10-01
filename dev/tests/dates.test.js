// Phase 3c : dates, rotation des equipes, liste Bradford. TZ=Europe/Brussels.
import { describe, it, expect, beforeAll } from 'vitest';
import { chargerApp, lireFichier } from './harnais.js';

// Tables officielles (bloc tenu par P5 les jours en horaire week-end), lues dans app.js.
const app = lireFichier('js/app.js');
const table = (n) => JSON.parse(app.match(new RegExp('var ' + n + '=(\\{[^;]*\\});'))[1]);
const H = { H2025: table('H2025'), H2026: table('H2026'), H2027: table('H2027') };

let w;
beforeAll(() => { w = chargerApp(['js/core/format.js', 'js/metier/ncp.js'], { avant: (w) => { Object.assign(w, H); w.t = (k) => k; } }); });

const jourIso = (d) => d.toISOString().slice(0, 10);
const joursEntre = (debut, fin, pas = 1) => { const r = []; for (let d = new Date(debut + 'T12:00:00Z'); jourIso(d) <= fin; d.setUTCDate(d.getUTCDate() + pas)) r.push(jourIso(d)); return r; };

describe('Rotation : jamais deux fois le meme horaire d\'affilee', () => {
  it('week-ends : P5 alterne jour / nuit chaque semaine (2024 a 2032)', () => {
    const doubles = [];
    let prec = null;
    for (const sam of joursEntre('2024-01-06', '2032-12-31', 7)) {
      const bloc = w.equipeWeekend(sam, '05h-17h') === 'P5' ? '05h-17h' : '17h-05h';
      if (bloc === prec) doubles.push(sam);
      prec = bloc;
      const dim = jourIso(new Date(Date.parse(sam + 'T12:00:00Z') + 864e5));
      expect(w.equipeWeekend(dim, bloc)).toBe('P5'); // samedi et dimanche : meme bloc
      expect(w.equipeWeekend(sam, bloc === '05h-17h' ? '17h-05h' : '05h-17h')).toBe('P4');
    }
    expect(doubles).toEqual([]);
  });

  it('semaine : P1 et P2 alternent matin / apres-midi chaque semaine, P3 toujours de nuit', () => {
    const doubles = [];
    let prec = null;
    for (const lun of joursEntre('2024-01-01', '2032-12-31', 7)) {
      const matin = w.equipeSemaine(lun, '05h-13h');
      expect(w.equipeSemaine(lun, '13h-21h')).toBe(matin === 'P1' ? 'P2' : 'P1');
      expect(w.equipeSemaine(lun, '21h-05h')).toBe('P3');
      const ven = jourIso(new Date(Date.parse(lun + 'T12:00:00Z') + 4 * 864e5));
      expect(w.equipeSemaine(ven, '05h-13h')).toBe(matin); // meme horaire toute la semaine
      if (matin === prec) doubles.push(lun);
      prec = matin;
    }
    expect(doubles).toEqual([]);
  });

  it('passage 2026 -> 2027 (annee de 53 semaines ISO) : pas de repetition', () => {
    expect(w.equipeSemaine('2026-12-28', '05h-13h')).not.toBe(w.equipeSemaine('2027-01-04', '05h-13h'));
    expect(w.equipeWeekend('2026-12-26', '17h-05h')).toBe('P5');
    expect(w.equipeWeekend('2027-01-02', '17h-05h')).toBe('P4');
  });

  it('rotation calee sur les plannings 2025 et 2026 (P1 le matin la semaine du 06/01/2025)', () => {
    expect(w.equipeSemaine('2025-01-06', '05h-13h')).toBe('P2');
    expect(w.equipeSemaine('2024-12-30', '05h-13h')).toBe('P1');
  });
});

describe('Tables H2025 / H2026 / H2027 (bloc de P5 en horaire week-end)', () => {
  it('chaque samedi et dimanche des tables est conforme a la rotation', () => {
    const ecarts = [];
    for (const [nom, h] of Object.entries(H)) {
      const annee = nom.slice(1);
      for (const [jjmm, bloc] of Object.entries(h)) {
        const [jj, mm] = jjmm.split('/');
        const iso = `${annee}-${mm}-${jj}`;
        const dow = new Date(iso + 'T12:00:00Z').getUTCDay();
        if (dow !== 0 && dow !== 6) continue;
        if (w.equipeWeekend(iso, bloc) !== 'P5') ecarts.push(iso);
      }
    }
    expect(ecarts).toEqual([]);
  });

  it('ferie en semaine : prolonge un week-end (lun/mar : celui d\'avant, jeu/ven : celui d\'apres)', () => {
    const ecarts = [];
    const blocDe = (d) => (w.equipeWeekend(d, '05h-17h') === 'P5' ? '05h-17h' : '17h-05h');
    for (const [nom, h] of Object.entries(H)) {
      const annee = nom.slice(1);
      for (const [jjmm, bloc] of Object.entries(h)) {
        const [jj, mm] = jjmm.split('/');
        const iso = `${annee}-${mm}-${jj}`;
        const t = Date.parse(iso + 'T12:00:00Z');
        const dow = new Date(t).getUTCDay();
        if (dow === 0 || dow === 6) continue;
        if (blocDe(iso) !== bloc) ecarts.push(iso + ' table');
        const samPrec = jourIso(new Date(t - (dow + 1) * 864e5));
        const samSuiv = jourIso(new Date(t + (6 - dow) * 864e5));
        if (dow <= 2 && bloc !== blocDe(samPrec)) ecarts.push(iso);
        if (dow >= 4 && bloc !== blocDe(samSuiv)) ecarts.push(iso);
      }
    }
    expect(ecarts).toEqual([]);
  });

  it('equipeReelle : un ferie suit la table, la nuit appartient a la veille', () => {
    expect(H.H2027['24/07']).toBe('17h-05h');
    expect(w.getEquipe('2027-07-25', '03:00')).toBe('P5');
    // Lundi de Paques 2026 (06/04) : rattache au week-end du 04-05/04, P5 de nuit
    expect(H.H2026['06/04']).toBe('17h-05h');
    expect(w.equipeReelle('2026-04-06', '20:00')).toBe('P5');
    expect(w.equipeReelle('2026-04-07', '03:00')).toBe('P5');
    expect(w.equipeReelle('2026-04-06', '10:00')).toBe('P4');
  });
});

describe('Outils de date', () => {
  it('isoLocal ne recule pas d\'un jour a minuit', () => {
    expect(w.isoLocal(new w.Date(2026, 2, 10, 0, 0))).toBe('2026-03-10');
  });
  it('ajouterJours est juste les jours de changement d\'heure', () => {
    expect(w.isoLocal(w.ajouterJours(new w.Date(2026, 9, 25), 1))).toBe('2026-10-26'); // fin heure d'ete
    expect(w.isoLocal(w.ajouterJours(new w.Date(2026, 2, 30), -1))).toBe('2026-03-29'); // debut heure d'ete
  });
  it('ncpBlocShift : poste de nuit du 25/10/2026 (changement d\'heure) finit le 26 a 05h', () => {
    const b = w.ncpBlocShift('2026-10-25', '20:00');
    expect(w.isoLocal(b.f)).toBe('2026-10-26');
    expect(b.f.getHours()).toBe(5);
    const v = w.ncpBlocShift('2026-03-30', '03:00'); // la veille du 30/03 est le 29/03
    expect(w.isoLocal(v.d)).toBe('2026-03-29');
  });
});

describe('Liste Bradford synchronisee avec les employes', () => {
  it('ajoute les nouveaux employes et retire les anciens', () => {
    const b = chargerApp(['js/metier/bradford.js'], { avant: (b) => { b.t = (k) => k; } });
    b.EMP = [{ n: 'Alex Exemple' }, { n: 'Nouvel Employe' }];
    b.BD = [{ n: 'Alex Exemple', D: 0, S: 0, sc: 0, T: [0, 0, 0, 0] }, { n: 'Ancien Employe', D: 1, S: 1, sc: 1, T: [0, 0, 0, 0] }];
    b.ABS = [{ n: 'Nouvel Employe', a: '01/09/2099', b: '02/09/2099', d: 2, t: 'ziek' }];
    b.recalc();
    expect(b.BD.map((e) => e.n).sort()).toEqual(['Alex Exemple', 'Nouvel Employe']);
    const nouveau = b.BD.find((e) => e.n === 'Nouvel Employe');
    expect(nouveau.S).toBe(1);
    expect(nouveau.sc).toBe(2);
  });
});
