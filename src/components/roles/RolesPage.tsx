import { useState } from 'react';
import { RoleTable } from './RoleTable';
import { RoleModal } from './RoleModal';
import type { Role } from '../../types';

export function RolesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRole(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingRole(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Role Management</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search role name..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover"
          >
            + Add Role
          </button>
        </div>
      </div>

      <RoleTable onEdit={handleEdit} />

      <RoleModal isOpen={modalOpen} onClose={handleClose} role={editingRole} />
    </div>
  );
}
