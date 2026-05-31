import { Link, useNavigate } from "@tanstack/react-router";
import { FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/layouts/auth-layout";
import { useAuthActions } from "../hooks/use-auth-actions";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthActions();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await login.mutateAsync({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Login failed. Check your email and password.");
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-xl border border-border bg-card p-6 elevated"
      >
        <div>
          <p className="text-2xl font-semibold tracking-tight">Sign in</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Restore your runtime control plane session.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@company.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="********" required />
        </div>
        <Button
          disabled={login.isPending}
          className="w-full bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
        >
          {login.isPending ? "Signing in..." : "Sign in"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New workspace?{" "}
          <Link to="/signup" className="text-primary">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
