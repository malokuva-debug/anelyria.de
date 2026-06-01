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
};
