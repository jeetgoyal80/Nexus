import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "../hooks/useChat";
import type { BotConfig, ChatBotMode, ChatBotTheme, ChatBotThemeMode } from "../types";
import { MessageMarkdown } from "./MessageMarkdown";
import { SdkStyles } from "./SdkStyles";

type ChatSurfaceProps = {
  botId: string;
  publicKey: string;
  config: BotConfig;
  apiBaseUrl?: string;
  mode: ChatBotMode;
  theme?: ChatBotThemeMode | ChatBotTheme;
  width?: number;
  height?: number;
  borderRadius?: number;
  primaryColor?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onToggleFullscreen?: () => void;
  fullscreen?: boolean;
};

const resolveTheme = (theme?: ChatBotThemeMode | ChatBotTheme) => {
  if (typeof theme === "object") return theme;
  if (theme === "light") {
    return {
      backgroundColor: "#f8fafc",
      secondaryColor: "#ffffff",
      textColor: "#0f172a",
      borderColor: "rgba(15, 23, 42, .1)",
    };
  }
  return {};
};

const capabilityLabels = ["System Design", "Databases", "Distributed Systems", "Architecture Reviews"];
const fallbackPrompts = [
  "Explain SOLID principles",
  "Summarize knowledge base",
  "Review system architecture",
  "Search documentation",
];

