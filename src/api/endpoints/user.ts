import { apiClient } from '../client';

export interface BackendUser {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
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
  list: async (params?: { page?: number; page_size?: number }): Promise<PaginatedUsersResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.page_size) searchParams.set('page_size', String(params.page_size));
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
