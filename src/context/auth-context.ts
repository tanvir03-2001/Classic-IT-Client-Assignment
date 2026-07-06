import { createContext } from "react";
import type { User } from "../types";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const rolePermissions: Record<string, string[]> = {
  admin: ["*"],
  manager: [
    "products:read",
    "products:create",
    "products:update",
    "products:delete",
    "sales:read",
    "sales:create",
  ],
  employee: ["products:read", "sales:read", "sales:create"],
};

export const AuthContext = createContext<AuthContextType | null>(null);
