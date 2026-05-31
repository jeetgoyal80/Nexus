import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Bot,
  Database,
  MessagesSquare,
  BarChart3,
  Rocket,
  Code2,
  Cpu,
  Settings,
  Search,
  Bell,
  ChevronsLeft,
  Plus,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/agents", label: "Agents", icon: Bot },
  { to: "/knowledge", label: "Knowledge Base", icon: Database },
  { to: "/conversations", label: "Conversations", icon: MessagesSquare },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/deployment", label: "Deployments", icon: Rocket },
  { to: "/sdk", label: "SDK & API", icon: Code2 },
  { to: "/runtime", label: "Runtime", icon: Cpu },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <div className="dark min-h-screen w-full bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "sticky top-0 z-30 h-screen shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-200",
            collapsed ? "w-[68px]" : "w-[248px]",
          )}
        >
          <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
            {collapsed ? (
              <Link
                to="/dashboard"
                className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-[color:var(--accent-blue)] to-[color:var(--accent-violet)]"
              >
                <span className="text-[11px] font-bold text-primary-foreground">N</span>
              </Link>
            ) : (
              <Logo />
            )}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              aria-label="Toggle sidebar"
            >
              <ChevronsLeft
                className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
              />
            </button>
          </div>

          <div className="p-2">
            {!collapsed && (
              <p className="px-2 pb-1 pt-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Workspace
              </p>
            )}
            <nav className="space-y-0.5">
              {nav.map((item) => {
                const active = pathname === item.to || pathname.startsWith(item.to + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {!collapsed && (
            <div className="absolute inset-x-3 bottom-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3">
              <p className="text-xs font-medium">Runtime healthy</p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_oklch(0.78_0.15_160)]" />
                42ms p50 · Groq · us-east
              </div>
            </div>
          )}
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border/70 bg-background/70 px-4 backdrop-blur-xl">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search agents, knowledge, conversations…"
                className="h-9 pl-8 bg-secondary/60 border-border/60"
              />
              <span className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
                ⌘K
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => navigate({ to: "/agents/new" })}
                className="bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground hover:opacity-95"
              >
                <Plus className="mr-1 h-4 w-4" />
                New agent
              </Button>
              <button className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                <Bell className="h-4 w-4" />
              </button>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[color:var(--accent-violet)] to-[color:var(--accent-blue)] text-xs font-semibold text-primary-foreground">
                AX
              </div>
            </div>
          </header>
          <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 border-b border-border/60 px-6 py-6 sm:flex-row sm:items-center">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
