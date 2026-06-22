import { useQuery } from "@tanstack/react-query";
import { getRuntimeUsage } from "../api/get-runtime-usage";

export const useRuntimeUsage = () =>
  useQuery({
    queryKey: ["runtime", "usage"],
    queryFn: getRuntimeUsage,
    refetchInterval: 30000,
  });
