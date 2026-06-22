import type { AppearanceConfig } from "../appearance/appearance.types";

export type AgentTone = "professional" | "friendly" | "casual" | "concise" | "technical";
export type AgentVisibility = "private" | "public";
export type AgentOutputFormat = "paragraph" | "bullet_points" | "structured_json";
export type AgentDeploymentStatus = "draft" | "deployed";
export type AgentDeploymentMode = "widget" | "embedded" | "fullscreen";
export type AgentRuntimeProvider = "user" | "platform";

export type Agent = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  role: string;
  tone: AgentTone;
  instructions: string;
  strictKnowledgeMode: boolean;
  outputFormat: AgentOutputFormat;
  theme: string;
  welcomeMessage: string;
  avatar: string;
  visibility: AgentVisibility;
  deploymentStatus: AgentDeploymentStatus;
  deploymentMode: AgentDeploymentMode;
  publicSlug?: string;
  publicKey?: string;
  sdkEnabled: boolean;
  apiEnabled: boolean;
  deployedAt?: string | null;
  analytics?: {
    messages: number;
    conversations: number;
    visitors: number;
    sdkRequests: number;
    apiRequests?: number;
    widgetRequests?: number;
    lastUsedAt?: string | null;
  };
  appearanceConfig: AppearanceConfig;
  runtimeProvider: AgentRuntimeProvider;
  hasUserApiKey?: boolean;
  model?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAgentPayload = Pick<Agent, "name" | "description" | "role"> &
  Partial<
    Pick<
      Agent,
      | "tone"
      | "instructions"
      | "strictKnowledgeMode"
      | "outputFormat"
      | "theme"
      | "welcomeMessage"
      | "avatar"
      | "visibility"
      | "deploymentMode"
      | "sdkEnabled"
      | "apiEnabled"
      | "runtimeProvider"
      | "model"
    >
  > & { appearanceConfig?: Partial<AppearanceConfig>; apiKey?: string };

export type UpdateAgentPayload = Partial<CreateAgentPayload>;
