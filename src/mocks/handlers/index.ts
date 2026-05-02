import { http, HttpResponse, delay } from 'msw';
import { SEED_USERS, SEED_ROLES, SEED_PERMISSIONS, SEED_RELATIONS } from '../data/seed';
import type { Relation } from '../../types';

let users = [...SEED_USERS];
let roles = [...SEED_ROLES];
let permissions = [...SEED_PERMISSIONS];
let relations = [...SEED_RELATIONS] as Relation[];

const generateId = () => Math.random().toString(36).substring(2, 9);

export const handlers = [
  // Users
  http.get('/api/users', async () => {
    await delay(100);
    return HttpResponse.json({ data: users });
  }),

  http.post('/api/users', async ({ request }) => {
    await delay(100);
    const body = await request.json() as { name: string };
    const newUser = { id: generateId(), name: body.name, roleIds: [], permissionIds: [] };
    users.push(newUser);
    return HttpResponse.json({ data: newUser }, { status: 201 });
  }),

  http.delete('/api/users/:id', async ({ params }) => {
    await delay(100);
    const id = params.id as string;
    users = users.filter((u) => u.id !== id);
    relations = relations.filter((r) => !(r.sourceId === id && r.sourceType === 'user'));
    return HttpResponse.json({ success: true });
  }),

  // Roles
  http.get('/api/roles', async () => {
    await delay(100);
    return HttpResponse.json({ data: roles });
  }),

  http.post('/api/roles', async ({ request }) => {
    await delay(100);
    const body = await request.json() as { name: string; permissionIds: string[] };
    const newRole = { id: generateId(), name: body.name, permissionIds: body.permissionIds };
    roles.push(newRole);
    return HttpResponse.json({ data: newRole }, { status: 201 });
  }),

  http.delete('/api/roles/:id', async ({ params }) => {
    await delay(100);
    const id = params.id as string;
    roles = roles.filter((r) => r.id !== id);
    relations = relations.filter((r) => !(r.sourceId === id && r.sourceType === 'role'));
    return HttpResponse.json({ success: true });
  }),

  // Permissions
  http.get('/api/permissions', async () => {
    await delay(100);
    return HttpResponse.json({ data: permissions });
  }),

  // Relations
  http.post('/api/relations', async ({ request }) => {
    await delay(100);
    const body = await request.json() as {
      sourceId: string;
      sourceType: string;
      targetId: string;
      targetType: string;
    };
    const newRel = { id: generateId(), ...body } as Relation;
    relations.push(newRel);
    return HttpResponse.json({ data: newRel }, { status: 201 });
  }),

  http.delete('/api/relations', async ({ request }) => {
    await delay(100);
    const body = await request.json() as { relationId: string };
    relations = relations.filter((r) => r.id !== body.relationId);
    return HttpResponse.json({ success: true });
  }),

  // Reset
  http.post('/api/sandbox/reset', async () => {
    await delay(100);
    users = [...SEED_USERS];
    roles = [...SEED_ROLES];
    permissions = [...SEED_PERMISSIONS];
    relations = [...SEED_RELATIONS] as Relation[];
    return HttpResponse.json({ success: true });
  }),
];
