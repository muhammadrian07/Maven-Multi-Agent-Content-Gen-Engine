"""
Shared conversation orchestration.

One chat/research service for all UIs; pipeline handlers attach downstream
agents (blog writer, script + video, image/try-on + optional video).
"""

from __future__ import annotations

from conversations.models import Conversation, ConversationPhase, Message, MessageRole
from conversations.services.pipelines import get_handler


def create_conversation(*, user, pipeline: str) -> Conversation:
    handler = get_handler(pipeline)
    return Conversation.objects.create(
        user=user,
        pipeline=pipeline,
        title=handler.default_title(),
        phase=ConversationPhase.RESEARCH,
        context={"pipeline": pipeline},
    )


def handle_user_message(
    *,
    conversation: Conversation,
    content: str,
    tools: list[str] | None = None,
) -> tuple[Message, Message]:
    """
    Persist the user turn, run the shared research agent (via pipeline handler
    prompt), then optionally advance into generation phases.
    """
    tools = tools or []
    user_message = Message.objects.create(
        conversation=conversation,
        role=MessageRole.USER,
        content=content,
        meta={"tools": tools},
    )

    handler = get_handler(conversation.pipeline)
    result = handler.respond(conversation=conversation, user_text=content, tools=tools)

    if result.phase and result.phase != conversation.phase:
        conversation.phase = result.phase
    if result.context_updates:
        conversation.context = {**(conversation.context or {}), **result.context_updates}
    if result.title:
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
