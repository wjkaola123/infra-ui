import { create } from 'zustand';
import type { AppState, EntityType, Permission } from '../types';
import { SEED_USERS, SEED_ROLES, SEED_PERMISSIONS, SEED_RELATIONS } from '../mocks/data/seed';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useStore = create<AppState>((set, get) => ({
  users: SEED_USERS,
  roles: SEED_ROLES,
  permissions: SEED_PERMISSIONS,
  relations: SEED_RELATIONS,

  selectedEntity: null,
  assignMode: null,
  operationLog: [],

  selectEntity: (entity) => set({ selectedEntity: entity }),

  enterAssignMode: (sourceId, sourceType, sourceName) =>
    set({ assignMode: { sourceId, sourceType, sourceName } }),

  exitAssignMode: () => set({ assignMode: null }),

  confirmAssignment: (targetId, targetType) => {
    const { assignMode, relations, addLog } = get();
    if (!assignMode) return;

    const exists = relations.some(
      (r) =>
        r.sourceId === assignMode.sourceId &&
        r.sourceType === assignMode.sourceType &&
        r.targetId === targetId &&
        r.targetType === targetType
    );

    if (exists) {
      addLog(`关系已存在，无需重复添加`);
      set({ assignMode: null });
      return;
    }

    const sourceName = assignMode.sourceName;
    const targetName =
      targetType === 'role'
        ? get().roles.find((r) => r.id === targetId)?.name
        : get().permissions.find((p) => p.id === targetId)?.name;

    const newRelation = {
      id: generateId(),
      sourceId: assignMode.sourceId,
      sourceType: assignMode.sourceType,
      targetId,
      targetType,
    };

    set((state) => ({
      relations: [...state.relations, newRelation],
      assignMode: null,
    }));

    addLog(`已分配: ${sourceName} → ${targetName}`);
  },

  removeRelation: (relationId) => {
    const { relations, addLog } = get();
    const rel = relations.find((r) => r.id === relationId);
    if (!rel) return;

    const sourceName =
      rel.sourceType === 'user'
        ? get().users.find((u) => u.id === rel.sourceId)?.name
        : get().roles.find((r) => r.id === rel.sourceId)?.name;
    const targetName =
      rel.targetType === 'role'
        ? get().roles.find((r) => r.id === rel.targetId)?.name
        : get().permissions.find((p) => p.id === rel.targetId)?.name;

    set((state) => ({
      relations: state.relations.filter((r) => r.id !== relationId),
    }));

    addLog(`已撤销: ${sourceName} → ${targetName}`);
  },

  addUser: (name) => {
    const id = generateId();
    set((state) => ({
      users: [...state.users, { id, name, roleIds: [], permissionIds: [] }],
    }));
    get().addLog(`已创建用户: ${name}`);
  },

  addRole: (name, permissionIds) => {
    const id = generateId();
    set((state) => ({
      roles: [...state.roles, { id, name, permissionIds }],
    }));
    get().addLog(`已创建角色: ${name}`);
  },

  addPermission: (name, key) => {
    const id = generateId();
    set((state) => ({
      permissions: [...state.permissions, { id, name, key }],
    }));
    get().addLog(`已创建权限: ${name}`);
  },

  deleteUser: (id) => {
    const user = get().users.find((u) => u.id === id);
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
      relations: state.relations.filter(
        (r) => !(r.sourceId === id && r.sourceType === 'user')
      ),
      selectedEntity:
        state.selectedEntity?.id === id ? null : state.selectedEntity,
    }));
    get().addLog(`已删除用户: ${user?.name}`);
  },

  deleteRole: (id) => {
    const role = get().roles.find((r) => r.id === id);
    set((state) => ({
      roles: state.roles.filter((r) => r.id !== id),
      relations: state.relations.filter(
        (r) => !(r.sourceId === id && r.sourceType === 'role')
      ),
      selectedEntity:
        state.selectedEntity?.id === id ? null : state.selectedEntity,
    }));
    get().addLog(`已删除角色: ${role?.name}`);
  },

  deletePermission: (id) => {
    const perm = get().permissions.find((p) => p.id === id);
    set((state) => ({
      permissions: state.permissions.filter((p) => p.id !== id),
      relations: state.relations.filter(
        (r) => !(r.targetId === id && r.targetType === 'permission')
      ),
      selectedEntity:
        state.selectedEntity?.id === id ? null : state.selectedEntity,
    }));
    get().addLog(`已删除权限: ${perm?.name}`);
  },

  resetSandbox: () => {
    set({
      users: SEED_USERS,
      roles: SEED_ROLES,
      permissions: SEED_PERMISSIONS,
      relations: SEED_RELATIONS,
      selectedEntity: null,
      assignMode: null,
      operationLog: [],
    });
    get().addLog(`沙盒已重置`);
  },

  addLog: (message) =>
    set((state) => ({
      operationLog: [message, ...state.operationLog].slice(0, 3),
    })),
}));