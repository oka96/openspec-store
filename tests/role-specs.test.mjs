import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';
import { aggregateRequirement, parseChangeName, parseKanban, parseTasks, roles, prefixes, validateStore } from '../scripts/lib/role-specs.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const exec = promisify(execFile);
async function temp(t) {
  const directory = await realpath(await mkdtemp(path.join(os.tmpdir(), 'role-change-store-')));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(path.join(directory, 'openspec/changes'), { recursive: true });
  await writeFile(path.join(directory, 'openspec/config.yaml'), 'schema: spec-driven\n');
  return directory;
}
async function write(directory, relative, value) {
  const filename = path.join(directory, relative);
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, value);
}
async function change(directory, id, { proposal = '# Proposal\n', tasks = '- [x] 1.1 Verified outcome\n' } = {}) {
  const base = `openspec/changes/${id}`;
  await write(directory, `${base}/proposal.md`, proposal);
  await write(directory, `${base}/design.md`, '# Design\n');
  await write(directory, `${base}/specs/feature/spec.md`, '# Contract\n');
  await write(directory, `${base}/tasks.md`, tasks);
  return path.join(directory, base);
}
async function fixture(t) {
  const directory = await temp(t);
  for (const role of roles) await change(directory, `${prefixes[role]}-REQ-007-feature`);
  return directory;
}
async function snapshot(directory) {
  const values = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) values.push(...await snapshot(filename));
    else values.push([filename, createHash('sha256').update(await readFile(filename)).digest('hex')]);
  }
  return values.sort(([a], [b]) => a.localeCompare(b));
}

test('canonical folders preserve arbitrary prefix and exact numeric identity', () => {
  assert.deepEqual(parseChangeName('BE-STORY-12-api'), { id: 'BE-STORY-12-api', change: 'BE-STORY-12-api', role: 'Backend', requirement: 'STORY-12', feature: 'api' });
  assert.equal(parseChangeName('FE-REQ-0003-task-filters').requirement, 'REQ-0003');
  for (const name of ['FE-REQ-003-../outside', 'FE-req-003-feature', 'Frontend-REQ-003-feature', 'FE-REQ--feature', 'FE-REQ-003-Feature', 'SA-REQ-1-' + 'a'.repeat(160)]) assert.equal(parseChangeName(name), null);
});

test('optional Kanban text preserves multiline fields without controlling identity', () => {
  const values = parseKanban('# Proposal\n\n## Kanban\n\n- Requirement title: Human title\n- Requirement summary: First line\n  Second line\n  \n  Last line\n- Spec title: Feature\n- Owner: Ada\n- Role note: Waiting\n- State: blocked\n- Note: Needs evidence\n- Requirement: WRONG-9\n\n## Other\n- Owner: Ignored\n');
  assert.deepEqual(values, { requirementTitle: 'Human title', requirementSummary: 'First line\nSecond line\n\nLast line', title: 'Feature', owner: 'Ada', roleNote: 'Waiting', state: 'blocked', note: 'Needs evidence' });
  assert.deepEqual(parseKanban('# Ordinary proposal'), {});
  assert.deepEqual(parseKanban('\`\`\`md\n## Kanban\n- Owner: Example\n\`\`\`'), {});
  assert.throws(() => parseKanban('## Kanban\n- State: done'), /Invalid Kanban State/);
  assert.throws(() => parseKanban('## Kanban\n- Owner: a\n- Owner: b'), /Duplicate/);
  assert.throws(() => parseKanban('## Kanban\n- Owner: ' + 'x'.repeat(201)), /200/);
});

test('task identity is local; absent roles inherit folder while conflicting tags fail', () => {
  assert.equal(parseTasks('- [x] 1.1 First', 'SA', 'SA-STORY-12-first')[0].role, 'SA');
  assert.equal(parseTasks('- [~] 1.1 [SA] Second', 'SA', 'SA-REQ-007-second')[0].done, false);
  assert.throws(() => parseTasks('- [ ] 1.1 [Backend] Wrong role', 'SA', 'SA-REQ-007-first'), /conflicts/);
  assert.throws(() => parseTasks('- [ ] 1.1 First\n- [ ] 1.1 Duplicate', 'SA', 'SA-REQ-007-first'), /duplicate local/);
  assert.equal(parseTasks('- [x] [FE] Alias', 'Frontend', 'FE-REQ-1-a')[0].done, true);
  const variants = parseTasks('1. [ x ] [SA] 2.1 Role-first task\n  + [~] Numberless task', 'SA', 'SA-REQ-007-first');
  assert.deepEqual(variants.map(({ id, description, done }) => ({ id, description, done })), [
    { id: '2.1', description: 'Role-first task', done: true }, { id: 'line-2', description: 'Numberless task', done: false },
  ]);
});

