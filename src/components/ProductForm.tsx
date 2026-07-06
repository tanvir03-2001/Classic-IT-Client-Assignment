import { useState, type FormEvent, type ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productsApi } from "../api/products";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Label from "./ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { X } from "lucide-react";
import { getImageUrl } from "../lib/utils";
import type { Product } from "../types";

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const isEdit = !!product;
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    category: product?.category || "",
    purchasePrice: product?.purchasePrice?.toString() || "",
    sellingPrice: product?.sellingPrice?.toString() || "",
    stockQuantity: product?.stockQuantity?.toString() || "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(product?.image || "");

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      isEdit ? productsApi.update(product!._id, formData) : productsApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(isEdit ? "Product updated successfully" : "Product created successfully");
      onClose();
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to save product";
      toast.error(message);
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isEdit && !image) {
      toast.error("Product image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("sku", form.sku);
    formData.append("category", form.category);
    formData.append("purchasePrice", form.purchasePrice);
    formData.append("sellingPrice", form.sellingPrice);
    formData.append("stockQuantity", form.stockQuantity);
    if (image) formData.append("image", image);

    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <Card className="w-full max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto rounded-b-none sm:rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEdit ? "Edit Product" : "Add Product"}</CardTitle>
          <button onClick={onClose} className="text-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label>Product Image {!isEdit && "*"}</Label>
              <div className="flex items-center gap-3 sm:gap-4">
                {preview && (
                  <img
                    src={preview.startsWith("blob:") ? preview : getImageUrl(preview)}
                    alt="Preview"
                    className="h-12 w-12 rounded-lg object-cover border border-border sm:h-16 sm:w-16"
                  />
                )}
                <Input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 col-span-2 sm:space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input id="sku" name="sku" value={form.sku} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input id="category" name="category" value={form.category} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price *</Label>
                <Input id="purchasePrice" name="purchasePrice" type="number" step="0.01" min="0" value={form.purchasePrice} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="sellingPrice">Selling Price *</Label>
                <Input id="sellingPrice" name="sellingPrice" type="number" step="0.01" min="0" value={form.sellingPrice} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5 col-span-2 sm:space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                <Input id="stockQuantity" name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={handleChange} required />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : isEdit ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
