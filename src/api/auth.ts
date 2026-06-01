import { apiRequest } from './client';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantSlug?: string;
    tenantName?: string;
    isSuperAdmin?: boolean;
  };
}

export const authApi = {
  login: (credentials: { email: string; password: any }) =>
    apiRequest<LoginResponse>('/auth/login', 'POST', credentials),

  builderLogin: (credentials: { email: string; password: any }) =>
    apiRequest<LoginResponse>('/auth/builder-login', 'POST', credentials),

  forgotPassword: (data: { email: string }) =>
    apiRequest<{ message: string }>('/auth/forgot-password', 'POST', data),

  resetPassword: (data: { token: string; password: string }) =>
    apiRequest<{ message: string }>('/auth/reset-password', 'POST', data),
};