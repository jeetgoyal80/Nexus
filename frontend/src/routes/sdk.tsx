import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/routes/index";
import { DashboardLayout, PageHeader } from "@/layouts/dashboard-layout";
import { requireAuth } from "@/features/auth/services/route-guards";
import { useAgents } from "@/features/agents/hooks/use-agents";

export const Route = createFileRoute("/sdk")({
  beforeLoad: requireAuth,
  head: () => ({ meta: [{ title: "SDK & API - Nexus" }] }),
  component: SDK,
});

function SDK() {
  const agents = useAgents();
  const botId = agents.data?.[0]?.id ?? "YOUR_BOT_ID";
  const react = `import { ChatBot } from "@nexus/react";

export default function Help() {
  return <ChatBot botId="${botId}" />;
}`;
  const rest = `curl ${typeof window === "undefined" ? "http://localhost:5000" : window.location.origin}/api/chat/${botId} \\
  -H "Content-Type: application/json" \\
  -d '{"message":"How do I rotate keys?"}'`;

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Developer"
        title="SDK & API"
        description="Use real bot IDs and backend chat endpoints in your integrations."
      />
      <div className="grid gap-4 p-6 lg:grid-cols-2">
        <CodeBlock filename="react.tsx" code={react} />
        <CodeBlock filename="rest.sh" code={rest} />
      </div>
    </DashboardLayout>
  );
}
