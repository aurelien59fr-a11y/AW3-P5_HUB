// Chaque personne gere son mot de passe (core/motdepasse.js). Firebase Auth
// est simule : aucun appel reseau, aucun vrai mot de passe.
import { describe, it, expect } from 'vitest';
import { chargerApp, fausseBase, lireFichier } from './harnais.js';

const app = lireFichier('js/app.js');
const debut = app.indexOf('var I18N={');
const I18N_SRC = (() => { let d = 0, i = debut + 9; for (; i < app.length; i++) { if (app[i] === '{') d++; else if (app[i] === '}') { d--; if (!d) break; } } return app.slice(debut + 9, i + 1); })();

function contexte({ motDePasse = 'Provisoire9', email = 'alex.exemple@aw3p5.local' } = {}) {
  const appels = [];
  const base = fausseBase();
  const utilisateur = {
    uid: 'uid-test', email,
    reauthenticateWithCredential: (cred) => { appels.push('reauth'); return cred.mdp === motDePasse ? Promise.resolve() : Promise.reject(Object.assign(new Error('x'), { code: 'auth/wrong-password' })); },
    updatePassword: (n) => { appels.push('update:' + n.length); return Promise.resolve(); },
    verifyBeforeUpdateEmail: (e) => { appels.push('verif:' + e); return Promise.resolve(); },
  };
  const w = chargerApp(['js/core/ui.js', 'js/core/motdepasse.js'], {
    avant: (w) => {
      w.eval('var I18N=' + I18N_SRC + ';');
      w.LANG = 'fr';
      w.t = (k) => (w.I18N.fr[k] !== undefined ? w.I18N.fr[k] : k);
      w.db = base;
      const auth = () => ({ currentUser: utilisateur });
      auth.EmailAuthProvider = { credential: (e, mdp) => ({ e, mdp }) };
      w.firebase = { auth };
    },
  });
  return { w, appels, base };
}

describe('Regles du nouveau mot de passe', () => {
  it('refuse trop court, sans chiffre, avec le prenom ou le nom, ou mal confirme', () => {
    const { w } = contexte();
    const e = 'alex.exemple@aw3p5.local';
    expect(w.mdpVerifier('abc12', 'abc12', e)).toMatch(/8 caracteres/);
    expect(w.mdpVerifier('abcdefghij', 'abcdefghij', e)).toMatch(/lettre et un chiffre/);
    expect(w.mdpVerifier('Alex2026xx', 'Alex2026xx', e)).toMatch(/prenom ou ton nom/);
    expect(w.mdpVerifier('Bureau2026', 'Bureau2027', e)).toMatch(/pas identiques/);
    expect(w.mdpVerifier('Bureau2026', 'Bureau2026', e)).toBe('');
  });
});

describe('Changement de mot de passe', () => {
  it('reverifie le mot de passe actuel, change, puis note la date', async () => {
    const { w, appels, base } = contexte();
    await w.mdpChanger('Provisoire9', 'Bureau2026');
    expect(appels).toEqual(['reauth', 'update:10']);
    expect(base.ecritures.map((x) => x.op + ' ' + x.chemin)).toEqual(['set users/uid-test/mdpChangeLe']);
    expect(typeof base.ecritures[0].valeur).toBe('number');
  });

  it('mot de passe actuel faux : rien ne change, message clair', async () => {
    const { w, appels, base } = contexte();
    const err = await w.mdpChanger('mauvais', 'Bureau2026').catch((e) => e);
    expect(w.mdpMessageErreur(err)).toBe('Mot de passe actuel incorrect.');
    expect(appels).toEqual(['reauth']);
    expect(base.ecritures).toEqual([]);
  });

  it('adresse de recuperation : verifiee puis lien de confirmation envoye par Firebase', async () => {
    const { w, appels } = contexte();
    await expect(w.mdpAjouterEmail('Provisoire9', 'pas-une-adresse')).rejects.toThrow(/invalide/);
    await w.mdpAjouterEmail('Provisoire9', 'perso@exemple.test');
    expect(appels).toEqual(['reauth', 'verif:perso@exemple.test']);
  });
});

describe('Premiere connexion', () => {
  it('compte sans date de changement : fenetre obligatoire, sans bouton fermer', () => {
    const { w } = contexte();
    expect(w.mdpVerifierPremiereConnexion({ role: 'custom' }, 'uid-test')).toBe(true);
    const f = w.document.getElementById('mdp-fenetre');
    expect(f.textContent).toContain('Choisis ton mot de passe');
    expect(w.document.getElementById('mdp-annuler')).toBeNull();
    expect(w.document.getElementById('mdp-deco')).not.toBeNull();
  });

  it('mot de passe deja choisi : rien ne s\'affiche', () => {
    const { w } = contexte();
    expect(w.mdpVerifierPremiereConnexion({ role: 'custom', mdpChangeLe: 1 }, 'uid-test')).toBe(false);
    expect(w.document.getElementById('mdp-fenetre')).toBeNull();
  });

  it('fenetre normale : changement depuis le bouton, puis fermeture', async () => {
    const { w, appels } = contexte();
    w.mdpOuvrir();
    w.document.getElementById('mdp-actuel').value = 'Provisoire9';
    w.document.getElementById('mdp-nouveau').value = 'Bureau2026';
    w.document.getElementById('mdp-confirm').value = 'Bureau2026';
    w.document.getElementById('mdp-valider').click();
    await new Promise((r) => setTimeout(r, 20));
    expect(appels).toEqual(['reauth', 'update:10']);
    expect(w.document.getElementById('mdp-fenetre')).toBeNull();
  });
});

describe('Compte cree par l\'admin', () => {
  it('mot de passe provisoire aleatoire (plus les initiales + 2026)', () => {
    const w = chargerApp(['js/core/ui.js', 'js/vues/admin.js'], { avant: (w) => { w.t = (k) => k; } });
    const a = w.genLoginInterne('Alex Exemple'), b = w.genLoginInterne('Alex Exemple');
    expect(a.email).toBe('alex.exemple@aw3p5.local');
    expect(a.password).toMatch(/^[a-z][2-9][A-Za-z2-9]{8}$/);
    expect(a.password).not.toBe(b.password);
    expect(a.password).not.toBe('axee2026');
  });
});
