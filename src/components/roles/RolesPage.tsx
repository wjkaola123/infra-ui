import { useState, useEffect } from 'react';
import { RoleTable } from './RoleTable';
import { RoleModal } from './RoleModal';
import { useStore } from '../../store/useStore';
import type { Role } from '../../types';

export function RolesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const rolesPage = useStore((s) => s.rolesPage);
  const rolesPageSize = useStore((s) => s.rolesPageSize);
  const rolesTotal = useStore((s) => s.rolesTotal);
  const rolesTotalPages = useStore((s) => s.rolesTotalPages);
  const setRolesPage = useStore((s) => s.setRolesPage);
  const setRolesPageSize = useStore((s) => s.setRolesPageSize);

  useEffect(() => {
    setRolesPage(1);
  }, [setRolesPage]);

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= rolesTotalPages) {
      setRolesPage(newPage);
    }
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

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing {(rolesPage - 1) * rolesPageSize + 1} to {Math.min(rolesPage * rolesPageSize, rolesTotal)} of {rolesTotal} roles
          </div>
          <select
            value={rolesPageSize}
            onChange={(e) => setRolesPageSize(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(rolesPage - 1)}
            disabled={rolesPage <= 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, rolesTotalPages) }, (_, i) => {
              let pageNum: number;
              if (rolesTotalPages <= 5) {
                pageNum = i + 1;
              } else if (rolesPage <= 3) {
                pageNum = i + 1;
              } else if (rolesPage >= rolesTotalPages - 2) {
                pageNum = rolesTotalPages - 4 + i;
              } else {
                pageNum = rolesPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    pageNum === rolesPage
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => handlePageChange(rolesPage + 1)}
            disabled={rolesPage >= rolesTotalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      <RoleModal isOpen={modalOpen} onClose={handleClose} role={editingRole} />
    </div>
  );
}
