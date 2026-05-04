import { create } from 'zustand';
import type { AppState, User, Role, PermissionEntity } from '../types';
import { SEED_LOGS } from '../mocks/data/seed';
import { userApi, roleApi, permissionApi, mapBackendUserToUser, mapBackendRoleToRole, mapBackendPermissionToPermission } from '../api';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useStore = create<AppState>((set, get) => ({
  users: [],
  roles: [],
  permissions: [],
  logs: SEED_LOGS,

  selectedEntity: null,
  operationLog: [],

  // Pagination defaults
  usersTotal: 0,
  usersPage: 1,
  usersPageSize: 10,
  usersTotalPages: 1,

  // Role pagination
  rolesTotal: 0,
  rolesPage: 1,
  rolesPageSize: 10,
  rolesTotalPages: 1,

  selectEntity: (entity) => set({ selectedEntity: entity }),

  setUsers: (users) => set({ users }),

  setUsersPage: (page) => {
    get().fetchUsersFromApi(page, get().usersPageSize);
  },

  setUsersPageSize: (size: number) => {
    get().fetchUsersFromApi(1, size);
  },

  setRolesPage: (page) => {
    get().fetchRolesFromApi(page, get().rolesPageSize);
  },

  setRolesPageSize: (size: number) => {
    get().fetchRolesFromApi(1, size);
  },

  fetchUsersFromApi: async (page = 1, pageSize = 10) => {
    try {
      const paginatedData = await userApi.list({ page, page_size: pageSize });
      const mappedUsers = paginatedData.items.map(mapBackendUserToUser);
      set({
        users: mappedUsers,
        usersTotal: paginatedData.total,
        usersPage: paginatedData.page,
        usersPageSize: paginatedData.page_size,
        usersTotalPages: paginatedData.total_pages,
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },

  addUser: async (user) => {
    const newUser: User = {
      ...user,
      id: generateId(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    set((state) => ({ users: [...state.users, newUser] }));
    get().addLog(`Created user: ${user.name}`);
    try {
      await userApi.create({ username: user.name, email: `${user.name}@example.com` });
    } catch (error) {
      console.error('Failed to create user in backend:', error);
    }
  },

  updateUser: async (id, data) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
    }));
    const name = get().users.find((u) => u.id === id)?.name;
    get().addLog(`Updated user: ${name}`);
    try {
      const backendId = parseInt(id, 10);
      const updateData: any = {};
      if (data.name !== undefined) updateData.username = data.name;
      if (data.status !== undefined) updateData.is_active = data.status === 'active';
      await userApi.update(backendId, updateData);
    } catch (error) {
      console.error('Failed to update user in backend:', error);
    }
  },

  deleteUser: async (id) => {
    const user = get().users.find((u) => u.id === id);
    try {
      const backendId = parseInt(id, 10);
      await userApi.delete(backendId);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
      }));
      get().addLog(`Deleted user: ${user?.name}`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Delete failed';
      console.error('Failed to delete user in backend:', errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  fetchRolesFromApi: async (page = 1, pageSize = 10) => {
    try {
      const paginatedData = await roleApi.list({ page, page_size: pageSize });
      const mappedRoles = paginatedData.items.map(mapBackendRoleToRole);

      // Collect all unique permissions from roles response
      const allPerms: PermissionEntity[] = [];
      const seenPermIds = new Set<string>();
      for (const role of paginatedData.items) {
        for (const p of role.permissions || []) {
          if (!seenPermIds.has(String(p.id))) {
            seenPermIds.add(String(p.id));
            allPerms.push({
              id: String(p.id),
              name: p.name,
              key: p.key as PermissionEntity['key'],
            });
          }
        }
      }
      if (allPerms.length > 0) {
        set((state) => ({
          permissions: [...state.permissions, ...allPerms.filter((p) => !state.permissions.some((ep) => ep.id === p.id))],
        }));
      }

      set({
        roles: mappedRoles,
        rolesTotal: paginatedData.total,
        rolesPage: paginatedData.page,
        rolesPageSize: paginatedData.page_size,
        rolesTotalPages: paginatedData.total_pages,
      });
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  },

  fetchPermissionsFromApi: async () => {
    try {
      const backendPerms = await permissionApi.list();
      const mappedPerms = backendPerms.map(mapBackendPermissionToPermission);
      set({ permissions: mappedPerms });
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    }
  },

  addRole: (role) => {
    const newRole: Role = {
      ...role,
      id: generateId(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    set((state) => ({ roles: [...state.roles, newRole] }));
    get().addLog(`Created role: ${role.name}`);
  },

  updateRole: async (id, data) => {
    set((state) => ({
      roles: state.roles.map((r) => (r.id === id ? { ...r, ...data } : r)),
    }));
    const name = get().roles.find((r) => r.id === id)?.name;
    get().addLog(`Updated role: ${name}`);
    try {
      const backendId = parseInt(id, 10);
      const updateData: { name?: string; permission_ids?: number[] } = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.permissionIds !== undefined) {
        updateData.permission_ids = data.permissionIds.map((pid) => parseInt(pid, 10));
      }
      await roleApi.update(backendId, updateData);
    } catch (error) {
      console.error('Failed to update role in backend:', error);
    }
  },

  deleteRole: async (id) => {
    const role = get().roles.find((r) => r.id === id);
    try {
      const backendId = parseInt(id, 10);
      await roleApi.delete(backendId);
      set((state) => ({
        roles: state.roles.filter((r) => r.id !== id),
      }));
      get().addLog(`Deleted role: ${role?.name}`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Delete failed';
      console.error('Failed to delete role in backend:', errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  addPermission: (permission) => {
    const newPerm: PermissionEntity = { ...permission, id: generateId() };
    set((state) => ({ permissions: [...state.permissions, newPerm] }));
    get().addLog(`Created permission: ${permission.name}`);
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
    get().addLog(`Deleted permission: ${perm?.name}`);
  },

  assignRoles: (userId, roleIds) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, roleIds } : u)),
    }));
    const userName = get().users.find((u) => u.id === userId)?.name;
    get().addLog(`Assigned roles: ${userName}`);
  },

  assignPermissions: (roleId, permissionIds) => {
    set((state) => ({
      roles: state.roles.map((r) => (r.id === roleId ? { ...r, permissionIds } : r)),
    }));
    const roleName = get().roles.find((r) => r.id === roleId)?.name;
    get().addLog(`Assigned permissions: ${roleName}`);
  },

  addLog: (message) =>
    set((state) => ({
      operationLog: [message, ...state.operationLog].slice(0, 3),
    })),
}));