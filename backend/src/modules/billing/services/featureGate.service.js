import { env } from "../../../config/env.js";
import { getPlanLimits, SUBSCRIPTION_PLAN } from "../../../config/plans.js";

const resolvePlan = (user) =>
  env.BYPASS_BILLING ? SUBSCRIPTION_PLAN.PRO : user?.subscriptionPlan || SUBSCRIPTION_PLAN.FREE;

export const featureGateService = {
  canUseHostedRuntime(user) {
    return Boolean(getPlanLimits(resolvePlan(user)).hostedMessagesPerDay);
  },

  canUseConversationMemory(user) {
    return getPlanLimits(resolvePlan(user)).conversationMemory;
  },

  canUseAdvancedAnalytics(user) {
    return getPlanLimits(resolvePlan(user)).advancedAnalytics;
  },

  canCreatePrivateBots(user) {
    return getPlanLimits(resolvePlan(user)).privateBots;
  },

  getEntitlements(user) {
    const plan = resolvePlan(user);
    return {
      plan,
      hostedMessagesPerDay: getPlanLimits(plan).hostedMessagesPerDay,
      canUseHostedRuntime: this.canUseHostedRuntime(user),
      canUseConversationMemory: this.canUseConversationMemory(user),
      canUseAdvancedAnalytics: this.canUseAdvancedAnalytics(user),
      canCreatePrivateBots: this.canCreatePrivateBots(user),
      bypassBilling: env.BYPASS_BILLING,
    };
  },
};
