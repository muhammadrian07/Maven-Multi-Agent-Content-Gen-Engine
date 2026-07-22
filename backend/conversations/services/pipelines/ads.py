from conversations.models import Conversation, ConversationPhase
from conversations.services.pipelines.base import (
    BasePipelineHandler,
    HandlerResult,
    tools_note,
)


class AdsPipelineHandler(BasePipelineHandler):
    """
    ads UI → shared research chat → image/try-on agent → optional video-gen clip.

    Important: do NOT jump straight to video-gen; garment-on-model needs image first.
    """

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
        note = tools_note(tools)
        lower = user_text.lower()

        if conversation.phase == ConversationPhase.RESEARCH:
            if any(
                key in lower
                for key in ("generate", "try on", "try-on", "model shot", "create image")
            ):
                return HandlerResult(
                    reply=(
                        f"Handing off to the image / virtual try-on agent{note}.\n\n"
                        "We'll place the product on a consistent model from multiple angles "
                        f"based on: “{user_text.strip()[:160]}”.\n"
                        "(Image/try-on model will plug in here — before any video step.)"
                    ),
                    agent="image_try_on",
                    phase=ConversationPhase.IMAGE_GEN,
                    title=user_text.strip()[:80] or None,
                    context_updates={"product_brief": user_text},
                )

            return HandlerResult(
                reply=(
                    f"Research agent{note}: I'll brief the UGC ad — product, look, and angles.\n\n"
                    f"You said: “{user_text.strip()[:200]}”.\n\n"
                    "Describe the product and style. When ready, say “generate model shots” "
                    "for try-on images. After that we can optionally animate a 5–8s clip."
                ),
                agent="shared_research",
                phase=ConversationPhase.RESEARCH,
                title=user_text.strip()[:80] or None,
            )

        if conversation.phase == ConversationPhase.IMAGE_GEN:
            if any(key in lower for key in ("video", "clip", "animate", "5-8", "5–8")):
                return HandlerResult(
                    reply=(
                        f"Image try-on complete path → attaching video-gen agent{note} "
                        "to animate the finished still into a short 5–8s creative clip."
                    ),
                    agent="video_gen",
                    phase=ConversationPhase.VIDEO_GEN,
                )

            return HandlerResult(
                reply=(
                    f"Image / try-on agent{note} (stub): refining model shots for "
                    f"“{user_text.strip()[:160]}”.\n"
                    "Say “make a clip” when you want the optional video-gen step."
                ),
                agent="image_try_on",
                phase=ConversationPhase.IMAGE_GEN,
            )

        return HandlerResult(
            reply=(
                f"Video-gen agent{note} (stub): short UGC clip from the try-on still — "
                f"“{user_text.strip()[:160]}”."
            ),
            agent="video_gen",
            phase=ConversationPhase.VIDEO_GEN,
        )
