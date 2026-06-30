import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { getPublicBot } from "../api/get-public-bot";
import { sendChatMessage } from "../api/send-chat-message";
import { sendPublicChatMessage } from "../api/send-public-chat-message";

export const usePublicBot = (botId: string) =>
  useQuery({
    queryKey: ["public-bot", botId],
    queryFn: () => getPublicBot(botId).then((data) => data.bot),
    retry: false,
  });

export const useSendChatMessage = () =>
  useMutation({
    mutationFn: sendChatMessage,
    onError: (error) => toast.error(getApiErrorMessage(error, "Chat runtime failed")),
  });

export const useSendPublicChatMessage = () =>
  useMutation({
    mutationFn: sendPublicChatMessage,
    onError: (error) => toast.error(getApiErrorMessage(error, "Public chat runtime failed")),
  });
