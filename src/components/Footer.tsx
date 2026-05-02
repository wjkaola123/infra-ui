import { useStore } from '../store/useStore';

export function Footer() {
  const operationLog = useStore((s) => s.operationLog);

  return (
    <footer className="h-12 bg-white border-t border-gray-200 flex items-center px-6 gap-4">
      <span className="text-sm text-gray-400">最近操作:</span>
      <div className="flex-1 flex gap-3 overflow-hidden">
        {operationLog.length === 0 ? (
          <span className="text-sm text-gray-300">暂无操作</span>
        ) : (
          operationLog.map((log, i) => (
            <span key={i} className="text-sm text-gray-600 truncate">
              {log}
            </span>
          ))
        )}
      </div>
    </footer>
  );
}