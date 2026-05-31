import { Link } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  Database,
  MessagesSquare,
  Rocket,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { DashboardLayout, PageHeader } from "@/layouts/dashboard-layout";
import { OperationalIndicator } from "@/shared/components/ui/operational-indicator";
import { useOperationalOverview } from "../hooks/use-operational-overview";

const emptySeries = Array.from({ length: 12 }).map((_, i) => ({
  t: `${i * 2}:00`,
  runtime: 0,
  retrieval: 0,
}));

export function DashboardPage() {
  const { agents, infrastructure, metrics } = useOperationalOverview();
  const liveSeries = (agents.data?.length ? agents.data : []).slice(0, 12).map((agent, index) => ({
    t: agent.name.slice(0, 10),
    runtime: index + 1,
    retrieval: agent.visibility === "public" ? 2 : 1,
  }));
  const series = liveSeries.length ? liveSeries : emptySeries;
  const queue = infrastructure.data?.queues?.ingestion;
  const bars = [
    { d: "Waiting", v: queue?.waiting ?? 0 },
    { d: "Active", v: queue?.active ?? 0 },
    { d: "Completed", v: queue?.completed ?? 0 },
    { d: "Failed", v: queue?.failed ?? 0 },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace overview"
        title="Control center"
        description="Realtime view of agents, ingestion queues, public runtimes, and infrastructure health."
        actions={
          <Button
            asChild
            className="bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
          >
            <Link to="/agents/new">
              New agent <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={Bot}
          label="Active agents"
          value={String(metrics.activeAgents)}
          delta={`${metrics.publicAgents} public`}
        />
        <Metric
          icon={Rocket}
          label="Public deployments"
          value={String(metrics.publicAgents)}
          delta="runtime exposed"
        />
        <Metric
          icon={Database}
          label="Ingestion queue"
          value={String(metrics.activeIngestion)}
          delta={`${metrics.completedIngestion} indexed`}
        />
        <Metric
          icon={Activity}
          label="Runtime health"
          value={metrics.runtimeHealth === "healthy" ? "Online" : "Degraded"}
          delta={metrics.failedIngestion ? `${metrics.failedIngestion} failed jobs` : "watching"}
        />
      </div>

      <div className="grid gap-4 px-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 elevated lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Runtime topology</p>
              <p className="text-xs text-muted-foreground">
                Live agent footprint from backend state
              </p>
            </div>
            <OperationalIndicator
              state={infrastructure.isError ? "degraded" : "healthy"}
              label={infrastructure.isError ? "API degraded" : "API live"}
            />
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={series}>
                <XAxis
                  dataKey="t"
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
                <Area
                  dataKey="runtime"
                  stroke="oklch(0.72 0.16 255)"
                  fill="oklch(0.72 0.16 255 / 0.18)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="retrieval"
                  stroke="oklch(0.68 0.18 295)"
                  fill="oklch(0.68 0.18 295 / 0.12)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 elevated">
          <p className="text-sm font-medium">Deployments</p>
          <p className="text-xs text-muted-foreground">Public bot runtime exposure</p>
          <ul className="mt-4 space-y-3 text-sm">
            {agents.data?.slice(0, 6).map((agent) => (
              <li
                key={agent.id}
                className="flex items-center justify-between rounded-lg border border-border bg-surface-1 px-3 py-2"
              >
                <span className="font-mono text-xs">{agent.name}</span>
                <OperationalIndicator
                  state={agent.visibility === "public" ? "healthy" : "offline"}
                  label={agent.visibility}
                />
              </li>
            ))}
            {!agents.data?.length && (
              <li className="rounded-lg border border-border bg-surface-1 px-3 py-6 text-center text-xs text-muted-foreground">
                No agents returned by the backend yet.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 px-6 py-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <p className="text-sm font-medium">Knowledge ingestion</p>
          <p className="text-xs text-muted-foreground">
            Queue state from `/api/health/infrastructure`
          </p>
          <div className="mt-4 h-56">
            <ResponsiveContainer>
              <BarChart data={bars}>
                <XAxis
                  dataKey="d"
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
                <Bar dataKey="v" fill="oklch(0.72 0.16 255)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-medium">Operational feed</p>
          <ul className="mt-4 space-y-3 text-sm">
            <ActivityItem
              icon={Activity}
              text={
                infrastructure.isFetching
                  ? "Refreshing infrastructure health"
                  : "Infrastructure health synced"
              }
            />
            <ActivityItem
              icon={Database}
              text={`${metrics.activeIngestion} ingestion jobs active or queued`}
            />
            <ActivityItem
              icon={MessagesSquare}
              text="Chat runtime connected through backend `/chat/:botId`"
            />
            {infrastructure.isError && (
              <ActivityItem icon={AlertTriangle} text="Infrastructure endpoint is unavailable" />
            )}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 elevated">
      <div className="flex items-center justify-between">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[11px] text-emerald-400">{delta}</span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ActivityItem({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div>
        <p className="text-sm">{text}</p>
        <p className="text-xs text-muted-foreground">live telemetry</p>
      </div>
    </li>
  );
}
