import type { User, Role } from '../types';
import type { BackendUser } from './endpoints/user';
import type { BackendRole } from './endpoints/role';

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
  createdAt: backendRole.created_at,
});
