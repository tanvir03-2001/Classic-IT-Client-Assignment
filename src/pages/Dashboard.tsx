import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Pagination from "../components/ui/Pagination";
import { Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";
import { formatCurrency, getImageUrl } from "../lib/utils";

export default function Dashboard() {
  const [lowStockPage, setLowStockPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", lowStockPage],
    queryFn: () => dashboardApi.getStats({ page: lowStockPage, limit: 10 }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive py-12">
        Failed to load dashboard data.
      </div>
    );
  }

  const stats = data?.data;

  const statCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Total Sales",
      value: stats?.totalSales ?? 0,
      icon: ShoppingCart,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: DollarSign,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Low Stock Items",
      value: stats?.lowStockCount ?? 0,
      icon: AlertTriangle,
      color: "text-orange-600 bg-orange-50",
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Dashboard</h1>
        <p className="text-muted text-xs mt-0.5 sm:text-sm sm:mt-1">Overview of your inventory and sales</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="flex items-center gap-2 p-3 sm:gap-4 sm:p-6">
              <div className={`rounded-lg p-2 sm:p-3 ${card.color}`}>
                <card.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted truncate sm:text-sm">{card.title}</p>
                <p className="text-lg font-bold sm:text-2xl">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5 text-sm sm:gap-2 sm:text-base">
            <AlertTriangle className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
            <span className="leading-tight">Low Stock Products (Stock &lt; 5)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium sm:pb-3">Product</th>
                    <th className="pb-2 font-medium sm:pb-3">SKU</th>
                    <th className="pb-2 font-medium sm:pb-3">Category</th>
                    <th className="pb-2 font-medium text-right sm:pb-3">Stock</th>
                    <th className="pb-2 font-medium text-right sm:pb-3">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockProducts.map((product) => (
                    <tr key={product._id} className="border-b border-border last:border-0">
                      <td className="py-2 sm:py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {product.image && (
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="h-6 w-6 rounded object-cover sm:h-8 sm:w-8"
                            />
                          )}
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-2 text-muted sm:py-3">{product.sku}</td>
                      <td className="py-2 text-muted sm:py-3">{product.category}</td>
                      <td className="py-2 text-right sm:py-3">
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-1.5 py-0.5 text-xs font-medium text-orange-700 sm:px-2.5">
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="py-2 text-right sm:py-3">{formatCurrency(product.sellingPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted text-center py-6 sm:py-8">No low stock products. All good!</p>
          )}

          {stats?.lowStockMeta && (
            <div className="mt-4">
              <Pagination
                page={lowStockPage}
                meta={stats.lowStockMeta}
                onPageChange={setLowStockPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
