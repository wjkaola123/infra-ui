export type Permission = 'READ' | 'CREATE' | 'UPDATE' | 'DELETE';

export interface User {
  id: string;
  name: string;
  roleIds: string[];
  permissionIds: string[];
}

export interface Role {
  id: string;
  name: string;
  permissionIds: string[];
}

export interface PermissionEntity {
  id: string;
  name: string;
  key: Permission;
}

export type EntityType = 'user' | 'role' | 'permission';

export interface Relation {
  id: string;
  sourceId: string;
  sourceType: EntityType;
  targetId: string;
  targetType: EntityType;
}

export type AssignMode = {
  sourceId: string;
  sourceType: EntityType;
  sourceName: string;
} | null;

export interface AppState {
  // Data
  users: User[];
  roles: Role[];
  permissions: PermissionEntity[];
  relations: Relation[];

  // UI State
  selectedEntity: { id: string; type: EntityType } | null;
  assignMode: AssignMode;
  operationLog: string[];

  // Actions
  selectEntity: (entity: { id: string; type: EntityType } | null) => void;
  enterAssignMode: (sourceId: string, sourceType: EntityType, sourceName: string) => void;
  exitAssignMode: () => void;
  confirmAssignment: (targetId: string, targetType: EntityType) => void;
  removeRelation: (relationId: string) => void;
  addUser: (name: string) => void;
  addRole: (name: string, permissionIds: string[]) => void;
  addPermission: (name: string, key: Permission) => void;
  deleteUser: (id: string) => void;
  deleteRole: (id: string) => void;
  deletePermission: (id: string) => void;
  resetSandbox: () => void;
  addLog: (message: string) => void;
}