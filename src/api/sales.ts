import api from "./axios";
import type { ApiResponse, Sale, SaleItemInput } from "../types";

export const salesApi = {
  getAll: async (params?: Record<string, string | number>) => {
    const { data } = await api.get<ApiResponse<Sale[]>>("/sales", { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Sale>>(`/sales/${id}`);
    return data;
  },

  create: async (items: SaleItemInput[]) => {
    const { data } = await api.post<ApiResponse<Sale>>("/sales", { items });
    return data;
  },
};
