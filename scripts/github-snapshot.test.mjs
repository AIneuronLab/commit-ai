import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contributionsFrom, nextSnapshot, readSnapshot } from './github-snapshot.mjs';

test('reads the last-year total from the contributions service', () => {
  assert.equal(contributionsFrom({ total: { lastYear: 1101 }, contributions: [] }), 1101);
});

test('rejects a response without a usable total', () => {
  assert.equal(contributionsFrom({ total: {} }), null);
  assert.equal(contributionsFrom({ total: { lastYear: 'x' } }), null);
  assert.equal(contributionsFrom(null), null);
});

test('a fresh total replaces the stored one and records when', () => {
  const now = new Date('2026-11-09T10:00:00Z');
  assert.deepEqual(nextSnapshot({ contributions: 983, fetchedAt: '2026-01-01T00:00:00Z' }, 1101, now), { contributions: 1101, fetchedAt: '2026-11-09T10:00:00.000Z' });
});

test('when the fetch failed, the stored snapshot is kept unchanged', () => {
  const prev = { contributions: 983, fetchedAt: '2026-01-01T00:00:00Z' };
  assert.equal(nextSnapshot(prev, null, new Date()), prev);
});

test('a missing or broken stored file reads as an empty snapshot instead of failing the build', () => {
  assert.deepEqual(readSnapshot('{"contributions": 983, "fetchedAt": "2026-01-01T00:00:00Z"}'), { contributions: 983, fetchedAt: '2026-01-01T00:00:00Z' });
  assert.deepEqual(readSnapshot('not json'), { contributions: 0, fetchedAt: null });
  assert.deepEqual(readSnapshot(null), { contributions: 0, fetchedAt: null });
  assert.deepEqual(readSnapshot('{"contributions": "x"}'), { contributions: 0, fetchedAt: null });
});
