import { Link, useNavigate } from "@tanstack/react-router";
import { FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AuthLayout } from "@/layouts/auth-layout";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { GoogleAuthButton } from "../components/google-auth-button";
import { useAuthActions } from "../hooks/use-auth-actions";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuthActions();

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

  const submitGoogle = async (idToken: string) => {
    try {
      await googleLogin.mutateAsync(idToken);
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Google login failed. Try again."));
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
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>
        <GoogleAuthButton
          text="signin_with"
          disabled={googleLogin.isPending}
          onToken={submitGoogle}
          onError={() => toast.error("Google login was cancelled or failed.")}
        />
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
