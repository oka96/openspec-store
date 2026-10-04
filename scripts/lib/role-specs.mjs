import assert from 'node:assert/strict';
import { lstat, open, readdir, realpath } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

export const roles = ['SA', 'Frontend', 'Backend', 'QA'];
export const prefixes = { SA: 'SA', Frontend: 'FE', Backend: 'BE', QA: 'QA' };
export const canonicalChange = /^(SA|FE|BE|QA)-([A-Z][A-Z0-9]*)-([0-9]+)-([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const roleNames = Object.fromEntries(Object.entries(prefixes).map(([role, prefix]) => [prefix, role]));
const text = (value, label, limit, required = true) => {
  assert(typeof value === 'string' && value.length <= limit && !value.includes('\0') && (!required || value.trim()), `${label} must be ${required ? 'nonempty ' : ''}text up to ${limit} characters`);
};

export function parseChangeName(name) {
  const match = typeof name === 'string' && name.length <= 160 && name.match(canonicalChange);
  if (!match) return null;
  return { id: name, change: name, role: roleNames[match[1]], requirement: `${match[2]}-${match[3]}`, feature: match[4] };
}

const kanbanFields = new Map([
  ['Requirement title', ['requirementTitle', 200]], ['Requirement summary', ['requirementSummary', 4000]],
  ['Spec title', ['title', 200]], ['Owner', ['owner', 200]], ['Role note', ['roleNote', 4000]],
  ['State', ['state', 200]], ['Note', ['note', 4000]],
]);
export function parseKanban(content) {
  const result = {};
  let active = false;
  let field = null;
  let seenSection = false;
  let fenced = false;
  for (const line of content.split(/\r?\n/)) {
    if (/^\s*(`{3,}|~{3,})/.test(line)) { fenced = !fenced; continue; }
    if (fenced) continue;
    if (line.trim() === '## Kanban') {
      assert(!seenSection, 'Duplicate Kanban section');
      active = true; seenSection = true; field = null; continue;
    }
    if (/^#{1,2}\s/.test(line)) { active = false; field = null; }
    if (!active) continue;
    const bullet = line.match(/^[-*+] ([^:]+):(?: (.*))?$/);
    if (bullet) {
      field = kanbanFields.get(bullet[1])?.[0] ?? null;
      if (!field) continue;
      assert(!(field in result), `Duplicate Kanban field ${bullet[1]}`);
      result[field] = bullet[2] ?? '';
    } else if (field && /^ {2}/.test(line)) result[field] += `\n${line.slice(2)}`;
    else if (line.trim()) field = null;
  }
  for (const [label, [key, limit]] of kanbanFields) if (key in result) text(result[key], label, limit, false);
  if ('state' in result) assert(['backlog', 'in_progress', 'blocked'].includes(result.state), 'Invalid Kanban State');
  return result;
}

// Match OpenSpec 1.14 checkbox semantics, including nested and ordered lists.
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
    const tagged = description.match(/^\[(SA|Frontend|Backend|QA|FE|BE)\]\s*/);
    if (tagged) {
      assert((roleNames[tagged[1]] ?? tagged[1]) === roleId, `${specId}:${index + 1}: task role conflicts with owning ${roleId}`);
      description = description.slice(tagged[0].length);
    }
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

export async function safePath(root, relative) {
  const canonicalRoot = await realpath(root);
  const parts = relative.split('/');
  assert(parts.every((part) => part && part !== '.' && part !== '..' && !part.includes('\\')), `${relative}: unsafe path`);
  let filename = canonicalRoot;
  for (const part of parts) {
    filename = path.join(filename, part);
    const info = await lstat(filename);
    assert(!info.isSymbolicLink(), `${relative}: linked paths are not allowed`);
  }
  return filename;
}
export async function safeReadBytes(root, relative, limit = 64 * 1024) {
  const filename = await safePath(root, relative);
  const handle = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const info = await handle.stat();
    assert(info.isFile() && info.size <= limit, `${relative}: must be a regular file up to ${limit} bytes`);
    // A bounded read also limits a file that grows after stat.
    const bytes = Buffer.alloc(limit + 1);
    const { bytesRead } = await handle.read(bytes, 0, bytes.length, 0);
    assert(bytesRead <= limit, `${relative}: exceeds ${limit} bytes`);
    return bytes.subarray(0, bytesRead);
  } finally { await handle.close(); }
}
export async function safeRead(root, relative, limit = 64 * 1024) {
  const bytes = await safeReadBytes(root, relative, limit);
  const value = bytes.toString('utf8');
  assert(Buffer.from(value, 'utf8').equals(bytes) && !value.includes('\0'), `${relative}: must contain UTF-8 text`);
  return value;
}

export function aggregateRequirement(requirement, specs) {
  const roleSummaries = Object.fromEntries(roles.map((roleId) => {
    const owned = specs.filter((spec) => spec.role === roleId);
    const complete = owned.length > 0 && owned.every((spec) => spec.total > 0 && spec.complete === spec.total && !spec.missing);
    const state = complete ? 'done' : owned.some((spec) => spec.state === 'blocked' && (spec.missing || spec.total === 0 || spec.complete < spec.total)) ? 'blocked'
      : owned.some((spec) => spec.complete > 0 || spec.state === 'in_progress') ? 'in_progress' : 'backlog';
    return [roleId, { complete, state, owner: [...new Set(owned.map((spec) => spec.owner))].join(' · ') || 'Unassigned', note: [...new Set(owned.map((spec) => spec.roleNote).filter(Boolean))].join('\n') }];
  }));
  const values = Object.values(roleSummaries);
  const stage = values.some((role) => role.state === 'blocked') ? 'Blocked'
    : values.every((role) => role.complete) ? 'Done'
      : values.every((role) => role.state === 'backlog') ? 'Backlog'
        : !roleSummaries.SA.complete ? 'Solution Design'
          : !roleSummaries.Frontend.complete || !roleSummaries.Backend.complete ? 'Implementation' : 'QA';
  return { ...requirement, stage, complete: specs.reduce((sum, spec) => sum + spec.complete, 0), total: specs.reduce((sum, spec) => sum + spec.total, 0), specs, roles: roleSummaries };
}

export async function validateStore(root, { allowMissing = false } = {}) {
  const changes = await safePath(root, 'openspec/changes');
  assert((await lstat(changes)).isDirectory(), 'changes must be a directory');
  const groups = new Map();
  const warnings = [];
  let sourceBytes = 0;
  const entries = await readdir(changes, { withFileTypes: true });
  assert(entries.length <= 1000, 'Too many change directory entries');
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    if (entry.name === 'archive') continue;
    assert(!entry.isSymbolicLink(), `${entry.name}: linked change rejected`);
    const identity = parseChangeName(entry.name);
    if (!identity) {
      assert(!/^(?:SA|FE|BE|QA)-/i.test(entry.name), `Malformed role change ${entry.name}`);
      continue;
    }
    assert(entry.isDirectory() && !entry.isSymbolicLink(), `${entry.name}: linked or non-directory role change`);
    if (!groups.has(identity.requirement)) groups.set(identity.requirement, []);
    assert(groups.size <= 50, 'Store supports at most 50 requirements');
    const group = groups.get(identity.requirement);
    assert(group.length < 20, `${identity.requirement}: at most 20 role changes are supported`);
    const base = `openspec/changes/${entry.name}`;
    let missing = false;
    async function source(relative, label) {
      try {
        const content = await safeRead(root, `${base}/${relative}`);
        sourceBytes += Buffer.byteLength(content);
        assert(sourceBytes <= 8 * 1024 * 1024, 'Store source content exceeds 8 MiB');
        if (!content.trim()) {
          missing = true; warnings.push(`${entry.name}: empty ${label}`);
          assert(allowMissing, `${entry.name}: empty ${label}`);
        }
        return content;
      } catch (error) {
        if (error.code !== 'ENOENT' || !allowMissing) throw error;
        missing = true; warnings.push(`${entry.name}: missing ${label}`); return '';
      }
    }
    // .openspec.yaml is optional with the store's default spec-driven schema.
    try {
      const config = await safeRead(root, `${base}/.openspec.yaml`);
      assert(!/^schema:/m.test(config) || /^schema:\s*spec-driven\s*$/m.test(config), `${entry.name}: schema must be spec-driven`);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    const proposal = await source('proposal.md', 'proposal');
    await source('design.md', 'design');
    const context = parseKanban(proposal);
    let capabilities = [];
    try {
      const directory = await safePath(root, `${base}/specs`);
      assert((await lstat(directory)).isDirectory(), `${entry.name}: specs must be a directory`);
      capabilities = await readdir(directory, { withFileTypes: true });
    } catch (error) { if (error.code !== 'ENOENT' || !allowMissing) throw error; }
    assert(capabilities.length <= 20, `${entry.name}: at most 20 capabilities`);
    if (!capabilities.length) {
      missing = true; warnings.push(`${entry.name}: missing specs`);
      assert(allowMissing, `${entry.name}: missing specs`);
    }
    const specPaths = [];
    for (const capability of capabilities.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      assert(capability.isDirectory() && !capability.isSymbolicLink() && /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(capability.name) && capability.name.length <= 160, `${entry.name}: invalid or linked capability`);
      await source(`specs/${capability.name}/spec.md`, 'spec');
      specPaths.push(`${base}/specs/${capability.name}/spec.md`);
    }
    const tasks = parseTasks(await source('tasks.md', 'tasks'), identity.role, identity.id);
    if (!tasks.length) warnings.push(`${entry.name}: no tasks; change is incomplete`);
    group.push({ ...identity, title: context.title?.trim() || identity.feature.replaceAll('-', ' '), owner: context.owner?.trim() || 'Unassigned', roleNote: context.roleNote || '', state: context.state || 'backlog', note: context.note || '', requirementTitle: context.requirementTitle || '', requirementSummary: context.requirementSummary || '', tasks, specPaths, complete: tasks.filter((task) => task.done).length, total: tasks.length, missing });
    assert(group.reduce((sum, spec) => sum + spec.total, 0) <= 500, `${identity.requirement}: at most 500 tasks are supported`);
  }
  const summaries = [];
  for (const [id, specs] of [...groups].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    const titles = [...new Set(specs.map((spec) => spec.requirementTitle).filter(Boolean))];
    const summariesText = [...new Set(specs.map((spec) => spec.requirementSummary).filter(Boolean))];
    if (titles.length > 1) warnings.push(`${id}: conflicting requirement titles; first change by name wins`);
    if (summariesText.length > 1) warnings.push(`${id}: conflicting requirement summaries; first change by name wins`);
    summaries.push(aggregateRequirement({ id, title: titles[0] || id, summary: summariesText[0] || '' }, specs));
  }
  return { summaries, warnings };
}
