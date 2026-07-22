from conversations.models import Conversation, ConversationPhase
from conversations.services.pipelines.base import (
    BasePipelineHandler,
    HandlerResult,
    tools_note,
)


class VideoPipelineHandler(BasePipelineHandler):
    """
    video UI → same research agent (YouTube title prompt) → script-writer → video-gen.
    """

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
        note = tools_note(tools)
        lower = user_text.lower()

        if conversation.phase == ConversationPhase.RESEARCH:
            if any(key in lower for key in ("script", "write scenes", "generate script")):
                return HandlerResult(
                    reply=(
                        f"Handing off to the script-writer agent{note}.\n\n"
                        f"I'll turn title research into scene scripts for: "
                        f"“{user_text.strip()[:160]}”.\n"
                        "(Script model will plug in here.)"
                    ),
                    agent="script_writer",
                    phase=ConversationPhase.SCRIPTING,
                    title=user_text.strip()[:80] or None,
                    context_updates={"title_brief": user_text},
                )

            return HandlerResult(
                reply=(
                    f"Research agent{note} — YouTube title mode: I'll help with title "
                    "research and angle shortlists (same chat service as blog, different prompt).\n\n"
                    f"You said: “{user_text.strip()[:200]}”.\n\n"
                    "Share a topic or niche. When ready, say “write a script” to continue "
                    "into scripting, then video generation."
                ),
                agent="shared_research",
                phase=ConversationPhase.RESEARCH,
                title=user_text.strip()[:80] or None,
            )

        if conversation.phase == ConversationPhase.SCRIPTING:
            if any(key in lower for key in ("video", "render", "generate video", "animate")):
                return HandlerResult(
                    reply=(
                        f"Attaching the video-generation agent{note}.\n"
                        "Text-to-audio & scene videos will run here."
                    ),
                    agent="video_gen",
                    phase=ConversationPhase.VIDEO_GEN,
                )

            return HandlerResult(
                reply=(
                    f"Script-writer agent{note} (stub): refining scenes for "
                    f"“{user_text.strip()[:160]}”.\n"
                    "Say “generate video” when you want the video-gen handoff."
                ),
                agent="script_writer",
                phase=ConversationPhase.SCRIPTING,
            )

        return HandlerResult(
            reply=(
                f"Video-gen agent{note} (stub): queued scene render for "
                f"“{user_text.strip()[:160]}”."
            ),
            agent="video_gen",
            phase=ConversationPhase.VIDEO_GEN,
        )
