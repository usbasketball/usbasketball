import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { TRAINING_SCHEDULE_TAG } from "@/lib/schedule";
import { ALV_NOTES_TAG } from "@/lib/alv-notes";
import { TASKS_PDF_TAG } from "@/lib/tasks-pdf";

function handleRequest(request: NextRequest): NextResponse {
  const secret = process.env.CONTENTFUL_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, error: "CONTENTFUL_WEBHOOK_SECRET is not set" },
      { status: 500 }
    );
  }

  const supplied =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-contentful-webhook-secret") ??
    request.headers.get("x-webhook-secret");

  if (supplied !== secret) {
    return NextResponse.json(
      { revalidated: false, error: "invalid secret" },
      { status: 401 }
    );
  }

  revalidateTag(TRAINING_SCHEDULE_TAG, "max");
  revalidateTag(ALV_NOTES_TAG, "max");
  revalidateTag(TASKS_PDF_TAG, "max");
  return NextResponse.json({ revalidated: true });
}

export function GET(request: NextRequest) {
  return handleRequest(request);
}

export function POST(request: NextRequest) {
  return handleRequest(request);
}
