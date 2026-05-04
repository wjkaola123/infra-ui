import { useState, useEffect } from 'react';
import { UserTable } from './UserTable';
import { UserModal } from './UserModal';
import { Pagination } from '../ui/Pagination';
import { useStore } from '../../store/useStore';
import type { User } from '../../types';

export function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const usersPage = useStore((s) => s.usersPage);
  const usersPageSize = useStore((s) => s.usersPageSize);
  const usersTotal = useStore((s) => s.usersTotal);
  const usersTotalPages = useStore((s) => s.usersTotalPages);
  const setUsersPage = useStore((s) => s.setUsersPage);
  const setUsersPageSize = useStore((s) => s.setUsersPageSize);

  useEffect(() => {
    setUsersPage(1);
  }, [setUsersPage]);

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= usersTotalPages) {
      setUsersPage(newPage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search username..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover"
          >
            + Add User
          </button>
        </div>
      </div>

      <UserTable onEdit={handleEdit} />

      <Pagination
        currentPage={usersPage}
        totalPages={usersTotalPages}
        totalItems={usersTotal}
        pageSize={usersPageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={setUsersPageSize}
      />

      <UserModal isOpen={modalOpen} onClose={handleClose} user={editingUser} />
    </div>
  );
}
