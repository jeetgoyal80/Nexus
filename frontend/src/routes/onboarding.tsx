import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  GraduationCap,
  LifeBuoy,
  Sparkles,
  Bot,
  Upload,
  ShieldCheck,
  KeyRound,
  Cpu,
  Brain,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — Nexus" }] }),
  component: Onboarding,
});

const STEPS = ["Purpose", "Name", "Knowledge", "Personality", "Runtime", "Ready"] as const;

function Onboarding() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const next = () => (step < STEPS.length - 1 ? setStep(step + 1) : nav({ to: "/dashboard" }));
  const prev = () => setStep(Math.max(0, step - 1));

  return (
    <div className="dark relative min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-hero)" }} />
      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10">
        <div className="flex items-center justify-between">
          <Logo />
          <p className="font-mono text-xs text-muted-foreground">
            Step {step + 1} / {STEPS.length}
          </p>
        </div>
        <div className="mt-4 flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)]" : "bg-secondary"}`}
            />
          ))}
        </div>
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-10 rounded-2xl border border-border bg-card/80 p-8 backdrop-blur elevated"
        >
          {step === 0 && <Purpose />}
          {step === 1 && <NameStep />}
          {step === 2 && <KnowledgeStep />}
          {step === 3 && <Personality />}
          {step === 4 && <Runtime />}
          {step === 5 && <Ready />}
        </motion.div>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={prev} disabled={step === 0}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={next}
            className="bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
          >
            {step === STEPS.length - 1 ? "Go to dashboard" : "Continue"}{" "}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Heading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function Purpose() {
  const opts = [
    { icon: LifeBuoy, t: "Support Agent", d: "Resolve customer tickets from your docs." },
    { icon: FileText, t: "Documentation AI", d: "Answer questions from your docs site." },
    { icon: Brain, t: "Research Assistant", d: "Search papers and internal research." },
    { icon: GraduationCap, t: "Personal Tutor", d: "Teach from your curriculum." },
    { icon: Sparkles, t: "Custom AI Agent", d: "Start blank with full control." },
  ];
  const [pick, setPick] = useState("Support Agent");
  return (
    <>
      <Heading
        eyebrow="01 — Purpose"
        title="What do you want to build?"
        subtitle="Pick a template — you can change it later."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {opts.map((o) => (
          <button
            key={o.t}
            onClick={() => setPick(o.t)}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${pick === o.t ? "border-primary/60 bg-primary/5" : "border-border bg-surface-1 hover:border-border/80"}`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-primary">
              <o.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium">{o.t}</p>
              <p className="text-xs text-muted-foreground">{o.d}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function NameStep() {
  return (
    <>
      <Heading
        eyebrow="02 — Identity"
        title="Name your AI agent"
        subtitle="This is shown to your users when they chat."
      />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Agent name</Label>
          <Input id="name" placeholder="e.g. Support Copilot" defaultValue="Support Copilot" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Input id="desc" placeholder="What does this agent do?" />
        </div>
      </div>
    </>
  );
}

function KnowledgeStep() {
  return (
    <>
      <Heading
        eyebrow="03 — Knowledge"
        title="Upload your knowledge"
        subtitle="PDF, DOCX, CSV, HTML, TXT supported."
      />
      <div className="rounded-xl border-2 border-dashed border-border bg-surface-1 p-10 text-center">
        <Upload className="mx-auto h-7 w-7 text-muted-foreground" />
        <p className="mt-3 font-medium">Drop files to upload</p>
        <p className="mt-1 text-xs text-muted-foreground">or click to browse · max 50MB per file</p>
        <Button variant="outline" className="mt-4 border-border bg-secondary">
          Choose files
        </Button>
      </div>
      <div className="mt-4 space-y-2">
        {[
          { n: "handbook.pdf", s: "Embedded", p: 100 },
          { n: "faq.csv", s: "Embedding", p: 64 },
        ].map((f) => (
          <div key={f.n} className="rounded-lg border border-border bg-surface-1 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-mono text-xs">{f.n}</span>
              <span className="text-xs text-muted-foreground">{f.s}</span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded bg-secondary">
              <div
                className="h-full bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)]"
                style={{ width: `${f.p}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Personality() {
  const opts = ["Professional", "Technical", "Friendly", "Strict"];
  const [pick, setPick] = useState("Professional");
  return (
    <>
      <Heading
        eyebrow="04 — Personality"
        title="Choose your AI personality"
        subtitle="Sets the tone for all responses."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {opts.map((o) => (
          <button
            key={o}
            onClick={() => setPick(o)}
            className={`rounded-xl border p-4 text-left transition ${pick === o ? "border-primary/60 bg-primary/5" : "border-border bg-surface-1"}`}
          >
            <p className="font-medium">{o}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {o === "Professional"
                ? "Polite, neutral, on-brand."
                : o === "Technical"
                  ? "Precise, references docs, code-ready."
                  : o === "Friendly"
                    ? "Warm, conversational, approachable."
                    : "Direct, concise, no fluff."}
            </p>
          </button>
        ))}
      </div>
    </>
  );
}

function Runtime() {
  const [pick, setPick] = useState<"byok" | "platform">("byok");
  return (
    <>
      <Heading
        eyebrow="05 — Runtime"
        title="Choose your runtime provider"
        subtitle="You can switch this anytime."
      />
      <div className="grid gap-3 md:grid-cols-2">
        <button
          onClick={() => setPick("byok")}
          className={`rounded-xl border p-5 text-left transition ${pick === "byok" ? "border-primary/60 bg-primary/5" : "border-border bg-surface-1"}`}
        >
          <div className="flex items-center justify-between">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-primary">
              <KeyRound className="h-4 w-4" />
            </span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              Free
            </span>
          </div>
          <p className="mt-3 font-medium">Bring your own Groq key</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Use your personal Groq account for free runtime.
          </p>
        </button>
        <button
          onClick={() => setPick("platform")}
          className={`relative overflow-hidden rounded-xl border p-5 text-left transition ${pick === "platform" ? "border-primary/60 bg-primary/5" : "border-border bg-card"}`}
        >
          <div className="absolute -right-12 top-4 rotate-45 bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] px-12 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
            Premium
          </div>
          <div className="flex items-center justify-between">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
              <Cpu className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-medium">Platform runtime</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Managed AI infrastructure · hosted runtime.
          </p>
        </button>
      </div>
      {pick === "byok" && (
        <div className="mt-5 rounded-xl border border-border bg-surface-1 p-4">
          <Label htmlFor="key">Groq API key</Label>
          <div className="mt-2 flex gap-2">
            <Input
              id="key"
              type="password"
              placeholder="gsk_••••••••••••••••"
              className="font-mono"
            />
            <Button variant="outline" className="border-border bg-secondary">
              <ShieldCheck className="mr-1 h-4 w-4" />
              Test
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Encrypted at rest. Never logged.</p>
        </div>
      )}
    </>
  );
}

function Ready() {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight">Your AI agent is ready</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        We've provisioned your runtime and indexed your knowledge.
      </p>
      <div className="mt-6 grid gap-2 text-left sm:grid-cols-3">
        {[
          { i: Bot, t: "Agent created" },
          { i: Upload, t: "Knowledge indexed" },
          { i: Cpu, t: "Runtime online" },
        ].map((x) => (
          <div key={x.t} className="rounded-lg border border-border bg-surface-1 p-3">
            <x.i className="h-4 w-4 text-primary" />
            <p className="mt-2 text-sm">{x.t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
