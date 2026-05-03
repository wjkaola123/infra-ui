export function Header() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">RB</span>
        </div>
        <h1 className="text-base font-semibold text-gray-900">Permission Management System</h1>
      </div>
    </header>
  );
}
