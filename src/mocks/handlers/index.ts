import { http, HttpResponse, delay } from 'msw';
import { SEED_USERS, SEED_ROLES, SEED_PERMISSIONS, SEED_LOGS } from '../data/seed';

let users = [...SEED_USERS];
let roles = [...SEED_ROLES];
let permissions = [...SEED_PERMISSIONS];
let logs = [...SEED_LOGS];

const generateId = () => Math.random().toString(36).substring(2, 9);

export const handlers = [
  // Users
  http.get('/api/users', async () => {
    await delay(100);
    return HttpResponse.json({ data: users });
  }),

  http.post('/api/users', async ({ request }) => {
    await delay(100);
    const body = await request.json() as any;
    const newUser = {
      id: generateId(),
      name: body.name,
      roleIds: body.roleIds || [],
      permissionIds: body.permissionIds || [],
      status: body.status || 'active',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    users.push(newUser);
    return HttpResponse.json({ data: newUser }, { status: 201 });
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    await delay(100);
    const body = await request.json() as any;
    const index = users.findIndex((u) => u.id === params.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...body };
      return HttpResponse.json({ data: users[index] });
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  http.delete('/api/users/:id', async ({ params }) => {
    await delay(100);
    users = users.filter((u) => u.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  // Roles
  http.get('/api/roles', async () => {
    await delay(100);
    return HttpResponse.json({ data: roles });
  }),

  http.post('/api/roles', async ({ request }) => {
    await delay(100);
    const body = await request.json() as any;
    const newRole = {
      id: generateId(),
      name: body.name,
      permissionIds: body.permissionIds || [],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    roles.push(newRole);
    return HttpResponse.json({ data: newRole }, { status: 201 });
  }),

  http.put('/api/roles/:id', async ({ params, request }) => {
    await delay(100);
    const body = await request.json() as any;
    const index = roles.findIndex((r) => r.id === params.id);
    if (index !== -1) {
      roles[index] = { ...roles[index], ...body };
      return HttpResponse.json({ data: roles[index] });
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  http.delete('/api/roles/:id', async ({ params }) => {
    await delay(100);
    roles = roles.filter((r) => r.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  // Permissions
  http.get('/api/permissions', async () => {
    await delay(100);
    return HttpResponse.json({ data: permissions });
  }),

  http.post('/api/permissions', async ({ request }) => {
    await delay(100);
    const body = await request.json() as any;
    const newPerm = { id: generateId(), name: body.name, key: body.key };
    permissions.push(newPerm);
    return HttpResponse.json({ data: newPerm }, { status: 201 });
  }),

  http.get('/api/logs', async () => {
    await delay(100);
    return HttpResponse.json({ data: logs });
  }),
];