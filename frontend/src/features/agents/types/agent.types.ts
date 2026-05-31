export type AgentTone = "professional" | "friendly" | "casual" | "concise" | "technical";
export type AgentVisibility = "private" | "public";
export type AgentOutputFormat = "paragraph" | "bullet_points" | "structured_json";

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
    >
  >;

export type UpdateAgentPayload = Partial<CreateAgentPayload>;
