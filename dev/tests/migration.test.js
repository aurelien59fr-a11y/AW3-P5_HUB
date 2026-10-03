// A. L'ancienne migration ne doit plus rien ecrire et n'est plus accessible.
import { describe, it, expect } from 'vitest';
import { chargerApp, fausseBase, lireFichier } from './harnais.js';

describe('Migration initiale desactivee', () => {
  it("le bouton « Lancer la migration » n'existe plus dans index.html", () => {
    const html = lireFichier('index.html');
    expect(html).not.toContain('onclick="runMigration()"');
    expect(html).not.toContain('data-on-click="runMigration()"');
    expect(html).not.toContain('id="migr-btn"');
  });

  it("runMigration() n'ecrit rien dans la base (fausse base, jamais executee en production)", () => {
    const base = fausseBase();
    const toasts = [];
    const w = chargerApp(['js/vues/admin.js'], {
      avant: (w) => {
        w.db = base;
        w.toast = (m) => toasts.push(m);
        w.t = (k) => k;
        w.SHIFTS25 = [{ n: 'Employe Fictif', s: ['V'] }];
        w.SHIFTS26 = w.SHIFTS25; w.SHIFTS27 = w.SHIFTS25;
        w.EMP = [{ n: 'Employe Fictif', g: 'Prod', r: 'op' }];
        w.ABS = [];
      },
    });
    const r = w.runMigration();
    expect(r).toBe(false);
    expect(base.ecritures).toHaveLength(0);
    expect(toasts).toEqual(['adm_migration_desactivee']);
  });
});
