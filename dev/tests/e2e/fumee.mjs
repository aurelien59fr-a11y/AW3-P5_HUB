// Test de fumee : charge index.html dans Chromium (serveur local), avec le faux
// Firebase et des donnees 100 % fictives, pour chaque role. Toute requete vers
// un autre hote que le serveur local est BLOQUEE (et comptee). Ouvre chaque
// onglet visible et releve les erreurs JavaScript.
// Usage : node tests/e2e/fumee.mjs [dossier_du_site]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const site = path.resolve(process.argv[2] || path.join(import.meta.dirname, '..', '..', '..'));
const faux = fs.readFileSync(path.join(import.meta.dirname, 'faux-firebase.js'), 'utf8');
const auditA11y = fs.readFileSync(path.join(import.meta.dirname, 'a11y.js'), 'utf8');
const jszipLocal = fs.readFileSync(path.join(import.meta.dirname, '..', '..', 'node_modules', 'jszip', 'dist', 'jszip.min.js'), 'utf8');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

// En-tetes de vercel.json appliques comme en production ; la CSP (publiee en
// Report-Only) est ici APPLIQUEE pour detecter toute ressource qu'elle bloquerait.
const ENTETES = {};
try {
  const conf = JSON.parse(fs.readFileSync(path.join(site, 'vercel.json'), 'utf8'));
  for (const h of (conf.headers || []).find((x) => x.source === '/(.*)')?.headers || []) {
    ENTETES[h.key === 'Content-Security-Policy-Report-Only' ? 'Content-Security-Policy' : h.key] = h.value;
  }
} catch { /* pas de vercel.json : aucun en-tete */ }

