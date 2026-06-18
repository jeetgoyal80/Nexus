import type { BotConfig, ChatBotProps } from "../types";
import { ChatSurface } from "./ChatSurface";

export function Fullscreen({
  botId,
  publicKey,
  apiBaseUrl,
  config,
  className,
  theme,
  borderRadius,
  primaryColor,
}: ChatBotProps & { config: BotConfig }) {
  return (
    <div className={className} style={{ minHeight: "100vh", width: "100%" }}>
      <ChatSurface
        botId={botId}
        publicKey={publicKey}
        apiBaseUrl={apiBaseUrl}
        config={config}
        mode="fullscreen"
        theme={theme}
        borderRadius={borderRadius}
        primaryColor={primaryColor}
      />
    </div>
  );
}
