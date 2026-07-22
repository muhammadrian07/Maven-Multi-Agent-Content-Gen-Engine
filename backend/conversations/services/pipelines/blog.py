from conversations.models import Conversation, ConversationPhase
from conversations.services.agent import run_pipeline_llm
from conversations.services.pipelines.base import BasePipelineHandler, HandlerResult


class BlogPipelineHandler(BasePipelineHandler):
    """blog UI → local LLM with full chat transcript."""

    pipeline = "blog"

    def default_title(self) -> str:
        return "Maven Blog chat"

    def respond(
        self,
        *,
        conversation: Conversation,
        user_text: str,
        tools: list[str],
    ) -> HandlerResult:
        phase = conversation.phase or ConversationPhase.RESEARCH
        if phase == ConversationPhase.RESEARCH and _wants_writing(user_text):
            phase = ConversationPhase.WRITING

        reply, llm_meta = run_pipeline_llm(
            conversation=conversation,
            phase=phase,
            tools=tools,
            user_text=user_text,
        )
        return HandlerResult(
            reply=reply,
            agent="blog_writer" if phase == ConversationPhase.WRITING else "shared_research",
            phase=phase,
            title=user_text.strip()[:80] or None,
            meta=llm_meta,
        )


def _wants_writing(text: str) -> bool:
    lower = text.lower()
    return any(
        key in lower
        for key in ("write", "draft", "generate blog", "start writing", "full article")
    )