export function ChatSurface({
  botId,
  publicKey,
  config,
  apiBaseUrl,
  mode,
  theme,
  width,
  height,
  borderRadius,
  primaryColor,
  onClose,
  onMinimize,
  onToggleFullscreen,
  fullscreen,
}: ChatSurfaceProps) {
  const appearance = config.appearanceConfig ?? {};
  const themeOverrides = resolveTheme(theme);
  const resolved = {
    primary: primaryColor ?? themeOverrides.primaryColor ?? appearance.primaryColor ?? "#5E6AD2",
    primary2: "#7C3AED",
    bg: themeOverrides.backgroundColor ?? "#0B1020",
    surface: themeOverrides.secondaryColor ?? "#111827",
    elevated: "#172033",
    text: themeOverrides.textColor ?? "#F8FAFC",
    muted: "#94A3B8",
    border: themeOverrides.borderColor ?? "rgba(255,255,255,.08)",
    radius: borderRadius ?? themeOverrides.borderRadius ?? 26,
    font: themeOverrides.fontFamily ?? appearance.fontFamily ?? "Inter, ui-sans-serif, system-ui, sans-serif",
  };
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const starterPrompts = appearance.starterPrompts?.length ? appearance.starterPrompts : fallbackPrompts;
  const chat = useChat({ botId, publicKey, apiBaseUrl, mode });
  const isFullscreen = fullscreen || mode === "fullscreen";
  const showEmptyState = chat.messages.length === 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat.messages.length, chat.loading]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 164)}px`;
  }, [input]);

  const surfaceStyle = useMemo(
    () => ({
      "--nexus-primary": resolved.primary,
      "--nexus-primary-2": resolved.primary2,
      "--nexus-bg": resolved.bg,
      "--nexus-surface": resolved.surface,
      "--nexus-surface-elevated": resolved.elevated,
      "--nexus-border": resolved.border,
      "--nexus-text": resolved.text,
      "--nexus-muted": resolved.muted,
      width: width ? `${width}px` : "100%",
      height: height ? `${height}px` : "100%",
      maxWidth: "100%",
      display: "flex",
      flexDirection: "column" as const,
      overflow: "hidden",
      border: isFullscreen ? "none" : `1px solid ${resolved.border}`,
      borderRadius: isFullscreen ? 0 : resolved.radius,
      background: resolved.bg,
      color: resolved.text,
      fontFamily: resolved.font,
      boxShadow: isFullscreen ? "none" : "var(--nexus-shadow)",
    }),
    [height, isFullscreen, resolved, width],
  );

  const send = async (message = input) => {
    const value = message.trim();
    if (!value || chat.loading) return;
    setInput("");
    await chat.sendMessage(value);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await send();
  };

  const onInputKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await send();
    }
  };

  return (
    <section
      className="nexus-sdk nexus-sdk-shell"
      style={surfaceStyle}
      role="region"
      aria-label={`${config.name} AI chat`}
    >
      <SdkStyles />
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: isFullscreen ? "18px max(22px, calc((100% - 980px) / 2))" : "16px 18px",
          background: "rgba(15,23,42,.9)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 44,
            height: 44,
            borderRadius: 16,
            display: "grid",
            placeItems: "center",
            background: `linear-gradient(135deg, ${resolved.primary}, ${resolved.primary2})`,
            color: "#fff",
            fontWeight: 850,
            overflow: "hidden",
            boxShadow: "0 18px 42px rgba(94,106,210,.34)",
          }}
        >
          {config.avatarUrl ? (
            <img src={config.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            config.name.slice(0, 1).toUpperCase()
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 780, letterSpacing: 0, color: resolved.text }}>
            {appearance.headerTitle || config.name}
          </div>
          <div style={{ marginTop: 3, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: resolved.muted }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: "#22C55E", boxShadow: "0 0 16px #22C55E" }} />
            <span>{appearance.statusText || "Online"}</span>
            <span style={{ opacity: .45 }}>{"|"}</span>
            <span>Knowledge ready</span>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 7 }}>
          {onToggleFullscreen ? (
            <button type="button" onClick={onToggleFullscreen} aria-label="Toggle fullscreen" className="nexus-sdk-control">
              {fullscreen ? "Min" : "Max"}
            </button>
          ) : null}
          {onMinimize ? (
            <button type="button" onClick={onMinimize} aria-label="Minimize chat" className="nexus-sdk-control">
              -
            </button>
          ) : null}
          {onClose ? (
            <button type="button" onClick={onClose} aria-label="Close chat" className="nexus-sdk-control">
              x
            </button>
          ) : null}
        </div>
      </header>

      <div
        ref={scrollRef}
        className="nexus-sdk-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: isFullscreen ? "34px max(22px, calc((100% - 980px) / 2))" : "22px",
          background:
            "linear-gradient(180deg, rgba(11,16,32,.98) 0%, rgba(13,19,36,.98) 46%, rgba(11,16,32,1) 100%)",
        }}
      >
        {showEmptyState ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .24 }}
            style={{
              minHeight: "100%",
              display: "grid",
              alignContent: "center",
              gap: 22,
              maxWidth: isFullscreen ? 760 : 640,
              margin: "0 auto",
            }}
          >
            <div style={{ display: "grid", gap: 14, textAlign: isFullscreen ? "center" : "left" }}>
              <div
                style={{
                  margin: isFullscreen ? "0 auto" : 0,
                  width: 62,
                  height: 62,
                  borderRadius: 22,
                  display: "grid",
                  placeItems: "center",
                  background: `linear-gradient(135deg, ${resolved.primary}, ${resolved.primary2})`,
                  boxShadow: "0 24px 70px rgba(94,106,210,.35)",
                  fontWeight: 850,
                  fontSize: 20,
                }}
              >
                AI
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: isFullscreen ? 36 : 28, lineHeight: 1.08, letterSpacing: 0, fontWeight: 820 }}>
                  {appearance.welcomeTitle || config.name || "System Design Assistant"}
                </h1>
                <p style={{ margin: "10px 0 0", color: resolved.muted, lineHeight: 1.7, fontSize: 14 }}>
                  {appearance.greetingDescription ||
                    "I can help reason through architecture, databases, distributed systems, and implementation tradeoffs."}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                gap: 9,
              }}
            >
              {capabilityLabels.map((label) => (
                <div
                  key={label}
                  style={{
                    border: "1px solid rgba(255,255,255,.08)",
                    borderRadius: 14,
                    padding: "10px 12px",
                    background: "rgba(255,255,255,.035)",
                    color: resolved.text,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "#22C55E", marginRight: 8 }}>{"OK"}</span>
                  {label}
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ color: resolved.muted, fontSize: 12, fontWeight: 720, textTransform: "uppercase", letterSpacing: ".12em" }}>
                Suggested questions
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
                {starterPrompts.map((prompt) => (
                  <motion.button
                    key={prompt}
                    type="button"
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: .985 }}
                    onClick={() => send(prompt)}
                    style={{
                      minHeight: 82,
                      textAlign: "left",
                      border: "1px solid rgba(255,255,255,.08)",
                      borderRadius: 18,
                      background: "linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.035))",
                      color: resolved.text,
                      padding: "15px 16px",
                      cursor: "pointer",
                      boxShadow: "0 14px 42px rgba(0,0,0,.16)",
                    }}
                  >
                    <span style={{ display: "block", fontSize: 13, color: resolved.muted, marginBottom: 7 }}>Ask Nexus</span>
                    <span style={{ fontWeight: 720, lineHeight: 1.35 }}>{prompt}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div style={{ display: "grid", gap: 20, maxWidth: isFullscreen ? 880 : "100%", margin: "0 auto" }}>
            <AnimatePresence initial={false}>
              {chat.messages.map((message, index) => {
                const isUser = message.role === "user";
                return (
                  <motion.div
                    key={`${message.role}-${index}`}
                    initial={{ opacity: 0, y: 10, scale: .985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: .18 }}
                    style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}
                  >
                    {!isUser ? (
                      <div
                        aria-hidden="true"
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 10,
                          marginRight: 10,
                          marginTop: 3,
                          flex: "0 0 auto",
                          display: "grid",
                          placeItems: "center",
                          background: `linear-gradient(135deg, ${resolved.primary}, ${resolved.primary2})`,
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        AI
                      </div>
                    ) : null}
                    <div
                      className="nexus-sdk-message"
                      style={{
                        maxWidth: isUser ? "72%" : "78%",
                        borderRadius: isUser ? "22px 22px 8px 22px" : "18px",
                        padding: isUser ? "12px 16px" : "14px 16px",
                        background: isUser
                          ? `linear-gradient(135deg, ${resolved.primary}, ${resolved.primary2})`
                          : "rgba(255,255,255,.045)",
                        color: "#F8FAFC",
                        border: isUser ? "none" : "1px solid rgba(255,255,255,.08)",
                        lineHeight: appearance.lineHeight ?? 1.68,
                        fontSize: appearance.fontSize ?? 14,
                        boxShadow: isUser
                          ? "0 18px 42px rgba(94,106,210,.26)"
                          : "0 18px 60px rgba(0,0,0,.18), inset 0 1px rgba(255,255,255,.04)",
                      }}
                    >
                      <div className="nexus-sdk-md">
                        <MessageMarkdown content={message.content} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {chat.loading ? (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    border: "1px solid rgba(255,255,255,.08)",
                    borderRadius: 18,
                    background: "rgba(255,255,255,.045)",
                    padding: "12px 15px",
                    color: resolved.text,
                    boxShadow: "0 18px 60px rgba(0,0,0,.16)",
                  }}
                >
                  <span style={{ marginRight: 9, color: resolved.muted }}>Thinking</span>
                  <span className="nexus-sdk-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div
        style={{
          position: "sticky",
          bottom: 0,
          padding: isFullscreen ? "0 max(22px, calc((100% - 980px) / 2)) 24px" : "0 18px 18px",
          background: "linear-gradient(180deg, transparent, rgba(11,16,32,.88) 22%, rgba(11,16,32,.98))",
        }}
      >
        <form
          onSubmit={submit}
          style={{
            maxWidth: isFullscreen ? 880 : "100%",
            margin: "0 auto",
            display: "grid",
            gap: 9,
            padding: 12,
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 22,
            background: "rgba(23,32,51,.92)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 22px 80px rgba(0,0,0,.32), inset 0 1px rgba(255,255,255,.05)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value.slice(0, 4000))}
            onKeyDown={onInputKeyDown}
            placeholder={appearance.inputPlaceholder || "Ask anything..."}
            disabled={chat.loading}
            rows={1}
            maxLength={4000}
            style={{
              width: "100%",
              minHeight: 42,
              maxHeight: 164,
              resize: "none",
              border: 0,
              outline: 0,
              background: "transparent",
              color: resolved.text,
              lineHeight: 1.55,
              padding: "8px 6px",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <button type="button" aria-label="Attachment placeholder" className="nexus-sdk-control">
              +
            </button>
            <motion.button
              type="submit"
              whileHover={{ y: -1 }}
              whileTap={{ scale: .96 }}
              disabled={chat.loading || !input.trim()}
              aria-label="Send message"
              style={{
                minWidth: 84,
                height: 40,
                border: 0,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${resolved.primary}, ${resolved.primary2})`,
                color: "#fff",
                cursor: chat.loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: chat.loading || !input.trim() ? .56 : 1,
                fontWeight: 760,
                boxShadow: "0 14px 38px rgba(94,106,210,.28)",
              }}
            >
              Send
            </motion.button>
          </div>
        </form>
      </div>
    </section>
  );
}
