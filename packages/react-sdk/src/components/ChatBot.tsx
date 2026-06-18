import { useBotConfig } from "../hooks/useBotConfig";
import type { ChatBotProps } from "../types";
import { Embedded } from "./Embedded";
import { Fullscreen } from "./Fullscreen";
import { Widget } from "./Widget";

export function ChatBot(props: ChatBotProps) {
  const { botId, apiBaseUrl, mode } = props;
  const { config, error, loading } = useBotConfig({ botId, apiBaseUrl });

  if (loading) {
    return <div style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#64748B" }}>Loading assistant...</div>;
  }

  if (error || !config) {
    return (
      <div style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#B91C1C" }}>
        {error?.message || "Assistant unavailable"}
      </div>
    );
  }

  const resolvedMode = mode ?? config.deploymentMode ?? "embedded";

  if (resolvedMode === "widget") {
    return <Widget {...props} config={config} />;
  }

  if (resolvedMode === "fullscreen") {
    return <Fullscreen {...props} config={config} />;
  }

  return <Embedded {...props} config={config} />;
}
