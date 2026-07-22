from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from conversations.models import Conversation, ConversationPhase


@dataclass
class HandlerResult:
    reply: str
    agent: str
    phase: str | None = None
    title: str | None = None
    context_updates: dict[str, Any] = field(default_factory=dict)
    meta: dict[str, Any] = field(default_factory=dict)


class BasePipelineHandler:
    """Downstream handler plugged into the shared conversation service."""

    pipeline: str

    def default_title(self) -> str:
        return "New chat"

    def respond(
        self,
        *,
        conversation: Conversation,
        user_text: str,
        tools: list[str],
    ) -> HandlerResult:
        raise NotImplementedError


def tools_note(tools: list[str]) -> str:
    if not tools:
        return ""
    labels = {
        "deep_search": "Deep Search",
        "reason": "Reason",
    }
    named = [labels.get(t, t) for t in tools]
    return f" (tools: {', '.join(named)})"
