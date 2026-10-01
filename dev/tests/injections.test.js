// E. Injections HTML : les donnees (Firebase, imports, saisies) doivent
// s'afficher comme du texte. Charges utiles executees UNIQUEMENT dans le DOM
// simule (jsdom), jamais en production. Donnees fictives.
import { describe, it, expect } from 'vitest';
import { chargerApp, lireFichier } from './harnais.js';

const CHARGES = [
  '<img src=x onerror="window.__pwned=1">',
  '"><script>window.__pwned=1</script>',
  "D'Hondt\"' onmouseover=\"window.__pwned=1",
  '</textarea><img src=x onerror=window.__pwned=1>',
];

function aucunElementInjecte(racine) {
  return racine.querySelectorAll('img, script, iframe, svg[onload], [onerror], [onmouseover]').length === 0;
}

describe('core/ui.js', () => {
  const w = chargerApp(['js/core/ui.js']);

  it('escHtml echappe & < > " et \'', () => {
    expect(w.escHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
    expect(w.escHtml(null)).toBe('');
    expect(w.escHtml(0)).toBe('0');
  });

  it('escJsAttr : la valeur revient intacte dans un onclick, sans casser l\'attribut', () => {
    for (const v of [...CHARGES, "D'Hondt", 'a\\b']) {
      const d = w.document.createElement('div');
      d.innerHTML = `<span onclick="window.__recu=('${w.escJsAttr(v)}')">x</span>`;
      const span = d.firstChild;
      expect(span.getAttributeNames()).toEqual(['onclick']); // aucun attribut ajoute par injection
      w.__recu = undefined;
      w.eval(span.getAttribute('onclick')); // le code de l'attribut, tel que le navigateur l'executerait
      expect(w.__recu).toBe(v);
    }
  });

  it("safeUrl n'accepte que https:// et les chemins du site", () => {
    expect(w.safeUrl('https://exemple.sharepoint.com/a?b=1&c=2')).toBe('https://exemple.sharepoint.com/a?b=1&amp;c=2');
    expect(w.safeUrl('/icons/logo.png')).toBe('/icons/logo.png');
    for (const u of ['javascript:alert(1)', ' JavaScript:alert(1)', 'data:text/html,x', 'http://exemple.com', '//exemple.com', 'https"onmouseover="x']) {
      expect(w.safeUrl(u)).toBe('#');
    }
    expect(w.safeUrl('https://x.test/"onmouseover="y')).toBe('https://x.test/&quot;onmouseover=&quot;y');
  });

  it('toast affiche le message comme texte (role=status)', () => {
    for (const c of CHARGES) {
      w.toast(c, '#fff');
      const t = [...w.document.querySelectorAll('.toast')].pop();
      expect(t.textContent).toBe(c);
      expect(aucunElementInjecte(t)).toBe(true);
      expect(t.getAttribute('role')).toBe('status');
    }
  });
});

describe('Formations', () => {
  it('titre, lieu, notes, horaires et noms affiches comme texte', () => {
    const w = chargerApp(['js/core/ui.js', 'js/vues/formations.js'], {
      html: '<body><div id="form-liste-avenir"></div><div id="form-liste-passees"></div></body>',
      avant: (w) => { w.t = (k) => k; w.EMP = [{ id: 'e1', n: CHARGES[0] }]; w.openAttestationModal = () => {}; },
    });
    w.canEditFormations = true;
    w.FORMATIONS.push({ id: "id'x", titre: CHARGES[0], lieu: CHARGES[1], notes: CHARGES[3], heureDebut: CHARGES[2], date: '2099-01-01', employes: ['e1'] });
    w.buildFormationsListe();
    const racine = w.document.getElementById('form-liste-avenir');
    expect(aucunElementInjecte(racine)).toBe(true);
    expect(racine.textContent).toContain(CHARGES[0]);
    expect(racine.textContent).toContain(CHARGES[3]);
    expect(w.__pwned).toBeUndefined();
  });
});

describe('Commentaires Bradford', () => {
  it('le texte du commentaire reste dans la zone de saisie', () => {
    const w = chargerApp(['js/core/ui.js', 'js/vues/bradford.js'], { avant: (w) => { w.t = (k) => k; } });
    w.BD_COMMENTS['Employe Fictif'] = { text: CHARGES[3], date: CHARGES[0], author: CHARGES[1] };
    w.openComment('Employe Fictif');
    const pop = w.document.getElementById('cm-popup');
    expect(aucunElementInjecte(pop)).toBe(true);
    expect(w.document.getElementById('cm-txt').value).toBe(CHARGES[3]);
  });
});

describe('Garde-fou : motifs dangereux corriges', () => {
  // Chaque motif ci-dessous etait present avant la correction ; il ne doit pas revenir.
  const motifs = [
    ['js/vues/formations.js', "'<b>'+(f.titre||'Formation')+'</b>'"],
    ['js/vues/formations.js', "'+f.notes+'"],
    ['js/vues/bradford.js', "'+prev+'</textarea>'"],
    ['js/vues/pointages.js', "' + a.detail + suspectIcon"],
    ['js/vues/recrutement.js', "'<th>'+c.nom+'</th>'"],
    ['js/vues/planning.js', "'+w.n+(w.p?"],
    ['js/vues/logbook.js', 'href="\' + esc(f.url)'],
    ['js/core/ui.js', "t.innerHTML='<div class=\"tdot\""],
  ];
  it.each(motifs)('%s ne contient plus le motif non echappe', (f, m) => {
    expect(lireFichier(f)).not.toContain(m);
  });
});
