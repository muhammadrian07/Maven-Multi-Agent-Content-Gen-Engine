import { authSuccessResponse, handleRouteError, jsonError } from "@/lib/auth/server";
import { djangoAuth } from "@/lib/api/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!body.email?.trim() || !body.password) {
      return jsonError("Email and password are required.", 400);
    }

    const auth = await djangoAuth.login({
      email: body.email.trim(),
      password: body.password,
    });

    return authSuccessResponse(auth);
  } catch (error) {
    return handleRouteError(error);
  }
}
