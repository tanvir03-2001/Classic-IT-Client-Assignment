import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { salesApi } from "../api/sales";
import { Card, CardContent } from "../components/ui/Card";
import Pagination from "../components/ui/Pagination";
import { formatCurrency } from "../lib/utils";

export default function Sales() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["sales", page],
    queryFn: () => salesApi.getAll({ page, limit: 10 }),
  });

  const sales = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-3 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Sales History</h1>
        <p className="text-muted text-xs mt-0.5 sm:text-sm sm:mt-1">View all sales transactions</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : sales.length === 0 ? (
            <p className="text-center text-muted py-8 sm:py-12">No sales recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border text-left bg-secondary/50">
                    <th className="p-2 font-medium sm:p-4">Date</th>
                    <th className="p-2 font-medium sm:p-4">Items</th>
                    <th className="p-2 font-medium sm:p-4">Created By</th>
                    <th className="p-2 font-medium text-right sm:p-4">Grand Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => {
                    const createdBy =
                      sale.createdBy &&
                      typeof sale.createdBy === "object" &&
                      "name" in sale.createdBy
                        ? sale.createdBy.name
                        : "Unknown";

                    return (
                      <tr key={sale._id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                        <td className="p-2 sm:p-4">
                          {new Date(sale.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="p-2 sm:p-4">
                          <div className="space-y-0.5 sm:space-y-1">
                            {sale.items.map((item, idx) => (
                              <div key={idx} className="text-muted">
                                {item.productName} x{item.quantity} = {formatCurrency(item.subtotal)}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-2 text-muted sm:p-4">{createdBy}</td>
                        <td className="p-2 text-right font-semibold sm:p-4">
                          {formatCurrency(sale.grandTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {meta && (
        <Pagination page={page} meta={meta} onPageChange={setPage} />
      )}
    </div>
  );
}
