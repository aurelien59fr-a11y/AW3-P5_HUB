// Phase 3 : ecritures sures. Fausse base, donnees fictives, aucun reseau.
import { describe, it, expect } from 'vitest';
import { chargerApp, fausseBase } from './harnais.js';

const attendre = () => new Promise((r) => setTimeout(r, 0));

function contexte(fichiers, { html = '<body></body>', donnees, echec, role = 'admin' } = {}) {
  const base = fausseBase({ donnees, echec });
  const toasts = [];
  const w = chargerApp(['js/core/ui.js', 'js/core/firebase.js', ...fichiers], {
    html,
    avant: (w) => {
      w.db = base; w.t = (k) => k; w.currentUser = { email: 'admin@exemple.test', uid: 'u1', role };
    },
  });
  w.db = base; // initFirebase n'est pas appele en test
  w.toast = (m, c) => toasts.push(m);
  return { w, base, toasts };
}

describe('Fiche employe (saveEmp)', () => {
  const html = `<body><input id="emp-name"><select id="emp-group"><option>Prod</option></select><input id="emp-role">
    <input id="emp-birthday"><div id="emp-modal-err"></div><button id="emp-save-btn"></button></body>`;
  function app(opts) {
    const c = contexte(['js/vues/admin.js'], { html, ...opts });
    Object.assign(c.w, { EMP: [], SHIFTS25: [], SHIFTS26: [], SHIFTS27: [], WEEKS25: [], WEEKS26: [], WEEKS27: [],
      closeEmpModal() {}, buildEmpTable() {}, buildPT() {}, buildBT() {}, buildBirthdayNotif() {}, buildBirthdayCal() {} });
    const $ = (id) => c.w.document.getElementById(id);
    $('emp-name').value = 'Alex Exemple'; $('emp-role').value = 'Operateur';
    return { ...c, $ };
  }

  it('creation : update() avec ordre, pas set()', async () => {
    const { w, base } = app();
    w.editingEmpId = null;
    w.saveEmp(); await attendre(); await attendre();
    const e = base.ecritures.filter((x) => x.chemin.startsWith('employees/'));
    expect(e.map((x) => x.op)).toEqual(['update']);
    expect(e[0].valeur).toMatchObject({ name: 'Alex Exemple', order: 0 });
  });

  it('modification : conserve les autres champs (pas de set, pas d\'ordre)', async () => {
    const { w, base } = app({ donnees: { employees: { alex_exemple: { name: 'Alex Exemple', accountUid: 'x', order: 3 } } } });
    w.editingEmpId = 'alex_exemple';
    w.saveEmp(); await attendre(); await attendre();
    const e = base.ecritures.find((x) => x.chemin === 'employees/alex_exemple');
    expect(e.op).toBe('update');
    expect(e.valeur.order).toBeUndefined();
    expect(e.valeur.accountUid).toBeUndefined();
  });

  it('homonyme ou employe retire : refuse, rien n\'est ecrit', async () => {
    const { w, base, $ } = app({ donnees: { employees: { alex_exemple: { name: 'Alex Exemple', active: false } } } });
    w.editingEmpId = null;
    w.saveEmp(); await attendre(); await attendre();
    expect(base.ecritures.filter((x) => x.chemin.startsWith('employees/'))).toHaveLength(0);
    expect($('emp-modal-err').textContent).toBe('adm_err_emp_exists');
    expect($('emp-save-btn').disabled).toBe(false);
  });

  it('double clic : une seule ecriture', async () => {
    const { w, base } = app();
    w.editingEmpId = null;
    w.saveEmp(); w.saveEmp(); await attendre(); await attendre();
    expect(base.ecritures.filter((x) => x.chemin.startsWith('employees/'))).toHaveLength(1);
  });
});

describe('Formations (saveFormation)', () => {
  const html = `<body><input id="form-f-titre" value="Securite"><input id="form-f-date" value="2099-01-10">
    <input id="form-f-heure-debut" value=""><input id="form-f-heure-fin" value=""><input id="form-f-lieu" value="">
    <textarea id="form-f-notes"></textarea><div id="formation-modal-err"></div></body>`;
  function app() {
    const c = contexte(['js/vues/formations.js'], { html });
    c.w.closeFormationModal = () => {};
    return c;
  }
  it('double clic : une seule formation creee', async () => {
    const { w, base } = app();
    w.formationEditId = null;
    w.saveFormation(); w.saveFormation(); await attendre();
    expect(base.ecritures.filter((x) => x.chemin.startsWith('formations/'))).toHaveLength(1);
  });
  it('heure de fin avant le debut : refusee', () => {
    const { w, base } = app();
    w.document.getElementById('form-f-heure-debut').value = '14:00';
    w.document.getElementById('form-f-heure-fin').value = '13:00';
    w.saveFormation();
    expect(base.ecritures).toHaveLength(0);
    expect(w.document.getElementById('formation-modal-err').textContent).toBe('formations_err_heures');
  });
  it('modification : creeLe et statut ne sont pas ecrases', async () => {
    const { w, base } = app();
    w.formationEditId = 'f1';
    w.saveFormation(); await attendre();
    const e = base.ecritures.find((x) => x.chemin === 'formations/f1');
    expect(e.valeur.creeLe).toBeUndefined();
    expect(e.valeur.statut).toBeUndefined();
    expect(e.valeur.modifieLe).toBeTruthy();
  });
});