test('folder discovery works without any registry and reflects direct additions and removals', async (t) => {
  const directory = await temp(t);
  await change(directory, 'SA-REQ-003-labels');
  await change(directory, 'FE-REQ-003-filters');
  await change(directory, 'BE-STORY-12-api');
  // Even a poisoned legacy registry is not a runtime input.
  await write(directory, 'openspec/requirements.json', 'invalid legacy json');
  let result = await validateStore(directory);
  assert.deepEqual(result.summaries.map(({ id }) => id), ['REQ-003', 'STORY-12']);
  assert.equal(result.summaries[0].title, 'REQ-003');
  assert.equal(result.summaries[0].roles.Frontend.owner, 'Unassigned');
  await rm(path.join(directory, 'openspec/requirements.json'));
  await rm(path.join(directory, 'openspec/changes/BE-STORY-12-api'), { recursive: true });
  await change(directory, 'QA-TEST-0001-checks');
  result = await validateStore(directory);
  assert.deepEqual(result.summaries.map(({ id }) => id), ['REQ-003', 'TEST-0001']);
});

test('archive and unrelated changes are excluded while malformed role names are rejected', async (t) => {
  const directory = await temp(t);
  await change(directory, 'SA-REQ-1-feature');
  await mkdir(path.join(directory, 'openspec/changes/archive/SA-REQ-2-old'), { recursive: true });
  await change(directory, 'ordinary-change');
  assert.equal((await validateStore(directory)).summaries.length, 1);
  await mkdir(path.join(directory, 'openspec/changes/FE-REQ-1-UPPER'));
  await assert.rejects(validateStore(directory), /Malformed role change/);
});

test('conflicting optional context is deterministic and role context aggregates uniquely', async (t) => {
  const directory = await temp(t);
  await change(directory, 'FE-REQ-9-b', { proposal: '## Kanban\n- Requirement title: B\n- Requirement summary: Two\n- Owner: Bob\n- Role note: Next\n' });
  await change(directory, 'FE-REQ-9-a', { proposal: '## Kanban\n- Requirement title: A\n- Requirement summary: One\n- Owner: Ada\n- Role note: First\n' });
  const result = await validateStore(directory);
  assert.equal(result.summaries[0].title, 'A');
  assert.equal(result.summaries[0].summary, 'One');
  assert.equal(result.summaries[0].roles.Frontend.owner, 'Ada · Bob');
  assert.equal(result.summaries[0].roles.Frontend.note, 'First\nNext');
  assert.equal(result.warnings.length, 2);
});

test('aggregation requires every role and every sibling change with blocker precedence', () => {
  const specs = roles.map((role) => ({ role, owner: 'Ada', total: 1, complete: 1, state: 'backlog' }));
  assert.equal(aggregateRequirement({ id: 'REQ-1' }, specs).stage, 'Done');
  specs.push({ role: 'Frontend', owner: 'Ada', total: 1, complete: 0, state: 'backlog' });
  assert.equal(aggregateRequirement({ id: 'REQ-1' }, specs).stage, 'Implementation');
  specs.at(-1).state = 'blocked';
  assert.equal(aggregateRequirement({ id: 'REQ-1' }, specs).stage, 'Blocked');
  specs.at(-1).complete = 1;
  assert.equal(aggregateRequirement({ id: 'REQ-1' }, specs).stage, 'Done');
  specs[0].missing = true;
  assert.equal(aggregateRequirement({ id: 'REQ-1' }, specs).roles.SA.complete, false);
});

