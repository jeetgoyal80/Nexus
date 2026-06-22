import { apiClient, unwrapApiData } from "@/shared/lib/axios";

export type RuntimeUsage = {
  usage: {
    subscriptionPlan: "free" | "pro";
    messagesToday: number;
    hostedMessagesPerDay: number;
    remainingHostedMessages: number;
    lastResetDate?: string;
    bypassBilling: boolean;
  };
  entitlements: {
    plan: "free" | "pro";
    hostedMessagesPerDay: number;
    canUseHostedRuntime: boolean;
    canUseConversationMemory: boolean;
    canUseAdvancedAnalytics: boolean;
    canCreatePrivateBots: boolean;
    bypassBilling: boolean;
  };
};

export const getRuntimeUsage = () =>
  apiClient.get("/runtime/usage").then(unwrapApiData<RuntimeUsage>);
