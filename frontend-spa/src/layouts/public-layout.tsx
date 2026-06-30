import { type ReactNode } from "react";
import { MarketingFooter, MarketingNav } from "@/components/shared/MarketingShell";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  );
}
