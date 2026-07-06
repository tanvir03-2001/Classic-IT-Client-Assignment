import api from "./axios";
import type { ApiResponse, DashboardStats } from "../types";

export const dashboardApi = {
  getStats: async (params?: { page?: number; limit?: number }) => {
    const { data } = await api.get<ApiResponse<DashboardStats>>("/dashboard", { params });
    return data;
  },
};
