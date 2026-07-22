"""
Shared agent helpers: system prompts, transcript assembly, LLM invoke.

- Current chat: full recent transcript from this conversation's messages.
- Cross-chat memory: snippets from the user's earlier chats in the same pipeline.
- Deep Search: specialist system prompt + live web results attached for the turn.
"""

from __future__ import annotations

from conversations.models import Conversation, ConversationPhase, Message, MessageRole
from conversations.services.llm import chat
from conversations.services.prompts import DEEP_SEARCH_SYSTEM_PROMPT
from conversations.services.search import format_search_results, web_search
from conversations.services.tokens import (
    TokenLimitExceeded,
    ensure_within_limit,
    estimate_messages_tokens,
    estimate_tokens,
    record_usage,
)

# Keep a sliding window so small local models (e.g. gemma3:270m) stay in context.
DEFAULT_TRANSCRIPT_LIMIT = 30
CROSS_CHAT_CONVERSATIONS = 5
CROSS_CHAT_USER_MESSAGES_PER_CHAT = 4

PIPELINE_SYSTEM_PROMPTS: dict[str, dict[str, str]] = {
    "blog": {
        ConversationPhase.RESEARCH: (
            "You are Maven Blog's research assistant. Help the user discover "
            "low-competition niches, rank-friendly topic shortlists, and SEO angles. "
            "Be practical and specific. Use this chat's messages AND any 'Earlier chats' "
            "memory block when the user asks what they said before. "
            "Ask clarifying questions only when needed — if they ask about a previous "
            "niche or fact and it appears in memory, answer it directly. "
            "Do not claim you browsed the live web unless search results are provided."
        ),
        ConversationPhase.WRITING: (
            "You are Maven Blog's writing assistant. Draft clear, SEO-friendly blog "
            "outlines and article sections based on the conversation and earlier-chat "
            "memory when relevant. Use markdown headings when helpful."
        ),
    },
    "video": {
        ConversationPhase.RESEARCH: (
            "You are Maven Video's research assistant. Help with YouTube title "
            "research, angles, and hooks. Be concise and punchy. "
            "Use this chat and any 'Earlier chats' memory when asked about past topics. "
            "Do not claim live web browsing unless search results are provided."
        ),
        ConversationPhase.SCRIPTING: (
            "You are Maven Video's script writer. Turn the brief and prior chat "
            "into scene-by-scene scripts with spoken lines and visual notes."
        ),
        ConversationPhase.VIDEO_GEN: (
            "You are Maven Video's production planner. Describe scene shots, timing, "
            "and text-to-audio notes for short videos. You cannot render video files yet."
        ),
    },
    "ads": {
        ConversationPhase.RESEARCH: (
            "You are Maven Ads' creative briefing assistant. Clarify product, audience, "
            "look/feel, and UGC angles. Use this chat and any 'Earlier chats' memory "
            "when asked about past briefs. "
            "Do not claim live web browsing unless search results are provided."
        ),
        ConversationPhase.IMAGE_GEN: (
            "You are Maven Ads' image / virtual try-on planner. Describe model shots "
            "from multiple angles for the product. You cannot generate image files yet."
        ),
        ConversationPhase.VIDEO_GEN: (
            "You are Maven Ads' short-clip planner. Describe 5–8s UGC clip structure "
            "from the finished still concept. You cannot render video files yet."
        ),
    },
}


def system_prompt_for(
    pipeline: str,
    phase: str,
    tools: list[str] | None = None,
    *,
    search_block: str | None = None,
) -> str:
    tools = tools or []

    # Deep Search replaces the default system prompt with the specialist brief.
    if "deep_search" in tools:
        prompt = DEEP_SEARCH_SYSTEM_PROMPT
        if search_block:
            prompt = f"{prompt}\n\n{search_block}"
        return prompt

    by_phase = PIPELINE_SYSTEM_PROMPTS.get(pipeline, {})
    prompt = by_phase.get(phase) or by_phase.get(ConversationPhase.RESEARCH)
    if not prompt:
        prompt = (
            "You are Maven, a helpful content assistant. "
            "Use prior chat turns and earlier-chat memory as context."
        )
    # Reason stays UI-only for now (intentionally ignored).
    return prompt


