import { createFileRoute } from "@/shared/router/react-router-compat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout, PageHeader } from "@/layouts/dashboard-layout";
import { useAppSelector } from "@/app/store/hooks";
import { requireAuth } from "@/features/auth/services/route-guards";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";

export const Route = createFileRoute("/settings")({
  beforeLoad: requireAuth,
  head: () => ({ meta: [{ title: "Settings - Nexus" }] }),
  component: Settings,
});

function Settings() {
  const user = useAppSelector((state) => state.auth.user);
  const { logout } = useAuthActions();

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Authenticated profile and session controls."
      />
      <div className="space-y-4 p-6">
        <Section title="Profile">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={user?.name ?? ""} />
            <Field label="Email" value={user?.email ?? ""} />
          </div>
        </Section>
        <Section title="Session">
          <p className="text-sm text-muted-foreground">
            Refresh tokens are stored as secure backend cookies; access token state is isolated in
            Redux auth/session.
          </p>
          <Button
            variant="outline"
            disabled={logout.isPending}
            onClick={() => logout.mutate()}
            className="mt-4 border-border bg-secondary"
          >
            {logout.isPending ? "Signing out..." : "Sign out"}
          </Button>
        </Section>
      </div>
    </DashboardLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 elevated">
      <h2 className="text-sm font-medium">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} readOnly />
    </div>
  );
}
