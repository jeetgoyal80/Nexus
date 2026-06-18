import ReactMarkdown from "react-markdown";
import { Bot, Briefcase, GraduationCap, MessageCircle, Send, Sparkles } from "lucide-react";
import remarkGfm from "remark-gfm";
import type { AppearanceConfig } from "./appearance.types";
import { mergeAppearanceConfig } from "./appearance-config";

type PreviewMessage = {
  role: "assistant" | "user";
  content: string;
};

const shadowMap: Record<AppearanceConfig["windowShadow"], string> = {
  none: "none",
  soft: "0 12px 34px rgba(15, 23, 42, 0.12)",
  premium: "0 24px 70px rgba(15, 23, 42, 0.22)",
  dramatic: "0 30px 90px rgba(15, 23, 42, 0.30)",
};

const densityPadding: Record<AppearanceConfig["density"], number> = {
  compact: 12,
  comfortable: 15,
  spacious: 18,
};

const avatarRadius = {
  circle: 999,
  rounded: 12,
  square: 4,
};

const AvatarIcon = ({ icon }: { icon: AppearanceConfig["avatarIcon"] }) => {
  const iconClass = "h-4 w-4";
  if (icon === "bot") return <Bot className={iconClass} />;
  if (icon === "message-circle") return <MessageCircle className={iconClass} />;
  if (icon === "graduation-cap") return <GraduationCap className={iconClass} />;
  if (icon === "briefcase") return <Briefcase className={iconClass} />;
  return <Sparkles className={iconClass} />;
};

