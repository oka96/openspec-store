import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';
import { aggregateRequirement, parseTasks, roles, prefixes, validateMetadata, validateStore } from '../scripts/lib/role-specs.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const exec = promisify(execFile);
const fixture = () => ({
  version: 2, name: 'Fixture', description: '', requirements: [{
    id: 'REQ-007', title: 'Feature', summary: '', change: 'fixture-feature',
    roles: Object.fromEntries(roles.map((role) => [role, { owner: `${role} owner`, note: '', specs: [
      { id: `${prefixes[role]}-REQ-007-feature`, title: 'Feature', state: 'backlog', note: '' },
    ] }])),
  }],
});

test('metadata permits multiple specs per role and empty incomplete roles', () => {
  const metadata = fixture();
  metadata.requirements[0].roles.Frontend.specs.push({ id: 'FE-REQ-007-second', title: 'Second', state: 'blocked', note: 'Awaiting contract' });
  metadata.requirements[0].roles.QA.specs = [];
  assert.equal(validateMetadata(metadata), metadata);
});

for (const [name, edit, pattern] of [
  ['wrong owner prefix', (m) => { m.requirements[0].roles.Backend.specs[0].id = 'FE-REQ-007-feature'; }, /must match Backend/],
  ['wrong requirement', (m) => { m.requirements[0].roles.SA.specs[0].id = 'SA-REQ-008-feature'; }, /must match SA/],
  ['unsafe suffix', (m) => { m.requirements[0].roles.SA.specs[0].id = 'SA-REQ-007-..\/outside'; }, /safe feature/],
  ['uppercase suffix', (m) => { m.requirements[0].roles.SA.specs[0].id = 'SA-REQ-007-Feature'; }, /safe feature/],
  ['duplicate ID', (m) => { m.requirements[0].roles.SA.specs.push({ ...m.requirements[0].roles.SA.specs[0] }); }, /duplicate spec ID/],
  ['spec cap', (m) => { m.requirements[0].roles.SA.specs = Array.from({ length: 18 }, (_, i) => ({ id: `SA-REQ-007-feature-${i}`, title: 'Feature', state: 'backlog', note: '' })); }, /at most 20/],
  ['obsolete role state', (m) => { m.requirements[0].roles.SA.state = 'done'; }, /unexpected or missing fields/],
  ['obsolete metadata version', (m) => { m.version = 1; }, /version 2/],
]) {
  test(`metadata rejects ${name}`, () => {
    const metadata = fixture(); edit(metadata);
    assert.throws(() => validateMetadata(metadata), pattern);
  });
}

test('task identity is local to a spec and ownership is enforced', () => {
  assert.equal(parseTasks('- [x] 1.1 [SA] First', 'SA', 'SA-REQ-007-first')[0].done, true);
  assert.equal(parseTasks('- [~] 1.1 [SA] Second', 'SA', 'SA-REQ-007-second')[0].done, false);
  assert.throws(() => parseTasks('- [ ] 1.1 [Backend] Wrong role', 'SA', 'SA-REQ-007-first'), /owning \[SA\]/);
  assert.throws(() => parseTasks('- [ ] 1.1 [SA] First\n- [ ] 1.1 [SA] Duplicate', 'SA', 'SA-REQ-007-first'), /duplicate local/);
  const variants = parseTasks('1. [ x ] [SA] 2.1 Role-first task\n  + [~] [SA] Numberless task', 'SA', 'SA-REQ-007-first');
  assert.deepEqual(variants.map(({ id, description, done }) => ({ id, description, done })), [
    { id: '2.1', description: 'Role-first task', done: true },
    { id: 'line-2', description: 'Numberless task', done: false },
  ]);
});

test('aggregation requires every spec and role, with unfinished blocker precedence', () => {
  const requirement = fixture().requirements[0];
  const specs = roles.map((role) => ({ role, total: 1, complete: 1, state: 'backlog' }));
  assert.equal(aggregateRequirement(requirement, specs).stage, 'Done');
  specs.push({ role: 'Frontend', total: 1, complete: 0, state: 'backlog' });
  assert.equal(aggregateRequirement(requirement, specs).stage, 'Implementation');
  assert.equal(aggregateRequirement(requirement, specs).roles.Frontend.complete, false);
  specs.at(-1).state = 'blocked';
  assert.equal(aggregateRequirement(requirement, specs).stage, 'Blocked');
  specs.at(-1).complete = 1;
  assert.equal(aggregateRequirement(requirement, specs).stage, 'Done');
  assert.equal(aggregateRequirement(requirement, specs.filter((spec) => spec.role !== 'QA')).stage, 'QA');
  specs[0].missing = true;
  assert.equal(aggregateRequirement(requirement, specs).roles.SA.complete, false);
});

async function sourceFixture(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'role-spec-store-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const metadata = fixture();
  const base = path.join(directory, 'openspec/changes/fixture-feature');
  await mkdir(base, { recursive: true });
  for (const name of ['proposal.md', 'design.md']) await writeFile(path.join(base, name), 'Shared context\n');
  await writeFile(path.join(base, '.openspec.yaml'), 'schema: role-specs\n');
  for (const role of roles) {
    const id = metadata.requirements[0].roles[role].specs[0].id;
    await mkdir(path.join(base, 'specs', id), { recursive: true });
    await mkdir(path.join(base, 'tasks'), { recursive: true });
    await writeFile(path.join(base, 'specs', id, 'spec.md'), '# Source contract\n');
    await writeFile(path.join(base, 'tasks', `${id}.md`), `- [x] 1.1 [${role}] Verified outcome\n`);
  }
  return { directory: await realpath(directory), metadata, base };
}

