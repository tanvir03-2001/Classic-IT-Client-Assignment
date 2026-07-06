import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Users,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import Button from "./ui/Button";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/products", label: "Products", icon: Package, permission: "products:read" },
  { to: "/sales", label: "Sales", icon: ShoppingCart, permission: "sales:read", end: true },
  { to: "/sales/create", label: "Create Sale", icon: ShoppingCart, permission: "sales:create", end: true },
  { to: "/users", label: "Users", icon: Users, permission: "users:read" },
];

export default function Layout() {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredNav = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 transform bg-white border-r border-border transition-transform sm:w-64 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-12 items-center justify-between px-4 border-b border-border sm:h-16 sm:px-6">
          <h1 className="text-base font-bold text-primary sm:text-lg">Mini ERP</h1>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 p-3 sm:gap-1 sm:p-4">
          {filteredNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors sm:gap-3 sm:px-3 sm:py-2.5",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-3 sm:p-4">
          <div className="mb-2 px-2 sm:mb-3 sm:px-3">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted capitalize">{user?.role}</p>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-12 items-center gap-3 border-b border-border bg-white px-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-primary">Mini ERP</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
