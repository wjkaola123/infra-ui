import type { User, Role, PermissionEntity, Relation } from '../../types';

export const SEED_USERS: User[] = [
  { id: 'u1', name: '张三', roleIds: ['r1'], permissionIds: [] },
  { id: 'u2', name: '李四', roleIds: ['r2'], permissionIds: [] },
  { id: 'u3', name: '王五', roleIds: ['r3'], permissionIds: [] },
];

export const SEED_ROLES: Role[] = [
  { id: 'r1', name: '查看者', permissionIds: ['p1'] },
  { id: 'r2', name: '编辑者', permissionIds: ['p2', 'p3'] },
  { id: 'r3', name: '管理员', permissionIds: ['p1', 'p2', 'p3', 'p4'] },
];

export const SEED_PERMISSIONS: PermissionEntity[] = [
  { id: 'p1', name: '读取', key: 'READ' },
  { id: 'p2', name: '创建', key: 'CREATE' },
  { id: 'p3', name: '更新', key: 'UPDATE' },
  { id: 'p4', name: '删除', key: 'DELETE' },
];

export const SEED_RELATIONS: Relation[] = [
  // User -> Role
  { id: 'rel1', sourceId: 'u1', sourceType: 'user', targetId: 'r1', targetType: 'role' },
  { id: 'rel2', sourceId: 'u2', sourceType: 'user', targetId: 'r2', targetType: 'role' },
  { id: 'rel3', sourceId: 'u3', sourceType: 'user', targetId: 'r3', targetType: 'role' },
  // Role -> Permission
  { id: 'rel4', sourceId: 'r1', sourceType: 'role', targetId: 'p1', targetType: 'permission' },
  { id: 'rel5', sourceId: 'r2', sourceType: 'role', targetId: 'p2', targetType: 'permission' },
  { id: 'rel6', sourceId: 'r2', sourceType: 'role', targetId: 'p3', targetType: 'permission' },
  { id: 'rel7', sourceId: 'r3', sourceType: 'role', targetId: 'p1', targetType: 'permission' },
  { id: 'rel8', sourceId: 'r3', sourceType: 'role', targetId: 'p2', targetType: 'permission' },
  { id: 'rel9', sourceId: 'r3', sourceType: 'role', targetId: 'p3', targetType: 'permission' },
  { id: 'rel10', sourceId: 'r3', sourceType: 'role', targetId: 'p4', targetType: 'permission' },
];