import { apiClient, setTokens, clearTokens } from '../client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/login', data);
    const tokens = response.data.data;
    setTokens(tokens.access_token, tokens.refresh_token);
    return tokens;
  },

  register: async (data: RegisterRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/register', data);
    const tokens = response.data.data;
    setTokens(tokens.access_token, tokens.refresh_token);
    return tokens;
  },

  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    const tokens = response.data.data;
    setTokens(tokens.access_token, tokens.refresh_token);
    return tokens;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refresh_token: refreshToken });
    clearTokens();
  },
};
