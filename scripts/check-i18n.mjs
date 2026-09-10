import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { parse } from '@formatjs/icu-messageformat-parser';
import ts from 'typescript';

const locales = ['en', 'ta', 'te', 'kn', 'hi'];
const directory = new URL('../i18n/dictionaries/', import.meta.url);
function flatten(object, prefix = '') {
  return Object.fromEntries(Object.entries(object).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [[path, value]] : Object.entries(flatten(value, path));
  }));
}
function argumentsFor(message) {
  const argumentsUsed = new Set();
  function visit(nodes) {
    for (const node of nodes) {
      if (node.type !== 0 && node.type !== 7) argumentsUsed.add(`${node.type}:${node.value}`);
      if (node.options) Object.values(node.options).forEach(option => visit(option.value));
      if (node.children) visit(node.children);
    }
  }
  visit(parse(message));
  return [...argumentsUsed].sort();
}
const catalogs = Object.fromEntries(await Promise.all(locales.map(async locale =>
  [locale, flatten(JSON.parse(await readFile(new URL(`${locale}.json`, directory), 'utf8')))]
)));
const english = catalogs.en;
const expected = Object.keys(english).sort();
for (const locale of locales) {
  assert.deepEqual(Object.keys(catalogs[locale]).sort(), expected, `${locale}: missing or extra translation keys`);
  for (const key of expected) {
    const translation = catalogs[locale][key];
    assert.ok(translation.trim(), `${locale}.${key}: empty message`);
    assert.deepEqual(argumentsFor(translation), argumentsFor(english[key]), `${locale}.${key}: ICU arguments or rich tags differ`);
    assert.ok(!translation.includes('\uFFFD'), `${locale}.${key}: damaged Unicode`);
  }
  console.log(`${locale}: ${expected.length} messages; key, ICU, rich-text and Unicode checks passed`);
}

// Catch text accidentally added outside the translation catalogs, including screen-reader labels.
const allowedLiteral = /^(?:BIS Intelligence|BIS|Intelligence|Google|Scheme-I|22K916|HUID|IS\s[\d :/.-]+|PM\/IS\s[\d /.-]+|ISO\/IEC\s\d+|\d[\d\s.,:%/+–—-]*|[←→↑↓×•·…]+)$/;
const violations = [];
async function inspect(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = new URL(entry.name, folder);
    if (entry.isDirectory()) { await inspect(new URL(`${entry.name}/`, folder)); continue; }
    if (!entry.name.endsWith('.tsx')) continue;
    const source = ts.createSourceFile(path.pathname, await readFile(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      let literal;
      if (ts.isJsxText(node)) literal = node.text.replace(/\s+/g, ' ').trim();
      if (ts.isJsxAttribute(node) && ['aria-label', 'placeholder', 'title', 'alt'].includes(node.name.getText(source)) && node.initializer && ts.isStringLiteral(node.initializer)) literal = node.initializer.text.trim();
      if (literal && !allowedLiteral.test(literal)) {
        const position = source.getLineAndCharacterOfPosition(node.getStart(source));
        violations.push(`${path.pathname}:${position.line + 1}: ${literal}`);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
}
await inspect(new URL('../app/', import.meta.url));
await inspect(new URL('../components/', import.meta.url));
assert.deepEqual(violations, [], 'Untranslated JSX text or accessibility labels');
console.log('JSX text and accessibility-label extraction checks passed');