for (const file of ['proposal.md', 'design.md', 'tasks.md', 'specs/feature/spec.md']) {
  test(`missing or empty ${file} cannot complete a change`, async (t) => {
    const directory = await fixture(t);
    const filename = path.join(directory, 'openspec/changes/QA-REQ-007-feature', file);
    await rm(filename);
    await assert.rejects(validateStore(directory), /ENOENT/);
    let result = await validateStore(directory, { allowMissing: true });
    assert.equal(result.summaries[0].roles.QA.complete, false);
    assert(result.warnings.some((warning) => warning.includes('missing')));
    await writeFile(filename, '');
    result = await validateStore(directory, { allowMissing: true });
    assert.equal(result.summaries[0].roles.QA.complete, false);
    assert(result.warnings.some((warning) => warning.includes('empty')));
  });
}

test('empty checklist stays incomplete and all capability contracts are discovered', async (t) => {
  const directory = await fixture(t);
  const base = 'openspec/changes/SA-REQ-007-feature';
  await write(directory, `${base}/specs/second/spec.md`, '# Second contract\n');
  await write(directory, `${base}/tasks.md`, '# Tasks\n');
  const result = await validateStore(directory);
  const spec = result.summaries[0].specs.find((item) => item.role === 'SA');
  assert.equal(spec.specPaths.length, 2);
  assert.equal(result.summaries[0].roles.SA.complete, false);
  assert(result.warnings.some((warning) => warning.includes('no tasks')));
});

for (const type of ['change', 'capability', 'file']) {
  test(`linked ${type} cannot escape the store`, async (t) => {
    const directory = await fixture(t);
    const base = path.join(directory, 'openspec/changes/SA-REQ-007-feature');
    const selected = type === 'change' ? base : type === 'capability' ? path.join(base, 'specs/feature') : path.join(base, 'tasks.md');
    await rm(selected, { recursive: true });
    await symlink(type === 'file' ? path.join(directory, 'openspec/changes/QA-REQ-007-feature/tasks.md') : path.join(directory, 'openspec/changes/QA-REQ-007-feature'), selected);
    await assert.rejects(validateStore(directory), /linked/);
  });
}

test('bounded source and requirement/spec/task limits reject oversized stores', async (t) => {
  const directory = await temp(t);
  await change(directory, 'SA-REQ-1-feature', { tasks: 'x'.repeat(65537) });
  await assert.rejects(validateStore(directory), /65536/);
  await change(directory, 'SA-REQ-1-feature', { tasks: Array.from({ length: 501 }, (_, i) => `- [ ] ${i + 1} Task ${i}`).join('\n') });
  await assert.rejects(validateStore(directory), /500 tasks/);
  await change(directory, 'SA-REQ-1-feature');
  for (let i = 0; i < 20; i++) await change(directory, `FE-REQ-1-feature-${i}`);
  await assert.rejects(validateStore(directory), /20 role changes/);
  await rm(path.join(directory, 'openspec/changes'), { recursive: true });
  for (let i = 0; i < 51; i++) await change(directory, `SA-REQ-${i}-feature`);
  await assert.rejects(validateStore(directory), /50 requirements/);
});

test('actual pinned CLI validates exactly four main roles and all repository-scoped changes with correct task paths', { timeout: 120000 }, async () => {
  const cli = path.join(root, 'node_modules/@fission-ai/openspec/bin/openspec.js');
  const run = async (args, cwd = root) => JSON.parse((await exec(process.execPath, [cli, ...args, '--json'], { cwd, maxBuffer: 4 * 1024 * 1024 })).stdout);
  const specs = (await validateStore(root)).summaries.flatMap((item) => item.specs);
  const mainSpecs = await run(['list', '--specs']);
  assert.deepEqual(mainSpecs.specs.map((item) => item.id).sort(), ['be', 'fe', 'qa', 'sa']);
  const list = await run(['list']);
  assert.deepEqual(list.changes.map((item) => item.name).sort(), specs.map((spec) => spec.id).sort());
  const validation = await run(['validate', '--all', '--strict']);
  assert.equal(validation.summary.totals.failed, 0);
  assert.equal(validation.summary.byType.change.passed, specs.length);
  assert.equal(validation.summary.byType.spec.passed, 4);
  assert.deepEqual(validation.items.filter((item) => item.type === 'spec').map((item) => item.id).sort(), ['be', 'fe', 'qa', 'sa']);
  for (let i = 0; i < specs.length; i += 4) {
    await Promise.all(specs.slice(i, i + 4).map(async (spec) => {
      const status = await run(['status', '--change', spec.id]);
      assert.equal(status.schemaName, spec.schema);
      assert.equal(status.isPlanningComplete, true);
      assert.equal(status.changeRoot, path.join(root, 'openspec/changes', spec.id));
      const response = await run(['instructions', 'apply', '--change', spec.id]);
      assert.equal(response.schemaName, spec.schema);
      assert.deepEqual(response.progress, { total: spec.total, complete: spec.complete, remaining: spec.total - spec.complete });
      assert.deepEqual(response.contextFiles.tasks, [path.join(root, 'openspec/changes', spec.id, 'tasks.md')]);
      for (const task of response.tasks) {
        assert.equal(task.sourcePath, response.contextFiles.tasks[0]);
        const raw = (await readFile(task.sourcePath, 'utf8')).split('\n')[task.line - 1];
        assert(raw.endsWith(task.description));
        assert.equal(/\[x\]/i.test(raw), task.done);
      }
    }));
  }
});

