// Traduction INTERNE : API Translator du navigateur (simulee ici). Aucun
// appel reseau ne doit partir, et rien ne bascule vers un service en ligne.
import { describe, it, expect } from 'vitest';
import { chargerApp, lireFichier } from './harnais.js';
import fs from 'node:fs';
import path from 'node:path';

function navigateurAvecTraducteur(w, journal) {
  w.LanguageDetector = { create: () => Promise.resolve({ detect: (txt) => Promise.resolve([{ detectedLanguage: /de|het|lijn/.test(txt) ? 'nl' : 'fr' }]) }) };
  w.Translator = { create: ({ sourceLanguage, targetLanguage }) => { journal.push(sourceLanguage + '>' + targetLanguage); return Promise.resolve({ translate: (l) => Promise.resolve('[' + targetLanguage + '] ' + l) }); } };
}

describe('traduireLocal', () => {
  it('traduit ligne par ligne sur l\'appareil, sans aucune requete reseau', async () => {
    const w = chargerApp(['js/core/traduction.js']);
    const journal = []; let reseau = 0;
    w.fetch = () => { reseau++; return Promise.reject(new Error('reseau interdit')); };
    navigateurAvecTraducteur(w, journal);
    const r = await w.traduireLocal('de lijn staat stil\n\nhet product', 'fr');
    expect(r).toBe('[fr] de lijn staat stil\n\n[fr] het product');
    expect(journal).toEqual(['nl>fr']);
    expect(reseau).toBe(0);
  });

  it('texte deja dans la langue cible : rendu tel quel', async () => {
    const w = chargerApp(['js/core/traduction.js']);
    navigateurAvecTraducteur(w, []);
    expect(await w.traduireLocal('arret ligne 31', 'fr')).toBe('arret ligne 31');
  });

  it('navigateur sans API : refus explicite, jamais de repli en ligne', async () => {
    const w = chargerApp(['js/core/traduction.js']);
    let reseau = 0; w.fetch = () => { reseau++; return Promise.resolve({ json: () => ({}) }); };
    await expect(w.traduireLocal('de lijn', 'fr')).rejects.toThrow(/indisponible/);
    expect(reseau).toBe(0);
  });
});

describe('Aucun service de traduction externe dans le code', () => {
  it('ni MyMemory ni autre API de traduction en ligne', () => {
    const racine = path.resolve(import.meta.dirname, '..', '..');
    const fichiers = [];
    const parcourir = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const p = path.join(d, e.name); if (e.isDirectory()) parcourir(p); else if (/\.js$/.test(e.name)) fichiers.push(p); });
    parcourir(path.join(racine, 'js'));
    const fautifs = fichiers.filter((f) => /mymemory|translate\.googleapis|api\.deepl|libretranslate|translator\.microsoft/i.test(fs.readFileSync(f, 'utf8')));
    expect(fautifs).toEqual([]);
    expect(lireFichier('vercel.json')).not.toMatch(/mymemory/);
  });
});
