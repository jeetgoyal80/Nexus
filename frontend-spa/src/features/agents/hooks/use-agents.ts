import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { getAgents } from "../api/get-agents";
import { getAgent } from "../api/get-agent";
import { createAgent } from "../api/create-agent";
import { updateAgent } from "../api/update-agent";
import { deleteAgent } from "../api/delete-agent";
import {
  deployAgent,
  regenerateAgentPublicKey,
  unpublishAgent,
  updateAgentDeploymentAccess,
} from "../api/deploy-agent";

export const agentKeys = {
  all: ["agents"] as const,
  detail: (id: string) => ["agents", id] as const,
};

export const useAgents = () =>
  useQuery({
    queryKey: agentKeys.all,
    queryFn: () => getAgents().then((data) => data.bots),
  });

export const useAgent = (agentId: string) =>
  useQuery({
    queryKey: agentKeys.detail(agentId),
    queryFn: () => getAgent(agentId).then((data) => data.bot),
    enabled: Boolean(agentId),
  });

export function useAgentMutations() {
  const queryClient = useQueryClient();
  return {
    create: useMutation({
      mutationFn: createAgent,
      onSuccess: ({ bot }) => {
        queryClient.invalidateQueries({ queryKey: agentKeys.all });
        toast.success(`${bot.name} created`);
      },
      onError: (error) => toast.error(getApiErrorMessage(error, "Agent creation failed")),
    }),
    update: useMutation({
      mutationFn: updateAgent,
      onSuccess: ({ bot }) => {
        queryClient.invalidateQueries({ queryKey: agentKeys.all });
        queryClient.setQueryData(agentKeys.detail(bot.id), bot);
        toast.success("Agent configuration saved");
      },
      onError: (error) => toast.error(getApiErrorMessage(error, "Agent update failed")),
    }),
    delete: useMutation({
      mutationFn: deleteAgent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: agentKeys.all });
        toast.success("Agent deleted");
      },
      onError: (error) => toast.error(getApiErrorMessage(error, "Agent deletion failed")),
    }),
    deploy: useMutation({
      mutationFn: deployAgent,
      onSuccess: ({ bot }) => {
        queryClient.invalidateQueries({ queryKey: agentKeys.all });
        queryClient.setQueryData(agentKeys.detail(bot.id), bot);
        toast.success(`${bot.name} deployed`);
      },
      onError: (error) => toast.error(getApiErrorMessage(error, "Deployment failed")),
    }),
    unpublish: useMutation({
      mutationFn: unpublishAgent,
      onSuccess: ({ bot }) => {
        queryClient.invalidateQueries({ queryKey: agentKeys.all });
        queryClient.setQueryData(agentKeys.detail(bot.id), bot);
        toast.success(`${bot.name} unpublished`);
      },
      onError: (error) => toast.error(getApiErrorMessage(error, "Unpublish failed")),
    }),
    regeneratePublicKey: useMutation({
      mutationFn: regenerateAgentPublicKey,
      onSuccess: ({ bot }) => {
        queryClient.invalidateQueries({ queryKey: agentKeys.all });
        queryClient.setQueryData(agentKeys.detail(bot.id), bot);
        toast.success("Public key regenerated");
      },
      onError: (error) => toast.error(getApiErrorMessage(error, "Key regeneration failed")),
    }),
    updateDeploymentAccess: useMutation({
      mutationFn: updateAgentDeploymentAccess,
      onSuccess: ({ bot }) => {
        queryClient.invalidateQueries({ queryKey: agentKeys.all });
        queryClient.setQueryData(agentKeys.detail(bot.id), bot);
        toast.success("Deployment settings updated");
      },
      onError: (error) => toast.error(getApiErrorMessage(error, "Deployment update failed")),
    }),
  };
}
