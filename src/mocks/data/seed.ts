import type { User, Role, PermissionEntity, OperationLog } from '../../types';

export const SEED_PERMISSIONS: PermissionEntity[] = [
  { id: 'p1', name: '读取', key: 'READ' },
  { id: 'p2', name: '创建', key: 'WRITE' },
  { id: 'p3', name: '更新', key: 'WRITE' },
  { id: 'p4', name: '删除', key: 'DELETE' },
];

export const SEED_ROLES: Role[] = [
  { id: 'r1', name: '超级管理员', permissionIds: ['p1', 'p2', 'p3', 'p4'], createdAt: '2024-01-01 00:00:00' },
  { id: 'r2', name: '查看者', permissionIds: ['p1'], createdAt: '2024-01-02 00:00:00' },
  { id: 'r3', name: '编辑者', permissionIds: ['p1', 'p2', 'p3'], createdAt: '2024-01-03 00:00:00' },
];

export const SEED_USERS: User[] = [
  { id: 'u1', name: 'admin', roleIds: ['r1'], permissionIds: [], status: 'active', createdAt: '2024-01-01 00:00:00' },
  { id: 'u2', name: '张三', roleIds: ['r2'], permissionIds: [], status: 'active', createdAt: '2024-01-15 10:30:00' },
  { id: 'u3', name: '李四', roleIds: ['r3'], permissionIds: [], status: 'active', createdAt: '2024-02-01 14:20:00' },
  { id: 'u4', name: '王五', roleIds: [], permissionIds: [], status: 'inactive', createdAt: '2024-03-10 09:00:00' },
];

export const SEED_LOGS: OperationLog[] = [
  { id: 'l1', timestamp: '2024-03-15 14:30:00', operator: 'admin', action: 'create', targetType: 'user', targetName: '王五', detail: '新建用户王五' },
  { id: 'l2', timestamp: '2024-03-15 15:00:00', operator: 'admin', action: 'assign', targetType: 'role', targetName: '编辑者', detail: '为用户李四分配角色编辑者' },
  { id: 'l3', timestamp: '2024-03-16 09:15:00', operator: 'admin', action: 'delete', targetType: 'user', targetName: '测试用户', detail: '删除用户测试用户' },
];