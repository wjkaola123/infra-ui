import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { PermissionTable } from './PermissionTable';
import { PermissionModal } from './PermissionModal';
import { Pagination } from '../ui/Pagination';
import type { PermissionEntity } from '../../types';

export function PermissionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<PermissionEntity | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const permissionsNameFilter = useStore((s) => s.permissionsNameFilter);
  const setPermissionsNameFilter = useStore((s) => s.setPermissionsNameFilter);
  const permissionsPage = useStore((s) => s.permissionsPage);
  const permissionsTotalPages = useStore((s) => s.permissionsTotalPages);
  const permissionsTotal = useStore((s) => s.permissionsTotal);
  const permissionsPageSize = useStore((s) => s.permissionsPageSize);
  const setPermissionsPage = useStore((s) => s.setPermissionsPage);
  const setPermissionsPageSize = useStore((s) => s.setPermissionsPageSize);
  const fetchPermissionsFromApi = useStore((s) => s.fetchPermissionsFromApi);

  useEffect(() => {
    fetchPermissionsFromApi(1, permissionsPageSize, permissionsNameFilter);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleEdit = (permission: PermissionEntity) => {
    setEditingPermission(permission);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPermission(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingPermission(null);
  };

  const handleResult = (success: boolean, errorMessage?: string) => {
    if (success) {
      setNotification('Permission saved successfully');
      fetchPermissionsFromApi(permissionsPage, permissionsPageSize, permissionsNameFilter);
    } else {
      setNotification(errorMessage || 'Operation failed');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPermissionsNameFilter(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Permission Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search permissions..."
              value={permissionsNameFilter}
              onChange={handleSearchChange}
              className="px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {permissionsNameFilter && (
              <button
                type="button"
                onClick={() => setPermissionsNameFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover"
          >
            + Add Permission
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-3 border rounded-md ${notification.includes('success') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-sm ${notification.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{notification}</p>
        </div>
      )}

      <PermissionTable onEdit={handleEdit} />

      <Pagination
        currentPage={permissionsPage}
        totalPages={permissionsTotalPages}
        totalItems={permissionsTotal}
        pageSize={permissionsPageSize}
        onPageChange={setPermissionsPage}
        onPageSizeChange={setPermissionsPageSize}
      />

      <PermissionModal isOpen={modalOpen} onClose={handleClose} onResult={handleResult} permission={editingPermission} />
    </div>
  );
}