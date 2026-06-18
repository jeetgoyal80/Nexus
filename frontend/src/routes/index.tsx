import { useState } from "react";
import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Code2,
  Copy,
  Cpu,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Globe,
  Layers3,
  LockKeyhole,
  MessageSquare,
  Network,
  Plug,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Terminal,
  UploadCloud,
  Workflow,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingFooter, MarketingNav } from "@/components/shared/MarketingShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus AI - AI Agent Infrastructure Platform" },
      {
        name: "description",
        content:
          "Build, deploy, and integrate AI agents at scale with RAG, SDKs, analytics, and production runtime infrastructure.",
      },
      { property: "og:title", content: "Nexus AI - AI Agent Infrastructure Platform" },
      {
        property: "og:description",
        content: "The infrastructure layer for production AI agents and embeddable AI runtimes.",
      },
    ],
  }),
  component: Landing,
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function Landing() {
  return (
    <div className="dark min-h-screen overflow-hidden bg-[#050711] text-foreground">
      <MarketingNav />
      <main>
        <Hero />
        <Capabilities />
        <HowItWorks />
        <ProductShowcase />
        <DeveloperSDK />
        <RagInfrastructure />
        <DeploymentChannels />
        <AnalyticsPreview />
        <FeatureBento />
        <Comparison />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-56px)] overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(94,106,210,.35),transparent_34%),linear-gradient(180deg,rgba(5,7,17,.2),#050711_88%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-56px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1fr_1.05fr]">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs text-slate-300 shadow-[0_0_0_1px_rgba(255,255,255,.02)] backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,.9)]" />
            AI Infrastructure Platform
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Build, Deploy, and Integrate AI Agents at Scale.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Nexus AI is the control plane for production AI agents: no-code builders, RAG pipelines,
            runtime orchestration, SDK deployment, and analytics in one infrastructure layer.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-white px-6 text-slate-950 hover:bg-slate-200"
            >
              <Link to="/signup">
                Start Building <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/15 bg-white/[.04] px-6 text-white hover:bg-white/[.08]"
            >
              <a href="#sdk">
                View SDK <Code2 className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-9 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["99.9%", "runtime ready"],
              ["38ms", "retrieval p50"],
              ["6", "deploy targets"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
                <p className="text-2xl font-semibold text-white">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <InfrastructureVisual />
        </motion.div>
      </div>
    </section>
  );
}

function InfrastructureVisual() {
  const nodes = [
    { icon: Bot, title: "Agent Builder", meta: "behavior + appearance" },
    { icon: UploadCloud, title: "Knowledge Upload", meta: "pdf, docs, csv, html" },
    { icon: Database, title: "Vector Processing", meta: "chunks -> embeddings" },
    { icon: Cpu, title: "Runtime Engine", meta: "RAG + Groq orchestration" },
    { icon: Plug, title: "SDK Integration", meta: "React, REST, widget" },
  ];

  return (
    <div className="relative mx-auto max-w-xl">
      <div className="absolute -inset-8 bg-[conic-gradient(from_180deg,rgba(94,106,210,.18),rgba(124,58,237,.2),rgba(20,184,166,.16),rgba(94,106,210,.18))] opacity-80 blur-3xl" />
      <div className="relative rounded-[2rem] border border-white/10 bg-slate-950/75 p-4 shadow-[0_32px_100px_rgba(0,0,0,.55)] backdrop-blur-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 font-mono text-xs text-slate-500">nexus.ai/runtime-flow</span>
          <span className="ml-auto rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-300">
            healthy
          </span>
        </div>

        <div className="grid gap-3 py-5">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={node.title}
                animate={{ y: [0, index % 2 ? -3 : 3, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: index * 0.2 }}
                className="relative"
              >
                {index > 0 && (
                  <span className="absolute -top-3 left-8 h-3 w-px bg-gradient-to-b from-transparent via-indigo-300/50 to-transparent" />
                )}
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] p-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-950/50">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{node.title}</p>
                    <p className="text-sm text-slate-400">{node.meta}</p>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 text-slate-500" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
          <RuntimeStat label="tokens" value="1.8M" />
          <RuntimeStat label="agents" value="42" />
          <RuntimeStat label="errors" value="0.03%" />
        </div>
      </div>
    </div>
  );
}

function RuntimeStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="font-mono text-lg text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
    </div>
  );
}

function Capabilities() {
  const cards = [
    {
      icon: Shield,
      title: "Production controls",
      text: "Auth, tenant isolation, public keys, rate limits, and deployment states for real SaaS operations.",
    },
    {
      icon: Network,
      title: "Runtime orchestration",
      text: "Bot configuration, prompt construction, RAG context, Groq execution, and conversation storage.",
    },
    {
      icon: Braces,
      title: "Developer APIs",
      text: "React SDK, REST runtime APIs, embeddable widgets, and future headless integrations.",
    },
  ];

  return (
    <Section
      id="platform"
      eyebrow="Built for production AI systems"
      title="Not a chatbot demo. An AI infrastructure layer."
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
        variants={stagger}
        className="grid gap-4 md:grid-cols-3"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} variants={fadeUp} className="premium-card p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/[.06] text-indigo-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{card.text}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}

function HowItWorks() {
  const steps = [
    [
      "01",
      "Create Agent",
      "Define personality, instructions, output format, theme, and deployment mode.",
    ],
    [
      "02",
      "Add Knowledge",
      "Upload documents and let the ingestion worker build searchable context.",
    ],
    [
      "03",
      "Deploy Runtime",
      "Publish a public endpoint with generated keys and visibility controls.",
    ],
    [
      "04",
      "Integrate SDK",
      "Drop the React SDK into any product and inherit the live bot configuration.",
    ],
  ];

  return (
    <Section eyebrow="How it works" title="A clean path from builder to embedded AI runtime.">
      <div className="grid gap-4 lg:grid-cols-4">
        {steps.map(([num, title, text], index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className="relative rounded-3xl border border-white/10 bg-white/[.035] p-6"
          >
            <span className="font-mono text-xs text-indigo-300">{num}</span>
            <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function ProductShowcase() {
  const tabs = [
    { id: "builder", label: "Agent Builder", icon: Bot },
    { id: "knowledge", label: "Knowledge Base", icon: Database },
    { id: "appearance", label: "Appearance Studio", icon: Sparkles },
    { id: "deployment", label: "Deployment Center", icon: Rocket },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "sdk", label: "SDK Platform", icon: Code2 },
  ];
  const [active, setActive] = useState(tabs[0].id);
  const activeTab = tabs.find((tab) => tab.id === active) ?? tabs[0];
  const ActiveIcon = activeTab.icon;

  return (
    <Section
      id="showcase"
      eyebrow="Product showcase"
      title="Everything your AI agent needs, managed from one control plane."
      description="Switch between the platform surfaces that make Nexus feel like Vercel for AI agents."
    >
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="premium-card p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const selected = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                  selected
                    ? "bg-white text-slate-950 shadow-lg"
                    : "text-slate-400 hover:bg-white/[.05] hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="premium-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{activeTab.label}</h3>
              <p className="text-xs text-slate-500">
                Live backend state with production-safe controls
              </p>
            </div>
            <span className="ml-auto rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">
              synced
            </span>
          </div>
          <ShowcaseMock active={active} />
        </div>
      </div>
    </Section>
  );
}

function ShowcaseMock({ active }: { active: string }) {
  const rows =
    active === "knowledge"
      ? ["Placement_Policy.pdf", "Employee_FAQ.docx", "Product_Manual.csv"]
      : active === "deployment"
        ? ["Public URL", "React SDK", "REST API"]
        : active === "analytics"
          ? ["Messages", "Visitors", "Resolution rate"]
          : ["Support Agent", "Placement Agent", "Finance Assistant"];

  return (
    <div className="grid gap-5 p-5 lg:grid-cols-[1fr_320px]">
      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white">Runtime canvas</p>
          <span className="font-mono text-xs text-slate-500">{active}.nexus</span>
        </div>
        <div className="mt-5 grid gap-3">
          {rows.map((row, index) => (
            <div key={row} className="flex items-center gap-3 rounded-2xl bg-white/[.04] p-4">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[.06] text-indigo-300">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{row}</p>
                <p className="text-xs text-slate-500">Configuration connected to runtime APIs</p>
              </div>
              <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-300" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.025] p-5">
        <p className="text-sm font-medium text-white">Live agent preview</p>
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b1020] p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500 text-white">
              AI
            </span>
            <div>
              <p className="text-sm font-medium text-white">Placement Assistant</p>
              <p className="text-xs text-emerald-300">Retrieval ready</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <div className="rounded-2xl bg-white/[.05] p-3 text-slate-300">
              Ask me anything about eligibility, PPOs, or company policies.
            </div>
            <div className="ml-auto max-w-[82%] rounded-2xl bg-indigo-500 p-3 text-white">
              What is the PPO rule?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeveloperSDK() {
  const code = `npm install @nexus-ai/react-sdk

import { ChatBot } from "@nexus-ai/react-sdk";

export function App() {
  return (
    <ChatBot
      botId="agent_abc123"
      publicKey="pk_test_xxxxx"
      mode="widget"
      apiBaseUrl="http://localhost:5000/api"
    />
  );
}`;

  return (
    <Section
      id="sdk"
      eyebrow="Developer SDK"
      title="Ship AI agents inside any product with one component."
      description="Developers get production APIs and a polished React SDK. The platform hosts the AI infrastructure."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_430px]">
        <CodeBlock code={code} filename="App.tsx" />
        <div className="premium-card p-5">
          <div className="rounded-3xl border border-white/10 bg-[#0b1020] p-4 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 font-semibold text-white">
                N
              </span>
              <div>
                <p className="font-medium text-white">Nexus Assistant</p>
                <p className="text-xs text-emerald-300">Online with knowledge</p>
              </div>
            </div>
            <div className="space-y-3 py-5 text-sm">
              <div className="max-w-[86%] rounded-2xl bg-white/[.06] p-3 text-slate-300">
                I can answer with your deployed bot configuration and RAG context.
              </div>
              <div className="ml-auto max-w-[78%] rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-3 text-white">
                Summarize the policy.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-slate-500">
              Ask anything...
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function RagInfrastructure() {
  const steps = [
    { icon: FileText, label: "Files" },
    { icon: Layers3, label: "Chunking" },
    { icon: Cpu, label: "Embeddings" },
    { icon: Database, label: "Qdrant" },
    { icon: Search, label: "Semantic Retrieval" },
    { icon: Zap, label: "Groq Runtime" },
    { icon: MessageSquare, label: "Response" },
  ];

  return (
    <Section
      eyebrow="RAG infrastructure"
      title="Knowledge-aware agents without hidden retrieval magic."
      description="A clean pipeline for document ingestion, semantic search, context injection, and grounded responses."
    >
      <div className="premium-card p-5">
        <div className="grid gap-3 md:grid-cols-7">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="relative">
                {index < steps.length - 1 && (
                  <span className="absolute left-[calc(100%-4px)] top-9 hidden h-px w-5 bg-white/15 md:block" />
                )}
                <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4 text-center">
                  <Icon className="mx-auto h-5 w-5 text-indigo-300" />
                  <p className="mt-3 text-xs font-medium text-white">{step.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function DeploymentChannels() {
  const channels = [
    ["Public URL", Globe],
    ["React SDK", Code2],
    ["JavaScript SDK", Braces],
    ["REST API", Terminal],
    ["Website Widget", Plug],
    ["Future integrations", Boxes],
  ];

  return (
    <Section
      id="developers"
      eyebrow="Deployment"
      title="Expose every deployed agent through channels developers expect."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {channels.map(([label, Icon]) => (
          <div key={label as string} className="premium-card flex items-center gap-4 p-5">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/[.06] text-indigo-300">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-white">{label as string}</p>
              <p className="text-sm text-slate-500">Generated from deployment state</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function AnalyticsPreview() {
  return (
    <Section eyebrow="Analytics" title="Observe usage, latency, retrieval, and SDK adoption.">
      <div className="premium-card p-5">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Messages", "84.2K", Activity],
            ["Visitors", "18.7K", Globe],
            ["Conversations", "12.1K", MessageSquare],
            ["Resolution", "91%", Gauge],
          ].map(([label, value, Icon]) => (
            <div
              key={label as string}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <Icon className="h-4 w-4 text-indigo-300" />
              <p className="mt-4 text-2xl font-semibold text-white">{value as string}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                {label as string}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex h-44 items-end gap-2 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          {Array.from({ length: 42 }).map((_, index) => (
            <span
              key={index}
              className="flex-1 rounded-t bg-gradient-to-t from-indigo-500/30 to-violet-400"
              style={{ height: `${18 + Math.abs(Math.sin(index / 3)) * 76}%` }}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

function FeatureBento() {
  const features = [
    ["Multi-tenant ownership", LockKeyhole, "Every bot belongs to an owner with strict isolation."],
    ["Async ingestion", Workflow, "Redis and BullMQ coordinate long-running document processing."],
    ["Cloud storage", Cloud, "Knowledge files are stored externally for deployment-ready scaling."],
    ["Runtime streaming", Activity, "SSE-ready architecture for token-by-token AI responses."],
    ["Public keys", Shield, "SDK calls validate deployed bots with generated public keys."],
    ["Provider layer", GitBranch, "Groq today, provider abstraction for future model routing."],
  ];

  return (
    <Section
      id="features"
      eyebrow="Feature bento"
      title="The platform primitives of AI agent SaaS."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map(([title, Icon, text], index) => (
          <div
            key={title as string}
            className={`premium-card p-6 ${index === 0 || index === 3 ? "lg:col-span-2" : ""}`}
          >
            <Icon className="h-5 w-5 text-indigo-300" />
            <h3 className="mt-5 text-lg font-semibold text-white">{title as string}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{text as string}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Comparison() {
  return (
    <Section
      eyebrow="Comparison"
      title="Traditional chatbot platforms stop at chat. Nexus ships infrastructure."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <CompareCard
          title="Traditional chatbot platforms"
          muted
          items={[
            "Template-first UI",
            "Limited runtime control",
            "Opaque retrieval",
            "Weak SDK story",
          ]}
        />
        <CompareCard
          title="Nexus AI"
          items={[
            "Agent control plane",
            "RAG + runtime orchestration",
            "Public APIs and SDKs",
            "Analytics and deployment state",
          ]}
        />
      </div>
    </Section>
  );
}

function CompareCard({
  title,
  items,
  muted = false,
}: {
  title: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 ${muted ? "border-white/10 bg-white/[.025]" : "border-indigo-400/25 bg-indigo-500/[.08]"}`}
    >
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
            <Check className={`h-4 w-4 ${muted ? "text-slate-500" : "text-emerald-300"}`} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Testimonials() {
  const quotes = [
    [
      "Nexus feels like an AI infrastructure control plane, not another support widget.",
      "Priya S.",
      "Platform Lead",
    ],
    [
      "The SDK made our internal assistant feel native inside the product in a day.",
      "Rahul M.",
      "Frontend Architect",
    ],
    [
      "The RAG separation helped our team understand and debug retrieval quality properly.",
      "Anika R.",
      "AI Engineer",
    ],
  ];

  return (
    <Section eyebrow="Teams" title="Built for builders who care about real infrastructure.">
      <div className="grid gap-4 md:grid-cols-3">
        {quotes.map(([quote, name, role]) => (
          <div key={name} className="premium-card p-6">
            <p className="text-sm leading-7 text-slate-300">"{quote}"</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[.06] text-sm font-semibold text-white">
                {name.slice(0, 1)}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{name}</p>
                <p className="text-xs text-slate-500">{role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Pricing() {
  const [annual, setAnnual] = useState(true);
  const plans = [
    [
      "Free",
      annual ? "$0" : "$0",
      "Prototype agents locally",
      ["2 agents", "1,000 messages", "Public URL"],
    ],
    [
      "Pro",
      annual ? "$39" : "$49",
      "Launch production agents",
      ["25 agents", "100K messages", "React SDK", "Analytics"],
    ],
    [
      "Enterprise",
      "Custom",
      "Scale AI infrastructure",
      ["SSO", "Dedicated workers", "SLA", "Security review"],
    ],
  ];

  return (
    <Section id="pricing" eyebrow="Pricing" title="Start local. Scale when your agents do.">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full border border-white/10 bg-white/[.04] p-1">
          {["Monthly", "Annual"].map((label) => {
            const selected = annual === (label === "Annual");
            return (
              <button
                key={label}
                onClick={() => setAnnual(label === "Annual")}
                className={`rounded-full px-4 py-2 text-sm transition ${selected ? "bg-white text-slate-950" : "text-slate-400 hover:text-white"}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map(([name, price, description, features]) => (
          <div key={name as string} className="premium-card p-6">
            <p className="text-lg font-semibold text-white">{name as string}</p>
            <p className="mt-4 text-4xl font-semibold text-white">{price as string}</p>
            <p className="mt-2 text-sm text-slate-400">{description as string}</p>
            <div className="mt-6 space-y-3">
              {(features as string[]).map((feature) => (
                <p key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  {feature}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FAQ() {
  const faqs = [
    [
      "Is Nexus only a chatbot builder?",
      "No. The builder is one surface on top of a runtime, RAG, SDK, deployment, and analytics platform.",
    ],
    [
      "Can I use this locally?",
      "Yes. The current architecture is local-first and uses environment variables to move to deployed infrastructure later.",
    ],
    [
      "Does the SDK host AI logic?",
      "No. The SDK talks to Nexus public runtime APIs. Your backend remains the orchestration authority.",
    ],
    [
      "Can I bring Qdrant or another vector database?",
      "The retrieval layer is structured for Qdrant today and can evolve behind service boundaries.",
    ],
  ];

  return (
    <Section eyebrow="FAQ" title="Questions before you ship your first agent.">
      <div className="grid gap-3">
        {faqs.map(([q, a]) => (
          <details key={q} className="group rounded-2xl border border-white/10 bg-white/[.035] p-5">
            <summary className="cursor-pointer list-none text-base font-medium text-white">
              {q}
            </summary>
            <p className="mt-3 text-sm leading-6 text-slate-400">{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

function FinalCTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(94,106,210,.25),rgba(124,58,237,.16),rgba(255,255,255,.04))] p-10 text-center shadow-[0_30px_120px_rgba(0,0,0,.45)]">
        <p className="text-sm uppercase tracking-[0.22em] text-indigo-200">
          Build the AI runtime layer
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Turn every agent into a deployable, observable, embeddable product.
        </h2>
        <div className="mt-8 flex justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-xl bg-white px-6 text-slate-950 hover:bg-slate-200"
          >
            <Link to="/signup">Start Building</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-xl border-white/15 bg-white/[.04] px-6 text-white hover:bg-white/[.08]"
          >
            <Link to="/docs">Read Docs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <SectionLabel>{eyebrow}</SectionLabel>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-7 text-slate-400">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-indigo-300">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </p>
  );
}

export function CodeBlock({ code, filename = "snippet.ts" }: { code: string; filename?: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#070a14] shadow-[0_26px_80px_rgba(0,0,0,.45)]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[.035] px-4 py-3">
        <Terminal className="h-4 w-4 text-indigo-300" />
        <span className="font-mono text-xs text-slate-400">{filename}</span>
        <Copy className="ml-auto h-4 w-4 text-slate-500" />
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}
