import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bot, ArrowRight, Brain, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DashboardLayout, PageHeader } from "@/layouts/dashboard-layout";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useAgentMutations } from "../hooks/use-agents";
import type { AgentOutputFormat, AgentTone, AgentVisibility } from "../types/agent.types";

export function CreateAgentPage() {
  const navigate = useNavigate();
  const { create } = useAgentMutations();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("AI runtime assistant");
  const [tone, setTone] = useState<AgentTone>("professional");
  const [behavior, setBehavior] = useState(
    "Answer using the configured knowledge base. Cite retrieved context when relevant.",
  );
  const [outputFormat, setOutputFormat] = useState<AgentOutputFormat>("paragraph");
  const [visibility, setVisibility] = useState<AgentVisibility>("private");
  const [strictKnowledgeMode, setStrictKnowledgeMode] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("Hi, how can I help you today?");
  const [theme, setTheme] = useState("light");
  const [avatar, setAvatar] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { bot } = await create.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        role: role.trim(),
        tone,
        instructions: behavior.trim(),
        outputFormat,
        visibility,
        strictKnowledgeMode,
        welcomeMessage: welcomeMessage.trim(),
        theme,
        avatar: avatar.trim(),
      });
      navigate({ to: "/agents/$agentId", params: { agentId: bot.id } });
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Agent could not be created. Please sign in again and retry."),
      );
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Provision runtime"
        title="New agent"
        description="Create a backend-backed bot runtime using the real bot schema."
      />
      <form onSubmit={submit} className="mx-auto grid max-w-6xl gap-5 p-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5 rounded-xl border border-border bg-card p-5 elevated">
          <div className="space-y-2">
            <Label htmlFor="name">Bot name</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Support Copilot"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Customer support assistant for product, billing, and troubleshooting questions."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Runtime role</Label>
            <Input
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              maxLength={120}
              placeholder="Customer support specialist"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <select
              id="tone"
              value={tone}
              onChange={(event) => setTone(event.target.value as AgentTone)}
              className="h-10 w-full rounded-md border border-border bg-input px-3 text-sm"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="casual">Casual</option>
              <option value="concise">Concise</option>
              <option value="technical">Technical</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="behavior">Behavior / system instructions</Label>
            <Textarea
              id="behavior"
              value={behavior}
              onChange={(event) => setBehavior(event.target.value)}
              rows={7}
              maxLength={4000}
              placeholder="Define how this bot should reason, respond, cite knowledge, escalate, and handle unknown answers."
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="outputFormat">Output format</Label>
              <select
                id="outputFormat"
                value={outputFormat}
                onChange={(event) => setOutputFormat(event.target.value as AgentOutputFormat)}
                className="h-10 w-full rounded-md border border-border bg-input px-3 text-sm"
              >
                <option value="paragraph">Paragraph</option>
                <option value="bullet_points">Bullet points</option>
                <option value="structured_json">Structured JSON</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Input
                id="theme"
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
                maxLength={40}
                placeholder="light"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Visibility</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility("private")}
                  className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm ${
                    visibility === "private"
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-border bg-surface-1 text-muted-foreground"
                  }`}
                >
                  <Lock className="h-4 w-4" /> Private
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility("public")}
                  className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm ${
                    visibility === "public"
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-border bg-surface-1 text-muted-foreground"
                  }`}
                >
                  <Globe className="h-4 w-4" /> Public
                </button>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface-1 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label htmlFor="strictKnowledge">Strict knowledge mode</Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Answer only from retrieved documents when enabled.
                  </p>
                </div>
                <Switch
                  id="strictKnowledge"
                  checked={strictKnowledgeMode}
                  onCheckedChange={setStrictKnowledgeMode}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">Welcome message</Label>
            <Input
              id="welcomeMessage"
              value={welcomeMessage}
              onChange={(event) => setWelcomeMessage(event.target.value)}
              maxLength={300}
              placeholder="Hi, how can I help you today?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={avatar}
              onChange={(event) => setAvatar(event.target.value)}
              maxLength={500}
              placeholder="https://..."
            />
          </div>
          <Button
            disabled={create.isPending}
            className="bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
          >
            {create.isPending ? "Provisioning..." : "Create runtime"}{" "}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <aside className="rounded-xl border border-border bg-card p-5">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--accent-blue)]/30 to-[color:var(--accent-violet)]/30 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-medium">{name || "New bot runtime"}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {description || "Backend bot record will be created from this schema."}
          </p>
          <div className="mt-4 rounded-lg border border-border bg-surface-1 p-3">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Brain className="h-4 w-4 text-primary" />
              {tone} · {outputFormat.replace("_", " ")}
            </div>
            <p className="mt-2 line-clamp-5 text-xs text-muted-foreground">{behavior}</p>
          </div>
          <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
            <li>API: POST /api/bots</li>
            <li>Visibility: {visibility}</li>
            <li>Strict knowledge: {strictKnowledgeMode ? "enabled" : "disabled"}</li>
            <li>Runtime preview available after create</li>
          </ul>
        </aside>
      </form>
    </DashboardLayout>
  );
}
