from conversations.models import Conversation, ConversationPhase
from conversations.services.agent import run_pipeline_llm
from conversations.services.pipelines.base import BasePipelineHandler, HandlerResult


class AdsPipelineHandler(BasePipelineHandler):
    """ads UI → local LLM with full chat transcript."""

    pipeline = "ads"

    def default_title(self) -> str:
        return "Maven Ads chat"

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
            k in lower
            for k in ("generate", "try on", "try-on", "model shot", "create image")
        ):
            phase = ConversationPhase.IMAGE_GEN
        elif phase == ConversationPhase.IMAGE_GEN and any(
            k in lower for k in ("video", "clip", "animate", "5-8", "5–8")
        ):
            phase = ConversationPhase.VIDEO_GEN

        reply, llm_meta = run_pipeline_llm(
            conversation=conversation,
            phase=phase,
            tools=tools,
            user_text=user_text,
        )

        agent = {
            ConversationPhase.IMAGE_GEN: "image_try_on",
            ConversationPhase.VIDEO_GEN: "video_gen",
        }.get(phase, "shared_research")

        return HandlerResult(
            reply=reply,
            agent=agent,
            phase=phase,
            title=user_text.strip()[:80] or None,
            meta=llm_meta,
        )
