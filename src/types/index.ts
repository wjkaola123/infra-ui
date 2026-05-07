export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
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
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  assignedRolesCount?: number;
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

// Activity Log types (from Audit Log API)
export type ActivityLogAction = 'CREATE' | 'UPDATE' | 'DELETE';
export type ActivityLogResourceType = 'user' | 'role' | 'permission';

export interface ActivityLog {
  id: number;
  actor_user_id: number;
  actor_username: string;
  action: ActivityLogAction;
  resource_type: ActivityLogResourceType;
  resource_id: number;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  ip_address: string;
  created_at: string;
}

export interface ActivityLogFilters {
  page: number;
  page_size: number;
  actor_user_id?: number;
  resource_type?: ActivityLogResourceType;
  action?: ActivityLogAction;
  start_date?: string;
  end_date?: string;
}

export interface PaginatedActivityLogs {
  items: ActivityLog[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
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
  rolesForModal: Role[];

  // Permission pagination
  permissionsTotal: number;
  permissionsPage: number;
  permissionsPageSize: number;
  permissionsTotalPages: number;
  permissionsNameFilter: string;

  // Activity Log pagination
  activityLogs: ActivityLog[];
  activityLogsTotal: number;
  activityLogsPage: number;
  activityLogsPageSize: number;
  activityLogsTotalPages: number;
  activityLogsFilters: ActivityLogFilters;

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
  fetchRolesForModal: () => Promise<void>;
  setPermissionsPage: (page: number) => void;
  setPermissionsPageSize: (size: number) => void;
  setPermissionsNameFilter: (filter: string) => void;
  fetchPermissionsFromApi: (page?: number, pageSize?: number, nameFilter?: string) => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  updateUser: (id: string, data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  deleteUser: (id: string) => Promise<{ success: boolean; error?: string }>;
  addRole: (role: Omit<Role, 'id' | 'createdAt'>) => void;
  updateRole: (id: string, data: Partial<Role>) => void;
  deleteRole: (id: string) => Promise<{ success: boolean; error?: string }>;
  addPermission: (permission: { name: string; description?: string }) => Promise<{ success: boolean; error?: string }>;
  updatePermission: (id: string, data: { name?: string; description?: string }) => Promise<{ success: boolean; error?: string }>;
  deletePermission: (id: string) => Promise<{ success: boolean; error?: string }>;
  assignRoles: (userId: string, roleIds: string[]) => void;
  assignPermissions: (roleId: string, permissionIds: string[]) => void;
  addLog: (message: string) => void;
  fetchActivityLogsFromApi: (filters?: Partial<ActivityLogFilters>) => Promise<void>;
  setActivityLogsPage: (page: number) => void;
  setActivityLogsPageSize: (size: number) => void;
  setActivityLogsFilters: (filters: Partial<ActivityLogFilters>) => void;
}
