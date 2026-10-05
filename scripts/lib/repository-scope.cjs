'use strict';

// Pure contract validation; callers supply already bounded, non-linked sources.
const ROLE_SCHEMAS = { SA: 'sa', Frontend: 'frontend', Backend: 'backend', QA: 'qa' };
const UPSTREAM_ROLES = { SA: [], Frontend: ['SA'], Backend: ['SA'], QA: ['SA', 'Frontend', 'Backend'] };
function scopeIdentity(id) {
  const match = typeof id === 'string' && id.length <= 160 && id.match(/^(SA|FE|BE|QA)-([A-Z][A-Z0-9]*-[0-9]+)-([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  return match && { role: { SA: 'SA', FE: 'Frontend', BE: 'Backend', QA: 'QA' }[match[1]], requirement: match[2] };
}
function validateRepositoryScope(scope, id, lookup = null, seen = new Set()) {
  const fail = message => { throw new Error(`${id}: ${message}`); };
  const identity = scopeIdentity(id);
  if (!identity || seen.has(id)) fail('invalid or cyclic scope identity');
  const exact = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).sort().join(',') === keys.sort().join(',');
  if (!exact(scope, ['version', 'applications', 'references']) || scope.version !== 1) fail('invalid scope.json version or fields');
  const apps = scope.applications, refs = scope.references, required = UPSTREAM_ROLES[identity.role];
  if (!Array.isArray(apps) || !apps.length || apps.length > 20 || (identity.role !== 'SA' && apps.length !== 1)) fail('role requires exactly one repository; SA permits 1 to 20');
  for (const app of apps) {
    if (!exact(app, ['id', 'name', 'role', 'repository']) || typeof app.id !== 'string' || app.id.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(app.id)
      || typeof app.name !== 'string' || !app.name.trim() || app.name.length > 200 || /[\x00-\x1f]/.test(app.name)
      || !['Frontend', 'Backend', 'QA'].includes(app.role) || (identity.role !== 'SA' && app.role !== identity.role)
      || typeof app.repository !== 'string' || app.repository.length > 500
      || !/^https:\/\/github\.com\/[A-Za-z0-9][A-Za-z0-9-]*\/[A-Za-z0-9_-][A-Za-z0-9_.-]*\.git$/.test(app.repository)) fail('invalid application identity, role or HTTPS GitHub repository');
  }
  if (new Set(apps.map(app => app.id)).size !== apps.length || new Set(apps.map(app => app.repository.toLowerCase())).size !== apps.length) fail('duplicate applications or repositories');
  if (!Array.isArray(refs) || refs.length > 20 || new Set(refs).size !== refs.length || (identity.role === 'SA' && refs.length)) fail('invalid upstream references');
  const upstream = refs.map(ref => {
    const value = scopeIdentity(ref);
    if (!value || value.requirement !== identity.requirement || !required.includes(value.role)) fail('upstream reference must belong to a required role in this requirement');
    return value;
  });
  if (required.some(role => !upstream.some(value => value.role === role))) fail('missing required upstream role reference');
  if (lookup) {
    const next = new Set(seen).add(id);
    const sources = refs.map(ref => {
      const source = lookup(ref);
      if (!source) fail(`missing upstream scope ${ref}`);
      validateRepositoryScope(source, ref, lookup, next);
      return { ...scopeIdentity(ref), scope: source };
    });
    if (identity.role !== 'SA' && !sources.filter(source => source.role === 'SA').some(source => source.scope.applications.some(app => JSON.stringify(app) === JSON.stringify(apps[0])
      || ['id', 'name', 'role', 'repository'].every(key => app[key] === apps[0][key])))) fail('repository binding is not declared by referenced SA');
    if (identity.role === 'QA') {
      const saRefs = new Set(refs.filter(ref => scopeIdentity(ref).role === 'SA'));
      if (sources.some(source => source.role !== 'SA' && !source.scope.references.some(ref => saRefs.has(ref)))) fail('QA upstream implementations must share a referenced SA contract');
    }
  }
  return scope;
}
module.exports = { ROLE_SCHEMAS, UPSTREAM_ROLES, scopeIdentity, validateRepositoryScope };
