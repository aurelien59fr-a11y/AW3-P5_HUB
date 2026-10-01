// F. La deconnexion ferme la session PUIS recharge la page (ecouteurs et
// donnees en memoire remis a zero). Firebase est simule.
import { describe, it, expect } from 'vitest';
import { chargerApp } from './harnais.js';

describe('doLogout', () => {
  it('appelle signOut puis recharge la page', async () => {
    const appels = [];
    const w = chargerApp(['js/core/auth.js'], {
      avant: (w) => {
        w.firebase = { auth: () => ({ signOut: () => { appels.push('signOut'); return Promise.resolve(); } }) };
      },
    });
    w.rechargerApresDeconnexion = () => appels.push('reload');
    await w.doLogout();
    expect(appels).toEqual(['signOut', 'reload']);
  });

  it('ne recharge pas si la deconnexion echoue et le signale', async () => {
    const appels = [];
    const w = chargerApp(['js/core/auth.js'], {
      avant: (w) => { w.firebase = { auth: () => ({ signOut: () => Promise.reject(new Error('reseau')) }) }; },
    });
    w.rechargerApresDeconnexion = () => appels.push('reload');
    w.toast = (m) => appels.push('toast:' + m);
    await w.doLogout();
    expect(appels).toEqual(['toast:Deconnexion impossible : reseau']);
  });
});
