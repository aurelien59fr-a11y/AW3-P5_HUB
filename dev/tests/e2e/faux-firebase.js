/* Faux SDK Firebase (compat) pour les tests de fumee. Remplace les scripts
   gstatic : AUCUNE connexion au vrai projet n'est possible. Les ecritures sont
   enregistrees dans window.__ecritures et appliquees a l'arbre local.
   Le role et les donnees fictives sont fournis par window.__SCENARIO. */
(function () {
  var sc = window.__SCENARIO || {};
  var arbre = JSON.parse(JSON.stringify(sc.donnees || {}));
  window.__ecritures = [];
  window.__ecoutes = []; // chemins ecoutes avec on() (pour verifier le chargement a la demande)
  function lire(chemin) {
    var n = arbre; var parts = chemin ? chemin.split('/').filter(Boolean) : [];
    for (var i = 0; i < parts.length; i++) { if (n == null) return null; n = n[parts[i]]; }
    return n === undefined ? null : n;
  }
  function ecrire(chemin, v) {
    var parts = chemin.split('/').filter(Boolean); var n = arbre;
    for (var i = 0; i < parts.length - 1; i++) { if (n[parts[i]] == null || typeof n[parts[i]] !== 'object') n[parts[i]] = {}; n = n[parts[i]]; }
    if (v === null) delete n[parts[parts.length - 1]]; else n[parts[parts.length - 1]] = JSON.parse(JSON.stringify(v));
  }
  function snap(chemin, v) {
    return { key: chemin.split('/').pop(), val: function () { return v == null ? null : JSON.parse(JSON.stringify(v)); }, exists: function () { return v != null; },
      forEach: function (f) { if (v && typeof v === 'object') Object.keys(v).forEach(function (k) { f(snap(chemin + '/' + k, v[k])); }); } };
  }
  function filtrer(v, plage) {
    if (!plage || !v || typeof v !== 'object') return v;
    var o = {}; Object.keys(v).forEach(function (k) { if (k >= plage[0] && k <= plage[1]) o[k] = v[k]; }); return o;
  }
  var compteur = 0;
  function ref(chemin) {
    chemin = chemin || '';
    var r = {
      key: chemin.split('/').pop() || null,
      child: function (c) { return ref(chemin ? chemin + '/' + c : c); },
      on: function (ev, cb) { window.__ecoutes.push(chemin + (r._plage ? ' [cles ' + r._plage.join('..') + ']' : '')); setTimeout(function () { cb(snap(chemin, filtrer(lire(chemin), r._plage))); }, 0); return cb; },
      off: function () {},
      once: function () { return Promise.resolve(snap(chemin, lire(chemin))); },
      set: function (v) { window.__ecritures.push({ op: 'set', chemin: chemin }); ecrire(chemin, v); return Promise.resolve(); },
      update: function (o) { window.__ecritures.push({ op: 'update', chemin: chemin, cles: Object.keys(o) }); Object.keys(o).forEach(function (k) { ecrire(chemin ? chemin + '/' + k : k, o[k]); }); return Promise.resolve(); },
      remove: function () { window.__ecritures.push({ op: 'remove', chemin: chemin }); ecrire(chemin, null); return Promise.resolve(); },
      push: function (v) { var k = 'push' + (++compteur); var c = ref(chemin + '/' + k); if (v !== undefined) { window.__ecritures.push({ op: 'push', chemin: chemin }); ecrire(chemin + '/' + k, v); } var t = ref(chemin + '/' + k); var p = Promise.resolve(c); t.then = p.then.bind(p); t.catch = p.catch.bind(p); return t; }, // comme ThenableReference : resout vers une reference non-thenable
      orderByChild: function () { return r; }, limitToLast: function () { return r; }, equalTo: function () { return r; },
      // orderByKey().startAt(a).endAt(b) : plage de cles appliquee (comme Firebase)
      orderByKey: function () { var q = ref(chemin); q._plage = ['', '\uffff']; return q; },
      startAt: function (a) { if (r._plage) r._plage[0] = a; return r; }, endAt: function (b) { if (r._plage) r._plage[1] = b; return r; },
    };
    return r;
  }
  var db = { ref: ref };
  var user = sc.utilisateur || null;
  var auth = {
    currentUser: user,
    onAuthStateChanged: function (cb) { setTimeout(function () { cb(user); }, 0); return function () {}; },
    signOut: function () { return Promise.resolve(); },
    signInWithEmailAndPassword: function () { return Promise.reject(new Error('Connexion desactivee en test')); },
    sendPasswordResetEmail: function () { return Promise.resolve(); },
    createUserWithEmailAndPassword: function () { return Promise.reject(new Error('Creation de compte desactivee en test')); },
  };
  var app = { name: '[DEFAULT]', options: {} };
  window.firebase = {
    apps: [],
    initializeApp: function () { window.firebase.apps.push(app); return app; },
    app: function () { return app; },
    auth: function () { return auth; },
    database: function () { return db; },
  };
  // Bibliotheques CDN remplacees par des bouchons (pas de reseau en test).
  window.Chart = function () { this.data = { labels: [], datasets: [{ data: [] }, { data: [] }, { data: [] }] }; this.options = {}; };
  window.Chart.prototype.update = function () {}; window.Chart.prototype.destroy = function () {}; window.Chart.prototype.resize = function () {};
})();