test('missing and empty task sources remain incomplete', async (t) => {
  const { directory, metadata, base } = await sourceFixture(t);
  await rm(path.join(base, 'tasks/QA-REQ-007-feature.md'));
  await assert.rejects(validateStore(directory, metadata), /ENOENT/);
  let result = await validateStore(directory, metadata, { allowMissing: true });
  assert.equal(result.summaries[0].stage, 'QA');
  assert(result.warnings.some((warning) => warning.includes('missing tasks')));
  await writeFile(path.join(base, 'tasks/QA-REQ-007-feature.md'), '# No tracked tasks\n');
  result = await validateStore(directory, metadata);
  assert.equal(result.summaries[0].stage, 'QA');
  assert(result.warnings.some((warning) => warning.includes('no tasks')));
});

test('unregistered and linked sources are rejected', async (t) => {
  const { directory, metadata, base } = await sourceFixture(t);
  const extra = path.join(base, 'tasks/FE-REQ-007-unregistered.md');
  await writeFile(extra, '- [ ] 1.1 [Frontend] Hidden task');
  await assert.rejects(validateStore(directory, metadata), /unregistered source/);
  await rm(extra);
  const selected = path.join(base, 'tasks/SA-REQ-007-feature.md');
  await rm(selected);
  await symlink(path.join(base, 'tasks/QA-REQ-007-feature.md'), selected);
  await assert.rejects(validateStore(directory, metadata), /linked or escaping/);
});

test('pinned OpenSpec discovers all REQ-003 role task files and their actual states', async () => {
  const { stdout } = await exec(process.execPath, ['node_modules/@fission-ai/openspec/bin/openspec.js', 'instructions', 'apply', '--change', 'add-task-labels', '--store', 'openspec-store', '--json'], { cwd: root });
  const response = JSON.parse(stdout);
  assert.equal(response.schemaName, 'role-specs');
  const metadata = JSON.parse(await readFile(path.join(root, 'openspec/requirements.json'), 'utf8'));
  const expected = (await validateStore(root, metadata)).summaries.find((item) => item.id === 'REQ-003');
  assert.equal(response.contextFiles.specs.length, expected.specs.length);
  assert.equal(response.contextFiles.tasks.length, expected.specs.length);
  assert.deepEqual(response.progress, { total: expected.total, complete: expected.complete, remaining: expected.total - expected.complete });
  const paths = new Set(response.tasks.map((task) => task.sourcePath));
  assert.equal(paths.size, expected.specs.filter((spec) => spec.total > 0).length);
  for (const task of response.tasks) {
    assert.match(task.sourcePath, /\/tasks\/(SA|FE|BE|QA)-REQ-003-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/);
    const raw = (await readFile(task.sourcePath, 'utf8')).split('\n')[task.line - 1];
    assert(raw.endsWith(task.description));
    assert.equal(/\[x\]/i.test(raw), task.done);
  }
});

test('repeating migration preserves all current source bytes', async () => {
  async function snapshot(directory) {
    const values = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) values.push(...await snapshot(filename));
      else values.push([filename, createHash('sha256').update(await readFile(filename)).digest('hex')]);
    }
    return values.sort(([a], [b]) => a.localeCompare(b));
  }
  const before = await snapshot(path.join(root, 'openspec'));
  const { stdout } = await exec(process.execPath, ['scripts/migrate-role-specs.mjs'], { cwd: root });
  assert.match(stdout, /already uses role-specs/);
  assert.deepEqual(await snapshot(path.join(root, 'openspec')), before);
});

async function originalStoreFixture(t) {
  const directory = await realpath(await mkdtemp(path.join(os.tmpdir(), 'role-spec-migration-')));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(path.join(root, 'scripts'), path.join(directory, 'scripts'), { recursive: true });
  await cp(path.join(root, 'openspec'), path.join(directory, 'openspec'), { recursive: true });
  const manifest = JSON.parse(await readFile(path.join(directory, 'openspec/migrations/role-specs-v1/manifest.json'), 'utf8'));
  const original = JSON.parse(await readFile(path.join(directory, 'openspec/migrations/role-specs-v1/requirements.json'), 'utf8'));
  for (const requirement of original.requirements) {
    const base = path.join(directory, 'openspec/changes', requirement.change);
    await rm(path.join(base, 'specs'), { recursive: true });
    await rm(path.join(base, 'tasks'), { recursive: true });
  }
  for (const item of manifest.originals) {
    const destination = path.join(directory, item.original);
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(path.join(directory, item.backup), destination);
  }
  return directory;
}

test('migration recovers original v1 samples from existing backups without task loss', async (t) => {
  const directory = await originalStoreFixture(t);
  const { stdout } = await exec(process.execPath, ['scripts/migrate-role-specs.mjs'], { cwd: directory });
  assert.match(stdout, /28 role specs/);
  const verification = await exec(process.execPath, ['scripts/validate-samples.mjs', '--seeded'], { cwd: directory });
  assert.match(verification.stdout, /48 exact task lines/);
  const repeated = await exec(process.execPath, ['scripts/migrate-role-specs.mjs'], { cwd: directory });
  assert.match(repeated.stdout, /already uses role-specs/);
});

test('migration refuses to remove an original task file changed after backup', async (t) => {
  const directory = await originalStoreFixture(t);
  const filename = path.join(directory, 'openspec/changes/add-task-due-dates/tasks.md');
  const changed = (await readFile(filename, 'utf8')).replace('- [ ] 1.2', '- [x] 1.2');
  await writeFile(filename, changed);
  await assert.rejects(exec(process.execPath, ['scripts/migrate-role-specs.mjs'], { cwd: directory }), /Refusing to remove changed/);
  assert.equal(await readFile(filename, 'utf8'), changed);
  assert.equal(JSON.parse(await readFile(path.join(directory, 'openspec/requirements.json'), 'utf8')).version, 1);
});
