import { authSuccessResponse, handleRouteError, jsonError } from "@/lib/auth/server";
import { djangoAuth } from "@/lib/api/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      full_name?: string;
    };

    if (!body.email?.trim() || !body.password || !body.full_name?.trim()) {
      return jsonError("Full name, email, and password are required.", 400);
    }

    const auth = await djangoAuth.register({
      email: body.email.trim(),
      password: body.password,
      full_name: body.full_name.trim(),
    });

    return authSuccessResponse(auth);
  } catch (error) {
    return handleRouteError(error);
  }
}
