import assert from 'node:assert/strict';
import { lstat, readFile, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';

export const roles = ['SA', 'Frontend', 'Backend', 'QA'];
export const prefixes = { SA: 'SA', Frontend: 'FE', Backend: 'BE', QA: 'QA' };
const hints = ['backlog', 'in_progress', 'blocked'];
const keys = (value, expected, label) => {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`);
  assert.deepEqual(Object.keys(value).sort(), [...expected].sort(), `${label} has unexpected or missing fields`);
};
const text = (value, label, limit, required = true) => {
  assert(typeof value === 'string' && value.length <= limit && !value.includes('\0') && (!required || value.trim()), `${label} must be ${required ? 'nonempty ' : ''}text up to ${limit} characters`);
};

export function validateMetadata(metadata) {
  keys(metadata, ['version', 'name', 'description', 'requirements'], 'Store metadata');
  assert.equal(metadata.version, 2, 'Store metadata must use version 2');
  text(metadata.name, 'Store name', 200);
  text(metadata.description, 'Store description', 4000, false);
  assert(Buffer.byteLength(JSON.stringify(metadata), 'utf8') <= 128 * 1024, 'Store metadata exceeds 128 KiB');
  assert(Array.isArray(metadata.requirements) && metadata.requirements.length <= 50, 'Store supports at most 50 requirements');
  const requirementIds = new Set();
  const changes = new Set();
  const specIds = new Set();
  for (const requirement of metadata.requirements) {
    const label = requirement?.id ?? 'Requirement';
    keys(requirement, ['id', 'title', 'summary', 'change', 'roles'], label);
    assert.match(requirement.id, /^REQ-[0-9]{3,}$/, `${label}: invalid requirement ID`);
    assert(requirement.id.length <= 64, `${label}: requirement ID is too long`);
    assert(!requirementIds.has(requirement.id), `${label}: duplicate requirement ID`);
    requirementIds.add(requirement.id);
    text(requirement.title, `${label} title`, 200);
    text(requirement.summary, `${label} summary`, 4000, false);
    assert(typeof requirement.change === 'string' && requirement.change.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(requirement.change), `${label}: invalid change`);
    assert(!changes.has(requirement.change), `${label}: duplicate change`);
    changes.add(requirement.change);
    keys(requirement.roles, roles, `${label} roles`);
    let specCount = 0;
    for (const roleId of roles) {
      const role = requirement.roles[roleId];
      keys(role, ['owner', 'note', 'specs'], `${label} ${roleId}`);
      text(role.owner, `${label} ${roleId} owner`, 200);
      text(role.note, `${label} ${roleId} note`, 4000, false);
      assert(Array.isArray(role.specs), `${label} ${roleId}: specs must be an array`);
      specCount += role.specs.length;
      for (const spec of role.specs) {
        keys(spec, ['id', 'title', 'state', 'note'], `${label} ${roleId} spec`);
        assert(typeof spec.id === 'string' && spec.id.length <= 160, `${label}: invalid spec ID length`);
        const start = `${prefixes[roleId]}-${requirement.id}-`;
        assert(spec.id.startsWith(start) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(spec.id.slice(start.length)), `${spec.id}: spec ID must match ${roleId} and ${label} with a safe feature slug`);
        assert(!specIds.has(spec.id), `${spec.id}: duplicate spec ID`);
        specIds.add(spec.id);
        text(spec.title, `${spec.id} title`, 200);
        text(spec.note, `${spec.id} note`, 4000, false);
        assert(hints.includes(spec.state), `${spec.id}: invalid state`);
      }
    }
    assert(specCount <= 20, `${label}: at most 20 specs are supported`);
  }
  return metadata;
}

// Match OpenSpec 1.14's checkbox semantics, including nested and ordered lists.
const taskLine = /^\s*(?:[-*+]|\d{1,9}[.)])\s*\[(?:\s*([^\]\s]?)\s*\](?![([])|\s+\])\s*(.*)/;
export function parseTasks(content, roleId, specId) {
  const tasks = [];
  const ids = new Set();
  for (const [index, line] of content.split('\n').entries()) {
    const match = line.match(taskLine);
    if (!match) continue;
    let description = match[2].trim();
    let id = `line-${index + 1}`;
    const number = description.match(/^(\d+(?:\.\d+)+|\d+)\.?\s+/);
    if (number) { id = number[1]; description = description.slice(number[0].length); }
    const tagged = description.match(/^\[(SA|Frontend|Backend|QA)\]\s*/);
    assert(tagged?.[1] === roleId, `${specId}:${index + 1}: every task needs its owning [${roleId}] tag`);
    description = description.slice(tagged[0].length);
    if (!number) {
      const after = description.match(/^(\d+(?:\.\d+)+|\d+)\.?\s+/);
      if (after) { id = after[1]; description = description.slice(after[0].length); }
    }
    text(description, `${specId}:${index + 1} task description`, 4000);
    assert(!ids.has(id), `${specId}: duplicate local task ID ${id}`);
    ids.add(id);
    tasks.push({ id, role: roleId, specId, description, done: (match[1] ?? '').toLowerCase() === 'x', line: index + 1, raw: line });
  }
  return tasks;
}

async function safeRead(root, relative, limit = 64 * 1024) {
  const filename = path.join(root, relative);
  const canonicalRoot = await realpath(root);
  const canonicalFile = await realpath(filename);
  assert(canonicalFile === filename && canonicalFile.startsWith(`${canonicalRoot}${path.sep}`), `${relative}: linked or escaping paths are not allowed`);
  const info = await lstat(filename);
  assert(info.isFile() && info.size <= limit, `${relative}: must be a regular file up to ${limit} bytes`);
  const bytes = await readFile(filename);
  const value = bytes.toString('utf8');
  assert(bytes.length <= limit && Buffer.from(value, 'utf8').equals(bytes) && !value.includes('\0'), `${relative}: must contain bounded UTF-8 text`);
  return value;
}

export function aggregateRequirement(requirement, specs) {
  const roleSummaries = Object.fromEntries(roles.map((roleId) => {
    const owned = specs.filter((spec) => spec.role === roleId);
    const complete = owned.length > 0 && owned.every((spec) => spec.total > 0 && spec.complete === spec.total && !spec.missing);
    const state = complete ? 'done' : owned.some((spec) => spec.state === 'blocked' && (spec.missing || spec.total === 0 || spec.complete < spec.total)) ? 'blocked'
      : owned.some((spec) => spec.complete > 0 || spec.state === 'in_progress') ? 'in_progress' : 'backlog';
    return [roleId, { complete, state }];
  }));
  const values = Object.values(roleSummaries);
  const stage = values.some((role) => role.state === 'blocked') ? 'Blocked'
    : values.every((role) => role.complete) ? 'Done'
      : values.every((role) => role.state === 'backlog') ? 'Backlog'
        : !roleSummaries.SA.complete ? 'Solution Design'
          : !roleSummaries.Frontend.complete || !roleSummaries.Backend.complete ? 'Implementation' : 'QA';
  return { id: requirement.id, stage, complete: specs.reduce((sum, spec) => sum + spec.complete, 0), total: specs.reduce((sum, spec) => sum + spec.total, 0), specs, roles: roleSummaries };
}

export async function validateStore(root, metadata, { allowMissing = false } = {}) {
  validateMetadata(metadata);
  const summaries = [];
  const warnings = [];
  for (const requirement of metadata.requirements) {
    const base = `openspec/changes/${requirement.change}`;
    for (const name of ['proposal.md', 'design.md', '.openspec.yaml']) {
      const content = await safeRead(root, `${base}/${name}`);
      assert(content.trim(), `${requirement.id}: empty ${name}`);
      if (name === '.openspec.yaml') assert.match(content, /^schema:\s*role-specs\s*$/m, `${requirement.id}: requires role-specs schema`);
    }
    const specs = [];
    for (const roleId of roles) {
      const role = requirement.roles[roleId];
      if (role.specs.length === 0) warnings.push(`${requirement.id} ${roleId}: no specs; role is incomplete`);
      for (const spec of role.specs) {
        let source = '';
        let tasks = [];
        let missing = false;
        for (const [kind, relative] of [['spec', `${base}/specs/${spec.id}/spec.md`], ['tasks', `${base}/tasks/${spec.id}.md`]]) {
          try {
            const content = await safeRead(root, relative);
            if (kind === 'spec') source = content;
            else tasks = parseTasks(content, roleId, spec.id);
          } catch (error) {
            if (!allowMissing || error.code !== 'ENOENT') throw error;
            warnings.push(`${spec.id}: missing ${kind} source`);
            missing = true;
          }
        }
        assert(missing || source.trim(), `${spec.id}: empty spec source`);
        if (tasks.length === 0) warnings.push(`${spec.id}: no tasks; spec is incomplete`);
        specs.push({ ...spec, role: roleId, tasks, complete: tasks.filter((task) => task.done).length, total: tasks.length, missing });
      }
    }
    assert(specs.reduce((sum, spec) => sum + spec.total, 0) <= 500, `${requirement.id}: at most 500 tasks are supported`);
    // Orphan files would be counted by OpenSpec but hidden from the board.
    for (const [directory, expected] of [
      ['specs', specs.map((spec) => spec.id)], ['tasks', specs.map((spec) => `${spec.id}.md`)],
    ]) {
      let files = [];
      try { files = await readdir(path.join(root, base, directory)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
      assert(files.every((file) => expected.includes(file)), `${requirement.id}: unregistered source in ${directory}`);
    }
    summaries.push(aggregateRequirement(requirement, specs));
  }
  return { summaries, warnings };
}
