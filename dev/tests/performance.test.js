// Phase 4 : bibliotheques chargees a la demande (JSZip). Aucun reseau : le
// script ajoute est intercepte et simule.
import { describe, it, expect } from 'vitest';
import { chargerApp } from './harnais.js';

describe('JSZip a la demande', () => {
  it('ajoute le script une seule fois puis relance l\'export', async () => {
    const w = chargerApp(['js/core/ui.js']);
    const appels = [];
    const exporter = (x) => appels.push(x);
    expect(w.attendreJSZip(exporter, ['a'])).toBe(true);
    expect(w.attendreJSZip(exporter, ['b'])).toBe(true);
    const scripts = [...w.document.head.querySelectorAll('script')].filter((s) => /jszip/.test(s.src));
    expect(scripts.length).toBe(1);
    w.JSZip = function () {};
    scripts[0].onload();
    await new Promise((r) => setTimeout(r, 0));
    expect(appels).toEqual(['a', 'b']);
    expect(w.attendreJSZip(exporter, ['c'])).toBe(false); // deja charge : l'appelant continue
  });

  it('echec de chargement : message, et nouvel essai possible', async () => {
    const w = chargerApp(['js/core/ui.js']);
    const messages = [];
    w.toast = (m) => messages.push(m);
    w.attendreJSZip(() => {}, []);
    const s = [...w.document.head.querySelectorAll('script')].find((x) => /jszip/.test(x.src));
    s.onerror();
    await new Promise((r) => setTimeout(r, 0));
    expect(messages).toEqual(['JSZip non charge']);
    w.attendreJSZip(() => {}, []);
    expect([...w.document.head.querySelectorAll('script')].filter((x) => /jszip/.test(x.src)).length).toBe(2);
  });
});
