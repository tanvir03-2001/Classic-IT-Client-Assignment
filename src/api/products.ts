import api from "./axios";
import type { ApiResponse, Product } from "../types";

export const productsApi = {
  getAll: async (params?: Record<string, string | number>) => {
    const { data } = await api.get<ApiResponse<Product[]>>("/products", { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return data;
  },

  create: async (formData: FormData) => {
    const { data } = await api.post<ApiResponse<Product>>("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (id: string, formData: FormData) => {
    const { data } = await api.put<ApiResponse<Product>>(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/products/${id}`);
    return data;
  },
};
