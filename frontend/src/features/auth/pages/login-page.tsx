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
      <div className="w-full max-w-md">
        <form
          onSubmit={submit}
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-border/50
            bg-card/90
            backdrop-blur-xl
            p-8
            shadow-[0_20px_80px_rgba(0,0,0,0.12)]
            space-y-6
          "
        >
          {/* Decorative gradient */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[color:var(--accent-blue)] via-primary to-[color:var(--accent-violet)]" />

          {/* Brand */}
          <div className="flex flex-col items-center text-center">
            <div
              className="
                mb-5
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-[color:var(--accent-blue)]
                to-[color:var(--accent-violet)]
                shadow-lg
              "
            >
              <span className="text-lg font-bold text-white">AI</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue managing your AI assistants, documents, and workflows.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium">
              Email address
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              className="
                h-11
                border-border/60
                bg-background/60
                transition-all
                focus-visible:ring-2
                focus-visible:ring-primary/25
              "
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="font-medium">
              Password
            </Label>

            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="
                h-11
                border-border/60
                bg-background/60
                transition-all
                focus-visible:ring-2
                focus-visible:ring-primary/25
              "
            />
          </div>

          {/* Submit */}
          <Button
            disabled={login.isPending}
            className="
              h-11
              w-full
              font-medium
              shadow-lg
              transition-all
              duration-200
              hover:scale-[1.01]
              hover:shadow-xl
              bg-gradient-to-r
              from-[color:var(--accent-blue)]
              to-[color:var(--accent-violet)]
              text-primary-foreground
            "
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />

            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Continue with
            </span>

            <Separator className="flex-1" />
          </div>

          {/* Google */}
          <GoogleAuthButton
            text="signin_with"
            disabled={googleLogin.isPending}
            onToken={submitGoogle}
            onError={() => toast.error("Google login was cancelled or failed.")}
          />

          {/* Security Notice */}
          <div
            className="
              rounded-2xl
              border
              border-border/50
              bg-muted/30
              p-3
              text-center
            "
          >
            <p className="text-xs text-muted-foreground">
              Protected with enterprise-grade authentication, secure sessions, and encrypted
              communication.
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            New workspace?{" "}
            <Link
              to="/signup"
              className="
                font-medium
                text-primary
                transition-colors
                hover:text-primary/80
              "
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
