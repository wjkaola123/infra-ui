import { useState, useEffect } from 'react';
import { UserTable } from './UserTable';
import { UserModal } from './UserModal';
import { Pagination } from '../ui/Pagination';
import { useStore } from '../../store/useStore';
import type { User } from '../../types';
import { userApi } from '../../api/endpoints/user';
import { mapBackendUserToUser } from '../../api/mappers';

export function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const usersPage = useStore((s) => s.usersPage);
  const usersPageSize = useStore((s) => s.usersPageSize);
  const usersTotal = useStore((s) => s.usersTotal);
  const usersTotalPages = useStore((s) => s.usersTotalPages);
  const setUsersPage = useStore((s) => s.setUsersPage);
  const setUsersPageSize = useStore((s) => s.setUsersPageSize);

  const usersUsernameFilter = useStore((s) => s.usersUsernameFilter);
  const setUsersUsernameFilter = useStore((s) => s.setUsersUsernameFilter);

  useEffect(() => {
    setUsersPage(1);
  }, [setUsersPage]);

  const handleEdit = async (user: User) => {
    try {
      const backendUser = await userApi.get(parseInt(user.id, 10));
      const mappedUser = mapBackendUserToUser(backendUser);
      setEditingUser(mappedUser);
      setModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleResult = (success: boolean, errorMessage?: string) => {
    if (success) {
      setNotification('User saved successfully');
    } else {
      setNotification(errorMessage || 'Operation failed');
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUsersFromApi = useStore((s) => s.fetchUsersFromApi);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= usersTotalPages) {
      setUsersPage(newPage);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsersUsernameFilter(e.target.value);
  };

  return (
    <div className="space-y-4">
      {notification && (
        <div className={`p-3 border rounded-md ${notification.includes('success') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-sm ${notification.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{notification}</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search username..."
            value={usersUsernameFilter}
            onChange={handleSearchChange}
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

      <UserModal isOpen={modalOpen} onClose={handleClose} onResult={(success, error) => { handleResult(success, error); if (success) fetchUsersFromApi(usersPage, usersPageSize); }} user={editingUser} />
    </div>
  );
}
