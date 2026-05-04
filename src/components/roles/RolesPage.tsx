import { useState, useEffect } from 'react';
import { RoleTable } from './RoleTable';
import { RoleModal } from './RoleModal';
import { Pagination } from '../ui/Pagination';
import { useStore } from '../../store/useStore';
import { roleApi } from '../../api';
import type { Role } from '../../types';

export function RolesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const rolesPage = useStore((s) => s.rolesPage);
  const rolesPageSize = useStore((s) => s.rolesPageSize);
  const rolesTotal = useStore((s) => s.rolesTotal);
  const rolesTotalPages = useStore((s) => s.rolesTotalPages);
  const setRolesPage = useStore((s) => s.setRolesPage);
  const setRolesPageSize = useStore((s) => s.setRolesPageSize);
  const fetchRolesFromApi = useStore((s) => s.fetchRolesFromApi);

  useEffect(() => {
    setRolesPage(1);
  }, [setRolesPage]);

  const handleEdit = async (role: Role) => {
    try {
      const backendRole = await roleApi.get(parseInt(role.id, 10));
      const mappedRole: Role = {
        id: String(backendRole.id),
        name: backendRole.name,
        permissionIds: backendRole.permissions.map((p) => String(p.id)),
        permissions: backendRole.permissions.map((p) => ({
          id: String(p.id),
          name: p.name,
          key: 'READ' as const,
        })),
        createdAt: backendRole.created_at,
      };
      setEditingRole(mappedRole);
      setModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch role:', error);
    }
  };

  const handleAdd = () => {
    setEditingRole(null);
    setModalOpen(true);
  };

  const handleSuccess = async (success: boolean, errorMessage?: string) => {
    if (success) {
      setNotification('Role saved successfully');
      await fetchRolesFromApi();
    } else {
      setNotification(errorMessage || 'Operation failed');
    }
    setTimeout(() => setNotification(null), 3000);
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
      {notification && (
        <div className={`p-3 border rounded-md ${notification.includes('success') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-sm ${notification.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{notification}</p>
        </div>
      )}
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

      <Pagination
        currentPage={rolesPage}
        totalPages={rolesTotalPages}
        totalItems={rolesTotal}
        pageSize={rolesPageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={setRolesPageSize}
      />

      <RoleModal isOpen={modalOpen} onClose={handleClose} role={editingRole} onSuccess={handleSuccess} />
    </div>
  );
}
