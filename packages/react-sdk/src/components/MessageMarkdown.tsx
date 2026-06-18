import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

function CodeBlock({ children }: { children: ReactNode }) {
  const text = String(children ?? "").replace(/\n$/, "");

  return (
    <div className="nexus-sdk-pre">
      <button
        type="button"
        className="nexus-sdk-copy"
        onClick={() => navigator.clipboard?.writeText(text)}
        aria-label="Copy code block"
      >
        Copy
      </button>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function MessageMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ children, ...props }) => (
          <a {...props} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
            {children}
          </a>
        ),
        code: ({ children, ...props }) => (
          <code
            {...props}
            style={{
              borderRadius: 6,
              background: "rgba(148, 163, 184, 0.18)",
              padding: "0.12rem 0.32rem",
              fontSize: "0.92em",
            }}
          >
            {children}
          </code>
        ),
        pre: ({ children }) => <CodeBlock>{children as ReactNode}</CodeBlock>,
        table: ({ children }) => (
          <div className="nexus-sdk-table-wrap">
            <table className="nexus-sdk-table">{children}</table>
          </div>
        ),
        th: ({ children }) => <th style={{ borderBottom: "1px solid currentColor", padding: 8 }}>{children}</th>,
        td: ({ children }) => <td style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.3)", padding: 8 }}>{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
