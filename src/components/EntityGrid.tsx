import { useRef, useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { EntityCard } from './EntityCard';
import { ConnectionLines } from './ConnectionLines';
import type { EntityType } from '../types';

interface CardPosition {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function EntityGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Map<string, CardPosition>>(new Map());

  const users = useStore((s) => s.users);
  const roles = useStore((s) => s.roles);
  const permissions = useStore((s) => s.permissions);
  const selectedEntity = useStore((s) => s.selectedEntity);
  const assignMode = useStore((s) => s.assignMode);
  const selectEntity = useStore((s) => s.selectEntity);
  const enterAssignMode = useStore((s) => s.enterAssignMode);
  const confirmAssignment = useStore((s) => s.confirmAssignment);
  const deleteUser = useStore((s) => s.deleteUser);
  const deleteRole = useStore((s) => s.deleteRole);
  const deletePermission = useStore((s) => s.deletePermission);

  const updatePosition = useCallback(
    (key: string, el: HTMLDivElement | null) => {
      if (!el || !gridRef.current) return;
      const rect = el.getBoundingClientRect();
      const gridRect = gridRef.current.getBoundingClientRect();
      setPositions((prev) => {
        const next = new Map(prev);
        next.set(key, {
          id: key,
          type: el.dataset.type as EntityType,
          x: rect.left - gridRect.left + gridRef.current!.scrollLeft,
          y: rect.top - gridRect.top + gridRef.current!.scrollTop,
          width: rect.width,
          height: rect.height,
        });
        return next;
      });
    },
    []
  );

  const handleAssign = (id: string, type: EntityType, name: string) => {
    enterAssignMode(id, type, name);
  };

  const handleCardClick = (id: string, type: EntityType) => {
    if (assignMode) {
      if (assignMode.sourceId !== id || assignMode.sourceType !== type) {
        confirmAssignment(id, type);
      }
    } else {
      selectEntity({ id, type });
    }
  };

  const columnData = [
    { title: '用户', type: 'user' as EntityType, items: users.map((u) => ({ id: u.id, name: u.name })) },
    { title: '角色', type: 'role' as EntityType, items: roles.map((r) => ({ id: r.id, name: r.name })) },
    { title: '权限', type: 'permission' as EntityType, items: permissions.map((p) => ({ id: p.id, name: p.name })) },
  ];

  const handleDelete = {
    user: deleteUser,
    role: deleteRole,
    permission: deletePermission,
  };

  return (
    <div ref={gridRef} className="flex-1 overflow-auto relative p-6">
      {assignMode && (
        <div className="mb-4 px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
          分配模式: 选择一个{targetTypeLabel(assignMode.sourceType)}作为分配目标
          <button
            onClick={() => useStore.getState().exitAssignMode()}
            className="ml-3 underline"
          >
            取消
          </button>
        </div>
      )}

      <ConnectionLines positions={positions} />

      <div className="grid grid-cols-3 gap-6 relative z-10">
        {columnData.map((col) => (
          <div key={col.type}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {col.title}
            </h2>
            <div className="space-y-3">
              {col.items.map((item) => {
                const key = `${col.type}-${item.id}`;
                const isSelected =
                  selectedEntity?.id === item.id && selectedEntity?.type === col.type;
                const isAssigning =
                  assignMode !== null &&
                  assignMode.sourceId !== item.id;

                return (
                  <div
                    key={key}
                    data-type={col.type}
                    data-id={item.id}
                    ref={(el) => updatePosition(key, el)}
                  >
                    <EntityCard
                      id={item.id}
                      name={item.name}
                      type={col.type}
                      isSelected={isSelected}
                      isAssigning={isAssigning}
                      onClick={() => handleCardClick(item.id, col.type)}
                      onAssign={() => handleAssign(item.id, col.type, item.name)}
                      onDelete={() => handleDelete[col.type](item.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function targetTypeLabel(sourceType: EntityType): string {
  if (sourceType === 'user') return '角色';
  if (sourceType === 'role') return '权限';
  return '目标';
}