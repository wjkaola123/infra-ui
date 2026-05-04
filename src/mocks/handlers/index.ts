import { http, HttpResponse, delay } from 'msw';
import { SEED_PERMISSIONS, SEED_LOGS } from '../data/seed';

let roles = [
  { id: 1, name: 'Super Administrator', permission_ids: [1, 2, 3, 4], permissions: [
    { id: 1, name: 'Read', key: 'READ' },
    { id: 2, name: 'Create', key: 'WRITE' },
    { id: 3, name: 'Update', key: 'WRITE' },
    { id: 4, name: 'Delete', key: 'DELETE' },
  ], created_at: '2024-01-01 00:00:00' },
  { id: 2, name: 'Viewer', permission_ids: [1], permissions: [
    { id: 1, name: 'Read', key: 'READ' },
  ], created_at: '2024-01-02 00:00:00' },
  { id: 3, name: 'Editor', permission_ids: [1, 2, 3], permissions: [
    { id: 1, name: 'Read', key: 'READ' },
    { id: 2, name: 'Create', key: 'WRITE' },
    { id: 3, name: 'Update', key: 'WRITE' },
  ], created_at: '2024-01-03 00:00:00' },
];
let permissions = [...SEED_PERMISSIONS];
let logs = [...SEED_LOGS];

const generateId = () => Math.random().toString(36).substring(2, 9);

export const handlers = [
  // Roles
  http.get('/api/v1/roles/', async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const page_size = parseInt(url.searchParams.get('page_size') || '10');
    const start = (page - 1) * page_size;
    const end = start + page_size;
    const items = roles.slice(start, end);
    return HttpResponse.json({
      message: 'success',
      status: 200,
      data: {
        items,
        total: roles.length,
        page,
        page_size,
        total_pages: Math.ceil(roles.length / page_size),
      },
    });
  }),

  http.post('/api/v1/roles/', async ({ request }) => {
    await delay(100);
    const body = await request.json() as any;
    const newId = roles.length > 0 ? Math.max(...roles.map((r) => r.id)) + 1 : 1;
    const newRole = {
      id: newId,
      name: body.name,
      permission_ids: body.permission_ids || [],
      permissions: body.permission_ids?.map((pid: number) => {
        const perm = permissions.find((p) => String(p.id) === String(pid));
        return perm ? { id: perm.id, name: perm.name, key: perm.key } : { id: pid, name: String(pid), key: 'READ' };
      }) || [],
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    roles.push(newRole);
    return HttpResponse.json({ message: 'success', status: 201, data: newRole });
  }),

  http.put('/api/v1/roles/:id', async ({ params, request }) => {
    await delay(100);
    const body = await request.json() as any;
    const index = roles.findIndex((r) => r.id === parseInt(params.id as string));
    if (index !== -1) {
      roles[index] = { ...roles[index], ...body };
      // Ensure permissions array is returned
      if (body.permission_ids && !body.permissions) {
        roles[index].permissions = body.permission_ids.map((pid: number) => {
          const perm = permissions.find((p) => String(p.id) === String(pid));
          return perm ? { id: perm.id, name: perm.name, key: perm.key } : { id: pid, name: String(pid), key: 'READ' };
        });
      }
      return HttpResponse.json({ message: 'success', status: 200, data: roles[index] });
    }
    return HttpResponse.json({ message: 'Not found', status: 404, data: null });
  }),

  http.delete('/api/v1/roles/:id', async ({ params }) => {
    await delay(100);
    roles = roles.filter((r) => r.id !== parseInt(params.id as string));
    return HttpResponse.json({ message: 'success', status: 200, data: null });
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