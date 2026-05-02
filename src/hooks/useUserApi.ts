import { useState, useCallback } from 'react';
import { userApi, mapBackendUserToUser, mapUserToBackendCreate } from '../api';
import { useStore } from '../store/useStore';
import type { User } from '../types';

export const useUserApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { users, setUsers, addUser: addUserToStore, updateUser: updateUserInStore, deleteUser: deleteUserFromStore } = useStore();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const paginatedData = await userApi.list();
      const mappedUsers = paginatedData.items.map(mapBackendUserToUser);
      setUsers(mappedUsers);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [setUsers]);

  const createUser = useCallback(async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const backendData = mapUserToBackendCreate(userData);
      const newBackendUser = await userApi.create(backendData);
      const newUser = mapBackendUserToUser(newBackendUser);
      addUserToStore({
        name: newUser.name,
        roleIds: [],
        permissionIds: [],
        status: newUser.status,
      });
    } catch (e: any) {
      setError(e.message || 'Failed to create user');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [addUserToStore]);

  const updateUser = useCallback(async (id: string, userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const backendId = parseInt(id, 10);
      const backendData: any = {};
      if (userData.name !== undefined) backendData.username = userData.name;
      if (userData.status !== undefined) backendData.is_active = userData.status === 'active';
      await userApi.update(backendId, backendData);
      updateUserInStore(id, userData);
    } catch (e: any) {
      setError(e.message || 'Failed to update user');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [updateUserInStore]);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const backendId = parseInt(id, 10);
      await userApi.delete(backendId);
      deleteUserFromStore(id);
    } catch (e: any) {
      setError(e.message || 'Failed to delete user');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [deleteUserFromStore]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
