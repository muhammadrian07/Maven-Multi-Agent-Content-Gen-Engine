import { NextResponse } from "next/server";
import { djangoConversations } from "@/lib/api/conversations";
import {
  applyAccessCookie,
  handleRouteError,
  jsonError,
  resolveAccessToken,
} from "@/lib/auth/server";
import { ApiError } from "@/lib/api/errors";

type RouteContext = {
  params: { id: string };
};

async function withToken<T>(
  run: (accessToken: string) => Promise<T>,
): Promise<NextResponse> {
  const { accessToken, rotatedAccess } = await resolveAccessToken();

  if (!accessToken) {
    return jsonError("Not authenticated.", 401);
  }

  try {
    const data = await run(accessToken);
    const response = NextResponse.json(data);
    if (rotatedAccess) applyAccessCookie(response, rotatedAccess);
    return response;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return jsonError("Not authenticated.", 401);
    }
    throw error;
  }
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    return await withToken((token) =>
      djangoConversations.messages(token, context.params.id),
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const body = (await request.json()) as {
      content?: string;
      tools?: string[];
    };

    if (!body.content?.trim()) {
      return jsonError("content is required.", 400);
    }

    return await withToken((token) =>
      djangoConversations.sendMessage(token, context.params.id, {
        content: body.content!.trim(),
        tools: body.tools,
      }),
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
