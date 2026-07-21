import { authSuccessResponse, handleRouteError, jsonError } from "@/lib/auth/server";
import { djangoAuth } from "@/lib/api/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { id_token?: string };

    if (!body.id_token?.trim()) {
      return jsonError("Google ID token is required.", 400);
    }

    const auth = await djangoAuth.google({ id_token: body.id_token.trim() });
    return authSuccessResponse(auth);
  } catch (error) {
    return handleRouteError(error);
  }
}
