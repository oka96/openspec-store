import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { validateStore, roles } from './lib/role-specs.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (relative) => readFile(new URL(`../${relative}`, import.meta.url));
const metadata = JSON.parse(await read('openspec/requirements.json'));
const seeded = process.argv.includes('--seeded');
const { summaries, warnings } = await validateStore(root, metadata);
for (const summary of summaries) {
  console.log(`${summary.id}: ${summary.stage}; ${summary.complete}/${summary.total} tasks; ${summary.specs.length} role specs`);
}
for (const warning of warnings) console.warn(`Warning: ${warning}`);

// Original bytes remain immutable even after active progress changes.
const manifest = JSON.parse(await read('openspec/migrations/role-specs-v1/manifest.json'));
assert.equal(manifest.migration, 'role-specs-v1-to-v2');
assert.equal(manifest.originals.length, 32);
for (const original of manifest.originals) {
  const bytes = await read(original.backup);
  assert.equal(bytes.length, original.bytes, `${original.backup}: original byte length changed`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), original.sha256, `${original.backup}: original bytes changed`);
}

if (seeded) {
  const before = JSON.parse(await read('openspec/migrations/role-specs-v1/requirements.json'));
  assert.equal(metadata.name, before.name);
  assert.equal(metadata.description, before.description);
  assert.equal(summaries.length, 6);
  assert.deepEqual(summaries.map((item) => item.stage), ['Backlog', 'Solution Design', 'Implementation', 'QA', 'Blocked', 'Done']);
  assert.deepEqual(summaries.map((item) => [item.complete, item.total]), [[0, 8], [1, 8], [3, 8], [7, 8], [3, 8], [8, 8]]);
  assert.equal(summaries.reduce((sum, item) => sum + item.specs.length, 0), 28);
  for (const [index, requirement] of metadata.requirements.entries()) {
    const old = before.requirements[index];
    for (const field of ['id', 'title', 'summary', 'change']) assert.equal(requirement[field], old[field]);
    const originalTasks = (await read(`openspec/changes/${requirement.change}/legacy/tasks.md`)).toString('utf8').split('\n').filter((line) => /^\s*[-*+]\s+\[/.test(line));
    const activeTasks = summaries[index].specs.flatMap((spec) => spec.tasks.map((task) => task.raw));
    assert.deepEqual(activeTasks.sort(), originalTasks.sort(), `${requirement.id}: task description or checkbox changed during migration`);
    for (const roleId of roles) {
      const role = requirement.roles[roleId];
      assert.equal(role.owner, old.roles[roleId].owner);
      assert.equal(role.note, old.roles[roleId].note);
      assert.equal(role.specs.length, requirement.id === 'REQ-003' ? 2 : 1);
      for (const spec of role.specs) {
        assert.equal(spec.state, old.roles[roleId].state);
        assert.equal(spec.note, old.roles[roleId].note);
      }
    }
  }
}
console.log(seeded ? 'Seeded stages, 48 exact task lines, 28 role specs, ownership, notes, and original bytes are preserved.' : 'Metadata v2, role spec sources, progress, and original migration bytes are valid.');
