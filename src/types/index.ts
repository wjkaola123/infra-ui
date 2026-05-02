export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  roleIds: string[];
  permissionIds: string[];
  status: UserStatus;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  permissionIds: string[];
  createdAt: string;
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

  selectEntity: (entity: { id: string; type: EntityType } | null) => void;
  setUsers: (users: User[]) => void;
  fetchUsersFromApi: () => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addRole: (role: Omit<Role, 'id' | 'createdAt'>) => void;
  updateRole: (id: string, data: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  addPermission: (permission: Omit<PermissionEntity, 'id'>) => void;
  updatePermission: (id: string, data: Partial<PermissionEntity>) => void;
  deletePermission: (id: string) => void;
  assignRoles: (userId: string, roleIds: string[]) => void;
  assignPermissions: (roleId: string, permissionIds: string[]) => void;
  addLog: (message: string) => void;
}
