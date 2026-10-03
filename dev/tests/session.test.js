// Deconnexion automatique apres inactivite et journal de securite.
import { describe, it, expect } from 'vitest';
import { chargerApp, fausseBase } from './harnais.js';

function contexte() {
  const base = fausseBase();
  const evenements = [];
  const w = chargerApp(['js/core/ui.js', 'js/core/session.js', 'js/vues/journal.js'], {
    avant: (w) => {
      w.t = (k) => ({ session_avertissement: 'Deconnexion dans {min} min', journal_vide: 'Aucune entree.' }[k] || k);
      w.db = base;
      w.currentUser = { uid: 'u1', role: 'admin' };
      w.journaliser = (a, d) => { evenements.push(a); return Promise.resolve(); };
      w.doLogout = () => { evenements.push('logout'); return Promise.resolve(); };
    },
  });
  let horloge = 1_000_000_000_000;
  w.sessionMaintenant = () => horloge;
  return { w, evenements, avancer: (min) => { horloge += min * 60000; } };
}

describe('Deconnexion automatique', () => {
  it('journalise la connexion une seule fois par session', () => {
    const { w, evenements } = contexte();
    w.demarrerSurveillanceSession({ uid: 'u1' });
    w.demarrerSurveillanceSession({ uid: 'u1' });
    expect(evenements.filter((e) => e === 'connexion').length).toBe(1);
    w.sessionArreter();
  });

  it('avertit 2 min avant, puis deconnecte et journalise apres 60 min sans activite', async () => {
    const { w, evenements, avancer } = contexte();
    w.demarrerSurveillanceSession({ uid: 'u1' });
    avancer(30); expect(w.sessionVerifier()).toBe('actif');
    avancer(28.5); expect(w.sessionVerifier()).toBe('averti');
    expect(w.document.getElementById('session-avertissement').textContent).toContain('Deconnexion dans 2 min');
    avancer(2); expect(w.sessionVerifier()).toBe('deconnecte');
    await new Promise((r) => setTimeout(r, 0));
    expect(evenements).toEqual(['connexion', 'deconnexion_inactivite', 'logout']);
  });

  it('toute activite repousse la deconnexion et retire l\'avertissement', () => {
    const { w, avancer } = contexte();
    w.demarrerSurveillanceSession({ uid: 'u1' });
    avancer(59); expect(w.sessionVerifier()).toBe('averti');
    w.sessionNoterActivite();
    expect(w.document.getElementById('session-avertissement')).toBeNull();
    avancer(30); expect(w.sessionVerifier()).toBe('actif');
    w.sessionArreter();
  });

  it('l\'activite d\'un autre onglet compte aussi', () => {
    const { w, avancer } = contexte();
    w.demarrerSurveillanceSession({ uid: 'u1' });
    avancer(59.5);
    w.localStorage.setItem('aw3_derniere_activite', String(w.sessionMaintenant()));
    expect(w.sessionVerifier()).toBe('actif');
    w.sessionArreter();
  });
});

describe('Journal de securite', () => {
  it('echappe le contenu et filtre', () => {
    const { w } = contexte();
    const entrees = [
      { action: 'acces_modifie', par: '<img src=x onerror=alert(1)>', at: '2026-10-01T10:00:00Z', details: { nouveauRole: 'admin' } },
      { action: 'connexion', par: 'b@exemple.test', at: '2026-10-01T09:00:00Z', details: {} },
    ];
    const html = w.journalHtml(entrees, '');
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
    expect(html).toContain('journal-sensible');
    expect(w.journalHtml(entrees, 'b@exemple')).not.toContain('acces_modifie');
    expect(w.journalHtml(entrees, 'introuvable')).toContain('Aucune entree.');
  });
});
