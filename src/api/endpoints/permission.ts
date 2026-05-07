import { apiClient } from '../client';
import type { ApiResponse } from './user';

export interface BackendPermission {
  id: number;
  name: string;
  key: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  assigned_roles_count?: number;
}

export interface PaginatedPermissionResponse {
  items: BackendPermission[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PermissionListParams {
  page?: number;
  page_size?: number;
  name?: string;
}

export const permissionApi = {
  list: async (params: PermissionListParams = {}): Promise<PaginatedPermissionResponse> => {
    const { page = 1, page_size = 10, name } = params;
    const searchParams = new URLSearchParams();
    searchParams.set('page', String(page));
    searchParams.set('page_size', String(page_size));
    if (name) searchParams.set('name', name);
    const url = `/permissions/?${searchParams.toString()}`;
    const response = await apiClient.get<ApiResponse<PaginatedPermissionResponse>>(url);
    return response.data.data;
  },
  getById: async (id: number): Promise<BackendPermission> => {
    const response = await apiClient.get<ApiResponse<BackendPermission>>(`/permissions/${id}`);
    return response.data.data;
  },
  create: async (data: { name: string; description?: string }): Promise<BackendPermission> => {
    const response = await apiClient.post<ApiResponse<BackendPermission>>('/permissions/', data);
    return response.data.data;
  },
  update: async (id: number, data: { name?: string; description?: string }): Promise<BackendPermission> => {
    const response = await apiClient.put<ApiResponse<BackendPermission>>(`/permissions/${id}`, data);
    return response.data.data;
  },
  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/permissions/${id}`);
  },
};
