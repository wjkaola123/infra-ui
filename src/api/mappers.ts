import type { User, Role, PermissionEntity } from '../types';
import type { BackendUser } from './endpoints/user';
import type { BackendRole } from './endpoints/role';
import type { BackendPermission } from './endpoints/permission';

export const mapBackendUserToUser = (backendUser: BackendUser): User => ({
  id: String(backendUser.id),
  name: backendUser.username,
  roleIds: [],
  permissionIds: [],
  status: backendUser.is_active ? 'active' : 'inactive',
  createdAt: backendUser.created_at || new Date().toISOString(),
});

export const mapUserToBackendCreate = (user: Partial<User>) => ({
  username: user.name || 'unknown',
  email: `${user.name || 'unknown'}@example.com`,
});

export const mapBackendRoleToRole = (backendRole: BackendRole): Role => ({
  id: String(backendRole.id),
  name: backendRole.name,
  permissionIds: (backendRole.permission_ids || []).map(String),
  permissions: (backendRole.permissions || []).map((p) => ({
    id: String(p.id),
    name: p.name,
    key: p.key as PermissionEntity['key'],
  })),
  createdAt: backendRole.created_at,
  assignedUsersCount: backendRole.assigned_users_count,
});

export const mapBackendPermissionToPermission = (backendPerm: BackendPermission): PermissionEntity => ({
  id: String(backendPerm.id),
  name: backendPerm.name,
  key: backendPerm.key as PermissionEntity['key'],
});

export const mapBackendRolePermissionsToPermissionEntities = (perms: { id: number; name: string; description?: string }[]): PermissionEntity[] =>
  perms.map((p) => ({
    id: String(p.id),
    name: p.name,
    key: 'READ' as PermissionEntity['key'],
  }));
