import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, rm, rmdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { roles, prefixes, validateStore, parseTasks } from './lib/role-specs.mjs';
import { sampleSpecs } from './role-spec-samples.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const metadataPath = path.join(root, 'openspec/requirements.json');
const currentBytes = await readFile(metadataPath);
const current = JSON.parse(currentBytes);
if (current.version === 2) {
  await validateStore(root, current);
  console.log('Store already uses role-specs metadata v2; preserved current progress and source files.');
  process.exit(0);
}
assert.equal(current.version, 1, 'Migration requires metadata version 1 or an already migrated version 2');
assert.deepEqual(current.requirements.map((item) => item.id), Object.keys(sampleSpecs), 'This migration only handles the six original samples');
const backupRoot = 'openspec/migrations/role-specs-v1';
const operations = [];
const originals = [];
const removals = [];
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const get = (relative) => readFile(path.join(root, relative));
async function backup(original, destination) {
  let bytes;
  try { bytes = await get(destination); }
  catch (error) { if (error.code !== 'ENOENT') throw error; bytes = await get(original); }
  originals.push({ original, backup: destination, sha256: digest(bytes), bytes: bytes.length });
  operations.push({ relative: destination, bytes, preserve: true });
  return bytes;
}
const originalMetadata = await backup('openspec/requirements.json', `${backupRoot}/requirements.json`);
assert(currentBytes.equals(originalMetadata), 'Refusing to replace metadata edited after the migration began');
const config = await backup('openspec/config.yaml', `${backupRoot}/config.yaml`);
const migrated = structuredClone(current);
migrated.version = 2;
for (const requirement of migrated.requirements) {
  assert(typeof requirement.change === 'string' && requirement.change.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(requirement.change), 'Unsafe original change directory');
  const base = `openspec/changes/${requirement.change}`;
  const original = {};
  for (const filename of ['proposal.md', 'design.md', 'tasks.md', '.openspec.yaml', 'specs/task-workspace/spec.md']) {
    original[filename] = await backup(`${base}/${filename}`, `${base}/legacy/${filename}`);
  }
  for (const filename of ['tasks.md', 'specs/task-workspace/spec.md']) removals.push({ relative: `${base}/${filename}`, bytes: original[filename] });
  const taskLines = original['tasks.md'].toString('utf8').split('\n').filter((line) => /^\s*[-*+]\s+\[/.test(line));
  const assigned = [];
  const registered = [];
  for (const roleId of roles) {
    const oldRole = requirement.roles[roleId];
    const definitions = sampleSpecs[requirement.id][roleId];
    const ownedLines = taskLines.filter((line) => line.includes(`[${roleId}]`));
    assert.equal(ownedLines.length, 2, `${requirement.id} ${roleId}: expected two original tasks`);
    const specs = definitions.map((definition, index) => {
      const id = `${prefixes[roleId]}-${requirement.id}-${definition.slug}`;
      const lines = definitions.length === 1 ? ownedLines : [ownedLines[index]];
      assigned.push(...lines);
      parseTasks(lines.join('\n'), roleId, id);
      const spec = { id, title: definition.title, state: oldRole.state, note: oldRole.note };
      const purpose = `Define the ${definition.title.toLowerCase()} responsibilities owned by ${roleId} for ${requirement.id}, ${requirement.title.toLowerCase()}.`;
      let body;
      if (definition.requirement === null) {
        body = original['specs/task-workspace/spec.md'].toString('utf8').replace(/^# Spec Delta\s*/, `# ${id} · ${definition.title}\n\n## Purpose\n\n${purpose}\n\n`);
      } else {
        body = `# ${id} · ${definition.title}\n\n## Purpose\n\n${purpose}\n\n## ADDED Requirements\n\n### Requirement: ${definition.title}\n${definition.requirement}\n\n`;
        body += definition.scenarios.map(([title, when, then]) => `#### Scenario: ${title}\n- **WHEN** ${when}\n- **THEN** ${then}\n`).join('\n');
      }
      const tasks = `# ${id} · Tasks\n\n> Illustrative sample progress only. Checked boxes seed the demonstration board;\n> they do not assert that product implementation or verification has occurred.\n> Owner and spec state/notes live in \`openspec/requirements.json\`.\n> Original task text and checkbox state are preserved in \`../legacy/tasks.md\`.\n\n## ${roleId} · ${definition.title}\n\n${lines.join('\n')}\n`;
      operations.push({ relative: `${base}/specs/${id}/spec.md`, bytes: Buffer.from(body) });
      operations.push({ relative: `${base}/tasks/${id}.md`, bytes: Buffer.from(tasks) });
      registered.push(spec);
      return spec;
    });
    requirement.roles[roleId] = { owner: oldRole.owner, note: oldRole.note, specs };
  }
  assert.deepEqual([...assigned].sort(), [...taskLines].sort(), `${requirement.id}: every original task line must survive exactly once`);
  const capabilities = `## Capabilities\n\n### New Capabilities\n\n${registered.map((spec) => `- \`${spec.id}\`: ${spec.title}.`).join('\n')}\n\n### Modified Capabilities\n\nNone. Role contracts retain the original task-workspace behavior; the original\ncapability delta remains in \`legacy/specs/task-workspace/spec.md\` for traceability.\n\n`;
  const proposal = original['proposal.md'].toString('utf8').replace(/## Capabilities\n[\s\S]*?(?=## Impact)/, capabilities);
  const index = `\n## Role specification tracking\n\nShared product decisions above are unchanged. This requirement uses the local\n\`role-specs\` workflow. Each role feature has its own specification and checklist:\n\n${registered.map((spec) => `- [${spec.id}](specs/${spec.id}/spec.md) · [tasks](tasks/${spec.id}.md)`).join('\n')}\n\nMetadata version 2 registers these role specs. Progress comes from each task file;\nevery registered spec must be complete before its role can complete. The original\nplanning artifacts remain byte-preserved under \`legacy/\` and are not active task\nsources. Seeded checks remain illustrative rather than implementation evidence.\n`;
  operations.push({ relative: `${base}/proposal.md`, bytes: Buffer.from(proposal), replaceOriginal: original['proposal.md'] });
  operations.push({ relative: `${base}/design.md`, bytes: Buffer.from(original['design.md'].toString('utf8') + index), replaceOriginal: original['design.md'] });
  operations.push({ relative: `${base}/.openspec.yaml`, bytes: Buffer.from(original['.openspec.yaml'].toString('utf8').replace(/^schema:\s*spec-driven\s*$/m, 'schema: role-specs')), replaceOriginal: original['.openspec.yaml'] });
}
const configText = `schema: role-specs\n\ncontext: |\n  This illustrative specification store groups role-owned feature specs under\n  REQ-xxx requirements and their existing lowercase OpenSpec change directories.\n  Canonical IDs are SA-REQ-xxx-feature, FE-REQ-xxx-feature, BE-REQ-xxx-feature,\n  and QA-REQ-xxx-feature; each role can have multiple specs. Metadata version 2\n  registers each exact ID in openspec/requirements.json. Keep per-spec contracts\n  at specs/<ID>/spec.md and tasks at tasks/<ID>.md inside the requirement change.\n  Shared proposal/design provide context. Spec-scoped work preserves shared and\n  sibling artifacts. Legacy originals are migration references, not active work.\n  Checked sample tasks are seeded demonstration progress, not implementation or\n  test evidence. This repository owns specifications only; the Kanban app lives\n  separately in /Users/oka/Desktop/openhands-apps.\n`;
operations.push({ relative: 'openspec/config.yaml', bytes: Buffer.from(configText), replaceOriginal: config });
operations.push({ relative: `${backupRoot}/manifest.json`, bytes: Buffer.from(`${JSON.stringify({ version: 1, migration: 'role-specs-v1-to-v2', originals }, null, 2)}\n`), preserve: true });

// Preflight all writes before modifying anything; a rerun can recover a partial
// migration, but never overwrite unrelated edits or later role-spec progress.
for (const operation of operations) {
  try {
    const existing = await get(operation.relative);
    assert(existing.equals(operation.bytes) || operation.replaceOriginal?.equals(existing), `Refusing to overwrite changed ${operation.relative}`);
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
for (const removal of removals) {
  try { assert((await get(removal.relative)).equals(removal.bytes), `Refusing to remove changed ${removal.relative}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
for (const operation of operations) {
  const filename = path.join(root, operation.relative);
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, operation.bytes);
}
for (const requirement of migrated.requirements) {
  const base = path.join(root, 'openspec/changes', requirement.change);
  await rm(path.join(base, 'tasks.md'), { force: true });
  await rm(path.join(base, 'specs/task-workspace/spec.md'), { force: true });
  try { await rmdir(path.join(base, 'specs/task-workspace')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
await validateStore(root, migrated);
const staging = `${metadataPath}.role-specs-migration.tmp`;
await writeFile(staging, `${JSON.stringify(migrated, null, 2)}\n`);
await rename(staging, metadataPath);
console.log('Migrated six requirements to 28 role specs; preserved all 48 original task lines and source backups.');
