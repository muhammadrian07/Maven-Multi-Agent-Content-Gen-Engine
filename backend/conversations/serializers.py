from rest_framework import serializers

from conversations.models import Conversation, Message, Pipeline


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = (
            "id",
            "pipeline",
            "title",
            "phase",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields


class CreateConversationSerializer(serializers.Serializer):
    pipeline = serializers.ChoiceField(choices=Pipeline.choices)


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ("id", "role", "content", "meta", "created_at")
        read_only_fields = fields


class SendMessageSerializer(serializers.Serializer):
    content = serializers.CharField(max_length=8000, trim_whitespace=True)
    tools = serializers.ListField(
        child=serializers.CharField(max_length=64),
        required=False,
        allow_empty=True,
    )
