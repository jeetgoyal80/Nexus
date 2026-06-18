import { PointerEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BotConfig, ChatBotProps } from "../types";
import { ChatSurface } from "./ChatSurface";
import { SdkStyles } from "./SdkStyles";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function Widget({
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
  launcherPosition,
  launcherOffset,
}: ChatBotProps & { config: BotConfig }) {
  const widget = config.appearanceConfig.widgetConfig;
  const position = launcherPosition ?? widget?.position ?? "bottom-right";
  const storageKey = `nexus-sdk-widget-size:${botId}`;
  const defaultWidth =
    width ??
    (config.appearanceConfig.widgetConfig?.size === "large"
      ? 560
      : config.appearanceConfig.widgetConfig?.size === "small"
        ? 440
        : 520);
  const defaultHeight = height ?? 760;
  const [state, setState] = useState<"closed" | "open" | "minimized" | "fullscreen">("closed");
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { width?: number; height?: number };
      setSize({
        width: clamp(parsed.width ?? defaultWidth, 360, 700),
        height: clamp(parsed.height ?? defaultHeight, 500, 900),
      });
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [defaultHeight, defaultWidth, storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(size));
  }, [size, storageKey]);

  const placement = useMemo(
    () => ({
      right: position === "bottom-right" ? launcherOffset?.x ?? 24 : undefined,
      left: position === "bottom-left" ? launcherOffset?.x ?? 24 : undefined,
      bottom: launcherOffset?.y ?? 24,
    }),
    [launcherOffset?.x, launcherOffset?.y, position],
  );

  const startResize = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const startY = event.clientY;
    const start = { ...size };

    const onMove = (moveEvent: globalThis.PointerEvent) => {
      const direction = position === "bottom-right" ? -1 : 1;
      setSize({
        width: clamp(start.width + (moveEvent.clientX - startX) * direction, 360, 700),
        height: clamp(start.height + (moveEvent.clientY - startY) * -1, 500, 900),
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const open = state === "open" || state === "fullscreen";

  return (
    <div className={`nexus-sdk ${className ?? ""}`}>
      <SdkStyles />
      <AnimatePresence>
        {open ? (
          <motion.div
            className="nexus-sdk-widget-panel"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            style={{
              position: "fixed",
              ...placement,
              bottom: state === "fullscreen" ? 0 : (placement.bottom ?? 24) + 74,
              width: state === "fullscreen" ? "100vw" : size.width,
              height: state === "fullscreen" ? "100dvh" : size.height,
              maxWidth: state === "fullscreen" ? "100vw" : "calc(100vw - 32px)",
              maxHeight: state === "fullscreen" ? "100dvh" : "calc(100vh - 110px)",
              zIndex: 2147483000,
              borderRadius: state === "fullscreen" ? 0 : borderRadius ?? 24,
              overflow: "hidden",
              boxShadow: state === "fullscreen" ? "none" : "0 36px 120px rgba(0,0,0,.48)",
            }}
          >
            <ChatSurface
              botId={botId}
              publicKey={publicKey}
              apiBaseUrl={apiBaseUrl}
              config={config}
              mode="widget"
              theme={theme}
              borderRadius={borderRadius}
              primaryColor={primaryColor}
              fullscreen={state === "fullscreen"}
              onClose={() => setState("closed")}
              onMinimize={() => setState("minimized")}
              onToggleFullscreen={() => setState((current) => (current === "fullscreen" ? "open" : "fullscreen"))}
            />
            {state !== "fullscreen" ? (
              <div
                role="separator"
                aria-label="Resize chat widget"
                onPointerDown={startResize}
                style={{
                  position: "absolute",
                  top: 8,
                  [position === "bottom-right" ? "left" : "right"]: 8,
                  width: 18,
                  height: 18,
                  borderRadius: 6,
                  cursor: "nwse-resize",
                  background: "rgba(255, 255, 255, 0.18)",
                  border: "1px solid rgba(255,255,255,.12)",
                }}
              />
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {state === "minimized" ? (
        <motion.button
          type="button"
          onClick={() => setState("open")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "fixed",
            ...placement,
            bottom: (placement.bottom ?? 24) + 74,
            border: "1px solid rgba(148, 163, 184, .28)",
            borderRadius: 999,
            padding: "10px 14px",
            background: "rgba(15,23,42,.88)",
            color: "#F8FAFC",
            boxShadow: "0 18px 50px rgba(0,0,0,.28)",
            zIndex: 2147483001,
            cursor: "pointer",
            backdropFilter: "blur(18px)",
          }}
        >
          Resume chat
        </motion.button>
      ) : null}

      <motion.button
        type="button"
        onClick={() => setState((current) => (current === "closed" || current === "minimized" ? "open" : "closed"))}
        aria-label={open ? "Close chat" : "Open chat"}
        whileHover={{ y: -2, scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        style={{
          position: "fixed",
          ...placement,
          width: widget?.size === "large" ? 64 : widget?.size === "small" ? 52 : 58,
          height: widget?.size === "large" ? 64 : widget?.size === "small" ? 52 : 58,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,.14)",
          background: `linear-gradient(135deg, ${
            widget?.color ?? primaryColor ?? config.appearanceConfig.primaryColor ?? "#5E6AD2"
          }, #7C3AED)`,
          color: "#FFFFFF",
          cursor: "pointer",
          zIndex: 2147483001,
          fontSize: open ? 20 : 15,
          fontWeight: 800,
          animation: open ? "none" : "nexus-pulse 2.2s infinite",
          boxShadow: "0 22px 70px rgba(94,106,210,.38), inset 0 1px rgba(255,255,255,.25)",
        }}
      >
        {open ? "x" : "N"}
      </motion.button>
    </div>
  );
}
