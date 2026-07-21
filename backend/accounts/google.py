from dataclasses import dataclass

from django.conf import settings
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from rest_framework.exceptions import AuthenticationFailed


@dataclass(frozen=True)
class GoogleIdentity:
    email: str
    full_name: str


def verify_google_id_token(token: str) -> GoogleIdentity:
    """
    Verify a Google GIS credential (ID token) and return profile fields.
    Audience must match GOOGLE_CLIENT_ID (same as frontend NEXT_PUBLIC_GOOGLE_CLIENT_ID).
    """
    client_id = getattr(settings, "GOOGLE_CLIENT_ID", "") or ""
    if not client_id:
        raise AuthenticationFailed(
            "Google sign-in is not configured on the server (missing GOOGLE_CLIENT_ID)."
        )

    try:
        payload = google_id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            audience=client_id,
        )
    except ValueError as exc:
        raise AuthenticationFailed("Invalid or expired Google ID token.") from exc

    email = (payload.get("email") or "").strip().lower()
    if not email:
        raise AuthenticationFailed("Google account did not provide an email address.")

    if not payload.get("email_verified", False):
        raise AuthenticationFailed("Google email address is not verified.")

    full_name = (
        (payload.get("name") or "").strip()
        or (payload.get("given_name") or "").strip()
        or email.split("@")[0]
    )

    return GoogleIdentity(email=email, full_name=full_name)
