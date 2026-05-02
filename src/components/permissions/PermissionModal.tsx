import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import type { PermissionEntity, Permission } from '../../types';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission?: PermissionEntity | null;
}

const PERMISSION_OPTIONS: { key: Permission; label: string }[] = [
  { key: 'READ', label: '读取 (READ)' },
  { key: 'WRITE', label: '写入 (WRITE)' },
  { key: 'DELETE', label: '删除 (DELETE)' },
  { key: 'ADMIN', label: '管理 (ADMIN)' },
];

export function PermissionModal({ isOpen, onClose, permission }: PermissionModalProps) {
  const [name, setName] = useState('');
  const [key, setKey] = useState<Permission>('READ');

  const addPermission = useStore((s) => s.addPermission);
  const updatePermission = useStore((s) => s.updatePermission);

  useEffect(() => {
    if (permission) {
      setName(permission.name);
      setKey(permission.key);
    } else {
      setName('');
      setKey('READ');
    }
  }, [permission, isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (permission) {
      updatePermission(permission.id, { name: name.trim(), key });
    } else {
      addPermission({ name: name.trim(), key });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={permission ? '编辑权限' : '新增权限'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>{permission ? '保存' : '创建'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="权限名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="如：用户管理"
          maxLength={20}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">权限标识</label>
          <select
            value={key}
            onChange={(e) => setKey(e.target.value as Permission)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {PERMISSION_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}