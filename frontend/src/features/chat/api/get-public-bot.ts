import { publicApiClient, unwrapApiData } from "@/shared/lib/axios";
import type { PublicBot } from "../types/chat.types";

export const getPublicBot = (botId: string) =>
  publicApiClient.get(`/public/bots/${botId}`).then(unwrapApiData<{ bot: PublicBot }>);
