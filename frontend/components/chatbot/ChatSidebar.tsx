"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ChatbotConfig } from "@/components/chatbot/config";
import { USER_SELECTION_PATH } from "@/components/selection/constants";
import type { Conversation } from "@/types/conversations";

type ChatSidebarProps = {
  config: ChatbotConfig;
  open: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  userLabel: string;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
};

/**
 * Collapsible chat sidebar.
 * Closed = icon rail; open = wider panel with saved chats from the DB.
 */
export function ChatSidebar({
  config,
  open,
  onToggle,
  onNewChat,
  userLabel,
  conversations,
  activeConversationId,
  onSelectConversation,
}: ChatSidebarProps) {
  if (!open) {
    return (
      <aside className="flex h-full w-[52px] shrink-0 flex-col items-center gap-3 overflow-hidden border-r border-black/[0.06] bg-[#ececec] py-3 sm:w-[56px]">
        <IconButton title="Open sidebar" onClick={onToggle}>
          <PanelIcon />
        </IconButton>

        <button
          type="button"
          onClick={onNewChat}
          title="New chat"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white transition hover:bg-black/85"
        >
          <PlusIcon />
        </button>

        <div className="mt-auto flex flex-col items-center gap-2 pb-1">
          <Image
            src={config.iconSrc}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain opacity-80"
          />
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col overflow-hidden border-r border-black/[0.06] bg-[#ececec] sm:w-[280px]">
      <div className="flex shrink-0 items-center justify-between gap-2 px-3 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Image
            src={config.iconSrc}
            alt=""
            width={22}
            height={22}
            className="h-[22px] w-[22px] shrink-0 object-contain"
          />
          <span className="truncate text-sm font-semibold text-black">
            {config.title}
          </span>
        </div>
        <IconButton title="Close sidebar" onClick={onToggle}>
          <PanelIcon />
        </IconButton>
      </div>

      <div className="flex shrink-0 flex-col gap-1 px-2">
        <SidebarRow onClick={onNewChat} icon={<PlusIcon />} label="New chat" />
        <SidebarRow
          href={USER_SELECTION_PATH}
          icon={<PipelinesIcon />}
          label="All pipelines"
        />
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col px-2">
        <p className="shrink-0 px-2 pb-2 text-xs font-medium text-black/40">Chats</p>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {conversations.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-black/35">
              No chats yet. Start one from the composer.
            </p>
          ) : (
            <ul className="space-y-0.5 pb-2">
              {conversations.map((item) => {
                const active = item.id === activeConversationId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelectConversation(item.id)}
                      className={`w-full truncate rounded-xl px-2.5 py-2 text-left text-sm transition ${
                        active
                          ? "bg-black/[0.08] font-medium text-black"
                          : "text-black/75 hover:bg-black/[0.05]"
                      }`}
                      title={item.title || "Chat"}
                    >
                      {item.title?.trim() || "Untitled chat"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-auto shrink-0 border-t border-black/[0.06] px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div
            aria-hidden
            className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[#d0d0d0] to-[#9a9a9a]"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-black">{userLabel}</p>
            <p className="truncate text-xs text-black/45">maven.ai</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function IconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-black/55 transition hover:bg-black/[0.06] hover:text-black"
    >
      {children}
    </button>
  );
}

function SidebarRow({
  label,
  icon,
  onClick,
  href,
}: {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const className =
    "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-black/80 transition hover:bg-black/[0.05]";

  if (href) {
    return (
      <Link href={href} className={className}>
        <span className="flex h-5 w-5 items-center justify-center text-black/55">
          {icon}
        </span>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <span className="flex h-5 w-5 items-center justify-center text-black/55">
        {icon}
      </span>
      {label}
    </button>
  );
}

function PanelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="15"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M9 4.5v15" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PipelinesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
