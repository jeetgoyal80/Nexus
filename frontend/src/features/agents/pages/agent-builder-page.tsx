import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  Bot,
  Briefcase,
  Code2,
  Cpu,
  Globe,
  GraduationCap,
  Lock,
  MessageCircle,
  Palette,
  Save,
  Sliders,
  Sparkles,
  Wand2,
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
import {
  applyThemePreset,
  defaultAppearanceConfig,
  mergeAppearanceConfig,
  themePresets,
  updatePrimaryColor,
} from "../appearance/appearance-config";
import { ChatAppearancePreview } from "../appearance/chat-appearance-preview";
import type { AppearanceConfig } from "../appearance/appearance.types";
import { useAgent, useAgentMutations } from "../hooks/use-agents";
import type { AgentOutputFormat, AgentTone, AgentVisibility } from "../types/agent.types";

type BuilderTab = "general" | "personality" | "knowledge" | "runtime" | "appearance" | "deployment";

type BuilderDraft = {
  name: string;
  description: string;
  role: string;
  tone: AgentTone;
  instructions: string;
  outputFormat: AgentOutputFormat;
  visibility: AgentVisibility;
  strictKnowledgeMode: boolean;
  welcomeMessage: string;
  avatar: string;
  theme: string;
  appearanceConfig: AppearanceConfig;
};

const tabs: Array<{ id: BuilderTab; label: string }> = [
  { id: "general", label: "General" },
  { id: "personality", label: "Personality" },
  { id: "knowledge", label: "Knowledge" },
  { id: "runtime", label: "Runtime" },
  { id: "appearance", label: "Appearance" },
  { id: "deployment", label: "Deployment" },
];

const createInitialDraft = (): BuilderDraft => ({
  name: "",
  description: "",
  role: "",
  tone: "professional",
  instructions: "",
  outputFormat: "paragraph",
  visibility: "private",
  strictKnowledgeMode: false,
  welcomeMessage: "Hi, how can I help you today?",
  avatar: "",
  theme: "light",
  appearanceConfig: defaultAppearanceConfig,
});

