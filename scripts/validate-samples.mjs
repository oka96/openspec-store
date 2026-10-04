import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { safeReadBytes, validateStore } from './lib/role-specs.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const { summaries, warnings } = await validateStore(root);
for (const summary of summaries) console.log(`${summary.id}: ${summary.stage}; ${summary.complete}/${summary.total} tasks; ${summary.specs.length} role changes`);
for (const warning of warnings) console.warn(`Warning: ${warning}`);

if (process.argv.includes('--seeded')) {
  const { seededExpectations } = await import('../tests/seeded-expectations.mjs');
  assert.deepEqual(summaries.map((item) => item.id), seededExpectations.map((item) => item.id), 'Seed requirement groups changed');
  for (const expected of seededExpectations) {
    const summary = summaries.find((item) => item.id === expected.id);
    for (const key of ['title', 'summary', 'stage', 'complete', 'total']) assert.equal(summary[key], expected[key], `${expected.id}: ${key} changed`);
    assert.deepEqual(summary.specs.map((item) => item.id), expected.specs.map((item) => item.id), `${expected.id}: role changes changed`);
    for (const previous of expected.specs) {
      const spec = summary.specs.find((item) => item.id === previous.id);
      for (const key of ['role', 'title', 'owner', 'roleNote', 'state', 'note']) assert.equal(spec[key], previous[key], `${spec.id}: ${key} changed`);
      assert.deepEqual(spec.tasks.map((task) => task.raw), previous.taskLines, `${spec.id}: task text or checkbox changed`);
      assert.equal(spec.specPaths.length, 1, `${spec.id}: seeded capability count changed`);
      const bytes = await safeReadBytes(root, spec.specPaths[0]);
      assert.equal(createHash('sha256').update(bytes).digest('hex'), previous.contractHash, `${spec.id}: contract source bytes changed`);
    }
  }
  const taskCount = summaries.reduce((total, item) => total + item.total, 0);
  const specCount = summaries.reduce((total, item) => total + item.specs.length, 0);
  console.log(`Seeded ${summaries.length} requirement stages, ${taskCount} exact task lines, ${specCount} contract sources, ownership and notes are valid.`);
}
console.log('Folder identities and active source consistency are valid.');
