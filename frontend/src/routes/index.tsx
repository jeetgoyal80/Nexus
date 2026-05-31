import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Zap,
  Database,
  Cpu,
  Shield,
  Code2,
  Rocket,
  Activity,
  MessageSquare,
  FileText,
  Globe,
  CheckCircle2,
  Sparkles,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingNav, MarketingFooter } from "@/components/shared/MarketingShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus — Build AI Agents Powered By Your Knowledge" },
      {
        name: "description",
        content:
          "Create, customize, and deploy intelligent AI assistants with semantic retrieval, RAG infrastructure, and developer-grade AI orchestration.",
      },
      { property: "og:title", content: "Nexus — AI Infrastructure Platform" },
      {
        property: "og:description",
        content: "Build, deploy, and orchestrate intelligent AI systems.",
      },
    ],
  }),
  component: Landing,
});

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

function Landing() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <MarketingNav />
      <Hero />
      <Trusted />
      <HowItWorks />
      <Features />
      <Architecture />
      <Runtime />
      <SDKSection />
      <UseCases />
      <DashboardPreview />
      <FinalCTA />
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_oklch(0.78_0.15_160)]" />
            Runtime online · Groq · RAG v2
          </div>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            <span className="text-gradient">Build AI Agents</span>
            <br />
            <span className="text-gradient-brand">Powered By Your Knowledge</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Create, customize and deploy intelligent AI assistants with semantic retrieval, RAG
            infrastructure, embeddable runtime systems and developer-grade orchestration.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-11 bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground hover:opacity-95"
            >
              <Link to="/signup">
                Start building <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 border-border bg-secondary/40"
            >
              <Link to="/bot/$botId" params={{ botId: "demo" }}>
                <Play className="mr-1.5 h-4 w-4" />
                View demo
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> SOC2-aligned infra
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Bring your own keys
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Sub-100ms p50
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <HeroPreview />
        </motion.div>
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-[color:var(--accent-blue)]/20 via-transparent to-[color:var(--accent-violet)]/20 blur-2xl"
        aria-hidden
      />
      <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur elevated">
        <div className="flex items-center gap-2 border-b border-border/70 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-muted" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted" />
          <span className="ml-3 font-mono text-[11px] text-muted-foreground">
            nexus.app/dashboard
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
            <span className="h-1 w-1 rounded-full bg-emerald-400" /> live
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 p-4">
          <MetricCard label="Active agents" value="12" trend="+3" />
          <MetricCard label="Conversations" value="48.2K" trend="+12%" />
          <MetricCard label="Retrieval p50" value="38ms" trend="-4ms" />
        </div>
        <div className="grid grid-cols-5 gap-3 px-4 pb-4">
          <div className="col-span-3 rounded-lg border border-border bg-surface-1 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">Runtime throughput</p>
              <span className="font-mono text-[10px] text-muted-foreground">last 24h</span>
            </div>
            <div className="mt-2 flex h-20 items-end gap-1">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-[color:var(--accent-blue)]/30 to-[color:var(--accent-violet)]/80"
                  style={{ height: `${20 + Math.abs(Math.sin(i / 2)) * 70}%` }}
                />
              ))}
            </div>
          </div>
          <div className="col-span-2 rounded-lg border border-border bg-surface-1 p-3 text-xs">
            <p className="font-medium">Support Agent</p>
            <p className="text-muted-foreground">Last reply 2s ago</p>
            <div className="mt-2 space-y-1.5">
              <div className="rounded-md bg-secondary px-2 py-1.5 text-[11px]">
                How do I rotate my API key?
              </div>
              <div className="rounded-md bg-primary/15 px-2 py-1.5 text-[11px] text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-primary" /> Go to Settings → Runtime → Rotate
                  key.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-1 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
      <p className="text-[10px] text-emerald-400">{trend}</p>
    </div>
  );
}

