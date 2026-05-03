import type { User, Role, PermissionEntity, OperationLog } from '../../types';

export const SEED_PERMISSIONS: PermissionEntity[] = [
  { id: 'p1', name: 'Read', key: 'READ' },
  { id: 'p2', name: 'Create', key: 'WRITE' },
  { id: 'p3', name: 'Update', key: 'WRITE' },
  { id: 'p4', name: 'Delete', key: 'DELETE' },
];

export const SEED_ROLES: Role[] = [
  { id: 'r1', name: 'Super Admin', permissionIds: ['p1', 'p2', 'p3', 'p4'], createdAt: '2024-01-01 00:00:00' },
  { id: 'r2', name: 'Viewer', permissionIds: ['p1'], createdAt: '2024-01-02 00:00:00' },
  { id: 'r3', name: 'Editor', permissionIds: ['p1', 'p2', 'p3'], createdAt: '2024-01-03 00:00:00' },
];

export const SEED_USERS: User[] = [
  { id: 'u1', name: 'admin', roleIds: ['r1'], permissionIds: [], status: 'active', createdAt: '2024-01-01 00:00:00' },
  { id: 'u2', name: 'Zhang San', roleIds: ['r2'], permissionIds: [], status: 'active', createdAt: '2024-01-15 10:30:00' },
  { id: 'u3', name: 'Li Si', roleIds: ['r3'], permissionIds: [], status: 'active', createdAt: '2024-02-01 14:20:00' },
  { id: 'u4', name: 'Wang Wu', roleIds: [], permissionIds: [], status: 'inactive', createdAt: '2024-03-10 09:00:00' },
];

export const SEED_LOGS: OperationLog[] = [
  { id: 'l1', timestamp: '2024-03-15 14:30:00', operator: 'admin', action: 'create', targetType: 'user', targetName: 'Wang Wu', detail: 'Created user Wang Wu' },
  { id: 'l2', timestamp: '2024-03-15 15:00:00', operator: 'admin', action: 'assign', targetType: 'role', targetName: 'Editor', detail: 'Assigned role Editor to user Li Si' },
  { id: 'l3', timestamp: '2024-03-16 09:15:00', operator: 'admin', action: 'delete', targetType: 'user', targetName: 'Test User', detail: 'Deleted user Test User' },
];