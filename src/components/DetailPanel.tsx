import { useStore } from '../store/useStore';
import { getEntityRelations } from '../utils/permissions';
import type { EntityType } from '../types';

export function DetailPanel() {
  const selectedEntity = useStore((s) => s.selectedEntity);
  const users = useStore((s) => s.users);
  const roles = useStore((s) => s.roles);
  const permissions = useStore((s) => s.permissions);
  const relations = useStore((s) => s.relations);
  const selectEntity = useStore((s) => s.selectEntity);
  const removeRelation = useStore((s) => s.removeRelation);

  if (!selectedEntity) return null;

  const { outgoing, incoming } = getEntityRelations(
    selectedEntity.id,
    selectedEntity.type,
    relations,
    users,
    roles,
    permissions
  );

  const entityName =
    selectedEntity.type === 'user'
      ? users.find((u) => u.id === selectedEntity.id)?.name
      : selectedEntity.type === 'role'
      ? roles.find((r) => r.id === selectedEntity.id)?.name
      : permissions.find((p) => p.id === selectedEntity.id)?.name;

  const typeLabel = { user: '用户', role: '角色', permission: '权限' }[selectedEntity.type];

  const getRelatedName = (rel: typeof outgoing[0]) => {
    if (rel.targetType === 'role') return roles.find((r) => r.id === rel.targetId)?.name;
    if (rel.targetType === 'permission')
      return permissions.find((p) => p.id === rel.targetId)?.name;
    return users.find((u) => u.id === rel.targetId)?.name;
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{typeLabel}</p>
          <p className="font-semibold text-gray-900">{entityName}</p>
        </div>
        <button
          onClick={() => selectEntity(null)}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {outgoing.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              分配给 ({outgoing.length})
            </h3>
            <div className="space-y-2">
              {outgoing.map((rel) => (
                <div
                  key={rel.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm">
                    {rel.targetType === 'role' ? '角色' : '权限'}: {getRelatedName(rel)}
                  </span>
                  <button
                    onClick={() => removeRelation(rel.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    撤销
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {incoming.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              被关联于 ({incoming.length})
            </h3>
            <div className="space-y-2">
              {incoming.map((rel) => {
                const sourceName =
                  rel.sourceType === 'user'
                    ? users.find((u) => u.id === rel.sourceId)?.name
                    : roles.find((r) => r.id === rel.sourceId)?.name;
                return (
                  <div key={rel.id} className="p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm">
                      {rel.sourceType === 'user' ? '用户' : '角色'}: {sourceName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {outgoing.length === 0 && incoming.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">暂无关联关系</p>
        )}
      </div>
    </div>
  );
}