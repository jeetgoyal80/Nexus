import { useEffect, useState } from "react";
import { DEFAULT_API_BASE_URL, fetchBotConfig } from "../services/api";
import type { BotConfig } from "../types";

export function useBotConfig({
  botId,
  apiBaseUrl = DEFAULT_API_BASE_URL,
}: {
  botId: string;
  apiBaseUrl?: string;
}) {
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchBotConfig({ apiBaseUrl, botId })
      .then((data) => {
        if (active) setConfig(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err : new Error("Failed to fetch bot config"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [apiBaseUrl, botId]);

  return { config, error, loading };
}
