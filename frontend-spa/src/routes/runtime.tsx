import { createFileRoute } from "@/shared/router/react-router-compat";
import { useQuery } from "@tanstack/react-query";
import { Cpu, Database, KeyRound, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout, PageHeader } from "@/layouts/dashboard-layout";
import { requireAuth } from "@/features/auth/services/route-guards";
import { getInfrastructureHealth } from "@/features/runtime/api/get-infrastructure-health";
import { OperationalIndicator } from "@/shared/components/ui/operational-indicator";

export const Route = createFileRoute("/runtime")({
  beforeLoad: requireAuth,
  head: () => ({ meta: [{ title: "Runtime - Nexus" }] }),
  component: Runtime,
});

function Runtime() {
  const health = useQuery({
    queryKey: ["runtime", "infrastructure-health"],
    queryFn: getInfrastructureHealth,
    refetchInterval: 10000,
  });
  const queue = health.data?.queues?.ingestion;

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Infrastructure"
        title="Runtime"
        description="Backend runtime health, ingestion workers, and Groq provider configuration."
      />
      <div className="grid gap-4 p-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 elevated">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Provider</p>
            </div>
            <OperationalIndicator
              state={health.isError ? "degraded" : "healthy"}
              label={health.isError ? "unreachable" : "API healthy"}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-primary/50 bg-primary/5 p-4 text-left">
              <div className="flex items-center justify-between">
                <KeyRound className="h-4 w-4 text-primary" />
                <span className="text-[10px] uppercase text-muted-foreground">Active</span>
              </div>
              <p className="mt-3 font-medium">Groq runtime</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Configured server-side through backend env
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface-1 p-4 text-left">
              <Database className="h-4 w-4 text-primary" />
              <p className="mt-3 font-medium">RAG service</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Retrieval called during chat orchestration
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="groq">Groq key status</Label>
            <div className="flex gap-2">
              <Input
                id="groq"
                type="password"
                value="managed by backend"
                readOnly
                className="font-mono"
              />
              <Button variant="outline" className="border-border bg-secondary">
                <ShieldCheck className="mr-1 h-4 w-4" />
                Server
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 elevated">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Worker health</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <KV k="Waiting" v={String(queue?.waiting ?? 0)} />
            <KV k="Active" v={String(queue?.active ?? 0)} />
            <KV k="Completed" v={String(queue?.completed ?? 0)} />
            <KV k="Failed" v={String(queue?.failed ?? 0)} />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-surface-1 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
      <p className="mt-1 font-mono text-sm">{v}</p>
    </div>
  );
}
