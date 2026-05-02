import { useState } from 'react';
import { UserTable } from './UserTable';
import { UserModal } from './UserModal';
import type { User } from '../../types';

export function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">用户管理</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="搜索用户名..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover"
          >
            + 新增用户
          </button>
        </div>
      </div>

      <UserTable onEdit={handleEdit} />

      <UserModal isOpen={modalOpen} onClose={handleClose} user={editingUser} />
    </div>
  );
}