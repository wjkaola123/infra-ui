import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { PermissionEntity } from '../../types';

interface PermissionTableProps {
  onEdit: (permission: PermissionEntity) => void;
}

export function PermissionTable({ onEdit }: PermissionTableProps) {
  const permissions = useStore((s) => s.permissions);
  const roles = useStore((s) => s.roles);
  const deletePermission = useStore((s) => s.deletePermission);

  const getRoleCount = (permId: string) =>
    roles.filter((r) => r.permissionIds.includes(permId)).length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-10">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Permission Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Permission Key</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned Roles</th>
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
              <td className="px-4 py-3">
                <Badge variant="default">{perm.key}</Badge>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{getRoleCount(perm.id)}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(perm)}>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => deletePermission(perm.id)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
