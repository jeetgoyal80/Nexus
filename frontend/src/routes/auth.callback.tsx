import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Completing sign in…" }] }),
  component: Cb,
});

function Cb() {
  const nav = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => nav({ to: "/dashboard" }), 800);
    return () => clearTimeout(t);
  }, [nav]);
  return (
    <div className="dark grid min-h-screen place-items-center bg-background">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Completing sign in…</p>
      </div>
    </div>
  );
}
