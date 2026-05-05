import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Badge } from '../ui/Badge';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';
import type { User } from '../../types';

interface UserTableProps {
  onEdit: (user: User) => void;
}

export function UserTable({ onEdit }: UserTableProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const users = useStore((s) => s.users);
  const roles = useStore((s) => s.roles);
  const permissions = useStore((s) => s.permissions);
  const deleteUser = useStore((s) => s.deleteUser);

  const handleDelete = async (id: string, userName: string) => {
    setMessage(null);
    const result = await deleteUser(id);
    if (result.success) {
      setMessage({ type: 'success', text: `User "${userName}" deleted successfully` });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete user' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const getRoleNames = (roleIds: string[]) =>
    roleIds.map((id) => roles.find((r) => r.id === id)?.name || '').filter(Boolean);

  const getRolesDisplay = (user: User) => {
    if (user.roles && user.roles.length > 0) {
      return user.roles.map((r) => r.name);
    }
    return getRoleNames(user.roleIds);
  };

  const getPermNames = (permIds: string[]) =>
    permIds.map((id) => permissions.find((p) => p.id === id)?.name || '').filter(Boolean);

  const getPermissionsDisplay = (user: User) => {
    if (user.roles) {
      const permNames: string[] = [];
      for (const role of user.roles) {
        if (role.permissions) {
          for (const p of role.permissions) {
            if (!permNames.includes(p.name)) {
              permNames.push(p.name);
            }
          }
        }
      }
      return permNames;
    }
    return getPermNames(user.permissionIds);
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  return (
    <div className="overflow-x-auto">
      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>
        </div>
      )}
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-10">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Roles</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Permissions</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {getRolesDisplay(user).map((name) => (
                    <Tag key={name} color="blue">{name}</Tag>
                  ))}
                  {getRolesDisplay(user).length === 0 && <span className="text-gray-400 text-sm">-</span>}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {getPermissionsDisplay(user).map((name) => (
                    <Tag key={name} color="amber">{name}</Tag>
                  ))}
                  {getPermissionsDisplay(user).length === 0 && <span className="text-gray-400 text-sm">-</span>}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(user.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(user.id, user.name)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
