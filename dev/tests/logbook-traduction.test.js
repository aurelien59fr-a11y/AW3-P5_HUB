// Logbook : traduction interne des notes SharePoint et interface en 3 langues.
// Le traducteur du navigateur est simule (il prefixe chaque phrase par la
// langue cible) : on verifie ce qu'on lui envoie et ce qu'on garde.
import { describe, it, expect } from 'vitest';
import { chargerApp, fausseBase, lireFichier } from './harnais.js';

const app = lireFichier('js/app.js');
const debut = app.indexOf('var I18N={');
const I18N_SRC = (() => { let d = 0, i = debut + 9; for (; i < app.length; i++) { if (app[i] === '{') d++; else if (app[i] === '}') { d--; if (!d) break; } } return app.slice(debut + 9, i + 1); })();

function contexte({ langue = 'fr', traducteur = true } = {}) {
  const envois = [];
  const base = fausseBase();
  const w = chargerApp(['js/core/format.js', 'js/core/ui.js', 'js/core/traduction.js', 'js/vues/logbook.js'], {
    avant: (w) => {
      w.eval('var I18N=' + I18N_SRC + ';');
      w.LANG = langue;
      w.t = (k) => (w.I18N[w.LANG] && w.I18N[w.LANG][k] !== undefined ? w.I18N[w.LANG][k] : k);
      w.db = base;
      if (traducteur) {
        // Detection simplifiee : mots neerlandais -> nl, francais -> fr, sinon en.
        w.LanguageDetector = { create: () => Promise.resolve({ detect: (x) => Promise.resolve([{ detectedLanguage: /\b(de|het|een|is|lijn|niet|met|dienst|kapot)\b/i.test(x) ? 'nl' : /\b(le|la|les|est|pas|avec)\b/i.test(x) ? 'fr' : 'en' }]) }) };
        w.Translator = { create: ({ sourceLanguage, targetLanguage }) => Promise.resolve({ translate: (l) => { envois.push(sourceLanguage + '>' + targetLanguage + ' ' + l); return Promise.resolve('[' + targetLanguage + '] ' + l); } }) };
      }
    },
  });
  return { w, envois, base };
}

const note = (valeurs) => ({ cle: 'liste1', id: '42', valeurs: Object.assign({ ID: '42', Ploeg: '2. Namiddag', Datum: '2026-09-01' }, valeurs) });

describe('Traduction des notes du logbook', () => {
  it('garde les heures intactes et traduit chaque ligne de la chronologie', async () => {
    const { w, envois } = contexte();
    const res = await w.logbookTraduireNote(note({ Gebeurtenissen: '*09u25 de lijn staat stil *14u28 lijn terug in productie' }), 'fr');
    expect(res.Gebeurtenissen).toBe('09u25 [fr] de lijn staat stil\n14u28 [fr] lijn terug in productie');
    expect(envois.every((e) => !/\d{2}u\d{2}/.test(e))).toBe(true); // l'heure n'est jamais envoyee au traducteur
  });

  it('traduit separement les morceaux separes par -> et developpe les abreviations', async () => {
    const { w, envois } = contexte();
    const res = await w.logbookTraduireNote(note({ Andere: 'TD gebeld voor de lijn -> mes is kapoet -> OK' }), 'fr');
    expect(res.Andere).toBe('[fr] technische dienst gebeld voor de lijn → [fr] mes is kapot → OK');
    expect(envois).toContain('nl>fr technische dienst gebeld voor de lijn');
  });

  it('detecte la langue ligne par ligne : une ligne deja en francais reste telle quelle', async () => {
    const { w } = contexte();
    const res = await w.logbookTraduireNote(note({ Gebeurtenissen: '08h10 : la ligne est pas en route\n09h00 : de lijn is gestart' }), 'fr');
    expect(res.Gebeurtenissen).toBe('08h10 la ligne est pas en route\n09h00 [fr] de lijn is gestart');
  });

  it('ne traduit ni les noms (Ploegchef, operateur) ni les codes courts, et retire les caracteres invisibles', async () => {
    const { w, envois } = contexte();
    const res = await w.logbookTraduireNote(note({ Ploegchef: 'Nom Fictif', 'Operator productie': 'Autre Nom', 'Technische storingen': '​L31', Afgehandeld: 'Non' }), 'nl');
    expect(res).toEqual({ Ploegchef: 'Nom Fictif', 'Operator productie': 'Autre Nom', 'Technische storingen': 'L31', Afgehandeld: 'Nee' });
    expect(envois).toEqual([]);
  });

  it('enregistre la traduction (cache) et la relit ensuite sans retraduire', async () => {
    const { w, envois, base } = contexte();
    await w.logbookTraduireNote(note({ Andere: 'de lijn staat stil' }), 'en');
    const ecriture = base.ecritures.find((e) => e.op === 'set');
    expect(ecriture.chemin).toBe('sharepoint_trad3/liste1/42/en');
    expect(Object.keys(ecriture.valeur)).toEqual(['Andere']); // cles = colonnes d'origine
    expect(envois.length).toBe(1);
  });

  it('navigateur sans traducteur : erreur claire, aucune requete', async () => {
    const { w } = contexte({ traducteur: false });
    await expect(w.logbookTraduireNote(note({ Andere: 'de lijn staat stil' }), 'fr')).rejects.toThrow(/indisponible|unavailable|niet beschikbaar/i);
  });
});

describe('Logbook : interface dans la langue choisie', () => {
  it('libelles de colonnes traduits par dictionnaire (pas par le traducteur)', () => {
    const { w } = contexte({ langue: 'en' });
    const html = w.logbookSpLignesHtml({ Afgehandeld: 'Yes', 'Technische storingen': 'Lange tekst over een storing aan de lijn die langer is dan vijfenveertig tekens' });
    expect(html).toContain('Handled');
    expect(html).toContain('Technical failures');
  });

  it('dates, semaine et boutons en neerlandais', () => {
    const { w } = contexte({ langue: 'nl' });
    expect(w.logbookDateLabel('2026-10-01')).toMatch(/^Donderdag 1 oktober 2026$/);
    expect(w.logbookSemaine('2026-10-01')).toBe('Week 40');
    expect(w.logbookMois(0)).toBe('Januari');
    const carte = w.logbookPosteCardHtml({ date: '2026-10-01', poste: 'P5', absences: [], ncp: [], arretsDureeTotale: 0, notes: [], notesSP: [] }, '05:00', '17:00');
    expect(carte).toContain('Niets te melden');
  });

  it('aucune cle de traduction du logbook ne manque en FR, NL et EN', () => {
    const { w } = contexte();
    const source = lireFichier('js/vues/logbook.js') + lireFichier('js/metier/logbook.js');
    const cles = [...new Set([...source.matchAll(/(?:lbT|\bt)\('(lb_[a-z_]+)'/g)].map((m) => m[1]).concat([...source.matchAll(/'(lb_[a-z_]+)'/g)].map((m) => m[1])))];
    const manquantes = [];
    for (const l of ['fr', 'nl', 'en']) for (const k of cles) if (w.I18N[l][k] === undefined) manquantes.push(l + ':' + k);
    expect(manquantes).toEqual([]);
  });
});
