import type { User } from '../types';
import type { BackendUser } from './endpoints/user';

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