function Trusted() {
  const items = ["Northwind", "Vercel-like", "Helios", "Quantica", "Stripe-ish", "Acme Labs"];
  return (
    <section className="border-y border-border/60 bg-surface-1/40 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Trusted infrastructure for AI-native teams
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-3 opacity-70">
          {items.map((n) => (
            <span key={n} className="font-mono text-sm tracking-widest text-muted-foreground">
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "Upload knowledge",
      desc: "PDF, DOCX, CSV, HTML, TXT. Auto-chunked and embedded.",
    },
    {
      icon: Database,
      title: "Retrieval layer",
      desc: "Vector search via Qdrant with reranking and metadata filters.",
    },
    {
      icon: Cpu,
      title: "Runtime orchestration",
      desc: "Groq runtime with streaming, tools and guardrails.",
    },
    { icon: Rocket, title: "Deploy anywhere", desc: "Public URL, embed widget, REST + React SDK." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionLabel>Workflow</SectionLabel>
      <h2 className="mt-2 text-4xl font-semibold tracking-tight">
        From knowledge to deployed runtime in minutes.
      </h2>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ delay: i * 0.05 }}
            className="relative rounded-xl border border-border bg-card p-5 elevated"
          >
            <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-xs font-mono text-muted-foreground">Step 0{i + 1}</p>
            <h3 className="mt-1 font-medium">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Database,
      title: "Semantic retrieval",
      desc: "Hybrid search with vector + keyword reranking.",
    },
    { icon: Zap, title: "Groq runtime", desc: "Sub-100ms token streaming on production hardware." },
    {
      icon: Code2,
      title: "Developer SDK",
      desc: "React, REST and webhook integration in minutes.",
    },
    {
      icon: Shield,
      title: "Guardrails",
      desc: "Topic filters, PII redaction, prompt injection defense.",
    },
    { icon: Globe, title: "Embed anywhere", desc: "Drop-in widget, iframe, headless API." },
    {
      icon: Activity,
      title: "Observability",
      desc: "Latency, token cost, retrieval accuracy in one pane.",
    },
  ];
  return (
    <section id="features" className="border-t border-border/60 bg-surface-1/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Platform</SectionLabel>
        <h2 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight">
          The infrastructure layer for production AI agents.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-5 transition hover:border-primary/40 hover:bg-card/80"
            >
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-foreground/80 transition group-hover:bg-primary/15 group-hover:text-primary">
                <f.icon className="h-4 w-4" />
              </div>
              <h3 className="font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  const layers = [
    { label: "Frontend", desc: "React SDK · Embed · Dashboard" },
    { label: "AI Runtime Engine", desc: "Orchestration · Streaming · Tools" },
    { label: "Retrieval Layer", desc: "Hybrid Search · Rerank · Filters" },
    { label: "Knowledge Infrastructure", desc: "Ingestion · Chunking · Embeddings" },
    { label: "Groq Runtime", desc: "LLM inference · Token streaming" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionLabel>Architecture</SectionLabel>
      <h2 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight">
        A clean stack from request to response.
      </h2>
      <div className="mt-10 grid gap-3 md:grid-cols-[1fr_2fr]">
        <div className="space-y-3">
          {layers.map((l, i) => (
            <div
              key={l.label}
              className="relative rounded-lg border border-border bg-card p-4 elevated"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 font-mono text-xs text-primary">
                  L{i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{l.label}</p>
                  <p className="text-xs text-muted-foreground">{l.desc}</p>
                </div>
              </div>
              {i < layers.length - 1 && (
                <div className="absolute left-[26px] -bottom-3 h-3 w-px bg-border" />
              )}
            </div>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
          <div className="absolute inset-0 bg-grid opacity-60" />
          <div className="relative grid h-full grid-cols-3 gap-3 text-xs">
            {[
              "ingest",
              "embed",
              "store",
              "retrieve",
              "rerank",
              "orchestrate",
              "stream",
              "observe",
              "deploy",
            ].map((n, i) => (
              <div
                key={n}
                className="rounded-lg border border-border bg-surface-1/80 p-3 backdrop-blur"
              >
                <p className="font-mono text-[10px] text-muted-foreground">
                  node.{String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 font-medium">{n}()</p>
                <div className="mt-2 h-1 w-full overflow-hidden rounded bg-secondary">
                  <div
                    className="h-full rounded bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)]"
                    style={{ width: `${30 + ((i * 17) % 65)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Runtime() {
  return (
    <section className="border-t border-border/60 bg-surface-1/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Runtime flexibility</SectionLabel>
        <h2 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight">
          Run on your own keys, or our managed infrastructure.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <RuntimeCard
            title="Bring your own Groq key"
            badge="Free tier"
            desc="Use your personal Groq account. Keys are encrypted at rest and never logged."
            features={["Personal Groq account", "Full runtime features", "Encrypted key storage"]}
          />
          <RuntimeCard
            title="Platform runtime"
            badge="Premium"
            premium
            desc="Use our managed AI infrastructure. Multi-region, autoscaling, no key management."
            features={["Managed runtime", "Autoscaling & failover", "Priority capacity"]}
          />
        </div>
      </div>
    </section>
  );
}

function RuntimeCard({
  title,
  badge,
  desc,
  features,
  premium = false,
}: {
  title: string;
  badge: string;
  desc: string;
  features: string[];
  premium?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 elevated ${premium ? "border-primary/40 bg-gradient-to-br from-card to-primary/5" : "border-border bg-card"}`}
    >
      {premium && (
        <div className="absolute -right-12 top-5 rotate-45 bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] px-12 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
          Premium
        </div>
      )}
      <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {badge}
      </span>
      <h3 className="mt-3 text-xl font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SDKSection() {
  const code = `import { Nexus } from "@nexus/sdk";

const nexus = new Nexus({ apiKey: process.env.NEXUS_KEY });

const agent = nexus.agent("support-bot");

const stream = await agent.chat({
  message: "How do I rotate my API key?",
  retrieval: { topK: 6, rerank: true },
});

for await (const token of stream) process.stdout.write(token);`;
  return (
    <section id="sdk" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionLabel>SDK</SectionLabel>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight">
            Developer-first by default.
          </h2>
          <p className="mt-3 text-muted-foreground">
            A typed SDK for Node and the browser, REST endpoints, streaming responses, and a React
            component you can drop in.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {["TypeScript", "Streaming", "Edge-ready", "Webhooks", "React"].map((t) => (
              <span
                key={t}
                className="rounded-md border border-border bg-secondary px-2.5 py-1 font-mono text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <CodeBlock code={code} filename="agent.ts" />
      </div>
    </section>
  );
}

export function CodeBlock({ code, filename = "snippet.ts" }: { code: string; filename?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card elevated">
      <div className="flex items-center justify-between border-b border-border/70 bg-surface-1 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-muted" />
          <span className="h-2 w-2 rounded-full bg-muted" />
          <span className="h-2 w-2 rounded-full bg-muted" />
          <span className="ml-2 font-mono text-[11px] text-muted-foreground">{filename}</span>
        </div>
        <button
          onClick={() => navigator.clipboard?.writeText(code)}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
        >
          <Copy className="h-3 w-3" /> Copy
        </button>
      </div>
      <pre className="scrollbar-thin overflow-x-auto p-4 text-[12.5px] leading-relaxed">
        <code className="font-mono text-foreground/90">{code}</code>
      </pre>
    </div>
  );
}

function UseCases() {
  const cases = [
    {
      icon: MessageSquare,
      t: "Support agents",
      d: "Resolve tickets with your docs as ground truth.",
    },
    { icon: FileText, t: "Internal copilots", d: "Search SOPs, contracts, and wikis instantly." },
    { icon: Code2, t: "Developer assistants", d: "API-aware bots embedded in your docs." },
  ];
  return (
    <section className="border-t border-border/60 bg-surface-1/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Use cases</SectionLabel>
        <h2 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight">
          Built for teams shipping AI to production.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cases.map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-card p-6">
              <c.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 text-lg font-medium">{c.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionLabel>Inside the platform</SectionLabel>
      <h2 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight">
        An infrastructure control center.
      </h2>
      <div className="relative mt-10 overflow-hidden rounded-2xl border border-border bg-card elevated">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative grid grid-cols-12 gap-3 p-4">
          <div className="col-span-3 space-y-2 rounded-lg border border-border bg-sidebar p-3">
            {[
              "Dashboard",
              "Agents",
              "Knowledge",
              "Conversations",
              "Analytics",
              "Deployments",
              "SDK & API",
            ].map((n, i) => (
              <div
                key={n}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs ${i === 1 ? "bg-sidebar-accent text-foreground" : "text-muted-foreground"}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${i === 1 ? "bg-primary" : "bg-muted"}`}
                />{" "}
                {n}
              </div>
            ))}
          </div>
          <div className="col-span-9 grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface-1 p-3">
                <p className="text-xs font-medium">support-bot-{i + 1}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Groq · public · 1.2K msgs</p>
                <div className="mt-3 flex h-12 items-end gap-1">
                  {Array.from({ length: 12 }).map((_, j) => (
                    <div
                      key={j}
                      className="flex-1 rounded-sm bg-gradient-to-t from-primary/20 to-primary/80"
                      style={{ height: `${20 + (((i + j) * 9) % 80)}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border/60">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-5xl font-semibold tracking-tight text-gradient">
          Deploy your first AI agent today.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Bring your knowledge. Pick a runtime. Ship to production in a single afternoon.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-11 bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
          >
            <Link to="/signup">
              Start free <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-11 border-border bg-secondary/40"
          >
            <Link to="/docs">Read the docs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
      <span className="mr-2 inline-block h-px w-6 align-middle bg-border" />
      {children}
    </p>
  );
}
