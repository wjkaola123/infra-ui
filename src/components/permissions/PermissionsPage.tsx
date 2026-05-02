import { useState } from 'react';
import { PermissionTable } from './PermissionTable';
import { PermissionModal } from './PermissionModal';
import type { PermissionEntity } from '../../types';

export function PermissionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<PermissionEntity | null>(null);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Permission Management</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search permissions..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover"
          >
            + Add Permission
          </button>
        </div>
      </div>

      <PermissionTable onEdit={handleEdit} />

      <PermissionModal isOpen={modalOpen} onClose={handleClose} permission={editingPermission} />
    </div>
  );
}
