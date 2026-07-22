"""
Shared conversation orchestration.

One chat/research service for all UIs; pipeline handlers attach downstream
agents (blog writer, script + video, image/try-on + optional video).
"""

from __future__ import annotations

from conversations.models import Conversation, ConversationPhase, Message, MessageRole
from conversations.services.llm import LlmError
from conversations.services.pipelines import get_handler
from conversations.services.pipelines.base import HandlerResult
from conversations.services.tokens import TokenLimitExceeded, chat_token_limit, tokens_used


def create_conversation(*, user, pipeline: str) -> Conversation:
    handler = get_handler(pipeline)
    return Conversation.objects.create(
        user=user,
        pipeline=pipeline,
        title=handler.default_title(),
        phase=ConversationPhase.RESEARCH,
        context={"pipeline": pipeline, "tokens_used": 0},
    )


def handle_user_message(
    *,
    conversation: Conversation,
    content: str,
    tools: list[str] | None = None,
) -> tuple[Message, Message]:
    """
    Persist the user turn, call the pipeline handler (local LLM), save assistant turn.
    """
    tools = tools or []
    user_message = Message.objects.create(
        conversation=conversation,
        role=MessageRole.USER,
        content=content,
        meta={"tools": tools},
    )

    handler = get_handler(conversation.pipeline)
    try:
        result = handler.respond(
            conversation=conversation,
            user_text=content,
            tools=tools,
        )
    except TokenLimitExceeded as exc:
        result = HandlerResult(
            reply=str(exc),
            agent="system",
            phase=conversation.phase,
            meta={
                "error": True,
                "llm": False,
                "token_limit": True,
                "tokens_used": tokens_used(conversation),
                "token_limit_max": chat_token_limit(),
            },
        )
    except LlmError as exc:
        result = HandlerResult(
            reply=str(exc),
            agent="system",
            phase=conversation.phase,
            meta={"error": True, "llm": False},
        )

    if result.phase and result.phase != conversation.phase:
        conversation.phase = result.phase
    if result.context_updates:
        conversation.context = {**(conversation.context or {}), **result.context_updates}
    if result.title:
        if not conversation.title or conversation.title.startswith("Maven "):
            conversation.title = result.title[:200]
    conversation.save(update_fields=["phase", "context", "title", "updated_at"])

    assistant_message = Message.objects.create(
        conversation=conversation,
        role=MessageRole.ASSISTANT,
        content=result.reply,
        meta={
            "agent": result.agent,
            "phase": conversation.phase,
            "tools_applied": tools,
            **(result.meta or {}),
        },
    )
    return user_message, assistant_message
