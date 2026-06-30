import { createFileRoute } from "@/shared/router/react-router-compat";
import { PublicChatPage } from "@/features/chat/pages/public-chat-page";

export const Route = createFileRoute("/bot/$botId")({
  head: () => ({ meta: [{ title: "Chat - Nexus" }] }),
  component: BotRoute,
});

function BotRoute() {
  const { botId } = Route.useParams();
  return <PublicChatPage botId={botId} />;
}
