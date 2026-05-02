import { create } from 'zustand';
import type { AppState, User, Role, PermissionEntity } from '../types';
import { SEED_USERS, SEED_ROLES, SEED_PERMISSIONS, SEED_LOGS } from '../mocks/data/seed';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useStore = create<AppState>((set, get) => ({
  users: SEED_USERS,
  roles: SEED_ROLES,
  permissions: SEED_PERMISSIONS,
  logs: SEED_LOGS,

  selectedEntity: null,
  operationLog: [],

  selectEntity: (entity) => set({ selectedEntity: entity }),

  addUser: (user) => {
    const newUser: User = {
      ...user,
      id: generateId(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    set((state) => ({ users: [...state.users, newUser] }));
    get().addLog(`创建用户: ${user.name}`);
  },

  updateUser: (id, data) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
    }));
    const name = get().users.find((u) => u.id === id)?.name;
    get().addLog(`更新用户: ${name}`);
  },

  deleteUser: (id) => {
    const user = get().users.find((u) => u.id === id);
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    }));
    get().addLog(`删除用户: ${user?.name}`);
  },

  addRole: (role) => {
    const newRole: Role = {
      ...role,
      id: generateId(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    set((state) => ({ roles: [...state.roles, newRole] }));
    get().addLog(`创建角色: ${role.name}`);
  },

  updateRole: (id, data) => {
    set((state) => ({
      roles: state.roles.map((r) => (r.id === id ? { ...r, ...data } : r)),
    }));
    const name = get().roles.find((r) => r.id === id)?.name;
    get().addLog(`更新角色: ${name}`);
  },

  deleteRole: (id) => {
    const role = get().roles.find((r) => r.id === id);
    set((state) => ({
      roles: state.roles.filter((r) => r.id !== id),
    }));
    get().addLog(`删除角色: ${role?.name}`);
  },

  addPermission: (permission) => {
    const newPerm: PermissionEntity = { ...permission, id: generateId() };
    set((state) => ({ permissions: [...state.permissions, newPerm] }));
    get().addLog(`创建权限: ${permission.name}`);
  },

  updatePermission: (id, data) => {
    set((state) => ({
      permissions: state.permissions.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
  },

  deletePermission: (id) => {
    const perm = get().permissions.find((p) => p.id === id);
    set((state) => ({
      permissions: state.permissions.filter((p) => p.id !== id),
    }));
    get().addLog(`删除权限: ${perm?.name}`);
  },

  assignRoles: (userId, roleIds) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, roleIds } : u)),
    }));
    const userName = get().users.find((u) => u.id === userId)?.name;
    get().addLog(`分配角色: ${userName}`);
  },

  assignPermissions: (roleId, permissionIds) => {
    set((state) => ({
      roles: state.roles.map((r) => (r.id === roleId ? { ...r, permissionIds } : r)),
    }));
    const roleName = get().roles.find((r) => r.id === roleId)?.name;
    get().addLog(`分配权限: ${roleName}`);
  },

  addLog: (message) =>
    set((state) => ({
      operationLog: [message, ...state.operationLog].slice(0, 3),
    })),
}));