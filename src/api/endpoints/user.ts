import { apiClient } from '../client';

export interface BackendUser {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
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
  list: async (): Promise<BackendUser[]> => {
    const response = await apiClient.get<ApiResponse<BackendUser[]>>('/users/');
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
