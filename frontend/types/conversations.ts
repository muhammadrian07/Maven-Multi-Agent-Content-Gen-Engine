export type PipelineId = "blog" | "video" | "ads";

export type ConversationPhase =
  | "research"
  | "writing"
  | "scripting"
  | "image_gen"
  | "video_gen"
  | "complete";

export type Conversation = {
  id: string;
  pipeline: PipelineId;
  title: string;
  phase: ConversationPhase;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  meta?: Record<string, unknown>;
};

export type SendMessageResult = {
  user_message: ChatMessage;
  assistant_message: ChatMessage;
  conversation: Conversation;
};