export function AgentBuilderPage({ agentId }: { agentId: string }) {
  const agent = useAgent(agentId);
  const docs = useDocuments(agentId);
  const { update } = useAgentMutations();
  const [activeTab, setActiveTab] = useState<BuilderTab>("appearance");
  const [draft, setDraft] = useState<BuilderDraft>(createInitialDraft);

  useEffect(() => {
    if (!agent.data) return;

    const appearanceConfig = mergeAppearanceConfig({
      ...agent.data.appearanceConfig,
      avatarUrl: agent.data.appearanceConfig?.avatarUrl || agent.data.avatar,
      headerTitle: agent.data.appearanceConfig?.headerTitle || agent.data.name,
      welcomeMessage: agent.data.appearanceConfig?.welcomeMessage || agent.data.welcomeMessage,
    });

    setDraft({
      name: agent.data.name,
      description: agent.data.description,
      role: agent.data.role,
      tone: agent.data.tone,
      instructions: agent.data.instructions,
      outputFormat: agent.data.outputFormat,
      visibility: agent.data.visibility,
      strictKnowledgeMode: agent.data.strictKnowledgeMode,
      welcomeMessage: agent.data.welcomeMessage,
      avatar: agent.data.avatar,
      theme: agent.data.theme,
      appearanceConfig,
    });
  }, [agent.data]);

  const readyDocs = docs.data?.filter((doc) => doc.status === "embedded").length ?? 0;
  const processingDocs =
    docs.data?.filter((doc) => doc.status === "uploaded" || doc.status === "processing").length ?? 0;

  const save = () => {
    const deploymentMode =
      draft.appearanceConfig.deploymentMode === "floating-widget"
        ? "widget"
        : draft.appearanceConfig.deploymentMode;

    update.mutate(
      {
        agentId,
        payload: {
          ...draft,
          deploymentMode,
          appearanceConfig: draft.appearanceConfig,
          welcomeMessage: draft.appearanceConfig.welcomeMessage || draft.welcomeMessage,
          avatar: draft.appearanceConfig.avatarUrl || draft.avatar,
          theme: draft.appearanceConfig.theme,
        },
      },
      {
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to save bot")),
      },
    );
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Bot Builder"
        title={draft.name || agent.data?.name || agentId}
        description="Configure behavior, retrieval, runtime, appearance, and deployment from one source of truth."
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

      <div className="border-b border-border px-4">
        <div className="scrollbar-thin flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-3 py-3 text-sm transition ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid h-[calc(100vh-12rem)] gap-4 p-4 lg:grid-cols-[340px_1fr_360px]">
        {activeTab === "appearance" ? (
          <>
            <AppearanceControls draft={draft} setDraft={setDraft} />
            <StyledRuntimePreview agentId={agentId} draft={draft} />
            <AdvancedAppearanceControls draft={draft} setDraft={setDraft} />
          </>
        ) : (
          <>
            <ConfigPanel activeTab={activeTab} draft={draft} setDraft={setDraft} />
            <StyledRuntimePreview agentId={agentId} draft={draft} />
            <RuntimePanel
              agentId={agentId}
              activeTab={activeTab}
              readyDocs={readyDocs}
              processingDocs={processingDocs}
              docs={docs.data ?? []}
              visibility={draft.visibility}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function ConfigPanel({
  activeTab,
  draft,
  setDraft,
}: {
  activeTab: BuilderTab;
  draft: BuilderDraft;
  setDraft: React.Dispatch<React.SetStateAction<BuilderDraft>>;
}) {
  return (
    <PanelShell icon={Sliders} title={`${activeTab[0].toUpperCase()}${activeTab.slice(1)} settings`}>
      {activeTab === "general" && (
        <>
          <Field label="Bot name">
            <Input value={draft.name} onChange={(event) => setDraftValue(setDraft, "name", event.target.value)} />
          </Field>
          <Field label="Description">
            <Textarea
              rows={4}
              value={draft.description}
              onChange={(event) => setDraftValue(setDraft, "description", event.target.value)}
            />
          </Field>
          <Field label="Visibility">
            <VisibilityPicker draft={draft} setDraft={setDraft} />
          </Field>
        </>
      )}

      {activeTab === "personality" && (
        <>
          <Field label="Role">
            <Input value={draft.role} onChange={(event) => setDraftValue(setDraft, "role", event.target.value)} />
          </Field>
          <Field label="Tone">
            <select
              value={draft.tone}
              onChange={(event) => setDraftValue(setDraft, "tone", event.target.value as AgentTone)}
              className="h-10 w-full rounded-md border border-border bg-input px-3 text-sm"
            >
              {["professional", "technical", "friendly", "casual", "concise"].map((tone) => (
                <option key={tone}>{tone}</option>
              ))}
            </select>
          </Field>
          <Field label="System instructions">
            <Textarea
              rows={8}
              value={draft.instructions}
              onChange={(event) => setDraftValue(setDraft, "instructions", event.target.value)}
            />
          </Field>
          <Field label="Output format">
            <Segmented
              value={draft.outputFormat}
              values={["paragraph", "bullet_points", "structured_json"]}
              onChange={(value) => setDraftValue(setDraft, "outputFormat", value as AgentOutputFormat)}
            />
          </Field>
        </>
      )}

      {activeTab === "knowledge" && (
        <>
          <Field label="Knowledge grounding">
            <ToggleRow
              label="Strict knowledge mode"
              checked={draft.strictKnowledgeMode}
              onChange={(checked) => setDraftValue(setDraft, "strictKnowledgeMode", checked)}
            />
          </Field>
          <p className="rounded-md border border-border bg-surface-1 p-3 text-sm text-muted-foreground">
            Documents remain managed from Knowledge Base. This bot has retrieval context enabled
            server-side when indexed knowledge exists.
          </p>
        </>
      )}

      {activeTab === "runtime" && (
        <>
          <Field label="Runtime identity">
            <Input value={draft.name} onChange={(event) => setDraftValue(setDraft, "name", event.target.value)} />
          </Field>
          <Field label="Output format">
            <Segmented
              value={draft.outputFormat}
              values={["paragraph", "bullet_points", "structured_json"]}
              onChange={(value) => setDraftValue(setDraft, "outputFormat", value as AgentOutputFormat)}
            />
          </Field>
        </>
      )}

      {activeTab === "deployment" && (
        <DeploymentControls draft={draft} setDraft={setDraft} />
      )}
    </PanelShell>
  );
}

function DeploymentControls({
  draft,
  setDraft,
}: {
  draft: BuilderDraft;
  setDraft: React.Dispatch<React.SetStateAction<BuilderDraft>>;
}) {
  const mode = draft.appearanceConfig.deploymentMode;

  return (
    <>
      <Field label="Visibility">
        <VisibilityPicker draft={draft} setDraft={setDraft} />
      </Field>

      <Field label="Deployment mode">
        <Segmented
          value={mode}
          values={["fullscreen", "floating-widget", "embedded"]}
          onChange={(deploymentMode) => updateAppearance(setDraft, { deploymentMode })}
        />
      </Field>

      {mode === "fullscreen" && (
        <div className="rounded-lg border border-border bg-surface-1 p-3 text-sm text-muted-foreground">
          Full Screen Assistant uses the whole public bot page, so launcher position and widget size are hidden.
        </div>
      )}

      {mode === "floating-widget" && (
        <>
          <Field label="Widget position">
            <Segmented
              value={draft.appearanceConfig.widgetConfig.position}
              values={["bottom-right", "bottom-left"]}
              onChange={(position) =>
                updateAppearance(setDraft, {
                  widgetPosition: position,
                  widgetConfig: { ...draft.appearanceConfig.widgetConfig, position },
                })
              }
            />
          </Field>
          <Field label="Widget size">
            <Segmented
              value={draft.appearanceConfig.widgetConfig.size}
              values={["small", "medium", "large"]}
              onChange={(size) =>
                updateAppearance(setDraft, {
                  widgetSize: size,
                  widgetConfig: { ...draft.appearanceConfig.widgetConfig, size },
                })
              }
            />
          </Field>
          <Field label="Widget icon">
            <Segmented
              value={draft.appearanceConfig.widgetConfig.icon}
              values={["message-circle", "sparkles", "bot"]}
              onChange={(icon) =>
                updateAppearance(setDraft, {
                  widgetIcon: icon,
                  widgetConfig: { ...draft.appearanceConfig.widgetConfig, icon },
                })
              }
            />
          </Field>
          <ColorControl
            label="Launcher color"
            value={draft.appearanceConfig.widgetConfig.color}
            onChange={(color) =>
              updateAppearance(setDraft, {
                widgetColor: color,
                widgetConfig: { ...draft.appearanceConfig.widgetConfig, color },
              })
            }
          />
        </>
      )}

      {mode === "embedded" && (
        <>
          <RangeControl
            label="Embed width"
            min={320}
            max={960}
            value={draft.appearanceConfig.embeddedConfig.width}
            onChange={(width) =>
              updateAppearance(setDraft, {
                embeddedConfig: { ...draft.appearanceConfig.embeddedConfig, width },
              })
            }
          />
          <RangeControl
            label="Embed height"
            min={420}
            max={900}
            value={draft.appearanceConfig.embeddedConfig.height}
            onChange={(height) =>
              updateAppearance(setDraft, {
                embeddedConfig: { ...draft.appearanceConfig.embeddedConfig, height },
              })
            }
          />
          <Field label="Layout options">
            <Segmented
              value={draft.appearanceConfig.embeddedConfig.layout}
              values={["standard-chat", "modern-assistant", "minimal", "enterprise"]}
              onChange={(layout) =>
                updateAppearance(setDraft, {
                  layoutType: layout,
                  embeddedConfig: { ...draft.appearanceConfig.embeddedConfig, layout },
                })
              }
            />
          </Field>
        </>
      )}
    </>
  );
}

function AppearanceControls({
  draft,
  setDraft,
}: {
  draft: BuilderDraft;
  setDraft: React.Dispatch<React.SetStateAction<BuilderDraft>>;
}) {
  const selectedPreset = useMemo(
    () => themePresets.find((preset) => preset.id === draft.appearanceConfig.theme),
    [draft.appearanceConfig.theme],
  );
  const comparisonThemes = themePresets.slice(0, 4);

  return (
    <PanelShell icon={Palette} title="Appearance settings">
      <div>
        <Label>Professional presets</Label>
        <div className="mt-2 grid gap-2">
          {themePresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() =>
                setDraft((state) => ({
                  ...state,
                  theme: preset.id,
                  appearanceConfig: applyThemePreset(state.appearanceConfig, preset.id),
                }))
              }
              className={`rounded-lg border p-3 text-left transition hover:-translate-y-0.5 ${
                draft.appearanceConfig.theme === preset.id
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-surface-1 hover:border-primary/50"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex gap-1">
                {[
                  preset.config.primaryColor ?? defaultAppearanceConfig.primaryColor,
                  preset.config.backgroundColor ?? defaultAppearanceConfig.backgroundColor,
                  preset.config.secondaryColor ?? defaultAppearanceConfig.secondaryColor,
                ].map((color) => (
                  <span key={color} className="h-4 w-4 rounded-full" style={{ background: color }} />
                ))}
                </div>
                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                  {preset.surface}
                </span>
              </div>
              <p className="text-xs font-medium">{preset.name}</p>
              <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
        {selectedPreset && (
          <p className="mt-2 text-xs text-muted-foreground">Selected: {selectedPreset.name}</p>
        )}
      </div>

      <div className="rounded-lg border border-border bg-surface-1 p-3">
        <Label>Brand color</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          The theme engine derives readable text, borders, hover states, bubbles, and accents from this.
        </p>
        <div className="mt-3">
          <ColorControl
            label="Primary"
            value={draft.appearanceConfig.primaryColor}
            onChange={(value) =>
              setDraft((state) => ({
                ...state,
                appearanceConfig: updatePrimaryColor(state.appearanceConfig, value),
              }))
            }
          />
        </div>
      </div>

      <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3">
        <p className="text-xs font-medium text-emerald-200">Theme safety active</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Contrast, message surfaces, borders, spacing, and radius values are normalized before preview, save, and public runtime rendering.
        </p>
      </div>

      <div>
        <Label>Theme comparison</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {comparisonThemes.map((theme) => {
            const preview = mergeAppearanceConfig({ ...draft.appearanceConfig, ...theme.config, theme: theme.id });
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() =>
                  setDraft((state) => ({
                    ...state,
                    appearanceConfig: applyThemePreset(state.appearanceConfig, theme.id),
                  }))
                }
                className="overflow-hidden rounded-lg border border-border bg-surface-1 text-left shadow-sm transition hover:border-primary/60"
              >
                <div className="h-16 p-2" style={{ background: preview.backgroundColor }}>
                  <div className="mb-2 h-2 w-12 rounded-full" style={{ background: preview.borderColor }} />
                  <div className="ml-auto h-4 w-14 rounded-full" style={{ background: preview.userBubbleColor }} />
                  <div className="mt-1 h-4 w-16 rounded-full" style={{ background: preview.botBubbleColor }} />
                </div>
                <div className="px-2 py-1.5">
                  <p className="truncate text-[11px] font-medium">{theme.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Typography">
        <select
          value={draft.appearanceConfig.fontFamily}
          onChange={(event) =>
            updateAppearance(setDraft, { fontFamily: event.target.value as AppearanceConfig["fontFamily"] })
          }
          className="h-10 w-full rounded-md border border-border bg-input px-3 text-sm"
        >
          {["Inter", "Geist", "Poppins", "Satoshi", "Roboto"].map((font) => (
            <option key={font}>{font}</option>
          ))}
        </select>
      </Field>
      <RangeControl label="Font size" min={12} max={20} value={draft.appearanceConfig.fontSize} onChange={(fontSize) => updateAppearance(setDraft, { fontSize })} />
      <RangeControl label="Message spacing" min={6} max={28} value={draft.appearanceConfig.messageSpacing} onChange={(messageSpacing) => updateAppearance(setDraft, { messageSpacing })} />
      <RangeControl label="Line height" min={1.2} max={2} step={0.1} value={draft.appearanceConfig.lineHeight} onChange={(lineHeight) => updateAppearance(setDraft, { lineHeight })} />
    </PanelShell>
  );
}

function AdvancedAppearanceControls({
  draft,
  setDraft,
}: {
  draft: BuilderDraft;
  setDraft: React.Dispatch<React.SetStateAction<BuilderDraft>>;
}) {
  return (
    <PanelShell icon={Wand2} title="Advanced customization">
      <Field label="Header title">
        <Input
          value={draft.appearanceConfig.headerTitle}
          onChange={(event) => updateAppearance(setDraft, { headerTitle: event.target.value })}
        />
      </Field>
      <Field label="Subtitle">
        <Input
          value={draft.appearanceConfig.headerSubtitle}
          onChange={(event) => updateAppearance(setDraft, { headerSubtitle: event.target.value })}
        />
      </Field>
      <Field label="Status text">
        <Input
          value={draft.appearanceConfig.statusText}
          onChange={(event) => updateAppearance(setDraft, { statusText: event.target.value })}
        />
      </Field>
      <Field label="Avatar URL">
        <Input
          value={draft.appearanceConfig.avatarUrl}
          placeholder="https://..."
          onChange={(event) => updateAppearance(setDraft, { avatarUrl: event.target.value })}
        />
      </Field>
      <Field label="Avatar icon">
        <IconPicker
          value={draft.appearanceConfig.avatarIcon}
          onChange={(avatarIcon) => updateAppearance(setDraft, { avatarIcon })}
        />
      </Field>
      <Field label="Avatar shape">
        <Segmented
          value={draft.appearanceConfig.avatarShape}
          values={["circle", "rounded", "square"]}
          onChange={(value) => updateAppearance(setDraft, { avatarShape: value as AppearanceConfig["avatarShape"] })}
        />
      </Field>
      <Field label="Welcome title">
        <Input
          value={draft.appearanceConfig.welcomeTitle}
          onChange={(event) => updateAppearance(setDraft, { welcomeTitle: event.target.value })}
        />
      </Field>
      <Field label="Welcome message">
        <Textarea
          rows={3}
          value={draft.appearanceConfig.welcomeMessage}
          onChange={(event) => updateAppearance(setDraft, { welcomeMessage: event.target.value })}
        />
      </Field>
      <Field label="Starter prompts">
        <Textarea
          rows={4}
          value={draft.appearanceConfig.starterPrompts.join("\n")}
          onChange={(event) =>
            updateAppearance(setDraft, {
              starterPrompts: event.target.value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
                .slice(0, 6),
            })
          }
        />
      </Field>
      <RangeControl label="Rounded corners" min={0} max={32} value={draft.appearanceConfig.borderRadius} onChange={(borderRadius) => updateAppearance(setDraft, { borderRadius })} />
      <RangeControl label="Border thickness" min={0} max={4} value={draft.appearanceConfig.borderThickness} onChange={(borderThickness) => updateAppearance(setDraft, { borderThickness })} />
      <RangeControl label="Bot bubble radius" min={0} max={28} value={draft.appearanceConfig.botBubbleRadius} onChange={(botBubbleRadius) => updateAppearance(setDraft, { botBubbleRadius })} />
      <RangeControl label="User bubble radius" min={0} max={28} value={draft.appearanceConfig.userBubbleRadius} onChange={(userBubbleRadius) => updateAppearance(setDraft, { userBubbleRadius })} />
      <Field label="Density">
        <Segmented
          value={draft.appearanceConfig.density}
          values={["compact", "comfortable", "spacious"]}
          onChange={(value) => updateAppearance(setDraft, { density: value as AppearanceConfig["density"] })}
        />
      </Field>
      <ToggleRow
        label="Glass effect"
        checked={draft.appearanceConfig.glassEffect}
        onChange={(glassEffect) => updateAppearance(setDraft, { glassEffect })}
      />
      <ToggleRow
        label="Online indicator"
        checked={draft.appearanceConfig.showOnlineIndicator}
        onChange={(showOnlineIndicator) => updateAppearance(setDraft, { showOnlineIndicator })}
      />
      <Field label="Input placeholder">
        <Input
          value={draft.appearanceConfig.inputPlaceholder}
          onChange={(event) => updateAppearance(setDraft, { inputPlaceholder: event.target.value })}
        />
      </Field>
      <Field label="Company name">
        <Input
          value={draft.appearanceConfig.companyName}
          onChange={(event) => updateAppearance(setDraft, { companyName: event.target.value })}
        />
      </Field>
      <Field label="Logo URL">
        <Input
          value={draft.appearanceConfig.logoUrl}
          placeholder="https://..."
          onChange={(event) => updateAppearance(setDraft, { logoUrl: event.target.value })}
        />
      </Field>
      <ToggleRow
        label="Powered by Platform"
        checked={draft.appearanceConfig.showPoweredBy}
        onChange={(showPoweredBy) => updateAppearance(setDraft, { showPoweredBy })}
      />
    </PanelShell>
  );
}

function StyledRuntimePreview({ agentId, draft }: { agentId: string; draft: BuilderDraft }) {
  const sendMessage = useSendChatMessage();
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string }[]>([]);
  const deploymentMode = draft.appearanceConfig.deploymentMode;

  useEffect(() => {
    setMessages((state) =>
      state.length
        ? state
        : [
            {
              role: "assistant",
              content:
                draft.appearanceConfig.welcomeMessage ||
                draft.welcomeMessage ||
                "Runtime preview connected. Ask a grounded question.",
            },
          ],
    );
  }, [draft.appearanceConfig.welcomeMessage, draft.welcomeMessage]);

  const send = async () => {
    if (!input.trim() || sendMessage.isPending) return;
    const content = input.trim();
    setInput("");
    setMessages((state) => [...state, { role: "user", content }]);

    try {
      const result = await sendMessage.mutateAsync({
        botId: agentId,
        message: content,
        conversationId,
        sessionId,
      });
      setConversationId(result.conversationId);
      setSessionId(result.sessionId ?? undefined);
      setMessages((state) => [...state, { role: "assistant", content: result.response }]);
    } catch (error) {
      const text = getApiErrorMessage(error, "Runtime chat failed");
      toast.error(text);
      setMessages((state) => [...state, { role: "assistant", content: text }]);
    }
  };

  const chatPreview = (
    <ChatAppearancePreview
      appearanceConfig={draft.appearanceConfig}
      botName={draft.name || "AI Assistant"}
      messages={messages}
      variant={deploymentMode === "fullscreen" ? "assistant" : "window"}
      interactive
      input={input}
      onInputChange={setInput}
      onSend={send}
      disabled={sendMessage.isPending}
    />
  );

  return (
    <div className="flex min-h-0 flex-col rounded-xl border border-border bg-card p-3 elevated">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium">
            {deploymentMode === "floating-widget"
              ? "Floating widget preview"
              : deploymentMode === "embedded"
                ? "Embedded component preview"
                : "Full screen assistant preview"}
          </p>
        </div>
        <OperationalIndicator
          state={sendMessage.isPending ? "processing" : "healthy"}
          label={sendMessage.isPending ? "generating" : deploymentMode}
        />
      </div>
      {deploymentMode === "floating-widget" ? (
        <FloatingWidgetPreview draft={draft}>{chatPreview}</FloatingWidgetPreview>
      ) : deploymentMode === "embedded" ? (
        <EmbeddedComponentPreview draft={draft}>{chatPreview}</EmbeddedComponentPreview>
      ) : (
        <div className="min-h-0 flex-1">{chatPreview}</div>
      )}
      <p className="mt-2 px-1 font-mono text-[10px] text-muted-foreground">
        POST /api/chat/{agentId} - appearanceConfig shared with public runtime and future SDK
      </p>
    </div>
  );
}

function FloatingWidgetPreview({ draft, children }: { draft: BuilderDraft; children: React.ReactNode }) {
  const config = draft.appearanceConfig;
  const sizeMap = {
    small: { width: 360, height: 560, launcher: 48 },
    medium: { width: 420, height: 620, launcher: 56 },
    large: { width: 480, height: 700, launcher: 64 },
  };
  const size = sizeMap[config.widgetConfig.size];
  const alignClass = config.widgetConfig.position === "bottom-left" ? "left-6" : "right-6";

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-[#f8fafc]">
      <div className="absolute inset-0 grid grid-cols-3 gap-4 p-6 opacity-80">
        <div className="col-span-2 space-y-4">
          <div className="h-12 rounded-xl bg-white shadow-sm" />
          <div className="h-40 rounded-xl bg-white shadow-sm" />
          <div className="h-28 rounded-xl bg-white shadow-sm" />
        </div>
        <div className="space-y-4">
          <div className="h-28 rounded-xl bg-white shadow-sm" />
          <div className="h-52 rounded-xl bg-white shadow-sm" />
        </div>
      </div>
      <div
        className={`absolute bottom-24 ${alignClass} overflow-hidden rounded-[22px] transition-all`}
        style={{ width: size.width, height: Math.min(size.height, 620) }}
      >
        {children}
      </div>
      <button
        type="button"
        className={`absolute bottom-6 ${alignClass} grid place-items-center rounded-full text-white shadow-2xl transition-all`}
        style={{
          width: size.launcher,
          height: size.launcher,
          background: config.widgetConfig.color,
        }}
      >
        <WidgetLauncherIcon icon={config.widgetConfig.icon} />
      </button>
    </div>
  );
}

function EmbeddedComponentPreview({ draft, children }: { draft: BuilderDraft; children: React.ReactNode }) {
  const config = draft.appearanceConfig;

  return (
    <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-border bg-[#f8fafc] p-6">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4 text-slate-900">
          <div>
            <p className="text-sm font-semibold">Example website page</p>
            <p className="text-xs text-slate-500">Embedded with &lt;ChatBot botId="{draft.name || "abc123"}" /&gt;</p>
          </div>
          <div className="h-8 w-24 rounded-full bg-slate-100" />
        </div>
        <div
          className="mx-auto overflow-hidden transition-all"
          style={{
            width: config.embeddedConfig.width,
            height: config.embeddedConfig.height,
            maxWidth: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function WidgetLauncherIcon({ icon }: { icon: AppearanceConfig["widgetConfig"]["icon"] }) {
  if (icon === "bot") return <Bot className="h-5 w-5" />;
  if (icon === "sparkles") return <Sparkles className="h-5 w-5" />;
  return <MessageCircle className="h-5 w-5" />;
}

function RuntimePanel({
  agentId,
  activeTab,
  readyDocs,
  processingDocs,
  docs,
  visibility,
}: {
  agentId: string;
  activeTab: BuilderTab;
  readyDocs: number;
  processingDocs: number;
  docs: { id: string; originalName: string; status: string }[];
  visibility: AgentVisibility;
}) {
  return (
    <PanelShell icon={Activity} title={activeTab === "deployment" ? "Deployment status" : "Runtime systems"}>
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
            Streaming-ready - RAG orchestration - appearance-aware runtime shell
          </p>
        </div>
      </div>
    </PanelShell>
  );
}

function VisibilityPicker({
  draft,
  setDraft,
}: {
  draft: BuilderDraft;
  setDraft: React.Dispatch<React.SetStateAction<BuilderDraft>>;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {(["public", "private"] as AgentVisibility[]).map((visibility) => {
        const Icon = visibility === "public" ? Globe : Lock;
        return (
          <button
            key={visibility}
            type="button"
            onClick={() => setDraftValue(setDraft, "visibility", visibility)}
            className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs ${
              draft.visibility === visibility
                ? "border-primary/50 bg-primary/10 text-foreground"
                : "border-border bg-surface-1 text-muted-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" /> {visibility}
          </button>
        );
      })}
    </div>
  );
}

function IconPicker({
  value,
  onChange,
}: {
  value: AppearanceConfig["avatarIcon"];
  onChange: (value: AppearanceConfig["avatarIcon"]) => void;
}) {
  const icons: Array<{ value: AppearanceConfig["avatarIcon"]; icon: React.ComponentType<{ className?: string }> }> = [
    { value: "sparkles", icon: Sparkles },
    { value: "bot", icon: Bot },
    { value: "message-circle", icon: MessageCircle },
    { value: "graduation-cap", icon: GraduationCap },
    { value: "briefcase", icon: Briefcase },
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
      {icons.map(({ value: item, icon: Icon }) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`grid h-10 place-items-center rounded-md border ${
            value === item ? "border-primary bg-primary/10" : "border-border bg-surface-1"
          }`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_44px_96px] items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-11 rounded border border-border bg-transparent p-1"
      />
      <Input value={value} onChange={(event) => onChange(event.target.value)} className="h-9 font-mono text-xs" />
    </div>
  );
}

function RangeControl({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[color:var(--accent-blue)]"
      />
    </div>
  );
}

function Segmented<T extends string>({
  value,
  values,
  onChange,
}: {
  value: T;
  values: T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-1 rounded-md border border-border bg-secondary p-1 text-xs" style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}>
      {values.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`rounded px-2 py-2 capitalize transition ${value === item ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          {item.replaceAll("-", " ").replaceAll("_", " ")}
        </button>
      ))}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-md border border-border bg-surface-1 px-3 py-2 text-sm"
    >
      <span>{label}</span>
      <span className={`h-5 w-9 rounded-full p-0.5 transition ${checked ? "bg-primary" : "bg-muted"}`}>
        <span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-4" : ""}`} />
      </span>
    </button>
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

function PanelShell({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="scrollbar-thin min-h-0 overflow-y-auto rounded-xl border border-border bg-card elevated">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <div className="space-y-5 p-4">{children}</div>
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

function setDraftValue<K extends keyof BuilderDraft>(
  setDraft: React.Dispatch<React.SetStateAction<BuilderDraft>>,
  key: K,
  value: BuilderDraft[K],
) {
  setDraft((state) => ({ ...state, [key]: value }));
}

function updateAppearance(
  setDraft: React.Dispatch<React.SetStateAction<BuilderDraft>>,
  patch: Partial<AppearanceConfig>,
) {
  setDraft((state) => ({
    ...state,
    appearanceConfig: mergeAppearanceConfig({
      ...state.appearanceConfig,
      ...patch,
    }),
  }));
}
