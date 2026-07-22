from conversations.models import Conversation, ConversationPhase
from conversations.services.pipelines.base import (
    BasePipelineHandler,
    HandlerResult,
    tools_note,
)


class BlogPipelineHandler(BasePipelineHandler):
    """
    blog UI → shared research chat → blog-writer agent.
    """

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
        note = tools_note(tools)

        if conversation.phase == ConversationPhase.RESEARCH:
            # Heuristic handoff stub until real agents are wired.
            if any(
                key in user_text.lower()
                for key in ("write", "draft", "generate blog", "start writing")
            ):
                return HandlerResult(
                    reply=(
                        f"Moving from niche research into the blog-writer agent{note}.\n\n"
                        f"I'll draft an SEO-ready outline for: “{user_text.strip()[:160]}”.\n"
                        "(Writer model will plug in here.)"
                    ),
                    agent="blog_writer",
                    phase=ConversationPhase.WRITING,
                    title=user_text.strip()[:80] or None,
                    context_updates={"brief": user_text},
                )

            return HandlerResult(
                reply=(
                    f"Research agent{note}: I'll help discover low-competition niches "
                    "and rank-friendly topic shortlists.\n\n"
                    f"You said: “{user_text.strip()[:200]}”.\n\n"
                    "Tell me your niche, audience, or ask me to shortlist topics. "
                    "When you're ready, say “write a draft” to hand off to the blog writer."
                ),
                agent="shared_research",
                phase=ConversationPhase.RESEARCH,
                title=user_text.strip()[:80] or None,
            )

        return HandlerResult(
            reply=(
                f"Blog-writer agent{note} (stub): received “{user_text.strip()[:160]}”.\n"
                "Full draft generation will attach here."
            ),
            agent="blog_writer",
            phase=ConversationPhase.WRITING,
        )
