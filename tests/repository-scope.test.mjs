import assert from 'node:assert/strict';
import test from 'node:test';
import { validateRepositoryScope } from '../scripts/lib/repository-scope.cjs';

const apps = ['Frontend', 'Backend', 'QA'].map(role => ({ id: role.toLowerCase(), name: role, role, repository: `https://github.com/example/${role.toLowerCase()}.git` }));
const ids = { SA: 'SA-ROOM-1-contract', Frontend: 'FE-ROOM-1-ui', Backend: 'BE-ROOM-1-api', QA: 'QA-ROOM-1-regression' };
function fixture() {
  return Object.fromEntries(Object.entries(ids).map(([role, id]) => [id, { version: 1,
    applications: role === 'SA' ? structuredClone(apps) : [structuredClone(apps.find(app => app.role === role))],
    references: role === 'SA' ? [] : role === 'QA' ? [ids.SA, ids.Frontend, ids.Backend] : [ids.SA] }]));
}
test('SA spans three apps while downstream specs each bind one and trace upstream roles', () => {
  const scopes = fixture();
  for (const [id, scope] of Object.entries(scopes)) assert.equal(validateRepositoryScope(scope, id, ref => scopes[ref]), scope);
});
test('invalid cardinality, credentials, role, duplicates, missing and cross-requirement references fail', () => {
  for (const mutate of [
    s => s[ids.Backend].applications.push(apps[0]),
    s => s[ids.Backend].applications[0].repository = 'https://token@github.com/example/backend.git',
    s => s[ids.Backend].applications[0].role = 'QA',
    s => s[ids.SA].applications.push(apps[0]),
    s => s[ids.QA].references.pop(),
    s => s[ids.Backend].references = ['SA-OTHER-1-contract'],
    s => delete s[ids.SA],
    s => s[ids.Backend].applications[0].id = 'unlisted',
    s => s[ids.SA].applications[0].repository = 'file:///tmp/repo',
    s => s[ids.SA].references = [ids.Backend],
  ]) {
    const scopes = fixture(); mutate(scopes);
    assert.throws(() => validateRepositoryScope(scopes[ids.QA], ids.QA, ref => scopes[ref]));
  }
});
