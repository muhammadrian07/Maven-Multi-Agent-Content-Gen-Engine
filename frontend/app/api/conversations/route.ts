import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { djangoConversations } from "@/lib/api/conversations";
import {
  applyAccessCookie,
  handleRouteError,
  jsonError,
  resolveAccessToken,
} from "@/lib/auth/server";
import type { PipelineId } from "@/types/conversations";

const PIPELINES = new Set<PipelineId>(["blog", "video", "ads"]);

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
      const refreshAttempt = await resolveAccessToken();
      if (!refreshAttempt.accessToken || refreshAttempt.accessToken === accessToken) {
        return jsonError("Not authenticated.", 401);
      }
      const data = await run(refreshAttempt.accessToken);
      const response = NextResponse.json(data);
      if (refreshAttempt.rotatedAccess) {
        applyAccessCookie(response, refreshAttempt.rotatedAccess);
      }
      return response;
    }
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pipeline = searchParams.get("pipeline") as PipelineId | null;

    if (pipeline && !PIPELINES.has(pipeline)) {
      return jsonError("Invalid pipeline.", 400);
    }

    return await withToken((token) =>
      djangoConversations.list(token, pipeline ?? undefined),
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { pipeline?: PipelineId };

    if (!body.pipeline || !PIPELINES.has(body.pipeline)) {
      return jsonError("pipeline must be blog, video, or ads.", 400);
    }

    return await withToken((token) =>
      djangoConversations.create(token, { pipeline: body.pipeline! }),
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
