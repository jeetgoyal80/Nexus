import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="relative grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] elevated">
        <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
      </span>
      <span className="font-semibold tracking-tight">Nexus</span>
      <span className="hidden rounded-sm border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground sm:inline">
        v1.0
      </span>
    </Link>
  );
}
