import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, ExternalLink, Globe, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout, PageHeader } from "@/layouts/dashboard-layout";
import { requireAuth } from "@/features/auth/services/route-guards";
import { useAgents } from "@/features/agents/hooks/use-agents";
import { OperationalIndicator } from "@/shared/components/ui/operational-indicator";

export const Route = createFileRoute("/deployment")({
  beforeLoad: requireAuth,
  head: () => ({ meta: [{ title: "Deployment - Nexus" }] }),
  component: Deployment,
});

function Deployment() {
  const agents = useAgents();
  const publicAgents = agents.data?.filter((agent) => agent.visibility === "public") ?? [];
  const origin =
    typeof window === "undefined" ? "https://your-domain.example" : window.location.origin;
  const copyUrl = async (url: string) => {
    await navigator.clipboard?.writeText(url);
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Deploy"
        title="Deployment"
        description="Public bot routes and embed endpoints derived from live bot visibility."
        actions={
          <Button
            asChild
            className="bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
          >
            <Link to="/agents">Manage agents</Link>
          </Button>
        }
      />
      <div className="grid gap-4 p-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 elevated lg:col-span-2">
          <p className="text-sm font-medium">Public runtime URLs</p>
          <p className="text-xs text-muted-foreground">
            Set an agent to public in Bot Builder to expose `/bot/:botId`.
          </p>
          <div className="mt-3 space-y-2">
            {publicAgents.map((agent) => {
              const url = `${origin}/bot/${agent.id}`;

              return (
                <div
                  key={agent.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface-1 p-3"
                >
                  <Globe className="h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{agent.name}</p>
                    <code className="block truncate font-mono text-xs text-muted-foreground">
                      {url}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyUrl(url)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    aria-label={`Copy ${agent.name} public URL`}
                    title="Copy public URL"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <Link
                    to="/bot/$botId"
                    params={{ botId: agent.id }}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    aria-label={`Open ${agent.name} public bot`}
                    title="Open public bot"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
            {!publicAgents.length && (
              <div className="rounded-lg border border-border bg-surface-1 p-4 text-sm text-muted-foreground">
                No public deployments yet. Set an agent visibility to public in Bot Builder.
              </div>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 elevated">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Rocket className="h-4 w-4 text-primary" />
            Deployment status
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {agents.data?.map((agent) => (
              <li
                key={agent.id}
                className="flex items-center justify-between rounded-md border border-border bg-surface-1 p-2.5"
              >
                <span className="truncate">{agent.name}</span>
                <OperationalIndicator
                  state={agent.visibility === "public" ? "healthy" : "offline"}
                  label={agent.visibility === "public" ? "live" : "private"}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
