import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/useAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Package } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful");
      navigate("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-3 sm:p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 sm:mb-4 sm:h-12 sm:w-12">
            <Package className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
          </div>
          <CardTitle className="text-xl sm:text-2xl">Mini ERP</CardTitle>
          <p className="text-xs text-muted sm:text-sm">Inventory & Sales Management</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@erp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 rounded-lg bg-secondary p-3 text-xs text-muted sm:mt-6 sm:p-4">
            <p className="font-medium mb-1.5 sm:mb-2">Demo Credentials:</p>
            <p>Admin: admin@erp.com / admin123</p>
            <p>Manager: manager@erp.com / manager123</p>
            <p>Employee: employee@erp.com / employee123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
