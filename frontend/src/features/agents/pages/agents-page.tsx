import { Link } from "@tanstack/react-router";
import { Bot, MoreHorizontal, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout, PageHeader } from "@/layouts/dashboard-layout";
import { SectionSkeleton } from "@/shared/components/loaders/section-skeleton";
import { OperationalIndicator } from "@/shared/components/ui/operational-indicator";
import { useAgents } from "../hooks/use-agents";
import type { Agent } from "../types/agent.types";

export function AgentsPage() {
  const agents = useAgents();

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Agents"
        description="Configure, deploy and observe AI runtimes from backend state."
        actions={
          <Button
            asChild
            className="bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
          >
            <Link to="/agents/new">
              <Plus className="mr-1 h-4 w-4" />
              New agent
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Filter agents" className="h-9 pl-8 bg-secondary/60" />
        </div>
        <OperationalIndicator
          state={agents.isFetching ? "processing" : "healthy"}
          label={agents.isFetching ? "syncing" : "backend synced"}
        />
      </div>

      <div className="p-6">
        {agents.isLoading && <SectionSkeleton rows={4} />}
        {agents.isError && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-8 text-sm text-destructive">
            Agents could not be loaded from the backend.
          </div>
        )}
        {!agents.isLoading && !agents.data?.length && (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <Bot className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No agents yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create the first runtime configuration to activate the workspace.
            </p>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agents.data?.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link
      to="/agents/$agentId"
      params={{ agentId: agent.id }}
      className="group relative rounded-xl border border-border bg-card p-5 elevated transition hover:border-primary/40"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--accent-blue)]/30 to-[color:var(--accent-violet)]/30 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium leading-none">{agent.name}</p>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">{agent.id}</p>
          </div>
        </div>
        <button className="rounded-md p-1 text-muted-foreground opacity-0 transition hover:bg-secondary hover:text-foreground group-hover:opacity-100">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <Stat k="Tone" v={agent.tone} />
        <Stat k="Visibility" v={agent.visibility} />
        <Stat k="Mode" v={agent.strictKnowledgeMode ? "strict" : "hybrid"} />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
        <span className="max-w-[65%] truncate text-muted-foreground">
          {agent.description || agent.role}
        </span>
        <OperationalIndicator
          state={agent.visibility === "public" ? "healthy" : "offline"}
          label={agent.visibility === "public" ? "deployed" : "private"}
        />
      </div>
    </Link>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-surface-1 px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
      <p className="mt-0.5 truncate text-xs font-medium">{v}</p>
    </div>
  );
}
