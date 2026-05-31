import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingNav, MarketingFooter } from "@/components/shared/MarketingShell";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — Nexus" }] }),
  component: Pricing,
});

const tiers = [
  {
    name: "Free",
    price: "$0",
    desc: "Bring your own Groq key.",
    features: ["1 workspace", "Up to 3 agents", "10K msgs / mo", "Community support"],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$49",
    desc: "Hosted runtime, ready to scale.",
    features: [
      "Unlimited agents",
      "Managed runtime",
      "100K msgs / mo",
      "Analytics + observability",
    ],
    cta: "Start Pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For teams shipping AI to production.",
    features: ["Dedicated infra", "SSO + RBAC", "SLA & priority support", "On-prem option"],
    cta: "Contact sales",
  },
];

function Pricing() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <MarketingNav />
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Pricing
        </p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-gradient">
          Pay for what you ship.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Start free with your own Groq key. Upgrade when you need managed infrastructure.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-2xl border p-6 text-left elevated ${t.featured ? "border-primary/50 bg-gradient-to-br from-card to-primary/5" : "border-border bg-card"}`}
            >
              {t.featured && (
                <span className="absolute right-4 top-4 rounded-full bg-primary px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary-foreground">
                  Popular
                </span>
              )}
              <p className="text-sm text-muted-foreground">{t.name}</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">
                {t.price}
                <span className="text-sm text-muted-foreground">
                  {t.price !== "Custom" && "/mo"}
                </span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`mt-6 ${t.featured ? "bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground" : "bg-secondary"}`}
                variant={t.featured ? "default" : "outline"}
              >
                <Link to="/signup">{t.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
