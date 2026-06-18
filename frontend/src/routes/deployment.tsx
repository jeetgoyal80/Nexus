import { createFileRoute, Link } from "@tanstack/react-router";
import type React from "react";
import { CheckCircle2, Copy, ExternalLink, KeyRound, Rocket, TerminalSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardLayout, PageHeader } from "@/layouts/dashboard-layout";
import { requireAuth } from "@/features/auth/services/route-guards";
import { useAgents, useAgentMutations } from "@/features/agents/hooks/use-agents";
import type { Agent } from "@/features/agents/types/agent.types";
import { OperationalIndicator } from "@/shared/components/ui/operational-indicator";
import { env } from "@/shared/lib/env";

export const Route = createFileRoute("/deployment")({
  beforeLoad: requireAuth,
  head: () => ({ meta: [{ title: "Deployment Center - Nexus" }] }),
  component: Deployment,
});

function Deployment() {
  const agents = useAgents();
  const mutations = useAgentMutations();
  const frontendOrigin =
    typeof window === "undefined" ? "http://localhost:5173" : window.location.origin;

  const copyText = async (value: string, label: string) => {
    await navigator.clipboard?.writeText(value);
    toast.success(`${label} copied`);
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Deploy"
        title="Deployment Center"
        description="Deploy bots locally, generate public URLs, and copy SDK/API integration code."
        actions={
          <Button
            asChild
            className="bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
          >
            <Link to="/agents">Manage agents</Link>
          </Button>
        }
      />

      <div className="grid gap-4 p-6">
        {agents.data?.map((agent) => (
          <DeploymentCard
            key={agent.id}
            agent={agent}
            frontendOrigin={frontendOrigin}
            apiBaseUrl={env.apiBaseUrl}
            onCopy={copyText}
            onDeploy={() => mutations.deploy.mutate(agent.id)}
            onUnpublish={() => mutations.unpublish.mutate(agent.id)}
            busy={mutations.deploy.isPending || mutations.unpublish.isPending}
          />
        ))}

        {!agents.data?.length && (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground elevated">
            No agents yet. Create an agent before deploying.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function DeploymentCard({
  agent,
  frontendOrigin,
  apiBaseUrl,
  onCopy,
  onDeploy,
  onUnpublish,
  busy,
}: {
  agent: Agent;
  frontendOrigin: string;
  apiBaseUrl: string;
  onCopy: (value: string, label: string) => void;
  onDeploy: () => void;
  onUnpublish: () => void;
  busy: boolean;
}) {
  const isDeployed = agent.deploymentStatus === "deployed" && agent.visibility === "public";
  const publicUrl = `${frontendOrigin}/bot/${agent.id}`;
  const sdkSnippet = `npm install @nexus-ai/react-sdk

import { ChatBot } from "@nexus-ai/react-sdk";

<ChatBot
  botId="${agent.id}"
  publicKey="${agent.publicKey ?? "pk_test_xxxxx"}"
  mode="${agent.deploymentMode === "widget" ? "widget" : agent.deploymentMode}"
/>`;
  const apiSnippet = `curl -X POST ${apiBaseUrl}/public/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "botId": "${agent.id}",
    "publicKey": "${agent.publicKey ?? "pk_test_xxxxx"}",
    "message": "What is PPO policy?"
  }'`;

  return (
    <section className="rounded-xl border border-border bg-card p-5 elevated">
      <div className="flex flex-col gap-3 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">{agent.name}</h2>
            <OperationalIndicator
              state={isDeployed ? "healthy" : "offline"}
              label={isDeployed ? "deployed" : "draft"}
            />
            <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
              {agent.deploymentMode}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{agent.description || "No description"}</p>
        </div>
        <div className="flex gap-2">
          {isDeployed ? (
            <Button variant="outline" onClick={onUnpublish} disabled={busy}>
              Unpublish
            </Button>
          ) : (
            <Button onClick={onDeploy} disabled={busy}>
              <Rocket className="mr-2 h-4 w-4" />
              Deploy Bot
            </Button>
          )}
          <Button asChild variant="outline">
            <Link to="/agents/$agentId" params={{ agentId: agent.id }}>
              Configure
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <InfoBlock
          icon={ExternalLink}
          title="Public URL"
          value={publicUrl}
          disabled={!isDeployed}
          onCopy={() => onCopy(publicUrl, "Public URL")}
          action={
            isDeployed ? (
              <Link
                to="/bot/$botId"
                params={{ botId: agent.id }}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            ) : null
          }
        />
        <InfoBlock
          icon={KeyRound}
          title="Public Key"
          value={agent.publicKey ?? "Deploy to generate pk_test key"}
          disabled={!agent.publicKey}
          onCopy={() => agent.publicKey && onCopy(agent.publicKey, "Public key")}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <CodeBlock
          icon={CheckCircle2}
          title="React SDK"
          code={sdkSnippet}
          onCopy={() => onCopy(sdkSnippet, "SDK snippet")}
        />
        <CodeBlock
          icon={TerminalSquare}
          title="Headless API"
          code={apiSnippet}
          onCopy={() => onCopy(apiSnippet, "API snippet")}
        />
      </div>
    </section>
  );
}

function InfoBlock({
  icon: Icon,
  title,
  value,
  disabled,
  onCopy,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  disabled?: boolean;
  onCopy: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-1 p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </div>
      <div className="flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-md bg-background px-2 py-2 font-mono text-xs text-muted-foreground">
          {value}
        </code>
        <button
          type="button"
          onClick={onCopy}
          disabled={disabled}
          className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40"
        >
          <Copy className="h-4 w-4" />
        </button>
        {action}
      </div>
    </div>
  );
}

function CodeBlock({
  icon: Icon,
  title,
  code,
  onCopy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  code: string;
  onCopy: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </p>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
      <pre className="scrollbar-thin max-h-64 overflow-auto p-4 text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
