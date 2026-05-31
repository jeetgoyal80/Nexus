import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Activity,
  Bot,
  Code2,
  Cpu,
  Database,
  FileText,
  Globe,
  Lock,
  Save,
  Send,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout, PageHeader } from "@/layouts/dashboard-layout";
import { OperationalIndicator } from "@/shared/components/ui/operational-indicator";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useDocuments } from "@/features/knowledge/hooks/use-documents";
import { useSendChatMessage } from "@/features/chat/hooks/use-chat-runtime";
import { useAgent, useAgentMutations } from "../hooks/use-agents";
import type { AgentOutputFormat, AgentTone, AgentVisibility } from "../types/agent.types";

export function AgentBuilderPage({ agentId }: { agentId: string }) {
  const agent = useAgent(agentId);
  const docs = useDocuments(agentId);
  const { update } = useAgentMutations();
  const [draft, setDraft] = useState({
    name: "",
    role: "",
    tone: "professional" as AgentTone,
    instructions: "",
    outputFormat: "paragraph" as AgentOutputFormat,
    visibility: "private" as AgentVisibility,
    strictKnowledgeMode: false,
  });

  useEffect(() => {
    if (!agent.data) return;
    setDraft({
      name: agent.data.name,
      role: agent.data.role,
      tone: agent.data.tone,
      instructions: agent.data.instructions,
      outputFormat: agent.data.outputFormat,
      visibility: agent.data.visibility,
      strictKnowledgeMode: agent.data.strictKnowledgeMode,
    });
  }, [agent.data]);

  const save = () => update.mutate({ agentId, payload: draft });
  const readyDocs = docs.data?.filter((doc) => doc.status === "COMPLETED").length ?? 0;
  const processingDocs =
    docs.data?.filter((doc) => doc.status === "PENDING" || doc.status === "PROCESSING").length ?? 0;

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Bot Builder"
        title={agent.data?.name ?? agentId}
        description="Configure behavior, runtime, retrieval, and deployment from live backend state."
        actions={
          <>
            <OperationalIndicator
              state={agent.isFetching ? "processing" : "healthy"}
              label={agent.isFetching ? "syncing" : "configuration live"}
            />
            <Button
              onClick={save}
              disabled={update.isPending || !agent.data}
              className="bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
            >
              <Save className="mr-1 h-4 w-4" />
              {update.isPending ? "Saving..." : "Save"}
            </Button>
          </>
        }
      />
      <div className="grid h-[calc(100vh-9rem)] gap-4 p-4 lg:grid-cols-[320px_1fr_340px]">
        <ConfigPanel draft={draft} setDraft={setDraft} />
        <LivePreview agentId={agentId} welcomeMessage={agent.data?.welcomeMessage} />
        <RuntimePanel
          agentId={agentId}
          readyDocs={readyDocs}
          processingDocs={processingDocs}
          docs={docs.data ?? []}
          visibility={draft.visibility}
        />
      </div>
    </DashboardLayout>
  );
}