def build_cross_chat_memory(
    conversation: Conversation,
    *,
    max_conversations: int = CROSS_CHAT_CONVERSATIONS,
    messages_per_chat: int = CROSS_CHAT_USER_MESSAGES_PER_CHAT,
) -> str:
    others = (
        Conversation.objects.filter(
            user_id=conversation.user_id,
            pipeline=conversation.pipeline,
        )
        .exclude(id=conversation.id)
        .order_by("-updated_at")[:max_conversations]
    )

    blocks: list[str] = []
    for other in others:
        user_lines = list(
            Message.objects.filter(
                conversation=other,
                role=MessageRole.USER,
            )
            .order_by("created_at")
            .values_list("content", flat=True)[:messages_per_chat]
        )
        cleaned = [line.strip() for line in user_lines if line and line.strip()]
        if not cleaned:
            continue
        title = (other.title or "Untitled chat").strip()
        joined = " | ".join(cleaned)
        if len(joined) > 500:
            joined = joined[:500] + "…"
        blocks.append(f"- [{title}]: {joined}")

    if not blocks:
        return ""

    return (
        "Earlier chats with this user in this pipeline "
        "(use when they ask what they said before):\n"
        + "\n".join(blocks)
    )


def build_chat_transcript(
    conversation: Conversation,
    *,
    system_prompt: str,
    limit: int = DEFAULT_TRANSCRIPT_LIMIT,
    include_cross_chat_memory: bool = True,
) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = [{"role": "system", "content": system_prompt}]

    if include_cross_chat_memory:
        memory = build_cross_chat_memory(conversation)
        if memory:
            messages.append(
                {
                    "role": "user",
                    "content": (
                        "Here are facts from my earlier chats in this pipeline. "
                        "Remember them for this session. If I ask what niche or topic "
                        "I mentioned before, answer from these facts directly:\n"
                        f"{memory}"
                    ),
                }
            )
            messages.append(
                {
                    "role": "assistant",
                    "content": (
                        "Got it. I will use those earlier-chat facts when you ask about "
                        "previous niches, topics, or what you told me before."
                    ),
                }
            )

    recent = list(
        conversation.messages.order_by("-created_at").values("role", "content")[:limit]
    )
    recent.reverse()

    for row in recent:
        role = row["role"]
        if role not in (MessageRole.USER, MessageRole.ASSISTANT):
            continue
        content = (row["content"] or "").strip()
        if not content:
            continue
        messages.append({"role": role, "content": content})

    return messages


def run_pipeline_llm(
    *,
    conversation: Conversation,
    phase: str,
    tools: list[str] | None = None,
    user_text: str = "",
) -> tuple[str, dict]:
    """
    Returns (reply_text, debug_meta).
    Deep Search attaches specialist system prompt + live web results.
    Enforces per-chat token budget (default 5000).
    """
    tools = tools or []
    deep_search = "deep_search" in tools

    search_block = None
    search_hits = 0
    if deep_search:
        hits = web_search(user_text or conversation.title, max_results=8)
        search_hits = len(hits)
        search_block = format_search_results(hits)

    prompt = system_prompt_for(
        conversation.pipeline,
        phase,
        tools,
        search_block=search_block,
    )
    # Deep Search focuses on SERP evidence; skip cross-chat priming noise.
    transcript = build_chat_transcript(
        conversation,
        system_prompt=prompt,
        include_cross_chat_memory=not deep_search,
    )

    input_tokens = estimate_messages_tokens(transcript)
    ensure_within_limit(conversation, input_tokens)

    reply = chat(transcript)
    output_tokens = estimate_tokens(reply)
    total_used = record_usage(
        conversation,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
    )

    turn_count = max(0, len(transcript) - 1)
    return reply, {
        "llm": True,
        "transcript_turns": turn_count,
        "transcript_messages": len(transcript),
        "deep_search": deep_search,
        "search_hits": search_hits,
        "input_tokens_est": input_tokens,
        "output_tokens_est": output_tokens,
        "tokens_used": total_used,
    }
