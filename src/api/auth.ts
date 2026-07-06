import api from "./axios";
import type { ApiResponse, LoginResponse, User } from "../types";

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
      email,
      password,
    });
    return data;
  },

  getMe: async () => {
    const { data } = await api.get<ApiResponse<User>>("/auth/me");
    return data;
  },
};
