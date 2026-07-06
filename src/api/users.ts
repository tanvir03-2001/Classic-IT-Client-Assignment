import api from "./axios";
import type { ApiResponse, User, UserRole } from "../types";

export interface UserFormPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export const usersApi = {
  getAll: async (params?: Record<string, string | number>) => {
    const { data } = await api.get<ApiResponse<User[]>>("/auth/users", { params });
    return data;
  },

  create: async (payload: UserFormPayload) => {
    const { data } = await api.post<ApiResponse<User>>("/auth/users", payload);
    return data;
  },

  update: async (id: string, payload: Partial<UserFormPayload>) => {
    const { data } = await api.put<ApiResponse<User>>(`/auth/users/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/auth/users/${id}`);
    return data;
  },
};
