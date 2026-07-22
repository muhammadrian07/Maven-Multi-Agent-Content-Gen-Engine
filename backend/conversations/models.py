import uuid

from django.conf import settings
from django.db import models


class Pipeline(models.TextChoices):
    BLOG = "blog", "Maven Blog"
    VIDEO = "video", "Maven Video"
    ADS = "ads", "Maven Ads"


class ConversationPhase(models.TextChoices):
    """
    Shared research phase first; then pipeline-specific generation phases.
    Ads: research → image_gen (try-on) → video_gen (optional clip).
    Video: research → scripting → video_gen.
    Blog: research → writing.
    """

    RESEARCH = "research", "Research / chat"
    WRITING = "writing", "Blog writing"
    SCRIPTING = "scripting", "Script writing"
    IMAGE_GEN = "image_gen", "Image / try-on"
    VIDEO_GEN = "video_gen", "Video generation"
    COMPLETE = "complete", "Complete"


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="conversations",
    )
    pipeline = models.CharField(max_length=16, choices=Pipeline.choices)
    title = models.CharField(max_length=200, blank=True, default="")
    phase = models.CharField(
        max_length=32,
        choices=ConversationPhase.choices,
        default=ConversationPhase.RESEARCH,
    )
    context = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self) -> str:
        return f"{self.pipeline}:{self.id}"


class MessageRole(models.TextChoices):
    USER = "user", "User"
    ASSISTANT = "assistant", "Assistant"
    SYSTEM = "system", "System"


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    role = models.CharField(max_length=16, choices=MessageRole.choices)
    content = models.TextField()
    meta = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"{self.role}:{self.id}"
