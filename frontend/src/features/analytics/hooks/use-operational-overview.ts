import { useQuery } from "@tanstack/react-query";
import { useAgents } from "@/features/agents/hooks/use-agents";
import { getInfrastructureHealth } from "@/features/runtime/api/get-infrastructure-health";

export function useOperationalOverview() {
  const agents = useAgents();
  const infrastructure = useQuery({
    queryKey: ["runtime", "infrastructure-health"],
    queryFn: getInfrastructureHealth,
    refetchInterval: 10000,
  });

  const activeAgents = agents.data?.length ?? 0;
  const publicAgents = agents.data?.filter((agent) => agent.visibility === "public").length ?? 0;
  const queue = infrastructure.data?.queues?.ingestion;
  const activeIngestion = (queue?.active ?? 0) + (queue?.waiting ?? 0) + (queue?.delayed ?? 0);
  const failedIngestion = queue?.failed ?? 0;

  return {
    agents,
    infrastructure,
    metrics: {
      activeAgents,
      publicAgents,
      activeIngestion,
      completedIngestion: queue?.completed ?? 0,
      failedIngestion,
      runtimeHealth: infrastructure.isError ? "degraded" : "healthy",
    },
  };
}
