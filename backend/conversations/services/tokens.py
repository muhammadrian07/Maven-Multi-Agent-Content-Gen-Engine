"""Approximate token budgeting per conversation (local models)."""

from __future__ import annotations

from django.conf import settings

from conversations.models import Conversation


class TokenLimitExceeded(Exception):
    """Raised when this chat would exceed the per-conversation token budget."""


def estimate_tokens(text: str) -> int:
    """Rough token estimate (~4 chars / token). Good enough for local budgeting."""
    if not text:
        return 0
    return max(1, len(text) // 4)


def estimate_messages_tokens(messages: list[dict[str, str]]) -> int:
    return sum(estimate_tokens(m.get("content", "")) for m in messages)


def tokens_used(conversation: Conversation) -> int:
    ctx = conversation.context or {}
    try:
        return int(ctx.get("tokens_used", 0))
    except (TypeError, ValueError):
        return 0


def chat_token_limit() -> int:
    return int(getattr(settings, "CHAT_TOKEN_LIMIT", 5000))


def ensure_within_limit(conversation: Conversation, upcoming_input_tokens: int) -> None:
    """
    Enforce a hard per-chat budget. Reserves a small slice for the model reply.
    """
    limit = chat_token_limit()
    used = tokens_used(conversation)
    # Leave headroom so a reply can still be stored within the budget.
    reply_reserve = min(400, max(100, limit // 5))
    if used + upcoming_input_tokens + reply_reserve > limit:
        raise TokenLimitExceeded(
            f"This chat has reached its {limit}-token limit "
            f"(used ≈ {used} tokens). Start a New chat to continue."
        )


def record_usage(
    conversation: Conversation,
    *,
    input_tokens: int,
    output_tokens: int,
) -> int:
    used = tokens_used(conversation) + max(0, input_tokens) + max(0, output_tokens)
    ctx = dict(conversation.context or {})
    ctx["tokens_used"] = used
    conversation.context = ctx
    conversation.save(update_fields=["context", "updated_at"])
    return used
