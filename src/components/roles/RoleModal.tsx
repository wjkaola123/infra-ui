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
}

export function RoleModal({ isOpen, onClose, role }: RoleModalProps) {
  const [name, setName] = useState('');
  const [permissionIds, setPermissionIds] = useState<string[]>([]);

  const permissions = useStore((s) => s.permissions);
  const fetchPermissionsFromApi = useStore((s) => s.fetchPermissionsFromApi);
  const addRole = useStore((s) => s.addRole);
  const updateRole = useStore((s) => s.updateRole);

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

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (role) {
      updateRole(role.id, { name: name.trim(), permissionIds });
    } else {
      addRole({ name: name.trim(), permissionIds });
    }
    onClose();
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
