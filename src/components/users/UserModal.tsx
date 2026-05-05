import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { useStore } from '../../store/useStore';
import type { User } from '../../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult?: (success: boolean, errorMessage?: string) => void;
  user?: User | null;
}

export function UserModal({ isOpen, onClose, onResult, user }: UserModalProps) {
  const [name, setName] = useState('');
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [status, setStatus] = useState(true);

  const roles = useStore((s) => s.roles);
  const fetchRolesFromApi = useStore((s) => s.fetchRolesFromApi);
  const addUser = useStore((s) => s.addUser);
  const updateUser = useStore((s) => s.updateUser);

  useEffect(() => {
    fetchRolesFromApi(1, 10000);
  }, [fetchRolesFromApi]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setRoleIds(user.roleIds);
      setStatus(user.status === 'active');
    } else {
      setName('');
      setRoleIds([]);
      setStatus(true);
    }
  }, [user, isOpen]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    let result: { success: boolean; error?: string };
    if (user) {
      result = await updateUser(user.id, {
        name: name.trim(),
        roleIds,
        status: status ? 'active' : 'inactive',
      });
    } else {
      result = await addUser({
        name: name.trim(),
        roleIds,
        permissionIds: [],
        status: status ? 'active' : 'inactive',
      });
    }
    onClose();
    onResult?.(result.success, result.error);
  };

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Create User'}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {user ? 'Save' : 'Create'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter username"
          maxLength={20}
        />
        <Select
          label="Role Assignment"
          value={roleIds}
          onChange={setRoleIds}
          options={roleOptions}
          placeholder="Select roles"
        />
        <div className="flex items-center gap-3">
          <Switch checked={status} onChange={setStatus} />
          <span className="text-sm text-gray-700">{status ? 'Active' : 'Inactive'}</span>
        </div>
      </div>
    </Modal>
  );
}
