import { apiClient } from '../client';

export interface BackendRoleRef {
  id: number;
  name: string;
  description: string;
  permissions: Array<{ id: number; name: string; key: string }>;
  assigned_users_count: number;
  created_at: string;
  updated_at: string;
}

export interface BackendUser {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
  roles: BackendRoleRef[];
}

export interface PaginatedUsersResponse {
  items: BackendUser[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  is_active?: boolean;
}

export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}

export const userApi = {
  list: async (params?: { page?: number; page_size?: number; username?: string }): Promise<PaginatedUsersResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.page_size) searchParams.set('page_size', String(params.page_size));
    if (params?.username) searchParams.set('username', params.username);
    const queryString = searchParams.toString();
    const url = queryString ? `/users/?${queryString}` : '/users/';
    const response = await apiClient.get<ApiResponse<PaginatedUsersResponse>>(url);
    return response.data.data;
  },

  get: async (id: number): Promise<BackendUser> => {
    const response = await apiClient.get<ApiResponse<BackendUser>>(`/users/${id}`);
    return response.data.data;
  },

  create: async (data: CreateUserRequest): Promise<BackendUser> => {
    const response = await apiClient.post<ApiResponse<BackendUser>>('/users/', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateUserRequest): Promise<BackendUser> => {
    const response = await apiClient.put<ApiResponse<BackendUser>>(`/users/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
