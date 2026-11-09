import { test } from 'node:test';
import assert from 'node:assert/strict';
import { langFor, pageFor, pathFor } from '../src/lib/route.ts';

test('the home page', () => {
  assert.equal(pageFor('/'), 'home');
  assert.equal(pageFor(''), 'home');
});

test('legal notice, in French and English, with or without a trailing slash', () => {
  for (const p of ['/mentions-legales', '/mentions-legales/', '/legal-notice', '/Legal-Notice']) assert.equal(pageFor(p), 'legal');
});

test('privacy policy, in French and English', () => {
  for (const p of ['/confidentialite', '/privacy', '/privacy/']) assert.equal(pageFor(p), 'privacy');
});

test('any other path falls back to the home page', () => {
  assert.equal(pageFor('/nope'), 'home');
});

test('links use the address in the reader\'s language', () => {
  assert.equal(pathFor('legal', 'fr'), '/mentions-legales');
  assert.equal(pathFor('legal', 'en'), '/legal-notice');
  assert.equal(pathFor('privacy', 'fr'), '/confidentialite');
  assert.equal(pathFor('privacy', 'en'), '/privacy');
  assert.equal(pathFor('home', 'en'), '/');
});

test('each page address carries its language; the home page carries none', () => {
  assert.equal(langFor('/mentions-legales'), 'fr');
  assert.equal(langFor('/confidentialite/'), 'fr');
  assert.equal(langFor('/legal-notice'), 'en');
  assert.equal(langFor('/Privacy'), 'en');
  assert.equal(langFor('/'), null);
  assert.equal(langFor('/nope'), null);
});