test('native archive handles uppercase role change in disposable fixture and excludes it from discovery', async (t) => {
  const directory = await temp(t);
  const name = 'QA-ROOM-001-booking-regression';
  await cp(path.join(root, 'openspec/schemas'), path.join(directory, 'openspec/schemas'), { recursive: true });
  await cp(path.join(root, 'openspec/changes', name), path.join(directory, 'openspec/changes', name), { recursive: true });
  const cli = path.join(root, 'node_modules/@fission-ai/openspec/bin/openspec.js');
  const { stdout } = await exec(process.execPath, [cli, 'archive', name, '--yes', '--skip-specs', '--json'], { cwd: directory });
  const result = JSON.parse(stdout);
  assert.equal(result.archive.change, name);
  assert(result.archive.archivedAs.endsWith(name));
  assert.equal((await validateStore(directory)).summaries.length, 0);
  const archives = await readdir(path.join(directory, 'openspec/changes/archive'));
  assert(archives.some((item) => item.endsWith(name)));
});

async function standaloneStore(t) {
  const directory = await fixture(t);
  await cp(path.join(root, 'scripts'), path.join(directory, 'scripts'), { recursive: true });
  await mkdir(path.join(directory, 'tests'));
  const expected = [{
    id: 'REQ-007', title: 'REQ-007', summary: '', stage: 'Done', complete: 4, total: 4,
    specs: roles.map((role) => ({
      id: `${prefixes[role]}-REQ-007-feature`, role, title: 'feature', owner: 'Unassigned',
      roleNote: '', state: 'backlog', note: '', taskLines: ['- [x] 1.1 Verified outcome'],
      contractHash: createHash('sha256').update('# Contract\n').digest('hex'),
    })).sort((a, b) => a.id.localeCompare(b.id, 'en')),
  }];
  await write(directory, 'tests/seeded-expectations.mjs', `export const seededExpectations = ${JSON.stringify(expected)};\n`);
  return directory;
}

test('standalone validation and seeded checks work without a registry or migration directory', async (t) => {
  const directory = await standaloneStore(t);
  await assert.rejects(lstat(path.join(directory, 'openspec/migrations')), /ENOENT/);
  await assert.rejects(lstat(path.join(directory, 'openspec/requirements.json')), /ENOENT/);
  const before = await snapshot(path.join(directory, 'openspec'));
  for (const args of [[], ['--seeded']]) {
    const { stdout } = await exec(process.execPath, ['scripts/validate-samples.mjs', ...args], { cwd: directory });
    assert.match(stdout, /Folder identities and active source consistency are valid/);
    if (args.length) assert.match(stdout, /4 exact task lines, 4 contract sources/);
  }
  assert.deepEqual(await snapshot(path.join(directory, 'openspec')), before);
});

test('ordinary validation accepts changed progress while explicit seeded verification detects it', async (t) => {
  const directory = await standaloneStore(t);
  const tasks = path.join(directory, 'openspec/changes/FE-REQ-007-feature/tasks.md');
  await writeFile(tasks, (await readFile(tasks, 'utf8')).replace('- [x]', '- [ ]'));
  const current = await exec(process.execPath, ['scripts/validate-samples.mjs'], { cwd: directory });
  assert.match(current.stdout, /REQ-007: Implementation; 3\/4 tasks/);
  await assert.rejects(exec(process.execPath, ['scripts/validate-samples.mjs', '--seeded'], { cwd: directory }), /REQ-007: stage changed/);
});
