import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link to="/pricing" className="hover:text-foreground transition">
              Pricing
            </Link>
            <Link to="/docs" className="hover:text-foreground transition">
              Docs
            </Link>
            <a href="#features" className="hover:text-foreground transition">
              Features
            </a>
            <a href="#sdk" className="hover:text-foreground transition">
              SDK
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground hover:opacity-95"
          >
            <Link to="/signup">Start building</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            AI infrastructure for builders. Orchestrate agents, knowledge, retrieval and runtime.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-10 text-sm">
          <div>
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Product
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing" className="hover:text-foreground text-muted-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-foreground text-muted-foreground">
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
              <li>Runtime</li>
              <li>SDK</li>
              <li>Embeddings</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Company
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>About</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl px-4 text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} Nexus Labs. All systems nominal.
      </p>
    </footer>
  );
}
