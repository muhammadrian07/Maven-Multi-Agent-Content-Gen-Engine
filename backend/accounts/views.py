from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.google import verify_google_id_token
from accounts.serializers import (
    GoogleAuthSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)

User = get_user_model()


def tokens_for_user(user) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": UserSerializer(user).data,
    }


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(tokens_for_user(user), status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(tokens_for_user(serializer.validated_data["user"]))


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        identity = verify_google_id_token(serializer.validated_data["id_token"])

        user, created = User.objects.get_or_create(
            email=identity.email,
            defaults={"full_name": identity.full_name},
        )

        # Fill empty names on returning Google users without overwriting custom names.
        if not created and not user.full_name and identity.full_name:
            user.full_name = identity.full_name
            user.save(update_fields=["full_name"])

        if created:
            user.set_unusable_password()
            user.save(update_fields=["password"])

        return Response(tokens_for_user(user))


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class RefreshView(TokenRefreshView):
    """
    Thin wrapper so the path stays /api/auth/refresh/ and response is { "access": "..." }.
    """

    permission_classes = [AllowAny]
    serializer_class = TokenRefreshSerializer
