import { createFileRoute } from "@/shared/router/react-router-compat";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardLayout, PageHeader } from "@/layouts/dashboard-layout";
import { requireAuth } from "@/features/auth/services/route-guards";
import { useOperationalOverview } from "@/features/analytics/hooks/use-operational-overview";
import { OperationalIndicator } from "@/shared/components/ui/operational-indicator";

export const Route = createFileRoute("/analytics")({
  beforeLoad: requireAuth,
  head: () => ({ meta: [{ title: "Analytics - Nexus" }] }),
  component: Analytics,
});

function Analytics() {
  const { agents, infrastructure, metrics } = useOperationalOverview();
  const queue = infrastructure.data?.queues?.ingestion;
  const data = [
    { name: "Agents", value: metrics.activeAgents },
    { name: "Public", value: metrics.publicAgents },
    { name: "Queued", value: queue?.waiting ?? 0 },
    { name: "Active", value: queue?.active ?? 0 },
    { name: "Indexed", value: queue?.completed ?? 0 },
    { name: "Failed", value: queue?.failed ?? 0 },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Observability"
        title="Analytics"
        description="Operational metrics sourced from backend agents and infrastructure health."
      />
      <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Active agents" value={metrics.activeAgents} />
        <Metric label="Public runtimes" value={metrics.publicAgents} />
        <Metric label="Ingestion active" value={metrics.activeIngestion} />
        <Metric label="Indexed jobs" value={metrics.completedIngestion} />
      </div>
      <div className="grid gap-4 px-6 pb-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-5 elevated lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Operational distribution</p>
              <p className="text-xs text-muted-foreground">
                Live backend counts, no synthetic analytics series.
              </p>
            </div>
            <OperationalIndicator
              state={infrastructure.isFetching ? "processing" : "healthy"}
              label={infrastructure.isFetching ? "refreshing" : "synced"}
            />
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={data}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="value" fill="oklch(0.72 0.16 255)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5 elevated">
          <p className="text-sm font-medium">Runtime inventory</p>
          <ul className="mt-3 space-y-2">
            {agents.data?.map((agent) => (
              <li key={agent.id} className="rounded-lg border border-border bg-surface-1 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">{agent.name}</span>
                  <OperationalIndicator
                    state={agent.visibility === "public" ? "healthy" : "offline"}
                    label={agent.visibility}
                  />
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{agent.role}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardLayout>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 elevated">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-[11px] text-emerald-400">backend sourced</p>
    </div>
  );
}
