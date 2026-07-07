import { useState, type FormEvent, type ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productsApi } from "../api/products";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Label from "./ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import Modal from "./ui/Modal";
import { X } from "lucide-react";
import { getImageUrl } from "../lib/utils";
import {
  ALLOWED_IMAGE_LABEL,
  getApiErrorMessage,
  IMAGE_ACCEPT_ATTRIBUTE,
  MAX_IMAGE_SIZE_MB,
  validateImageFile,
} from "../lib/imageUpload";
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
  const [imageError, setImageError] = useState("");

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      isEdit ? productsApi.update(product!._id, formData) : productsApi.create(formData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      const savedSku = response.data.sku;
      const submittedSku = form.sku.trim().toUpperCase();

      if (!isEdit && savedSku !== submittedSku) {
        toast.success(`Product created successfully. SKU adjusted to ${savedSku}.`);
      } else {
        toast.success(isEdit ? "Product updated successfully" : "Product created successfully");
      }

      onClose();
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, "Failed to save product"));
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const error = validateImageFile(file);
    if (error) {
      setImage(null);
      setImageError(error);
      e.target.value = "";
      toast.error(error);
      return;
    }

    setImageError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isEdit && !image) {
      toast.error("Product image is required");
      return;
    }

    if (image) {
      const error = validateImageFile(image);
      if (error) {
        setImageError(error);
        toast.error(error);
        return;
      }
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
    <Modal onClose={onClose}>
      <Card className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl">
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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                {preview && (
                  <img
                    src={preview.startsWith("blob:") ? preview : getImageUrl(preview)}
                    alt="Preview"
                    className="h-12 w-12 rounded-lg object-cover border border-border sm:h-16 sm:w-16"
                  />
                )}
                <div className="flex-1 space-y-1">
                  <Input
                    type="file"
                    accept={IMAGE_ACCEPT_ATTRIBUTE}
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-muted">
                    Allowed: {ALLOWED_IMAGE_LABEL}. Max size: {MAX_IMAGE_SIZE_MB}MB.
                  </p>
                  {imageError && <p className="text-xs text-destructive">{imageError}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="space-y-1.5 sm:col-span-2 sm:space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input id="sku" name="sku" value={form.sku} onChange={handleChange} required />
                <p className="text-xs text-muted">
                  If SKU already exists, a unique SKU will be generated automatically.
                </p>
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
              <div className="space-y-1.5 col-span-1 sm:col-span-2 sm:space-y-2">
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
    </Modal>
  );
}
