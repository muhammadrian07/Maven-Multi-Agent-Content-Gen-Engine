from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from conversations.models import Conversation
from conversations.serializers import (
    ConversationSerializer,
    CreateConversationSerializer,
    MessageSerializer,
    SendMessageSerializer,
)
from conversations.services import create_conversation, handle_user_message


class ConversationListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Conversation.objects.filter(user=request.user)
        pipeline = request.query_params.get("pipeline")
        if pipeline:
            qs = qs.filter(pipeline=pipeline)
        return Response(ConversationSerializer(qs, many=True).data)

    def post(self, request):
        serializer = CreateConversationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        conversation = create_conversation(
            user=request.user,
            pipeline=serializer.validated_data["pipeline"],
        )
        return Response(
            ConversationSerializer(conversation).data,
            status=status.HTTP_201_CREATED,
        )


class ConversationMessageListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def _get_conversation(self, request, conversation_id) -> Conversation | None:
        try:
            return Conversation.objects.get(id=conversation_id, user=request.user)
        except (Conversation.DoesNotExist, ValueError):
            return None

    def get(self, request, conversation_id):
        conversation = self._get_conversation(request, conversation_id)
        if conversation is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        messages = conversation.messages.all()
        return Response(MessageSerializer(messages, many=True).data)

    def post(self, request, conversation_id):
        conversation = self._get_conversation(request, conversation_id)
        if conversation is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_message, assistant_message = handle_user_message(
            conversation=conversation,
            content=serializer.validated_data["content"],
            tools=serializer.validated_data.get("tools") or [],
        )
        conversation.refresh_from_db()

        return Response(
            {
                "user_message": MessageSerializer(user_message).data,
                "assistant_message": MessageSerializer(assistant_message).data,
                "conversation": ConversationSerializer(conversation).data,
            },
            status=status.HTTP_201_CREATED,
        )
