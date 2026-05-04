import { apiClient } from '../client';

export interface BackendPermission {
  id: number;
  name: string;
  key: string;
}

export const permissionApi = {
  list: async (): Promise<BackendPermission[]> => {
    const response = await apiClient.get<{ data: BackendPermission[] }>('/roles/permissions');
    return response.data.data;
  },
};
