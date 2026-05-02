import { useStore } from '../store/useStore';

export function Header() {
  const resetSandbox = useStore((s) => s.resetSandbox);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">RB</span>
        </div>
        <h1 className="text-lg font-semibold text-gray-900">权限管理演示</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">模拟用户: 管理员</span>
        <button
          onClick={resetSandbox}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
        >
          重置沙盒
        </button>
      </div>
    </header>
  );
}