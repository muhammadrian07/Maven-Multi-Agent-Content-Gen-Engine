"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import type { ChatToolId } from "@/components/chatbot/config";

const ALLOWED_EXTENSIONS = new Set(["txt", "md"]);
const ACCEPT_ATTR = ".txt,.md,text/plain,text/markdown";
const REJECT_MESSAGE = "I only accept txt or md file.";

export type AttachedTextFile = {
  name: string;
  content: string;
};

type ChatComposerProps = {
  placeholder: string;
  disabled?: boolean;
  attachment?: AttachedTextFile | null;
  onClearAttachment?: () => void;
  onSend: (text: string, tools: ChatToolId[]) => void;
  /** Valid .txt / .md selection */
  onAttachFile: (file: AttachedTextFile) => void;
  /** Wrong file type — parent shows this as a chatbot reply */
  onRejectFile: (message: string) => void;
};

/** Floating ask bar with attach / Deep Search / Reason tools from /assets. */
export function ChatComposer({
  placeholder,
  disabled,
  attachment,
  onClearAttachment,
  onSend,
  onAttachFile,
  onRejectFile,
}: ChatComposerProps) {
  const [value, setValue] = useState("");
  const [tools, setTools] = useState<Set<ChatToolId>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function toggleTool(id: ChatToolId) {
    setTools((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function submit() {
    const text = value.trim();
    if ((!text && !attachment) || disabled) return;

    const payload = attachment
      ? [
          text || `Attached file: ${attachment.name}`,
          "",
          `--- ${attachment.name} ---`,
          attachment.content,
        ].join("\n")
      : text;

    onSend(payload, Array.from(tools));
    setValue("");
    onClearAttachment?.();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset so the same file can be re-selected after a reject.
    event.target.value = "";
    if (!file) return;

    const ext = file.name.includes(".")
      ? file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase()
      : "";

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      onRejectFile(REJECT_MESSAGE);
      return;
    }

    try {
      const content = await file.text();
      onAttachFile({ name: file.name, content });
    } catch {
      onRejectFile(REJECT_MESSAGE);
    }
  }

  return (
    <div className="w-full rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={handleFileChange}
      />

      {attachment ? (
        <div className="flex items-center gap-2 px-4 pt-3">
          <span className="inline-flex max-w-full items-center gap-2 truncate rounded-full bg-[#efefef] px-3 py-1 text-xs text-black/75">
            <span className="truncate">{attachment.name}</span>
            <button
              type="button"
              title="Remove attachment"
              onClick={onClearAttachment}
              className="shrink-0 text-black/45 hover:text-black"
            >
              ×
            </button>
          </span>
        </div>
      ) : null}

      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => {
          setValue(event.target.value);
          const el = event.target;
          el.style.height = "auto";
          el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        className="block w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[15px] text-black outline-none placeholder:text-black/35 disabled:opacity-60"
      />

      <div className="flex items-center gap-1.5 px-3 pb-3">
        <button
          type="button"
          title="Attach .txt or .md"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efefef] transition hover:bg-[#e4e4e4] disabled:opacity-50"
        >
          <Image
            src="/assets/attach.png"
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 object-contain"
          />
        </button>

        <ToolPill
          active={tools.has("deep_search")}
          onClick={() => toggleTool("deep_search")}
          iconSrc="/assets/deep-search.png"
          label="Deep Search"
        />

        <ToolPill
          active={tools.has("reason")}
          onClick={() => toggleTool("reason")}
          iconSrc="/assets/reason.png"
          label="Reason"
        />

        <button
          type="button"
          title="More"
          className="flex h-8 w-8 items-center justify-center rounded-full text-black/40 transition hover:bg-black/[0.05] hover:text-black/65"
        >
          <span className="text-lg leading-none">…</span>
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={disabled || (!value.trim() && !attachment)}
          title="Send"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition enabled:hover:bg-black/85 disabled:cursor-not-allowed disabled:bg-black/25"
        >
          <ArrowUpIcon />
        </button>
      </div>
    </div>
  );
}

function ToolPill({
  active,
  onClick,
  iconSrc,
  label,
}: {
  active: boolean;
  onClick: () => void;
  iconSrc: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition sm:text-[13px] ${
        active
          ? "bg-black text-white"
          : "bg-[#efefef] text-black/70 hover:bg-[#e4e4e4]"
      }`}
    >
      <Image
        src={iconSrc}
        alt=""
        width={14}
        height={14}
        className={`h-3.5 w-3.5 object-contain ${active ? "brightness-0 invert" : ""}`}
      />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 19V5M5 12l7-7 7 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
