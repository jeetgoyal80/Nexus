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

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuthActions();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/.test(password)) {
      toast.error("Password needs 8+ characters with uppercase, lowercase, and a number.");
      return;
    }

    try {
      await signup.mutateAsync({
        name: `${form.get("first")} ${form.get("last")}`.trim(),
        email: String(form.get("email")),
        password,
      });
      navigate({ to: "/onboarding" });
    } catch {
      toast.error("Signup failed. Check your details and try again.");
    }
  };

  const submitGoogle = async (idToken: string) => {
    try {
      await googleLogin.mutateAsync(idToken);
      navigate({ to: "/onboarding" });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Google signup failed. Try again."));
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-xl border border-border bg-card p-6 elevated"
      >
        <div>
          <p className="text-2xl font-semibold tracking-tight">Create workspace</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Start operating AI agents with real backend auth.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="first">First name</Label>
            <Input id="first" name="first" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" name="last" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" minLength={8} required />
          <p className="text-xs text-muted-foreground">
            Use 8+ characters with uppercase, lowercase, and a number.
          </p>
        </div>
        <Button
          disabled={signup.isPending}
          className="w-full bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
        >
          {signup.isPending ? "Creating..." : "Create account"}
        </Button>
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>
        <GoogleAuthButton
          text="signup_with"
          disabled={googleLogin.isPending}
          onToken={submitGoogle}
          onError={() => toast.error("Google signup was cancelled or failed.")}
        />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
