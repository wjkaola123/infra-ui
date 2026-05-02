import { clearTokens, getUsername } from '../../api';

export function Header() {
  const handleLogout = () => {
    clearTokens();
    window.location.hash = '#/login';
    window.location.reload();
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">RB</span>
        </div>
        <h1 className="text-base font-semibold text-gray-900">权限管理系统</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">当前用户: {getUsername()}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          退出
        </button>
      </div>
    </header>
  );
}
