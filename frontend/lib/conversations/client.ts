import type { PipelineId } from "@/types/conversations";
import type {
  ChatMessage,
  Conversation,
  SendMessageResult,
} from "@/types/conversations";

type ClientErrorBody = {
  error?: string;
};

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const data: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const body = data as ClientErrorBody;
    throw new Error(
      typeof body.error === "string" ? body.error : "Request failed.",
    );
  }

  return data as T;
}

/** Browser → Next BFF helpers for the shared conversations API. */
export const conversationsClient = {
  list(pipeline?: PipelineId): Promise<Conversation[]> {
    const query = pipeline ? `?pipeline=${pipeline}` : "";
    return requestJson<Conversation[]>(`/api/conversations${query}`);
  },

  create(pipeline: PipelineId): Promise<Conversation> {
    return requestJson<Conversation>("/api/conversations", {
      method: "POST",
      body: JSON.stringify({ pipeline }),
    });
  },

  messages(conversationId: string): Promise<ChatMessage[]> {
    return requestJson<ChatMessage[]>(
      `/api/conversations/${conversationId}/messages`,
    );
  },

  sendMessage(
    conversationId: string,
    payload: { content: string; tools?: string[] },
  ): Promise<SendMessageResult> {
    return requestJson<SendMessageResult>(
      `/api/conversations/${conversationId}/messages`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },
};
