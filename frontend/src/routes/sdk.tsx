import { createFileRoute, Link } from "@tanstack/react-router";
import type React from "react";
import {
  Box,
  Code2,
  Copy,
  ExternalLink,
  KeyRound,
  Layers3,
  MonitorSmartphone,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardLayout, PageHeader } from "@/layouts/dashboard-layout";
import { requireAuth } from "@/features/auth/services/route-guards";
import { useAgents } from "@/features/agents/hooks/use-agents";
import { OperationalIndicator } from "@/shared/components/ui/operational-indicator";
import { env } from "@/shared/lib/env";

export const Route = createFileRoute("/sdk")({
  beforeLoad: requireAuth,
  head: () => ({ meta: [{ title: "SDK & API - Nexus" }] }),
  component: SDK,
});

function SDK() {
  const agents = useAgents();
  const deployedAgents =
    agents.data?.filter((agent) => agent.deploymentStatus === "deployed" && agent.publicKey) ?? [];
  const agent = deployedAgents[0] ?? agents.data?.[0];
  const botId = agent?.id ?? "YOUR_BOT_ID";
  const publicKey = agent?.publicKey ?? "pk_test_xxxxx";
  const apiBaseUrl = env.apiBaseUrl;
  const frontendOrigin =
    typeof window === "undefined" ? "http://localhost:8080" : window.location.origin;
  const publicUrl = `${frontendOrigin}/bot/${botId}`;

  const install = `npm install @nexus-ai/react-sdk`;
  const widget = `import { ChatBot } from "@nexus-ai/react-sdk";

export function SupportWidget() {
  return (
    <ChatBot
      botId="${botId}"
      publicKey="${publicKey}"
      mode="widget"
      apiBaseUrl="${apiBaseUrl}"
      theme="dark"
      primaryColor="#5E6AD2"
      launcherPosition="bottom-right"
    />
  );
}`;
  const embedded = `<ChatBot
  botId="${botId}"
  publicKey="${publicKey}"
  mode="embedded"
  apiBaseUrl="${apiBaseUrl}"
  width={920}
  height={760}
  borderRadius={24}
/>`;
  const fullscreen = `<ChatBot
  botId="${botId}"
  publicKey="${publicKey}"
  mode="fullscreen"
  apiBaseUrl="${apiBaseUrl}"
/>;
`;
  const headless = `import { createNexusClient } from "@nexus-ai/react-sdk";

const nexus = createNexusClient({
  botId: "${botId}",
  publicKey: "${publicKey}",
  apiBaseUrl: "${apiBaseUrl}"
});

const result = await nexus.chat("What can you help with?");
console.log(result.response);`;
  const rest = `curl -X POST ${apiBaseUrl}/public/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "botId": "${botId}",
    "publicKey": "${publicKey}",
    "message": "What can you help with?",
    "channel": "public_api"
  }'`;

  const copy = async (value: string, label: string) => {
    await navigator.clipboard?.writeText(value);
    toast.success(`${label} copied`);
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Developer"
        title="SDK & API"
        description="Embed deployed Nexus assistants with inherited appearance, secure public keys, Markdown rendering, and runtime analytics."
        actions={
          <Button asChild variant="outline">
            <Link to="/deployment">Deployment Center</Link>
          </Button>
        }
      />

      <div className="grid gap-5 p-6">
        <section className="grid gap-4 rounded-xl border border-border bg-card p-5 elevated lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">{agent?.name ?? "No deployed bot selected"}</h2>
              <OperationalIndicator
                state={agent?.deploymentStatus === "deployed" ? "healthy" : "offline"}
                label={agent?.deploymentStatus === "deployed" ? "deployed" : "draft"}
              />
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              SDK traffic uses the public runtime API. Developers only need the bot ID and public
              key; the platform handles prompt orchestration, RAG context, Groq calls, and
              analytics.
            </p>
          </div>
          <div className="grid gap-2 rounded-lg border border-border bg-surface-1 p-3 text-sm">
            <InfoRow icon={Box} label="Bot ID" value={botId} onCopy={() => copy(botId, "Bot ID")} />
            <InfoRow
              icon={KeyRound}
              label="Public key"
              value={publicKey}
              onCopy={() => copy(publicKey, "Public key")}
            />
            <InfoRow
              icon={ExternalLink}
              label="Public URL"
              value={publicUrl}
              onCopy={() => copy(publicUrl, "Public URL")}
            />
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-2">
          <SDKCard
            icon={Terminal}
            title="Install"
            code={install}
            onCopy={() => copy(install, "Install command")}
          />
          <SDKCard
            icon={MonitorSmartphone}
            title="Premium Widget"
            code={widget}
            onCopy={() => copy(widget, "Widget snippet")}
          />
          <SDKCard
            icon={Layers3}
            title="Embedded Component"
            code={embedded}
            onCopy={() => copy(embedded, "Embedded snippet")}
          />
          <SDKCard
            icon={MonitorSmartphone}
            title="Fullscreen Assistant"
            code={fullscreen}
            onCopy={() => copy(fullscreen, "Fullscreen snippet")}
          />
          <SDKCard
            icon={Code2}
            title="Headless SDK"
            code={headless}
            onCopy={() => copy(headless, "Headless SDK snippet")}
          />
          <SDKCard
            icon={Terminal}
            title="REST API"
            code={rest}
            onCopy={() => copy(rest, "REST API snippet")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  onCopy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr_auto] items-center gap-2">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <code className="truncate rounded-md bg-background px-2 py-1.5 font-mono text-xs">
        {value}
      </code>
      <button
        type="button"
        onClick={onCopy}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}

function SDKCard({
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
    <section className="overflow-hidden rounded-xl border border-border bg-card elevated">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </h3>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
      <pre className="max-h-80 overflow-auto p-4 text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </section>
  );
}
