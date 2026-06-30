import { createFileRoute, Link } from "@/shared/router/react-router-compat";
import { MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout, PageHeader } from "@/layouts/dashboard-layout";
import { requireAuth } from "@/features/auth/services/route-guards";

export const Route = createFileRoute("/conversations")({
  beforeLoad: requireAuth,
  head: () => ({ meta: [{ title: "Conversations - Nexus" }] }),
  component: Conversations,
});

function Conversations() {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Sessions"
        title="Conversations"
        description="Conversation persistence exists in the backend runtime; list APIs can be added without changing this route boundary."
      />
      <div className="p-6">
        <section className="rounded-xl border border-border bg-card p-10 text-center elevated">
          <MessagesSquare className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium">Conversation explorer awaiting backend list endpoint</p>
          <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">
            Public and preview chats now write through the real `/api/chat/:botId` runtime. Once the
            backend exposes conversation listing, this feature can hydrate through
            `features/chat/api` without storing server data in Redux.
          </p>
          <Button
            asChild
            className="mt-5 bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
          >
            <Link to="/agents">Open agents</Link>
          </Button>
        </section>
      </div>
    </DashboardLayout>
  );
}
