import { NextResponse } from "next/server";
import { generatePresignedUrl } from "@/lib/r2/generatePresignedUrl";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const ALLOWED_CONTENT_TYPES = new Set([
  "application/pdf",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
]);

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.session.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized! Please login to continue" },
        { status: 401 },
      );
    }

    const { filename, contentType } = await request.json();
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Invalid request body!" },
        { status: 400 },
      );
    }

    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: "Only PDF and image uploads are supported" },
        { status: 400 },
      );
    }

    const result = await generatePresignedUrl(
      filename,
      contentType,
      `lesson-resources/${userId}`,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating upload URL:", error);
    return NextResponse.json(
      {
        error: "Failed to create upload URL",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 },
    );
  }
}
