import type { BotConfig, ChatBotProps } from "../types";
import { ChatSurface } from "./ChatSurface";

export function Embedded({
  botId,
  publicKey,
  apiBaseUrl,
  config,
  className,
  theme,
  width,
  height,
  borderRadius,
  primaryColor,
}: ChatBotProps & { config: BotConfig }) {
  const embedded = config.appearanceConfig.embeddedConfig;

  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth: width ?? embedded?.width ?? 920,
        height: height ?? embedded?.height ?? 760,
        margin: "0 auto",
      }}
    >
      <ChatSurface
        botId={botId}
        publicKey={publicKey}
        apiBaseUrl={apiBaseUrl}
        config={config}
        mode="embedded"
        theme={theme}
        borderRadius={borderRadius}
        primaryColor={primaryColor}
      />
    </div>
  );
}
