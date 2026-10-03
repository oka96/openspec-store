import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const metadata = JSON.parse(await readFile(new URL('openspec/requirements.json', root), 'utf8'));
const roles = ['SA', 'Frontend', 'Backend', 'QA'];
const ids = new Set();
const changes = new Set();
const expectedStages = ['Backlog', 'SA', 'Implementation', 'QA', 'Blocked', 'Done'];
const stages = [];
const seeded = process.argv.includes('--seeded');

assert.equal(metadata.version, 1);
assert.equal(metadata.name, 'Taskflow · Sample spec store');
assert.match(metadata.description, /illustrative/i);
assert(Array.isArray(metadata.requirements) && metadata.requirements.length > 0 && metadata.requirements.length <= 50);
if (seeded) assert.equal(metadata.requirements.length, 6, 'The seeded fixture illustrates six delivery phases.');

for (const requirement of metadata.requirements) {
  assert(!ids.has(requirement.id), `Duplicate requirement: ${requirement.id}`);
  assert(!changes.has(requirement.change), `Duplicate change: ${requirement.change}`);
  ids.add(requirement.id);
  changes.add(requirement.change);
  assert.match(requirement.id, /^REQ-\d+$/);
  assert.match(requirement.change, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
  assert(requirement.title && requirement.summary);
  assert.deepEqual(Object.keys(requirement.roles), roles);

  const change = new URL(`openspec/changes/${requirement.change}/`, root);
  for (const artifact of ['proposal.md', 'design.md', '.openspec.yaml']) {
    assert((await readFile(new URL(artifact, change), 'utf8')).trim(), `Empty artifact: ${artifact}`);
  }
  const specs = await readdir(new URL('specs/', change), { recursive: true });
  assert(specs.some((file) => file.endsWith('/spec.md')), `${requirement.id}: missing capability specification`);
  const tasks = await readFile(new URL('tasks.md', change), 'utf8');
  if (seeded) assert.match(tasks, /Illustrative sample progress only/);
  const checkboxes = [...tasks.matchAll(/^\s*[-*+]\s+\[\s*(\S?)\s*\]\s+\S+\s+\[(SA|Frontend|Backend|QA)\] (.+)$/gm)];
  assert.equal(checkboxes.length, (tasks.match(/^\s*[-*+]\s+\[/gm) ?? []).length, 'Every task must be numbered and role tagged.');
  const summaries = Object.fromEntries(roles.map((role) => {
    const roleTasks = checkboxes.filter((task) => task[2] === role);
    assert(roleTasks.length >= (seeded ? 2 : 1), `${requirement.id}: ${role} needs tracked tasks.`);
    const hint = requirement.roles[role];
    assert(typeof hint.owner === 'string' && hint.owner.trim() && typeof hint.note === 'string', `${requirement.id}: ${role} needs an owner and a note field.`);
    if (seeded) assert(hint.note, `${requirement.id}: seeded ${role} needs an illustrative note.`);
    assert(['backlog', 'in_progress', 'blocked'].includes(hint.state));
    const done = roleTasks.filter((task) => task[1].toLowerCase() === 'x').length;
    return [role, { total: roleTasks.length, done, complete: done === roleTasks.length, hint: hint.state }];
  }));
  const values = Object.values(summaries);
  const stage = values.every((role) => role.complete) ? 'Done'
    : values.some((role) => !role.complete && role.hint === 'blocked') ? 'Blocked'
      : values.every((role) => role.done === 0 && role.hint === 'backlog') ? 'Backlog'
        : !summaries.SA.complete ? 'SA'
          : !summaries.Frontend.complete || !summaries.Backend.complete ? 'Implementation' : 'QA';
  stages.push(stage);
  console.log(`${requirement.id}: ${stage}; ${values.reduce((sum, role) => sum + role.done, 0)}/${checkboxes.length} tasks; four roles verified`);
}

if (seeded) assert.deepEqual(stages, expectedStages, 'Seeded samples must illustrate each intended delivery phase once.');
console.log(seeded ? 'Sample metadata, artifacts, roles, and seeded phases are valid.' : 'Store metadata, artifacts, and four-role task coverage are valid.');
