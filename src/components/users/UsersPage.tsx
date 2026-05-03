import { useState, useEffect } from 'react';
import { UserTable } from './UserTable';
import { UserModal } from './UserModal';
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

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow">
        <div className="text-sm text-gray-500">
          Showing {(usersPage - 1) * usersPageSize + 1} to {Math.min(usersPage * usersPageSize, usersTotal)} of {usersTotal} users
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(usersPage - 1)}
            disabled={usersPage <= 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, usersTotalPages) }, (_, i) => {
              let pageNum: number;
              if (usersTotalPages <= 5) {
                pageNum = i + 1;
              } else if (usersPage <= 3) {
                pageNum = i + 1;
              } else if (usersPage >= usersTotalPages - 2) {
                pageNum = usersTotalPages - 4 + i;
              } else {
                pageNum = usersPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    pageNum === usersPage
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => handlePageChange(usersPage + 1)}
            disabled={usersPage >= usersTotalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      <UserModal isOpen={modalOpen} onClose={handleClose} user={editingUser} />
    </div>
  );
}
