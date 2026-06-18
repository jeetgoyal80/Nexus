const css = `
.nexus-sdk {
  --nexus-bg: #0b1020;
  --nexus-surface: #111827;
  --nexus-surface-elevated: #172033;
  --nexus-border: rgba(255, 255, 255, .08);
  --nexus-primary: #5e6ad2;
  --nexus-primary-2: #7c3aed;
  --nexus-text: #f8fafc;
  --nexus-muted: #94a3b8;
  --nexus-soft: rgba(148, 163, 184, .12);
  --nexus-shadow: 0 34px 110px rgba(0, 0, 0, .42), 0 18px 45px rgba(15, 23, 42, .32);
  color: var(--nexus-text);
  font-synthesis: none;
  text-rendering: geometricPrecision;
}
.nexus-sdk * { box-sizing: border-box; }
.nexus-sdk button,
.nexus-sdk textarea {
  font: inherit;
}
.nexus-sdk button:focus-visible,
.nexus-sdk textarea:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--nexus-primary) 72%, white);
  outline-offset: 2px;
}
.nexus-sdk-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, .46) transparent;
}
.nexus-sdk-scroll::-webkit-scrollbar { width: 8px; }
.nexus-sdk-scroll::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, .38);
  border-radius: 999px;
}
.nexus-sdk-shell {
  position: relative;
  isolation: isolate;
}
.nexus-sdk-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--nexus-primary) 26%, transparent), transparent 34%),
    radial-gradient(circle at 90% 10%, rgba(124, 58, 237, .24), transparent 30%),
    linear-gradient(180deg, rgba(255,255,255,.035), transparent 34%);
  z-index: -1;
}
.nexus-sdk-control {
  width: 34px;
  height: 34px;
  border: 1px solid var(--nexus-border);
  border-radius: 12px;
  background: rgba(255, 255, 255, .045);
  color: var(--nexus-muted);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform .16s ease, background .16s ease, color .16s ease, border-color .16s ease;
}
.nexus-sdk-control:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, .08);
  color: var(--nexus-text);
  border-color: rgba(255,255,255,.16);
}
.nexus-sdk-md {
  display: grid;
  gap: .78rem;
}
.nexus-sdk-md > * { margin: 0; }
.nexus-sdk-md h1 { font-size: 1.34rem; line-height: 1.25; font-weight: 760; letter-spacing: 0; }
.nexus-sdk-md h2 { font-size: 1.14rem; line-height: 1.3; font-weight: 730; letter-spacing: 0; }
.nexus-sdk-md h3 { font-size: 1rem; line-height: 1.35; font-weight: 700; letter-spacing: 0; }
.nexus-sdk-md ul,
.nexus-sdk-md ol {
  padding-left: 1.22rem;
  display: grid;
  gap: .4rem;
}
.nexus-sdk-md li { padding-left: .08rem; }
.nexus-sdk-md blockquote {
  border-left: 3px solid var(--nexus-primary);
  padding: .65rem .82rem;
  border-radius: .9rem;
  background: rgba(148, 163, 184, .105);
}
.nexus-sdk-md p { line-height: inherit; }
.nexus-sdk-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--nexus-border);
  border-radius: 1rem;
  background: rgba(255,255,255,.025);
}
.nexus-sdk-table {
  width: 100%;
  border-collapse: collapse;
  font-size: .92em;
}
.nexus-sdk-table th {
  text-align: left;
  background: rgba(255,255,255,.05);
  color: var(--nexus-text);
}
.nexus-sdk-table th,
.nexus-sdk-table td {
  padding: .72rem .82rem;
  border-bottom: 1px solid rgba(255,255,255,.07);
}
.nexus-sdk-pre {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid rgba(255,255,255,.1);
  background: #070b16;
  color: #f8fafc;
  box-shadow: inset 0 1px rgba(255,255,255,.04);
}
.nexus-sdk-pre pre {
  margin: 0;
  overflow-x: auto;
  padding: 1rem;
  line-height: 1.65;
}
.nexus-sdk-copy {
  position: absolute;
  top: .55rem;
  right: .55rem;
  border: 1px solid rgba(255,255,255,.14);
  border-radius: .6rem;
  background: rgba(15,23,42,.78);
  color: #fff;
  padding: .34rem .55rem;
  font-size: .72rem;
  cursor: pointer;
}
.nexus-sdk-dots {
  display: inline-flex;
  gap: .28rem;
  align-items: center;
}
.nexus-sdk-dots span {
  width: .42rem;
  height: .42rem;
  border-radius: 999px;
  background: currentColor;
  opacity: .35;
  animation: nexus-dot 1.1s infinite ease-in-out;
}
.nexus-sdk-dots span:nth-child(2) { animation-delay: .14s; }
.nexus-sdk-dots span:nth-child(3) { animation-delay: .28s; }
@keyframes nexus-dot {
  0%, 80%, 100% { transform: translateY(0); opacity: .28; }
  40% { transform: translateY(-4px); opacity: .9; }
}
@keyframes nexus-pulse {
  0%, 100% {
    box-shadow:
      0 22px 60px rgba(0, 0, 0, .34),
      0 0 0 0 color-mix(in srgb, var(--nexus-primary) 34%, transparent);
  }
  50% {
    box-shadow:
      0 22px 60px rgba(0, 0, 0, .34),
      0 0 0 14px transparent;
  }
}
@media (max-width: 760px) {
  .nexus-sdk-widget-panel {
    inset: 0 !important;
    width: 100vw !important;
    height: 100dvh !important;
    max-width: none !important;
    max-height: none !important;
    border-radius: 0 !important;
  }
  .nexus-sdk-message { max-width: 88% !important; }
}
`;

let injected = false;

export function SdkStyles() {
  if (typeof document !== "undefined" && !injected) {
    const style = document.createElement("style");
    style.setAttribute("data-nexus-sdk", "true");
    style.textContent = css;
    document.head.appendChild(style);
    injected = true;
  }

  return null;
}
