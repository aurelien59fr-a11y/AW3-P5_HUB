// Configuration ESLint du dashboard (scripts classiques partageant l'espace global).
// Les declarations de premier niveau de chaque fichier sont collectees
// automatiquement et declarees comme globales pour les autres fichiers,
// afin que no-undef detecte les vrais oublis (faute de frappe, variable absente).
import fs from 'node:fs';
import path from 'node:path';
import * as espree from 'espree';
import globals from 'globals';

const racine = path.resolve(import.meta.dirname, '..');
function fichiersJs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return fichiersJs(p);
    return e.name.endsWith('.js') ? [p] : [];
  });
}
const partagees = {};
for (const f of [...fichiersJs(path.join(racine, 'js')), path.join(racine, 'sw.js')]) {
  const ast = espree.parse(fs.readFileSync(f, 'utf8'), { ecmaVersion: 2022, sourceType: 'script' });
  for (const n of ast.body) {
    if (n.type === 'FunctionDeclaration') partagees[n.id.name] = 'writable';
    if (n.type === 'VariableDeclaration') n.declarations.forEach((d) => { if (d.id.name) partagees[d.id.name] = 'writable'; });
  }
}

export default [
  {
    files: ['js/**/*.js', 'sw.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: { ...globals.browser, ...globals.serviceworker, ...partagees, firebase: 'readonly', Chart: 'readonly', JSZip: 'readonly',
        // API Chrome integrees (utilisation protegee par typeof) et point d'entree pose sur window
        Translator: 'readonly', LanguageDetector: 'readonly', buildRecrutementTab: 'readonly' },
    },
    rules: {
      'no-undef': 'error',
      'no-dupe-keys': 'error',
      'no-unreachable': 'error',
      'no-func-assign': 'off',
      'no-redeclare': 'off',
      'no-unused-vars': 'off',
      'no-empty': 'warn',
    },
  },
];