function MarkdownMessage({
  content,
  config,
  role,
}: {
  content: string;
  config: AppearanceConfig;
  role: PreviewMessage["role"];
}) {
  if (role === "user") {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-3 mt-1 text-2xl font-semibold tracking-[-0.02em]">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-2.5 mt-5 text-xl font-semibold tracking-[-0.015em] first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="my-2 leading-relaxed first:mt-0 last:mb-0">{children}</p>
        ),
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic opacity-95">{children}</em>,
        ul: ({ children }) => <ul className="my-3 list-disc space-y-1.5 pl-5">{children}</ul>,
        ol: ({ children }) => <ol className="my-3 list-decimal space-y-1.5 pl-5">{children}</ol>,
        li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote
            className="my-4 border-l-4 py-1 pl-4 italic opacity-90"
            style={{ borderColor: config.accentColor }}
          >
            {children}
          </blockquote>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
            style={{ color: config.accentColor }}
          >
            {children}
          </a>
        ),
        code: ({ children, className }) => {
          if (className) {
            return <code className={className}>{children}</code>;
          }

          return (
            <code
              className="rounded-md px-1.5 py-0.5 font-mono text-[0.92em]"
              style={{ background: `${config.secondaryColor}CC` }}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre
            className="my-4 overflow-x-auto rounded-xl border p-4 text-sm leading-relaxed"
            style={{
              background: config.secondaryColor,
              borderColor: config.borderColor,
            }}
          >
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div
            className="my-4 overflow-x-auto rounded-xl border"
            style={{ borderColor: config.borderColor }}
          >
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead style={{ background: config.secondaryColor }}>{children}</thead>
        ),
        th: ({ children }) => (
          <th
            className="border-b px-3 py-2 text-left font-semibold"
            style={{ borderColor: config.borderColor }}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-t px-3 py-2 align-top" style={{ borderColor: config.borderColor }}>
            {children}
          </td>
        ),
        hr: () => (
          <hr className="my-5 border-0 border-t" style={{ borderColor: config.borderColor }} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function ChatAppearancePreview({
  appearanceConfig,
  botName,
  messages,
  variant = "window",
  interactive = false,
  input,
  onInputChange,
  onSend,
  disabled = false,
}: {
  appearanceConfig?: Partial<AppearanceConfig> | null;
  botName: string;
  messages?: PreviewMessage[];
  variant?: "window" | "assistant";
  interactive?: boolean;
  input?: string;
  onInputChange?: (value: string) => void;
  onSend?: () => void;
  disabled?: boolean;
}) {
  const config = mergeAppearanceConfig(appearanceConfig);
  const headerTitle = config.headerTitle || botName;
  const previewMessages = messages?.length
    ? messages
    : [
        { role: "assistant" as const, content: config.welcomeMessage },
        { role: "user" as const, content: "Can you help me understand the policy?" },
        {
          role: "assistant" as const,
          content:
            "**Absolutely.** I can answer using the configured knowledge base and keep the response aligned with this bot's personality.",
        },
      ];

  if (variant === "assistant") {
    return (
      <FullScreenAssistant
        config={config}
        botName={botName}
        messages={previewMessages}
        interactive={interactive}
        input={input}
        onInputChange={onInputChange}
        onSend={onSend}
        disabled={disabled}
      />
    );
  }

  return (
    <div
      className="flex h-full min-h-[560px] flex-col overflow-hidden"
      style={{
        background: config.glassEffect
          ? `linear-gradient(145deg, ${config.backgroundColor}E6, ${config.secondaryColor}CC)`
          : config.backgroundColor,
        borderColor: config.borderColor,
        borderRadius: config.borderRadius,
        borderWidth: config.borderThickness,
        boxShadow: shadowMap[config.windowShadow],
        color: config.botTextColor,
        fontFamily: config.fontFamily,
        backdropFilter: config.glassEffect ? "blur(20px)" : undefined,
      }}
    >
      <div
        className="flex items-center gap-3 border-b px-5 py-4"
        style={{
          background: config.headerBackgroundColor,
          borderColor: config.borderColor,
          color: config.headerTextColor,
        }}
      >
        <div
          className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden shadow-sm ring-1 ring-white/10"
          style={{
            background: config.avatarUrl ? "transparent" : config.primaryColor,
            borderRadius: avatarRadius[config.avatarShape],
            color: config.userTextColor,
          }}
        >
          {config.avatarUrl ? (
            <img src={config.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <AvatarIcon icon={config.avatarIcon} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold tracking-[-0.01em]">{headerTitle}</p>
          <p className="mt-0.5 truncate text-xs opacity-70">{config.headerSubtitle}</p>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] shadow-sm"
          style={{
            borderColor: config.borderColor,
            background: `${config.secondaryColor}AA`,
          }}
        >
          {config.showOnlineIndicator && (
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: config.accentColor,
                boxShadow: `0 0 14px ${config.accentColor}`,
              }}
            />
          )}
          <span className="hidden sm:inline">{config.statusText}</span>
        </div>
      </div>

      <div
        className="border-b px-5 py-5"
        style={{
          borderColor: config.borderColor,
          background:
            config.layoutType === "enterprise"
              ? `${config.secondaryColor}CC`
              : `linear-gradient(135deg, ${config.primaryColor}22, transparent)`,
        }}
      >
        <p
          className="text-xl font-semibold tracking-[-0.02em]"
          style={{ color: config.headerTextColor }}
        >
          {config.welcomeTitle}
        </p>
        <p
          className="mt-1.5 max-w-[46rem] text-sm leading-relaxed"
          style={{ color: config.botTextColor, opacity: 0.76 }}
        >
          {config.greetingDescription}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {config.starterPrompts.slice(0, 4).map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="rounded-full border px-3.5 py-1.5 text-xs font-medium shadow-sm transition hover:-translate-y-0.5 hover:opacity-95"
              style={{
                borderColor: config.borderColor,
                background: config.secondaryColor,
                color: config.botTextColor,
              }}
              onClick={() => onInputChange?.(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-6">
        <div
          className="mx-auto flex w-full max-w-3xl flex-col"
          style={{ gap: config.messageSpacing }}
        >
          {previewMessages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
            >
              {message.role === "assistant" && (
                <div
                  className="mb-1 hidden h-7 w-7 shrink-0 place-items-center rounded-full shadow-sm sm:grid"
                  style={{ background: config.primaryColor, color: config.userTextColor }}
                >
                  <AvatarIcon icon={config.avatarIcon} />
                </div>
              )}
              <div
                className="max-w-[70%] shadow-sm"
                style={{
                  background:
                    message.role === "user" ? config.userBubbleColor : config.botBubbleColor,
                  color: message.role === "user" ? config.userTextColor : config.botTextColor,
                  borderRadius:
                    message.role === "user" ? config.userBubbleRadius : config.botBubbleRadius,
                  border:
                    message.role === "assistant"
                      ? `${config.borderThickness}px solid ${config.borderColor}`
                      : undefined,
                  fontSize: config.fontSize,
                  lineHeight: config.lineHeight,
                  padding: densityPadding[config.density],
                  boxShadow:
                    message.role === "user"
                      ? "0 8px 20px rgba(15, 23, 42, 0.14)"
                      : "0 6px 18px rgba(15, 23, 42, 0.08)",
                }}
              >
                <MarkdownMessage content={message.content} config={config} role={message.role} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ChatInput
        config={config}
        input={input}
        interactive={interactive}
        disabled={disabled}
        onInputChange={onInputChange}
        onSend={onSend}
      />
    </div>
  );
}

function FullScreenAssistant({
  config,
  botName,
  messages,
  interactive,
  input,
  onInputChange,
  onSend,
  disabled,
}: {
  config: AppearanceConfig;
  botName: string;
  messages: PreviewMessage[];
  interactive: boolean;
  input?: string;
  onInputChange?: (value: string) => void;
  onSend?: () => void;
  disabled: boolean;
}) {
  const headerTitle = config.headerTitle || botName;
  const hasUserMessage = messages.some((message) => message.role === "user");
  const visibleMessages = hasUserMessage ? messages : [];

  return (
    <div
      className="flex h-full min-h-[560px] flex-col"
      style={{
        background: config.backgroundColor,
        color: config.botTextColor,
        fontFamily: config.fontFamily,
      }}
    >
      <div
        className="flex h-14 shrink-0 items-center justify-between border-b px-4 sm:px-6"
        style={{ borderColor: config.borderColor, background: config.backgroundColor }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden shadow-sm"
            style={{
              background: config.avatarUrl ? "transparent" : config.primaryColor,
              borderRadius: avatarRadius[config.avatarShape],
              color: config.userTextColor,
            }}
          >
            {config.avatarUrl ? (
              <img src={config.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <AvatarIcon icon={config.avatarIcon} />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[-0.01em]">{headerTitle}</p>
            <p className="truncate text-xs opacity-60">{config.headerSubtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full px-2.5 py-1 text-xs opacity-80">
          {config.showOnlineIndicator && (
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: config.accentColor,
                boxShadow: `0 0 14px ${config.accentColor}`,
              }}
            />
          )}
          <span className="hidden sm:inline">{config.statusText}</span>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-4">
        {!hasUserMessage ? (
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center py-12">
            <div
              className="mb-6 grid h-14 w-14 place-items-center overflow-hidden shadow-sm"
              style={{
                background: config.avatarUrl ? "transparent" : config.primaryColor,
                borderRadius: avatarRadius[config.avatarShape],
                color: config.userTextColor,
              }}
            >
              {config.avatarUrl ? (
                <img src={config.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <AvatarIcon icon={config.avatarIcon} />
              )}
            </div>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              {config.welcomeTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 opacity-70">
              {config.greetingDescription}
            </p>
            <div className="mt-8 grid gap-2 sm:grid-cols-3">
              {config.starterPrompts.slice(0, 3).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-2xl border px-4 py-3 text-left text-sm transition hover:-translate-y-0.5 hover:shadow-sm"
                  style={{
                    borderColor: config.borderColor,
                    background: config.secondaryColor,
                    color: config.botTextColor,
                  }}
                  onClick={() => onInputChange?.(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-8">
            {visibleMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div
                    className="mt-1 hidden h-8 w-8 shrink-0 place-items-center rounded-full sm:grid"
                    style={{ background: config.primaryColor, color: config.userTextColor }}
                  >
                    <AvatarIcon icon={config.avatarIcon} />
                  </div>
                )}
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[70%] rounded-3xl px-4 py-2.5"
                      : "max-w-[78%] py-1"
                  }
                  style={{
                    background: message.role === "user" ? config.userBubbleColor : "transparent",
                    color: message.role === "user" ? config.userTextColor : config.botTextColor,
                    fontSize: config.fontSize,
                    lineHeight: config.lineHeight,
                  }}
                >
                  <MarkdownMessage content={message.content} config={config} role={message.role} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ChatInput
        config={config}
        input={input}
        interactive={interactive}
        disabled={disabled}
        onInputChange={onInputChange}
        onSend={onSend}
        fullscreen
      />
    </div>
  );
}

function ChatInput({
  config,
  input,
  interactive,
  disabled,
  onInputChange,
  onSend,
  fullscreen = false,
}: {
  config: AppearanceConfig;
  input?: string;
  interactive: boolean;
  disabled: boolean;
  onInputChange?: (value: string) => void;
  onSend?: () => void;
  fullscreen?: boolean;
}) {
  return (
    <div
      className={fullscreen ? "shrink-0 px-4 pb-4 pt-2" : "border-t px-5 py-4"}
      style={{ borderColor: fullscreen ? undefined : config.borderColor }}
    >
      <div
        className="mx-auto flex min-h-12 max-w-3xl items-center gap-2 border px-3 py-1 shadow-sm transition focus-within:shadow-md"
        style={{
          background:
            config.inputStyle === "filled" ? config.secondaryColor : `${config.secondaryColor}66`,
          borderColor: config.inputStyle === "soft" ? "transparent" : config.borderColor,
          borderRadius: fullscreen ? 28 : Math.max(16, config.borderRadius),
        }}
      >
        <input
          value={input ?? ""}
          onChange={(event) => onInputChange?.(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSend?.();
          }}
          disabled={!interactive || disabled}
          placeholder={config.inputPlaceholder}
          className="h-11 min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:opacity-50"
          style={{ color: config.botTextColor }}
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!interactive || disabled}
          className="grid h-9 w-9 shrink-0 place-items-center transition hover:scale-[1.03] disabled:opacity-50"
          style={{
            background:
              config.sendButtonStyle === "minimal" ? "transparent" : config.sendButtonColor,
            borderRadius: config.sendButtonStyle === "soft" ? 12 : 999,
            color:
              config.sendButtonStyle === "minimal" ? config.sendButtonColor : config.userTextColor,
          }}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      {config.showPoweredBy && (
        <p
          className="pt-2 text-center text-[10px]"
          style={{ color: config.botTextColor, opacity: 0.52 }}
        >
          Powered by {config.companyName || "Platform"}
        </p>
      )}
    </div>
  );
}