describe('Commentaire Bradford (saveComment)', () => {
  function app(echec) {
    const c = contexte(['js/vues/bradford.js'], { html: '<body><div id="cm-popup"><textarea id="cm-txt">Note fictive</textarea></div></body>', echec });
    c.w.buildBT = () => {};
    return c;
  }
  it("annonce le succes seulement apres l'ecriture", async () => {
    const { w, toasts } = app();
    w.saveComment('Alex Exemple');
    expect(toasts).toEqual([]); // rien tant que Firebase n'a pas confirme
    await attendre();
    expect(toasts).toEqual(['br_comment_saved']);
    expect(w.document.getElementById('cm-popup')).toBeNull();
  });
  it('en cas de refus : erreur affichee, fenetre et texte conserves', async () => {
    const { w, toasts } = app(() => true);
    w.saveComment('Alex Exemple'); await attendre(); await attendre();
    expect(toasts[0]).toContain('PERMISSION_DENIED');
    expect(w.document.getElementById('cm-txt').value).toBe('Note fictive');
    expect(w.BD_COMMENTS['Alex Exemple']).toBeUndefined();
  });
});

describe('Import NCP (champ par champ)', () => {
  it("n'envoie que les champs nouveaux ou modifies ; les corrections manuelles restent", async () => {
    const existant = { notification: '200000001', description: 'Ancienne', equipe_override: 'P5', de_cote: true, type_ncp: 'Inpak' };
    const { w, base } = contexte(['js/imports/base.js', 'js/imports/ncp.js'], {
      html: '<body><textarea id="ncp-import-txt"></textarea><div id="ncp-import-err"></div><div id="ncp-import-modal"></div></body>',
      donnees: { ncp_data: { 200000001: existant } },
    });
    w.document.getElementById('ncp-import-txt').value = JSON.stringify([
      { notification: '200000001', description: 'Nouvelle', type_ncp: 'Inpak', ligne: '' },
      { notification: '200000002', description: 'Fiche neuve' },
    ]);
    const r = await w.importerNCP();
    expect(r.ok).toBe(true);
    const u = base.ecritures.find((x) => x.op === 'update').valeur;
    expect(Object.keys(u).sort()).toEqual(['ncp_data/200000001/description', 'ncp_data/200000002']);
    expect(u['ncp_data/200000001/description']).toBe('Nouvelle');
  });
});

describe('Import global (compte rendu reel)', () => {
  it('attend chaque import et signale les echecs sans vider la zone', async () => {
    const { w } = contexte(['js/imports/base.js'], {
      html: '<body><textarea id="global-import-txt"></textarea><div id="global-import-err"></div></body>',
    });
    w.importerBulk = () => Promise.resolve({ ok: true, message: 'Bulk & Bijlijn : 3 point(s)' });
    w.importerNCP = () => Promise.resolve({ ok: false, message: 'Erreur Firebase : refus' });
    for (const id of ['bulk-import-txt', 'ncp-import-txt']) { const t = w.document.createElement('textarea'); t.id = id; w.document.body.appendChild(t); }
    const zone = w.document.getElementById('global-import-txt');
    zone.value = JSON.stringify([{ source: 'grafana_bulk', data: { standaard: [] } }, { source: 'ncp', data: [] }]);
    const r = await w.importerGlobal();
    expect(r.echecs).toBe(1);
    const texte = w.document.getElementById('global-import-err').textContent;
    expect(texte).toContain('OK Bulk & Bijlijn : 3 point(s)');
    expect(texte).toContain('ECHEC NCP Qualite : Erreur Firebase : refus');
    expect(zone.value).not.toBe(''); // rien n'est perdu en cas d'echec
  });
});

describe('Journal audit_log', () => {
  it('ajoute une entree (push) avec action, auteur et date', async () => {
    const { w, base } = contexte([]);
    await w.journaliser('test_action', { n: 2 });
    const e = base.ecritures.find((x) => x.chemin === 'audit_log');
    expect(e.op).toBe('push');
    expect(e.valeur).toMatchObject({ action: 'test_action', details: { n: 2 }, par: 'admin@exemple.test', uid: 'u1' });
  });
  it("un refus d'ecriture du journal ne bloque rien", async () => {
    const { w } = contexte([], { echec: (op, c) => c === 'audit_log' });
    await expect(w.journaliser('x')).resolves.toBeUndefined();
  });
});
