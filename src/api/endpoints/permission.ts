import { apiClient } from '../client';
import type { ApiResponse } from './user';

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
  create: async (data: { name: string; description?: string }): Promise<BackendPermission> => {
    const response = await apiClient.post<ApiResponse<BackendPermission>>('/permissions/', data);
    return response.data.data;
  },
};
