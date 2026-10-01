// D. Episodes Bradford : pas de double comptage des jours qui se chevauchent,
// logique week-end conservee. Donnees 100 % fictives.
import { describe, it, expect, beforeAll } from 'vitest';
import { chargerApp } from './harnais.js';

let w;
const J = (s) => { const [d, m, y] = s.split('/').map(Number); return new w.Date(y, m - 1, d); };
const iv = (a, b, d) => ({ deb: J(a), fin: J(b), d });
const resume = (eps) => eps.map((e) => e.days);

beforeAll(() => { w = chargerApp(['js/metier/bradford.js'], { avant: (w) => { w.t = (k) => k; } }); });

describe('mergerAbsencesEnEpisodes', () => {
  it('deux periodes identiques : un episode, jours non doubles', () => {
    const eps = w.mergerAbsencesEnEpisodes([iv('02/03/2026', '04/03/2026', 3), iv('02/03/2026', '04/03/2026', 3)]);
    expect(resume(eps)).toEqual([3]);
  });

  it('chevauchement partiel : seuls les jours nouveaux sont ajoutes', () => {
    // 02-04/03 (3 j) puis 03-06/03 (4 j) : union = 02-06/03 = 5 jours
    const eps = w.mergerAbsencesEnEpisodes([iv('02/03/2026', '04/03/2026', 3), iv('03/03/2026', '06/03/2026', 4)]);
    expect(resume(eps)).toEqual([5]);
  });

  it('periode incluse dans une autre : rien a ajouter', () => {
    const eps = w.mergerAbsencesEnEpisodes([iv('02/03/2026', '06/03/2026', 5), iv('03/03/2026', '03/03/2026', 1)]);
    expect(resume(eps)).toEqual([5]);
  });

  it('deux periodes adjacentes : un episode, jours additionnes', () => {
    const eps = w.mergerAbsencesEnEpisodes([iv('02/03/2026', '03/03/2026', 2), iv('04/03/2026', '05/03/2026', 2)]);
    expect(resume(eps)).toEqual([4]);
  });

  it('vendredi puis lundi (separes par un week-end) : un seul episode', () => {
    const eps = w.mergerAbsencesEnEpisodes([iv('06/03/2026', '06/03/2026', 1), iv('09/03/2026', '09/03/2026', 1)]);
    expect(resume(eps)).toEqual([2]);
  });

  it('periodes totalement separees : deux episodes', () => {
    const eps = w.mergerAbsencesEnEpisodes([iv('02/03/2026', '03/03/2026', 2), iv('16/03/2026', '17/03/2026', 2)]);
    expect(resume(eps)).toEqual([2, 2]);
  });

  it('chevauchement a cheval sur le changement d\'heure (29/03/2026)', () => {
    const eps = w.mergerAbsencesEnEpisodes([iv('27/03/2026', '30/03/2026', 4), iv('29/03/2026', '31/03/2026', 3)]);
    expect(resume(eps)).toEqual([5]);
  });

  it('ordre de saisie indifferent', () => {
    const a = w.mergerAbsencesEnEpisodes([iv('03/03/2026', '06/03/2026', 4), iv('02/03/2026', '04/03/2026', 3)]);
    expect(resume(a)).toEqual([5]);
  });
});
