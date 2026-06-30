import { Link } from "@/shared/router/react-router-compat";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050711]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="/#platform" className="transition hover:text-foreground">
              Platform
            </a>
            <a href="/#sdk" className="transition hover:text-foreground">
              SDK
            </a>
            <Link to="/docs" className="transition hover:text-foreground">
              Docs
            </Link>
            <a href="/#pricing" className="transition hover:text-foreground">
              Pricing
            </a>
            <a href="/#developers" className="transition hover:text-foreground">
              Developers
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground hover:opacity-95"
          >
            <Link to="/signup">Start Building</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050711] py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:flex-row sm:px-6">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            AI agent infrastructure for builders. Orchestrate agents, knowledge, retrieval,
            deployment, and SDK runtimes.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-10 text-sm">
          <div>
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Product
            </p>
            <ul className="space-y-2">
              <li>
                <a href="/#platform" className="text-muted-foreground hover:text-foreground">
                  Platform
                </a>
              </li>
              <li>
                <a href="/#pricing" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <Link to="/docs" className="text-muted-foreground hover:text-foreground">
                  Docs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Platform
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>Agent Builder</li>
              <li>RAG Runtime</li>
              <li>React SDK</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Developers
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>REST API</li>
              <li>Public Keys</li>
              <li>Status</li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl px-4 text-xs text-muted-foreground sm:px-6">
        (c) {new Date().getFullYear()} Nexus Labs. All systems nominal.
      </p>
    </footer>
  );
}
