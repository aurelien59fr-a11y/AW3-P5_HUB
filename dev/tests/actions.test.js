// Plus aucun code JavaScript inline : la CSP peut interdire 'unsafe-inline'.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { chargerApp, lireFichier } from './harnais.js';

const racine = path.resolve(import.meta.dirname, '..', '..');
const fichiersJs = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? fichiersJs(path.join(d, e.name)) : (/\.js$/.test(e.name) ? [path.join(d, e.name)] : []));

describe('Aucun JavaScript inline', () => {
  it('aucun attribut onclick/onchange/... ni <script> sans src', () => {
    const fautes = [];
    for (const f of ['index.html', ...fichiersJs(path.join(racine, 'js')).map((x) => path.relative(racine, x))]) {
      const s = lireFichier(f);
      if (/[\s"'+]on(click|change|input|keydown|keyup|submit|load|error|mouse\w+|focus|blur)=\\?["']/.test(s)) fautes.push(f + ' : attribut on*');
      if (f === 'index.html' && /<script(?![^>]*\ssrc=)[^>]*>/.test(s)) fautes.push(f + ' : <script> inline');
    }
    expect(fautes).toEqual([]);
  });

  it('la CSP de vercel.json n\'autorise plus les scripts inline', () => {
    const csp = JSON.parse(lireFichier('vercel.json')).headers[0].headers.find((h) => h.key === 'Content-Security-Policy').value;
    expect(csp.match(/script-src[^;]*/)[0]).not.toMatch(/unsafe-inline|unsafe-eval/);
  });

  it('toutes les actions ecrites dans index.html sont comprises par le lecteur', () => {
    const w = chargerApp(['js/core/actions.js']);
    const html = lireFichier('index.html');
    const erreurs = [];
    for (const m of html.matchAll(/data-on-(?:click|change|input|keydown)="([^"]*)"/g)) {
      const code = m[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
      const el = w.document.createElement('button');
      try { w.actionsAnalyser(code).forEach((o) => (o.args || []).forEach((a) => w.actionsValeur(a, el, {}))); } catch (e) { erreurs.push(code + ' -> ' + e.message); }
    }
    expect(erreurs).toEqual([]);
  });
});

describe('Lecteur d\'actions (sans eval)', () => {
  it('appelle la fonction avec les bons arguments, this et event', () => {
    const w = chargerApp(['js/core/actions.js'], { html: '<body><div id="p" data-on-click="clicParent()"><button id="b" data-tab="x" value="v" data-on-click="clic(\'a\\\'b\', 3, true, this.dataset.tab, this, event);return false">ok</button></div></body>' });
    const appels = [];
    w.clic = function (...a) { appels.push(a); };
    w.clicParent = () => appels.push('parent');
    const ev = new w.MouseEvent('click', { bubbles: true, cancelable: true });
    w.document.getElementById('b').dispatchEvent(ev);
    expect(appels[0].slice(0, 4)).toEqual(["a'b", 3, true, 'x']);
    expect(appels[0][4].id).toBe('b');
    expect(appels[0][5]).toBe(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(appels[1]).toBe('parent'); // remonte au parent comme un onclick
  });

  it('stopPropagation empeche le parent', () => {
    const w = chargerApp(['js/core/actions.js'], { html: '<body><div data-on-click="p()"><button id="b" data-on-click="event.stopPropagation();f()">x</button></div></body>' });
    const appels = []; w.f = () => appels.push('f'); w.p = () => appels.push('p');
    w.document.getElementById('b').click();
    expect(appels).toEqual(['f']);
  });

  it('refuse tout ce qui n\'est pas un simple appel (pas d\'execution de code arbitraire)', () => {
    const w = chargerApp(['js/core/actions.js']);
    for (const c of ['if(event.target===this)f()', 'alert(document.cookie)+1', 'fetch("x").then(f)', 'a=1', 'f(g())', 'f(document.cookie)', 'this.remove()']) {
      let refuse = false;
      try { const ops = w.actionsAnalyser(c); ops.forEach((o) => o.args && o.args.forEach((a) => w.actionsValeur(a, null, null))); } catch { refuse = true; }
      expect(refuse, c).toBe(true);
    }
  });
});
