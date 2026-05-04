import { apiClient } from '../client';

export interface BackendRole {
  id: number;
  name: string;
  permission_ids: number[];
  permissions: Array<{ id: number; name: string; key: string }>;
  created_at: string;
  assigned_users_count?: number;
}

export interface PaginatedRolesResponse {
  items: BackendRole[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CreateRoleRequest {
  name: string;
  permission_ids?: number[];
}

export interface UpdateRoleRequest {
  name?: string;
  permission_ids?: number[];
}

export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}

export const roleApi = {
  list: async (params?: { page?: number; page_size?: number }): Promise<PaginatedRolesResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.page_size) searchParams.set('page_size', String(params.page_size));
    const queryString = searchParams.toString();
    const url = queryString ? `/roles/?${queryString}` : '/roles/';
    const response = await apiClient.get<ApiResponse<PaginatedRolesResponse>>(url);
    return response.data.data;
  },

  get: async (id: number): Promise<BackendRole> => {
    const response = await apiClient.get<ApiResponse<BackendRole>>(`/roles/${id}`);
    return response.data.data;
  },

  create: async (data: CreateRoleRequest): Promise<BackendRole> => {
    const response = await apiClient.post<ApiResponse<BackendRole>>('/roles/', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateRoleRequest): Promise<BackendRole> => {
    const response = await apiClient.put<ApiResponse<BackendRole>>(`/roles/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
  },

  assignPermissions: async (roleId: number, permissionIds: number[]): Promise<void> => {
    await apiClient.post(`/roles/${roleId}/permissions`, { permission_ids: permissionIds });
  },

  removePermission: async (roleId: number, permId: number): Promise<void> => {
    await apiClient.delete(`/roles/${roleId}/permissions/${permId}`);
  },
};