function ConfigPanel({
  draft,
  setDraft,
}: {
  draft: {
    name: string;
    role: string;
    tone: AgentTone;
    instructions: string;
    outputFormat: AgentOutputFormat;
    visibility: AgentVisibility;
    strictKnowledgeMode: boolean;
  };
  setDraft: React.Dispatch<
    React.SetStateAction<{
      name: string;
      role: string;
      tone: AgentTone;
      instructions: string;
      outputFormat: AgentOutputFormat;
      visibility: AgentVisibility;
      strictKnowledgeMode: boolean;
    }>
  >;
}) {
  return (
    <div className="scrollbar-thin overflow-y-auto rounded-xl border border-border bg-card elevated">
      <PanelHeader icon={Sliders} title="Configuration" />
      <div className="space-y-5 p-4">
        <Field label="Name">
          <Input
            value={draft.name}
            onChange={(event) => setDraft((state) => ({ ...state, name: event.target.value }))}
          />
        </Field>
        <Field label="Role">
          <Input
            value={draft.role}
            onChange={(event) => setDraft((state) => ({ ...state, role: event.target.value }))}
          />
        </Field>
        <Field label="Tone">
          <select
            value={draft.tone}
            onChange={(event) =>
              setDraft((state) => ({ ...state, tone: event.target.value as AgentTone }))
            }
            className="h-10 w-full rounded-md border border-border bg-input px-3 text-sm"
          >
            {["professional", "technical", "friendly", "casual", "concise"].map((tone) => (
              <option key={tone}>{tone}</option>
            ))}
          </select>
        </Field>
        <Field label="System instructions">
          <Textarea
            rows={6}
            value={draft.instructions}
            onChange={(event) =>
              setDraft((state) => ({ ...state, instructions: event.target.value }))
            }
          />
        </Field>
        <Field label="Output format">
          <div className="grid grid-cols-3 gap-1 rounded-md border border-border bg-secondary p-0.5 text-xs">
            {(["paragraph", "bullet_points", "structured_json"] as AgentOutputFormat[]).map(
              (format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => setDraft((state) => ({ ...state, outputFormat: format }))}
                  className={`rounded px-2 py-1.5 ${draft.outputFormat === format ? "bg-background" : "text-muted-foreground"}`}
                >
                  {format.replace("_", " ")}
                </button>
              ),
            )}
          </div>
        </Field>
        <Field label="Visibility">
          <div className="grid grid-cols-2 gap-2">
            {(["public", "private"] as AgentVisibility[]).map((visibility) => {
              const Icon = visibility === "public" ? Globe : Lock;
              return (
                <button
                  key={visibility}
                  type="button"
                  onClick={() => setDraft((state) => ({ ...state, visibility }))}
                  className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs ${draft.visibility === visibility ? "border-primary/50 bg-primary/10 text-foreground" : "border-border bg-surface-1 text-muted-foreground"}`}
                >
                  <Icon className="h-3.5 w-3.5" /> {visibility}
                </button>
              );
            })}
          </div>
        </Field>
      </div>
    </div>
  );
}

function LivePreview({ agentId, welcomeMessage }: { agentId: string; welcomeMessage?: string }) {
  const sendMessage = useSendChatMessage();
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();
  const [messages, setMessages] = useState<{ from: "assistant" | "user"; text: string }[]>([
    {
      from: "assistant" as const,
      text: welcomeMessage || "Runtime preview connected. Ask a grounded question.",
    },
  ]);

  const send = async () => {
    if (!input.trim() || sendMessage.isPending) return;
    const message = input;
    setInput("");
    setMessages((state) => [...state, { from: "user", text: message }]);
    try {
      const result = await sendMessage.mutateAsync({
        botId: agentId,
        message,
        conversationId,
        sessionId,
      });
      setConversationId(result.conversationId);
      setSessionId(result.sessionId ?? undefined);
      setMessages((state) => [...state, { from: "assistant", text: result.response }]);
    } catch (error) {
      const text = getApiErrorMessage(error, "Runtime chat failed");
      toast.error(text);
      setMessages((state) => [...state, { from: "assistant", text }]);
    }
  };

  return (
    <div className="flex min-h-0 flex-col rounded-xl border border-border bg-card elevated">
      <PanelHeader
        icon={Bot}
        title="Live runtime preview"
        right={
          <OperationalIndicator
            state={sendMessage.isPending ? "processing" : "healthy"}
            label={sendMessage.isPending ? "generating" : "Groq ready"}
          />
        }
      />
      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-5">
        {messages.map((message, index) => (
          <motion.div
            key={`${message.from}-${index}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${message.from === "user" ? "bg-primary text-primary-foreground" : "border border-border bg-surface-1"}`}
            >
              {message.from === "assistant" && (
                <Sparkles className="mr-1 inline h-3 w-3 text-primary" />
              )}
              {message.text}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && send()}
            placeholder="Ask the live runtime..."
            className="bg-secondary/60"
          />
          <Button
            onClick={send}
            disabled={sendMessage.isPending}
            className="bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">
          POST /api/chat/{agentId} · retrieval context enabled server-side
        </p>
      </div>
    </div>
  );
}

function RuntimePanel({
  agentId,
  readyDocs,
  processingDocs,
  docs,
  visibility,
}: {
  agentId: string;
  readyDocs: number;
  processingDocs: number;
  docs: { id: string; originalName: string; status: string }[];
  visibility: AgentVisibility;
}) {
  return (
    <div className="scrollbar-thin overflow-y-auto rounded-xl border border-border bg-card elevated">
      <PanelHeader icon={Activity} title="Runtime systems" />
      <div className="space-y-5 p-4">
        <div>
          <Label>Knowledge readiness</Label>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <Stat k="indexed" v={String(readyDocs)} />
            <Stat k="ingesting" v={String(processingDocs)} />
            <Stat k="mode" v={readyDocs ? "ready" : "cold"} />
          </div>
        </div>
        <div>
          <Label>Documents</Label>
          <ul className="mt-2 space-y-1.5 text-xs">
            {docs.slice(0, 5).map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between rounded-md border border-border bg-surface-1 px-2.5 py-1.5"
              >
                <span className="truncate font-mono">{doc.originalName}</span>
                <span className="text-[10px] text-muted-foreground">{doc.status}</span>
              </li>
            ))}
            {!docs.length && (
              <li className="rounded-md border border-border bg-surface-1 px-2.5 py-4 text-center text-muted-foreground">
                No knowledge attached
              </li>
            )}
          </ul>
        </div>
        <div>
          <Label>SDK snippet</Label>
          <div className="mt-2 overflow-hidden rounded-md border border-border bg-surface-1">
            <div className="flex items-center gap-1.5 border-b border-border px-2 py-1.5">
              <Code2 className="h-3 w-3 text-primary" />
              <span className="font-mono text-[10px] text-muted-foreground">embed.tsx</span>
            </div>
            <pre className="scrollbar-thin overflow-x-auto p-3 text-[11px]">{`<ChatBot botId="${agentId}" />`}</pre>
          </div>
        </div>
        <div>
          <Label>Deployment</Label>
          <div className="mt-2 rounded-md border border-border bg-surface-1 p-3">
            <OperationalIndicator
              state={visibility === "public" ? "healthy" : "offline"}
              label={visibility === "public" ? "public endpoint live" : "private runtime"}
            />
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">/bot/{agentId}</p>
          </div>
        </div>
        <div>
          <Label>Runtime</Label>
          <div className="mt-2 rounded-md border border-border bg-surface-1 p-3 text-xs">
            <p className="flex items-center gap-2 font-medium">
              <Cpu className="h-3.5 w-3.5 text-primary" /> Groq runtime
            </p>
            <p className="mt-1 text-muted-foreground">
              Streaming-ready · RAG orchestration · token accounting-ready
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function PanelHeader({
  icon: Icon,
  title,
  right,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium">{title}</p>
      </div>
      {right}
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-surface-1 px-2 py-1.5 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
      <p className="mt-0.5 truncate text-xs font-medium">{v}</p>
    </div>
  );
}
