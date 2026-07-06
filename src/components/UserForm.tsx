import { useState, type FormEvent, type ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "../api/users";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Label from "./ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { X } from "lucide-react";
import type { User, UserRole } from "../types";

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  {
    value: "admin",
    label: "Admin",
    description: "Full access — manage users, products, sales, and dashboard",
  },
  {
    value: "manager",
    label: "Manager",
    description: "Manage products, sales, and view dashboard",
  },
  {
    value: "employee",
    label: "Employee",
    description: "View products, create and view sales, view dashboard",
  },
];

interface UserFormProps {
  user?: User | null;
  currentUserId?: string;
  onClose: () => void;
}

export default function UserForm({ user, currentUserId, onClose }: UserFormProps) {
  const isEdit = !!user;
  const isSelf = isEdit && user._id === currentUserId;
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: (user?.role || "employee") as UserRole,
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (isEdit) {
        return usersApi.update(user!._id, {
          name: form.name,
          email: form.email,
          role: form.role,
        });
      }

      return usersApi.create({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(isEdit ? "User updated successfully" : "User created successfully");
      onClose();
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to save user";
      toast.error(message);
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isEdit && form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <Card className="w-full max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto rounded-b-none sm:rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEdit ? "Edit User" : "Add User"}</CardTitle>
          <button onClick={onClose} className="text-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {!isEdit && (
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            )}

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="role">Role / Permission *</Label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={isSelf}
                className="flex h-9 w-full rounded-md border border-border bg-white px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed sm:h-10 sm:px-3 sm:py-2"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted">
                {isSelf
                  ? "You cannot change your own role."
                  : roleOptions.find((o) => o.value === form.role)?.description}
              </p>
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
