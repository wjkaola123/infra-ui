import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { PermissionEntity } from '../../types';

interface PermissionTableProps {
  onEdit: (permission: PermissionEntity) => void;
}

export function PermissionTable({ onEdit }: PermissionTableProps) {
  const [confirmDelete, setConfirmDelete] = useState<PermissionEntity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const permissions = useStore((s) => s.permissions);
  const deletePermission = useStore((s) => s.deletePermission);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setError(null);
    const result = await deletePermission(confirmDelete.id);
    setConfirmDelete(null);
    if (result.success) {
      setSuccess('Permission deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } else if (result.error) {
      setError(result.error);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-10">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Permission Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned Roles</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {permissions.map((perm) => (
            <tr key={perm.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{perm.name}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{perm.assignedRolesCount ?? 0}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{perm.description || '-'}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(perm)}>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => setConfirmDelete(perm)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Permission"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete permission <span className="font-semibold text-gray-900">{confirmDelete?.name}</span>?
        </p>
      </Modal>
    </div>
  );
}
