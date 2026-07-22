from conversations.models import Conversation, ConversationPhase
from conversations.services.agent import run_pipeline_llm
from conversations.services.pipelines.base import BasePipelineHandler, HandlerResult


class VideoPipelineHandler(BasePipelineHandler):
    """video UI → local LLM with full chat transcript."""

    pipeline = "video"

    def default_title(self) -> str:
        return "Maven Video chat"

    def respond(
        self,
        *,
        conversation: Conversation,
        user_text: str,
        tools: list[str],
    ) -> HandlerResult:
        phase = conversation.phase or ConversationPhase.RESEARCH
        lower = user_text.lower()

        if phase == ConversationPhase.RESEARCH and any(
            k in lower for k in ("script", "write scenes", "generate script")
        ):
            phase = ConversationPhase.SCRIPTING
        elif phase == ConversationPhase.SCRIPTING and any(
            k in lower for k in ("video", "render", "generate video", "animate")
        ):
            phase = ConversationPhase.VIDEO_GEN

        reply, llm_meta = run_pipeline_llm(
            conversation=conversation,
            phase=phase,
            tools=tools,
            user_text=user_text,
        )

        agent = {
            ConversationPhase.SCRIPTING: "script_writer",
            ConversationPhase.VIDEO_GEN: "video_gen",
        }.get(phase, "shared_research")

        return HandlerResult(
            reply=reply,
            agent=agent,
            phase=phase,
            title=user_text.strip()[:80] or None,
            meta=llm_meta,
        )
