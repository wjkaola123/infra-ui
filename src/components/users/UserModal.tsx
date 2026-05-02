import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import type { User } from '../../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const [name, setName] = useState('');
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [permissionIds, setPermissionIds] = useState<string[]>([]);
  const [status, setStatus] = useState(true);

  const roles = useStore((s) => s.roles);
  const permissions = useStore((s) => s.permissions);
  const addUser = useStore((s) => s.addUser);
  const updateUser = useStore((s) => s.updateUser);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setRoleIds(user.roleIds);
      setPermissionIds(user.permissionIds);
      setStatus(user.status === 'active');
    } else {
      setName('');
      setRoleIds([]);
      setPermissionIds([]);
      setStatus(true);
    }
  }, [user, isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (user) {
      updateUser(user.id, {
        name: name.trim(),
        roleIds,
        permissionIds,
        status: status ? 'active' : 'inactive',
      });
    } else {
      addUser({
        name: name.trim(),
        roleIds,
        permissionIds,
        status: status ? 'active' : 'inactive',
      });
    }
    onClose();
  };

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }));
  const permOptions = permissions.map((p) => ({ value: p.id, label: p.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? '编辑用户' : '新增用户'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>{user ? '保存' : '创建'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="用户名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入用户名"
          maxLength={20}
        />
        <Select
          label="角色分配"
          value={roleIds}
          onChange={setRoleIds}
          options={roleOptions}
          placeholder="选择角色"
        />
        <Select
          label="直接权限"
          value={permissionIds}
          onChange={setPermissionIds}
          options={permOptions}
          placeholder="选择权限"
        />
        <div className="flex items-center gap-3">
          <Switch checked={status} onChange={setStatus} />
          <span className="text-sm text-gray-700">{status ? '启用' : '禁用'}</span>
        </div>
      </div>
    </Modal>
  );
}