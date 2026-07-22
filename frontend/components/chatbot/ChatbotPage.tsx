"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ChatComposer, type AttachedTextFile } from "@/components/chatbot/ChatComposer";
import { ChatSidebar } from "@/components/chatbot/ChatSidebar";
import type { ChatToolId, ChatbotConfig, PipelineId } from "@/components/chatbot/config";
import { CHATBOT_CONFIGS } from "@/components/chatbot/config";
import { conversationsClient } from "@/lib/conversations/client";
import type { ChatMessage, Conversation } from "@/types/conversations";

type ChatbotPageProps = {
  pipeline: PipelineId;
};

/**
 * Shared chatbot shell for blog / video / ads.
 * Viewport is locked; only the message list scrolls.
 * Messages are persisted in the DB and replayed as LLM transcript.
 */
export function ChatbotPage({ pipeline }: ChatbotPageProps) {
  const config = CHATBOT_CONFIGS[pipeline];
  const router = useRouter();
  const { user, loading } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attachment, setAttachment] = useState<AttachedTextFile | null>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      try {
        const list = await conversationsClient.list(pipeline);
        if (active) setConversations(list);
      } catch {
        // Sidebar history is best-effort; chat still works.
      }
    })();
    return () => {
      active = false;
    };
  }, [user, pipeline]);

  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  async function refreshConversations() {
    try {
      const list = await conversationsClient.list(pipeline);
      setConversations(list);
    } catch {
      // ignore
    }
  }

  async function ensureConversation(): Promise<string> {
    if (conversationId) return conversationId;
    const created = await conversationsClient.create(pipeline);
    setConversationId(created.id);
    setConversations((prev) => [created, ...prev.filter((c) => c.id !== created.id)]);
    return created.id;
  }

  async function handleNewChat() {
    setConversationId(null);
    setMessages([]);
    setError(null);
    setAttachment(null);
  }

  async function handleSelectConversation(id: string) {
    setError(null);
    setAttachment(null);
    setBusy(true);
    try {
      const loaded = await conversationsClient.messages(id);
      setConversationId(id);
      setMessages(loaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat.");
    } finally {
      setBusy(false);
    }
  }

  function handleRejectFile(message: string) {
    setAttachment(null);
    setError(null);
    setMessages((prev) => [
      ...prev,
      {
        id: `local-reject-${Date.now()}`,
        role: "assistant",
        content: message,
        created_at: new Date().toISOString(),
        meta: { local: true, reason: "invalid_attachment" },
      },
    ]);
  }

  async function handleSend(text: string, tools: ChatToolId[]) {
    setError(null);
    setBusy(true);

    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
      meta: { tools },
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const id = await ensureConversation();
      const result = await conversationsClient.sendMessage(id, {
        content: text,
        tools,
      });
      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.id !== optimistic.id);
        return [...withoutOptimistic, result.user_message, result.assistant_message];
      });
      setConversations((prev) => {
        const rest = prev.filter((c) => c.id !== result.conversation.id);
        return [result.conversation, ...rest];
      });
      void refreshConversations();
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !user) {
    return (
      <main className="flex h-dvh items-center justify-center overflow-hidden bg-[#f4f4f4] text-black/45">
        Loading…
      </main>
    );
  }

  const isEmpty = messages.length === 0;
  const composer = (
    <ChatComposer
      placeholder={config.placeholder}
      disabled={busy}
      attachment={attachment}
      onClearAttachment={() => setAttachment(null)}
      onAttachFile={setAttachment}
      onRejectFile={handleRejectFile}
      onSend={handleSend}
    />
  );

  return (
    <main className="flex h-dvh max-h-dvh w-full overflow-hidden bg-[#f4f4f4]">
      <ChatSidebar
        config={config}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        onNewChat={handleNewChat}
        userLabel={user.full_name || user.email}
        conversations={conversations}
        activeConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-end gap-2 px-4 py-3 sm:px-5">
          <PipelineChip config={config} />
          <div
            aria-hidden
            className="h-8 w-8 rounded-full bg-gradient-to-br from-[#d0d0d0] to-[#9a9a9a]"
            title={user.full_name || user.email}
          />
        </header>

        {isEmpty ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-6 sm:px-8">
            <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-black sm:text-3xl">
              {config.emptyHeading}
            </h1>
            <div className="w-full max-w-2xl">{composer}</div>
            <p className="mt-3 text-center text-[11px] text-black/40">
              AI can make mistakes. Please double-check responses.
            </p>
          </div>
        ) : (
          <>
            <div
              ref={messagesScrollRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-8"
            >
              <div className="mx-auto w-full max-w-2xl space-y-4 py-2 pb-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {busy ? (
                  <p className="text-sm text-black/40">Maven is thinking…</p>
                ) : null}
              </div>
            </div>

            <div className="shrink-0 border-t border-black/[0.04] bg-[#f4f4f4] px-4 pt-3 pb-4 sm:px-8">
              <div className="mx-auto w-full max-w-2xl">
                {composer}
                {error ? (
                  <p className="mt-2 text-center text-sm text-danger">{error}</p>
                ) : null}
                <p className="mt-2 text-center text-[11px] text-black/40">
                  AI can make mistakes. Please double-check responses.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function PipelineChip({ config }: { config: ChatbotConfig }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white sm:text-sm">
      <Image
        src={config.iconSrc}
        alt=""
        width={16}
        height={16}
        className="h-4 w-4 object-contain brightness-0 invert"
      />
      {config.title}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-black text-white"
            : "border border-black/[0.06] bg-white text-black shadow-sm"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
