import { type ReactNode } from "react";
import { Logo } from "@/components/shared/Logo";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark grid min-h-screen bg-background text-foreground lg:grid-cols-[1fr_520px]">
      <section className="hidden border-r border-border bg-surface-1 p-10 lg:flex lg:flex-col lg:justify-between">
        <Logo />
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            AI Runtime Infrastructure
          </p>
          <h1 className="mt-4 max-w-xl text-5xl font-semibold tracking-tight">
            Operate agents, retrieval, and runtime systems from one control plane.
          </h1>
          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-xs">
            {["Groq runtime", "RAG indexing", "Public bots"].map((item) => (
              <div key={item} className="rounded-lg border border-border bg-card p-3">
                <span className="mb-2 block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_oklch(0.78_0.15_160)]" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Nexus cloud workspace</p>
      </section>
      <main className="flex items-center justify-center p-6">{children}</main>
    </div>
  );
}
