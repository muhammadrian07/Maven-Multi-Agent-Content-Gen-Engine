import type { PipelineId } from "@/types/conversations";
import type {
  ChatMessage,
  Conversation,
  SendMessageResult,
} from "@/types/conversations";
import { djangoFetch } from "@/lib/api/client";

type CreateConversationPayload = {
  pipeline: PipelineId;
};

type SendMessagePayload = {
  content: string;
  tools?: string[];
};

/** Django conversations contract — keep in sync with backend routes. */
export const djangoConversations = {
  list(accessToken: string, pipeline?: PipelineId): Promise<Conversation[]> {
    const query = pipeline ? `?pipeline=${pipeline}` : "";
    return djangoFetch<Conversation[]>(`/api/conversations/${query}`, {
      method: "GET",
      accessToken,
    });
  },

  create(
    accessToken: string,
    payload: CreateConversationPayload,
  ): Promise<Conversation> {
    return djangoFetch<Conversation>("/api/conversations/", {
      method: "POST",
      accessToken,
      body: payload,
    });
  },

  messages(accessToken: string, conversationId: string): Promise<ChatMessage[]> {
    return djangoFetch<ChatMessage[]>(
      `/api/conversations/${conversationId}/messages/`,
      {
        method: "GET",
        accessToken,
      },
    );
  },

  sendMessage(
    accessToken: string,
    conversationId: string,
    payload: SendMessagePayload,
  ): Promise<SendMessageResult> {
    return djangoFetch<SendMessageResult>(
      `/api/conversations/${conversationId}/messages/`,
      {
        method: "POST",
        accessToken,
        body: payload,
      },
    );
  },
};
