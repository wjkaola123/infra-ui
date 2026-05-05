export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  roleIds: string[];
  permissionIds: string[];
  status: UserStatus;
  createdAt: string;
  roles?: Role[];
}

export interface Role {
  id: string;
  name: string;
  permissionIds: string[];
  permissions?: PermissionEntity[];
  createdAt: string;
  assignedUsersCount?: number;
}

export interface PermissionEntity {
  id: string;
  name: string;
  key: Permission;
}

export type LogAction = 'create' | 'update' | 'delete' | 'assign';
export type LogTargetType = 'user' | 'role' | 'permission';

export interface OperationLog {
  id: string;
  timestamp: string;
  operator: string;
  action: LogAction;
  targetType: LogTargetType;
  targetName: string;
  detail: string;
}

export type EntityType = 'user' | 'role' | 'permission';

export interface AppState {
  users: User[];
  roles: Role[];
  permissions: PermissionEntity[];
  logs: OperationLog[];

  selectedEntity: { id: string; type: EntityType } | null;
  operationLog: string[];

  // Pagination
  usersTotal: number;
  usersPage: number;
  usersPageSize: number;
  usersTotalPages: number;
  usersUsernameFilter: string;

  // Role pagination
  rolesTotal: number;
  rolesPage: number;
  rolesPageSize: number;
  rolesTotalPages: number;
  rolesNameFilter: string;

  selectEntity: (entity: { id: string; type: EntityType } | null) => void;
  setUsers: (users: User[]) => void;
  fetchUsersFromApi: (page?: number, pageSize?: number, usernameFilter?: string) => Promise<void>;
  setUsersPage: (page: number) => void;
  setUsersPageSize: (size: number) => void;
  setUsersUsernameFilter: (filter: string) => void;
  setRolesPage: (page: number) => void;
  setRolesPageSize: (size: number) => void;
  setRolesNameFilter: (filter: string) => void;
  fetchRolesFromApi: (page?: number, pageSize?: number, nameFilter?: string) => Promise<void>;
  fetchPermissionsFromApi: () => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  updateUser: (id: string, data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  deleteUser: (id: string) => Promise<{ success: boolean; error?: string }>;
  addRole: (role: Omit<Role, 'id' | 'createdAt'>) => void;
  updateRole: (id: string, data: Partial<Role>) => void;
  deleteRole: (id: string) => Promise<{ success: boolean; error?: string }>;
  addPermission: (permission: Omit<PermissionEntity, 'id'>) => void;
  updatePermission: (id: string, data: Partial<PermissionEntity>) => void;
  deletePermission: (id: string) => void;
  assignRoles: (userId: string, roleIds: string[]) => void;
  assignPermissions: (roleId: string, permissionIds: string[]) => void;
  addLog: (message: string) => void;
}
