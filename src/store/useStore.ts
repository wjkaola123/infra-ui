import { create } from 'zustand';
import type { AppState, User, Role, PermissionEntity, Permission } from '../types';
import { userApi, roleApi, permissionApi, mapBackendUserToUser, mapBackendRoleToRole, mapBackendPermissionToPermission } from '../api';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useStore = create<AppState>((set, get) => ({
  users: [],
  roles: [],
  permissions: [],
  logs: [],

  selectedEntity: null,
  operationLog: [],

  // User pagination defaults
  usersTotal: 0,
  usersPage: 1,
  usersPageSize: 10,
  usersTotalPages: 1,
  usersUsernameFilter: '',

  setUsersUsernameFilter: (filter: string) => {
    set({ usersUsernameFilter: filter });
    get().fetchUsersFromApi(1, get().usersPageSize, filter);
  },

  setUsersPage: (page) => {
    get().fetchUsersFromApi(page, get().usersPageSize, get().usersUsernameFilter);
  },

  setUsersPageSize: (size: number) => {
    get().fetchUsersFromApi(1, size, get().usersUsernameFilter);
  },

  // Role pagination
  rolesTotal: 0,
  rolesPage: 1,
  rolesPageSize: 10,
  rolesTotalPages: 1,
  rolesForModal: [],

  // Permission pagination
  permissionsTotal: 0,
  permissionsPage: 1,
  permissionsPageSize: 10,
  permissionsTotalPages: 1,
  permissionsNameFilter: '',

  selectEntity: (entity) => set({ selectedEntity: entity }),

  setUsers: (users) => set({ users }),

  setRolesPage: (page) => {
    get().fetchRolesFromApi(page, get().rolesPageSize, get().rolesNameFilter);
  },

  setRolesPageSize: (size: number) => {
    get().fetchRolesFromApi(1, size, get().rolesNameFilter);
  },

  rolesNameFilter: '',

  setRolesNameFilter: (filter: string) => {
    set({ rolesNameFilter: filter });
    get().fetchRolesFromApi(1, get().rolesPageSize, filter);
  },

  setPermissionsPage: (page) => {
    get().fetchPermissionsFromApi(page, get().permissionsPageSize, get().permissionsNameFilter);
  },

  setPermissionsPageSize: (size) => {
    get().fetchPermissionsFromApi(1, size, get().permissionsNameFilter);
  },

  setPermissionsNameFilter: (filter: string) => {
    set({ permissionsNameFilter: filter });
    get().fetchPermissionsFromApi(1, get().permissionsPageSize, filter);
  },

  fetchUsersFromApi: async (page = 1, pageSize = 10, usernameFilter?: string) => {
    try {
      const paginatedData = await userApi.list({ page, page_size: pageSize, username: usernameFilter });
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
      await userApi.create({
        username: user.name,
        email: user.email,
        password: user.password,
        role_ids: user.roleIds?.map((rid) => parseInt(rid, 10)),
      });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Create failed';
      console.error('Failed to create user in backend:', errorMessage);
      return { success: false, error: errorMessage };
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
      if (data.email !== undefined) updateData.email = data.email;
      if (data.password !== undefined && data.password) updateData.password = data.password;
      if (data.status !== undefined) updateData.is_active = data.status === 'active';
      if (data.roleIds !== undefined) updateData.role_ids = data.roleIds.map((rid) => parseInt(rid, 10));
      await userApi.update(backendId, updateData);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Update failed';
      console.error('Failed to update user in backend:', errorMessage);
      return { success: false, error: errorMessage };
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
      get().fetchUsersFromApi(get().usersPage, get().usersPageSize, get().usersUsernameFilter);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Delete failed';
      console.error('Failed to delete user in backend:', errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  fetchRolesFromApi: async (page = 1, pageSize = 10, nameFilter?: string) => {
    try {
      const paginatedData = await roleApi.list({ page, page_size: pageSize, name: nameFilter });
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

  fetchPermissionsFromApi: async (page = 1, pageSize = 20, nameFilter?: string) => {
    try {
      const paginatedData = await permissionApi.list({ page, page_size: pageSize, name: nameFilter });
      const mappedPerms = paginatedData.items.map(mapBackendPermissionToPermission);
      set({
        permissions: mappedPerms,
        permissionsTotal: paginatedData.total,
        permissionsPage: paginatedData.page,
        permissionsPageSize: paginatedData.page_size,
        permissionsTotalPages: paginatedData.total_pages,
      });
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    }
  },

  addRole: async (role) => {
    try {
      const backendRole = await roleApi.create({
        name: role.name,
        permission_ids: role.permissionIds.map((pid) => parseInt(pid, 10)),
      });
      const newRole: Role = {
        ...role,
        id: String(backendRole.id),
        createdAt: backendRole.created_at.replace('T', ' ').substring(0, 19),
      };
      set((state) => ({ roles: [...state.roles, newRole] }));
      get().addLog(`Created role: ${role.name}`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Create failed';
      console.error('Failed to create role:', errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  fetchRolesForModal: async () => {
    try {
      const paginatedData = await roleApi.list({ page: 1, page_size: 100 });
      const mappedRoles = paginatedData.items.map(mapBackendRoleToRole);
      set({ rolesForModal: mappedRoles });
    } catch (error) {
      console.error('Failed to fetch roles for modal:', error);
    }
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
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Update failed';
      console.error('Failed to update role in backend:', errorMessage);
      return { success: false, error: errorMessage };
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

  addPermission: async (permission: { name: string; description?: string }) => {
    try {
      const backendPerm = await permissionApi.create({
        name: permission.name,
        description: permission.description,
      });
      const newPerm: PermissionEntity = {
        id: String(backendPerm.id),
        name: backendPerm.name,
        key: (backendPerm.key as Permission) || 'READ',
      };
      set((state) => ({ permissions: [...state.permissions, newPerm] }));
      get().addLog(`Created permission: ${permission.name}`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Create failed';
      console.error('Failed to create permission:', errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  updatePermission: async (id, data: { name?: string; description?: string }) => {
    try {
      const backendPerm = await permissionApi.update(Number(id), data);
      set((state) => ({
        permissions: state.permissions.map((p) =>
          p.id === id ? { ...p, name: backendPerm.name, description: backendPerm.description } : p
        ),
      }));
      get().addLog(`Updated permission: ${data.name || backendPerm.name}`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Update failed';
      console.error('Failed to update permission:', errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  deletePermission: async (id) => {
    const perm = get().permissions.find((p) => p.id === id);
    try {
      await permissionApi.remove(Number(id));
      set((state) => ({
        permissions: state.permissions.filter((p) => p.id !== id),
      }));
      get().addLog(`Deleted permission: ${perm?.name}`);
      get().fetchPermissionsFromApi(get().permissionsPage, get().permissionsPageSize, get().permissionsNameFilter);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Delete failed';
      console.error('Failed to delete permission:', errorMessage);
      return { success: false, error: errorMessage };
    }
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