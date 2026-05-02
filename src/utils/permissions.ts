import type { User, Role, PermissionEntity, Relation, EntityType } from '../types';

export function getUserPermissions(
  userId: string,
  users: User[],
  roles: Role[],
  permissions: PermissionEntity[],
  relations: Relation[]
): PermissionEntity[] {
  const user = users.find((u) => u.id === userId);
  if (!user) return [];

  // 直接分配的权限
  const directPermIds = user.permissionIds;

  // 通过角色获得的权限 - 从关系中查找用户关联的角色
  const userRoleIds = relations
    .filter((r) => r.sourceId === userId && r.sourceType === 'user' && r.targetType === 'role')
    .map((r) => r.targetId);

  // 从角色-权限关系获取权限
  const rolePermissionIds = relations
    .filter(
      (r) =>
        r.sourceType === 'role' &&
        r.targetType === 'permission' &&
        userRoleIds.includes(r.sourceId)
    )
    .map((r) => r.targetId);

  const allPermIds = new Set([...directPermIds, ...rolePermissionIds]);

  return permissions.filter((p) => allPermIds.has(p.id));
}

export function getEntityRelations(
  entityId: string,
  entityType: EntityType,
  relations: Relation[],
  users: User[],
  roles: Role[],
  permissions: PermissionEntity[]
) {
  const outgoing = relations.filter(
    (r) => r.sourceId === entityId && r.sourceType === entityType
  );

  const incoming = relations.filter(
    (r) => r.targetId === entityId && r.targetType === entityType
  );

  return { outgoing, incoming };
}