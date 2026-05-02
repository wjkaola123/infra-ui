import type { EntityType } from '../types';

interface EntityCardProps {
  id: string;
  name: string;
  type: EntityType;
  isSelected: boolean;
  isAssigning: boolean;
  badge?: string;
  onClick: () => void;
  onAssign: () => void;
  onDelete: () => void;
}

const typeStyles = {
  user: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    label: '用户',
  },
  role: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700',
    label: '角色',
  },
  permission: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    label: '权限',
  },
};

export function EntityCard({
  name,
  type,
  isSelected,
  isAssigning,
  badge,
  onClick,
  onAssign,
  onDelete,
}: EntityCardProps) {
  const styles = typeStyles[type];

  return (
    <div
      className={`
        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-150
        ${styles.bg} ${styles.border}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${isAssigning ? 'ring-2 ring-orange-400 ring-offset-2 animate-pulse' : ''}
        hover:shadow-md
      `}
      onClick={onClick}
    >
      <button
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 rounded"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${styles.badge}`}>
          {styles.label}
        </span>
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {badge}
          </span>
        )}
      </div>

      <p className="font-medium text-gray-900">{name}</p>

      <button
        className="mt-3 w-full py-1.5 text-sm bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onAssign();
        }}
      >
        分配
      </button>
    </div>
  );
}