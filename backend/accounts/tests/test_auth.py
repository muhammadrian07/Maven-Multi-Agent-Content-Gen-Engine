from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.google import GoogleIdentity

User = get_user_model()


class AuthAPITests(APITestCase):
    def setUp(self):
        self.register_url = reverse("auth-register")
        self.login_url = reverse("auth-login")
        self.google_url = reverse("auth-google")
        self.refresh_url = reverse("auth-refresh")
        self.me_url = reverse("auth-me")

    def test_register_login_me_refresh(self):
        register = self.client.post(
            self.register_url,
            {
                "email": "Ada@Example.com",
                "password": "StrongPass1!",
                "full_name": "Ada Lovelace",
            },
            format="json",
        )
        self.assertEqual(register.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", register.data)
        self.assertIn("refresh", register.data)
        self.assertEqual(register.data["user"]["email"], "ada@example.com")
        self.assertEqual(register.data["user"]["full_name"], "Ada Lovelace")

        login = self.client.post(
            self.login_url,
            {"email": "ada@example.com", "password": "StrongPass1!"},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        access = login.data["access"]

        me = self.client.get(self.me_url, HTTP_AUTHORIZATION=f"Bearer {access}")
        self.assertEqual(me.status_code, status.HTTP_200_OK)
        self.assertEqual(me.data["email"], "ada@example.com")

        refresh = self.client.post(
            self.refresh_url,
            {"refresh": login.data["refresh"]},
            format="json",
        )
        self.assertEqual(refresh.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh.data)

    def test_login_rejects_bad_password(self):
        User.objects.create_user(
            email="bob@example.com",
            password="StrongPass1!",
            full_name="Bob",
        )
        response = self.client.post(
            self.login_url,
            {"email": "bob@example.com", "password": "wrong-password"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_me_requires_auth(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("accounts.views.verify_google_id_token")
    def test_google_creates_user(self, mock_verify):
        mock_verify.return_value = GoogleIdentity(
            email="google.user@example.com",
            full_name="Google User",
        )
        response = self.client.post(
            self.google_url,
            {"id_token": "fake-token"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["email"], "google.user@example.com")
        user = User.objects.get(email="google.user@example.com")
        self.assertFalse(user.has_usable_password())

    def test_duplicate_register(self):
        User.objects.create_user(
            email="dup@example.com",
            password="StrongPass1!",
            full_name="Dup",
        )
        response = self.client.post(
            self.register_url,
            {
                "email": "dup@example.com",
                "password": "StrongPass1!",
                "full_name": "Dup",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
