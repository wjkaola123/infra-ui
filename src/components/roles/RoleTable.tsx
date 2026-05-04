import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Modal } from '../ui/Modal';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';
import type { Role } from '../../types';

interface RoleTableProps {
  onEdit: (role: Role) => void;
}

export function RoleTable({ onEdit }: RoleTableProps) {
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Role | null>(null);
  const roles = useStore((s) => s.roles);
  const users = useStore((s) => s.users);
  const deleteRole = useStore((s) => s.deleteRole);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setError(null);
    const result = await deleteRole(confirmDelete.id);
    setConfirmDelete(null);
    if (!result.success && result.error) {
      setError(result.error);
      setTimeout(() => setError(null), 3000);
    }
  };

  const getUserCount = (roleId: string) =>
    users.filter((u) => u.roleIds.includes(roleId)).length;

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-10">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Permissions</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned Users</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{role.name}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {role.permissions?.map((p) => (
                    <Tag key={p.id} color="green">{p.name}</Tag>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{getUserCount(role.id)}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{role.createdAt}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(role)}>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => setConfirmDelete(role)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Role"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete role <span className="font-semibold text-gray-900">{confirmDelete?.name}</span>?
          {confirmDelete && getUserCount(confirmDelete.id) > 0 && (
            <span className="block mt-2 text-amber-600">This role is assigned to {getUserCount(confirmDelete.id)} user(s).</span>
          )}
        </p>
      </Modal>
    </div>
  );
}
