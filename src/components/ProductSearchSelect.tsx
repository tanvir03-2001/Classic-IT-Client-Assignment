import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search, X } from "lucide-react";
import { productsApi } from "../api/products";
import Input from "./ui/Input";
import { cn, formatCurrency } from "../lib/utils";
import type { Product } from "../types";

interface ProductSearchSelectProps {
  value: Product | null;
  onChange: (product: Product | null) => void;
}

export default function ProductSearchSelect({ value, onChange }: ProductSearchSelectProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isFetching } = useQuery({
    queryKey: ["products-picker", searchQuery],
    queryFn: () =>
      productsApi.getAll({
        ...(searchQuery ? { search: searchQuery } : {}),
        limit: 100,
      }),
    enabled: open,
  });

  const results = (data?.data || []).filter((p) => p.stockQuantity > 0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (product: Product) => {
    onChange(product);
    setSearchInput("");
    setSearchQuery("");
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setSearchInput("");
    setSearchQuery("");
    setOpen(false);
  };

  const toggleDropdown = () => setOpen((prev) => !prev);

  if (value) {
    return (
      <div className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-border bg-white px-3 text-sm">
        <span className="flex-1 truncate">
          {value.name} ({value.sku}) - Stock: {value.stockQuantity} -{" "}
          {formatCurrency(value.sellingPrice)}
        </span>
        <button
          type="button"
          onClick={handleClear}
          className="shrink-0 rounded p-0.5 text-muted hover:bg-secondary hover:text-foreground"
          aria-label="Clear selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted pointer-events-none" />
        <Input
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search or select from list..."
          className="pl-9 pr-10"
        />
        <button
          type="button"
          onClick={toggleDropdown}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:bg-secondary hover:text-foreground"
          aria-label="Toggle product list"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
      </div>

      {open && (
        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-white shadow-lg">
          {isFetching ? (
            <p className="p-3 text-sm text-muted">Loading products...</p>
          ) : results.length === 0 ? (
            <p className="p-3 text-sm text-muted">
              {searchInput.trim() ? "No products found" : "No products in stock"}
            </p>
          ) : (
            <>
              {!searchInput.trim() && (
                <p className="border-b border-border px-3 py-2 text-xs font-medium text-muted">
                  All products ({results.length})
                </p>
              )}
              {results.map((product) => (
                <button
                  key={product._id}
                  type="button"
                  className="w-full border-b border-border px-3 py-2.5 text-left text-sm last:border-0 hover:bg-secondary/60"
                  onClick={() => handleSelect(product)}
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="text-muted">
                    {" "}
                    ({product.sku}) - Stock: {product.stockQuantity} -{" "}
                    {formatCurrency(product.sellingPrice)}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
