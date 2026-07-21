import { djangoFetch } from "@/lib/api/client";
import type {
  AuthResponse,
  GoogleAuthPayload,
  LoginPayload,
  RefreshResponse,
  RegisterPayload,
  User,
} from "@/types/auth";

/** Django auth contract — keep in sync with backend routes. */
export const djangoAuth = {
  register(payload: RegisterPayload): Promise<AuthResponse> {
    return djangoFetch<AuthResponse>("/api/auth/register/", {
      method: "POST",
      body: payload,
    });
  },

  login(payload: LoginPayload): Promise<AuthResponse> {
    return djangoFetch<AuthResponse>("/api/auth/login/", {
      method: "POST",
      body: payload,
    });
  },

  google(payload: GoogleAuthPayload): Promise<AuthResponse> {
    return djangoFetch<AuthResponse>("/api/auth/google/", {
      method: "POST",
      body: payload,
    });
  },

  refresh(refresh: string): Promise<RefreshResponse> {
    return djangoFetch<RefreshResponse>("/api/auth/refresh/", {
      method: "POST",
      body: { refresh },
    });
  },

  me(accessToken: string): Promise<User> {
    return djangoFetch<User>("/api/auth/me/", {
      method: "GET",
      accessToken,
    });
  },
};
