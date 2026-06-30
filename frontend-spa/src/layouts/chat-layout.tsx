import { type ReactNode } from "react";

export function ChatLayout({ children }: { children: ReactNode }) {
  return <div className="dark min-h-screen bg-background text-foreground">{children}</div>;
}
