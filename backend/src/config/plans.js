export const SUBSCRIPTION_PLAN = {
  FREE: "free",
  PRO: "pro",
};

export const RUNTIME_PROVIDER = {
  USER: "user",
  PLATFORM: "platform",
};

export const PLAN_LIMITS = {
  [SUBSCRIPTION_PLAN.FREE]: {
    hostedMessagesPerDay: 100,
    advancedAnalytics: false,
    conversationMemory: false,
    privateBots: false,
    priorityRuntime: false,
  },
  [SUBSCRIPTION_PLAN.PRO]: {
    hostedMessagesPerDay: 1000,
    advancedAnalytics: true,
    conversationMemory: true,
    privateBots: true,
    priorityRuntime: true,
  },
};

export const getPlanLimits = (plan) => PLAN_LIMITS[plan] || PLAN_LIMITS[SUBSCRIPTION_PLAN.FREE];
