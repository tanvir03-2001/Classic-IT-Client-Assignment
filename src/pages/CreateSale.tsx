import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { salesApi } from "../api/sales";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ProductSearchSelect from "../components/ProductSearchSelect";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Plus, Trash2, ShoppingCart } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import type { Product, SaleItemInput } from "../types";

interface CartItem extends SaleItemInput {
  productData: Product;
}

export default function CreateSale() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (items: SaleItemInput[]) => salesApi.create(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Sale created successfully");
      navigate("/sales");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create sale";
      toast.error(message);
    },
  });

  const addToCart = () => {
    const product = selectedProduct;
    if (!product) {
      toast.error("Please select a product");
      return;
    }

    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    const existingInCart = cart.find((item) => item.product === product._id);
    const totalQty = (existingInCart?.quantity || 0) + quantity;

    if (totalQty > product.stockQuantity) {
      toast.error(`Insufficient stock. Available: ${product.stockQuantity}`);
      return;
    }

    if (existingInCart) {
      setCart((prev) =>
        prev.map((item) =>
          item.product === product._id ? { ...item, quantity: totalQty } : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        { product: product._id, quantity, productData: product },
      ]);
    }

    setSelectedProduct(null);
    setQuantity(1);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product !== productId));
  };

  const grandTotal = cart.reduce(
    (sum, item) => sum + item.productData.sellingPrice * item.quantity,
    0
  );

  const handleSubmit = () => {
    if (cart.length === 0) {
      toast.error("Add at least one product to the sale");
      return;
    }

    const items = cart.map(({ product, quantity }) => ({ product, quantity }));
    createMutation.mutate(items);
  };

  return (
    <div className="space-y-3 sm:space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Create Sale</h1>
        <p className="text-muted text-xs mt-0.5 sm:text-sm sm:mt-1">Select products and quantities to create a new sale</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <ProductSearchSelect
              value={selectedProduct}
              onChange={setSelectedProduct}
            />
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20 sm:w-24"
                placeholder="Qty"
              />
              <Button onClick={addToCart} className="flex-1 sm:flex-none">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5 sm:gap-2">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            Sale Items ({cart.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <p className="text-center text-muted py-6 sm:py-8">No items added yet.</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product}
                  className="flex items-center justify-between rounded-lg border border-border p-2.5 sm:p-4"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-sm sm:text-base truncate">{item.productData.name}</p>
                    <p className="text-xs text-muted sm:text-sm">
                      {formatCurrency(item.productData.sellingPrice)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 sm:gap-4">
                    <span className="font-semibold text-sm sm:text-base">
                      {formatCurrency(item.productData.sellingPrice * item.quantity)}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.product)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-border pt-3 mt-3 sm:pt-4 sm:mt-4">
                <span className="text-base font-bold sm:text-lg">Grand Total</span>
                <span className="text-xl font-bold text-primary sm:text-2xl">{formatCurrency(grandTotal)}</span>
              </div>

              <Button
                className="w-full mt-3 sm:mt-4"
                onClick={handleSubmit}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Processing..." : "Complete Sale"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
