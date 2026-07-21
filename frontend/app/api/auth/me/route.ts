import { NextResponse } from "next/server";
import { handleRouteError, resolveSessionUser } from "@/lib/auth/server";

export async function GET() {
  try {
    const result = await resolveSessionUser();

    if (result.response) {
      return result.response;
    }

    if (!result.user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    return NextResponse.json(result.user);
  } catch (error) {
    return handleRouteError(error);
  }
}
