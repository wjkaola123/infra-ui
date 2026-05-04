import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import type { Role } from '../../types';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
  onSuccess?: (success: boolean, errorMessage?: string) => void;
}

export function RoleModal({ isOpen, onClose, role, onSuccess }: RoleModalProps) {
  const [name, setName] = useState('');
  const [permissionIds, setPermissionIds] = useState<string[]>([]);

  const permissions = useStore((s) => s.permissions);
  const fetchPermissionsFromApi = useStore((s) => s.fetchPermissionsFromApi);
  const addRole = useStore((s) => s.addRole);
  const updateRole = useStore((s) => s.updateRole);
  const fetchRolesFromApi = useStore((s) => s.fetchRolesFromApi);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setPermissionIds(role.permissionIds);
    } else {
      setName('');
      setPermissionIds([]);
    }
  }, [role, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchPermissionsFromApi();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    let result;
    if (role) {
      result = await updateRole(role.id, { name: name.trim(), permissionIds });
    } else {
      result = await addRole({ name: name.trim(), permissionIds });
    }

    if (result.success) {
      await fetchRolesFromApi();
      onSuccess?.(true);
      onClose();
    } else {
      onSuccess?.(false, result.error);
    }
  };

  // 编辑时：下拉选项用 store 中的完整权限列表，选中状态用 role.permissionIds
  const permOptions = permissions.length > 0
    ? permissions.map((p) => ({ value: p.id, label: p.name }))
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={role ? 'Edit Role' : 'Create Role'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>{role ? 'Save' : 'Create'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Role Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter role name"
          maxLength={20}
        />
        <Select
          label="Permission Assignment"
          value={permissionIds}
          onChange={setPermissionIds}
          options={permOptions}
          placeholder="Select permissions"
        />
      </div>
    </Modal>
  );
}