const serveur = http.createServer((req, res) => {
  const p = path.join(site, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const f = fs.existsSync(p) && fs.statSync(p).isDirectory() ? path.join(p, 'index.html') : p;
  if (!f.startsWith(site) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', ...ENTETES });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => serveur.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${serveur.address().port}/`;

const EMPLOYES = {
  e1: { name: 'Alex Exemple', group: 'INPAK', role: 'Operateur Inpak', active: true, order: 1 },
  e2: { name: 'Sam Fictif', group: 'Prod', role: 'Operateur Production', active: true, order: 2 },
  e3: { name: 'Chef Test', group: 'TL', role: 'TL', active: true, order: 0 },
};
const recent = new Date(Date.now() - 3 * 864e5).toISOString().slice(0, 10);
function donnees(uid, fiche) {
  const jours = Array.from({ length: 400 }, (_, i) => (i % 7 < 5 ? 'V' : ''));
  return {
    users: { [uid]: fiche },
    employees: EMPLOYES,
    planning: {
      shifts2025: { 'Alex Exemple': jours, 'Sam Fictif': jours, 'Chef Test': jours },
      shifts2026: { 'Alex Exemple': jours, 'Sam Fictif': jours, 'Chef Test': jours },
      shifts2027: { 'Alex Exemple': jours, 'Sam Fictif': jours, 'Chef Test': jours },
      absences: [{ n: 'Sam Fictif', a: '02/03/2026', b: '04/03/2026', d: 3, y: '2026', t: 'ziek' }],
      extraHistorique: [],
    },
    formations: { f1: { titre: '<img src=x onerror="window.__pwned=1">Formation test', date: '2099-01-10', lieu: 'Salle A' } },
    ncp_data: {}, bulk_data: {}, pointages: {},
    arrets_inpak: {
      [`arret-31_${recent}_raison_06:00`]: { date: recent, heure: '06:00', ligne: '31', type: 'avec_raison', raison: '(04.01) Arret fictif recent', duree: 30 },
      'arret-31_2025-01-04_raison_06:00': { date: '2025-01-04', heure: '06:00', ligne: '31', type: 'avec_raison', raison: '(04.01) Arret fictif ancien', duree: 30 },
    },
    espace: { [uid]: { nom: 'Alex Exemple', absences: [{ n: 'Alex Exemple', a: '02/03/2026', b: '04/03/2026', d: 3, t: 'ziek', y: '2026' }], pointages: { p1: { nom: 'Alex Exemple', date: '2026-03-10', type: 'retard', detail: 'Retard fictif 7 min' } }, bradford: { S: 1, D: 3, sc: 3, T: [0, 0, 0, 1] } } },
  };
}
const SCENARIOS = [
  ['admin', { role: 'admin', email: 'admin@exemple.test' }],
  ['sous-chef', { role: 'subchef', email: 'souschef@exemple.test' }],
  ['visiteur', { role: 'visiteur', email: 'visiteur@exemple.test' }],
  ['employe (personnalise)', { role: 'custom', email: 'employe@exemple.test', nom: 'Alex Exemple', tabs: { pl: true, espace: true, formations: true } }],
  ['compte sans fiche /users', null],
  ['non connecte', undefined],
];

// Chromium : CHROMIUM_PATH, sinon celui de l'environnement de dev, sinon celui
// installe par « npx playwright install chromium » (CI).
const cheminChromium = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const navigateur = await chromium.launch(cheminChromium ? { executablePath: cheminChromium } : {});
const resultats = [];
for (const [nom, fiche] of SCENARIOS) {
  const ctx = await navigateur.newContext({ serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const erreurs = []; const bloquees = new Set();
  await page.exposeFunction('__violationCSP', (v) => erreurs.push('CSP: ' + v));
  await page.addInitScript(() => document.addEventListener('securitypolicyviolation', (e) => window.__violationCSP(e.violatedDirective + ' ' + e.blockedURI)));
  page.on('pageerror', (e) => erreurs.push(e.message.split('\n')[0]));
  page.on('dialog', (d) => { erreurs.push('boite de dialogue: ' + d.message().slice(0, 120)); d.dismiss(); });
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) erreurs.push('console: ' + m.text().slice(0, 160)); });
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (u.startsWith(base)) return route.continue();
    if (/gstatic\.com\/firebasejs\/.*firebase-app-compat/.test(u)) return route.fulfill({ contentType: 'text/javascript', body: faux });
    if (/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip\//.test(u)) return route.fulfill({ contentType: 'text/javascript', body: jszipLocal });
    if (/gstatic\.com\/firebasejs|cdnjs\.cloudflare\.com/.test(u)) return route.fulfill({ contentType: 'text/javascript', body: '' });
    bloquees.add(new URL(u).host);
    return route.abort();
  });
  const uid = 'uid-test';
  const scenario = fiche === undefined ? { utilisateur: null, donnees: {} } : { utilisateur: { uid, email: (fiche && fiche.email) || 'orphelin@exemple.test' }, donnees: donnees(uid, fiche) };
  if (fiche === null) delete scenario.donnees.users;
  await page.addInitScript((s) => { window.__SCENARIO = s; }, scenario);
  await page.goto(base + 'index.html');
  await page.waitForTimeout(1500);
  const ecoutesDemarrage = await page.evaluate(() => [...new Set(window.__ecoutes || [])].sort());
  const arretsDemarrage = await page.evaluate(() => Object.keys(window.ARRETS_DATA || {}).length);
  const jszipAuDemarrage = await page.evaluate(() => [...document.scripts].some((s) => /jszip/.test(s.src)));
  const onglets = await page.evaluate(() => [...document.querySelectorAll('.tab[data-tab]')].filter((b) => b.style.display !== 'none').map((b) => b.dataset.tab));
  for (const o of onglets) {
    await page.evaluate((o) => { const b = document.querySelector('.tab[data-tab="' + o + '"]'); if (b) b.click(); }, o);
    await page.waitForTimeout(150);
  }
  // Pour les roles qui modifient le planning : une maladie saisie dans une cellule.
  let saisie = null;
  if (nom === 'admin' || nom === 'sous-chef') {
    saisie = await page.evaluate(async () => {
      const avant = window.__ecritures.length;
      document.querySelector('.tab[data-tab="pl"]').click();
      await new Promise((r) => setTimeout(r, 200));
      const pill = document.querySelector('.sp[data-n="Sam Fictif"][data-s="V"]');
      if (!pill) return 'cellule introuvable';
      window.activePill = pill; applyShift('ziek');
      await new Promise((r) => setTimeout(r, 200));
      return window.__ecritures.slice(avant).map((e) => e.op + ' ' + (e.cles ? e.cles.join('+') : e.chemin));
    });
  }
  // Admin : export Excel Bradford (JSZip chargee a la demande)
  let exportExcel = null;
  if (nom === 'admin') {
    exportExcel = await page.evaluate(async () => {
      const avant = typeof JSZip !== 'undefined';
      let fichier = null;
      const orig = URL.createObjectURL;
      URL.createObjectURL = (b) => { if (b && /spreadsheetml/.test(b.type)) fichier = b.size; return orig.call(URL, b); };
      try { exportBradfordExcel(); } catch (e) { return { erreur: String(e) }; }
      for (let i = 0; i < 100 && fichier === null; i++) await new Promise((r) => setTimeout(r, 100));
      return { jszipAvant: avant, jszipApres: typeof JSZip !== 'undefined', tailleFichier: fichier };
    });
  }
  // Admin : import global d'une NCP fictive (chemin complet jusqu'au compte rendu)
  let importGlobal = null;
  if (nom === 'admin') {
    importGlobal = await page.evaluate(async () => {
      const zone = document.getElementById('global-import-txt');
      if (!zone) return 'zone introuvable';
      zone.value = JSON.stringify({ source: 'ncp', data: [{ notification: '200000099', description: 'NCP fictive de test' }] });
      const r = await importerGlobal();
      return { echecs: r && r.echecs, texte: document.getElementById('global-import-err').textContent.slice(0, 160) };
    });
  }
  const accessibilite = await page.evaluate(auditA11y);
  const etat = await page.evaluate(() => ({
    appVisible: getComputedStyle(document.getElementById('app-screen') || document.body).display !== 'none',
    loginVisible: !!document.getElementById('login-screen') && getComputedStyle(document.getElementById('login-screen')).display !== 'none',
    ecritures: (window.__ecritures || []).map((e) => e.op + ' ' + e.chemin),
    pwned: !!window.__pwned,
    migration: !!document.getElementById('migr-btn'),
    arretsEnMemoire: Object.keys(window.ARRETS_DATA || {}).length,
    espace: (() => { const b = document.querySelector('.tab[data-tab="espace"]'); if (b) b.click(); const c = document.getElementById('espace-content'); return c ? c.textContent.replace(/\s+/g, ' ').slice(0, 4000) : null; })(),
  }));
  const ecoutesFin = await page.evaluate(() => [...new Set(window.__ecoutes || [])].sort());
  resultats.push({ nom, accessibilite, onglets, ecoutesDemarrage, ecoutesFin, arretsDemarrage, jszipAuDemarrage, exportExcel, erreurs: [...new Set(erreurs)], bloquees: [...bloquees], saisie, importGlobal, ...etat });
  await ctx.close();
}
await navigateur.close();
serveur.close();
console.log(JSON.stringify(resultats, null, 2));

// Echec (code 1) si un role montre une erreur JS, une injection reussie, le
// bouton de migration, un champ/bouton sans nom accessible, ou une ecriture
// en base pour un role qui ne doit rien ecrire.
const ROLES_LECTURE = ['visiteur', 'employe (personnalise)', 'compte sans fiche /users', 'non connecte'];
const problemes = [];
for (const r of resultats) {
  if (r.erreurs.length) problemes.push(`${r.nom} : ${r.erreurs.length} erreur(s) JS`);
  if (r.pwned) problemes.push(`${r.nom} : injection HTML executee`);
  if (r.migration) problemes.push(`${r.nom} : bouton de migration present`);
  if (r.accessibilite.boutonsSansNom.length || r.accessibilite.champsSansNom.length) problemes.push(`${r.nom} : elements sans nom accessible`);
  if (ROLES_LECTURE.includes(r.nom) && r.ecritures.some((e) => !/^push audit_log/.test(e))) problemes.push(`${r.nom} : ecriture inattendue ${r.ecritures.join(', ')}`);
}
if (problemes.length) { console.error('ECHEC du test de fumee :\n- ' + problemes.join('\n- ')); process.exitCode = 1; }
else console.error('Test de fumee : ' + resultats.length + ' roles, aucun probleme.');
