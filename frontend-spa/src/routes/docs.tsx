import { createFileRoute } from "@/shared/router/react-router-compat";
import { MarketingNav, MarketingFooter } from "@/components/shared/MarketingShell";
import { CodeBlock } from "@/routes/index";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/docs")({
  head: () => ({ meta: [{ title: "Docs — Nexus" }] }),
  component: Docs,
});

const sections = [
  { id: "intro", t: "Introduction" },
  { id: "quickstart", t: "Quickstart" },
  { id: "agents", t: "Agents" },
  { id: "knowledge", t: "Knowledge base" },
  { id: "runtime", t: "Runtime" },
  { id: "sdk", t: "SDK" },
  { id: "rest", t: "REST API" },
  { id: "webhooks", t: "Webhooks" },
];

function Docs() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <MarketingNav />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[220px_1fr]">
        <aside className="sticky top-20 hidden h-fit lg:block">
          <p className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" /> Docs
          </p>
          <nav className="space-y-1">
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`block rounded-md px-2 py-1.5 text-sm ${i === 0 ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
              >
                {s.t}
              </a>
            ))}
          </nav>
        </aside>

        <article className="prose prose-invert max-w-none">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Documentation
          </p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight">Build with Nexus</h1>
          <p className="mt-3 text-muted-foreground">
            A developer-grade platform for deploying AI agents grounded in your knowledge.
          </p>

          <h2 id="quickstart" className="mt-10 text-xl font-semibold">
            Quickstart
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Install the SDK and send your first message.
          </p>
          <div className="mt-3">
            <CodeBlock
              filename="quickstart.ts"
              code={`import { Nexus } from "@nexus/sdk";

const nexus = new Nexus({ apiKey: process.env.NEXUS_KEY });
const agent = nexus.agent("support-bot");

console.log(await agent.ask("How do I rotate my API key?"));`}
            />
          </div>

          <h2 id="agents" className="mt-10 text-xl font-semibold">
            Agents
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Agents are the deployable unit of Nexus. Each agent has its own knowledge, runtime and
            deployment.
          </p>

          <h2 id="rest" className="mt-10 text-xl font-semibold">
            REST API
          </h2>
          <div className="mt-3">
            <CodeBlock
              filename="curl"
              code={`curl https://api.nexus.app/v1/agents/support-bot/chat \\
  -H "Authorization: Bearer $NEXUS_KEY" \\
  -d '{"message":"hello"}'`}
            />
          </div>
        </article>
      </div>
      <MarketingFooter />
    </div>
  );
}
