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
import type { ChatMessage } from "@/types/conversations";

type ChatbotPageProps = {
  pipeline: PipelineId;
};

/**
 * Shared chatbot shell for blog / video / ads.
 * UI matches the reference chrome; backend pipeline is keyed by `pipeline`.
 */
export function ChatbotPage({ pipeline }: ChatbotPageProps) {
  const config = CHATBOT_CONFIGS[pipeline];
  const router = useRouter();
  const { user, loading } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attachment, setAttachment] = useState<AttachedTextFile | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function ensureConversation(): Promise<string> {
    if (conversationId) return conversationId;
    const created = await conversationsClient.create(pipeline);
    setConversationId(created.id);
    return created.id;
  }

  async function handleNewChat() {
    setConversationId(null);
    setMessages([]);
    setError(null);
    setAttachment(null);
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
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#f4f4f4] text-black/45">
        Loading…
      </main>
    );
  }

  const isEmpty = messages.length === 0;

  /* Full-bleed light shell — no dark frame, padding, or inset card. */
  return (
    <main className="flex min-h-dvh w-full overflow-hidden bg-[#f4f4f4]">
      <ChatSidebar
        config={config}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        onNewChat={handleNewChat}
        userLabel={user.full_name || user.email}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end gap-2 px-4 py-3 sm:px-5">
          <PipelineChip config={config} />
          <div
            aria-hidden
            className="h-8 w-8 rounded-full bg-gradient-to-br from-[#d0d0d0] to-[#9a9a9a]"
            title={user.full_name || user.email}
          />
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-4 sm:px-8">
          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center pb-8">
              <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                {config.emptyHeading}
              </h1>
              <div className="w-full max-w-2xl">
                <ChatComposer
                  placeholder={config.placeholder}
                  disabled={busy}
                  attachment={attachment}
                  onClearAttachment={() => setAttachment(null)}
                  onAttachFile={setAttachment}
                  onRejectFile={handleRejectFile}
                  onSend={handleSend}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto w-full max-w-2xl flex-1 space-y-4 py-2">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {busy ? (
                  <p className="text-sm text-black/40">Maven is thinking…</p>
                ) : null}
                <div ref={bottomRef} />
              </div>

              <div className="mx-auto mt-auto w-full max-w-2xl pt-3">
                <ChatComposer
                  placeholder={config.placeholder}
                  disabled={busy}
                  attachment={attachment}
                  onClearAttachment={() => setAttachment(null)}
                  onAttachFile={setAttachment}
                  onRejectFile={handleRejectFile}
                  onSend={handleSend}
                />
              </div>
            </>
          )}

          {error ? (
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-danger">
              {error}
            </p>
          ) : null}

          <p className="mx-auto mt-3 max-w-2xl text-center text-[11px] text-black/40">
            AI can make mistakes. Please double-check responses.
          </p>
        </div>
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
