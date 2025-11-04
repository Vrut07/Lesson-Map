"use server";

import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createLessonsBulkSchema, lessonSchema } from "@/lib/validation";
import { Lesson } from "@prisma/client";

//  GET — Fetch all lessons for the logged-in user
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.session.userId;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized! Please login to continue" },
      { status: 401 }
    );
  }

  try {
    const lessons = await db.lesson.findMany({
      where: {
        module: {
          course: { userId },
        },
      },
      include: {
        module: {
          select: { id: true, moduleName: true, courseId: true },
        },
      },
    });

    if (lessons.length === 0) {
      return NextResponse.json(
        { message: "No lessons found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lessons, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch lessons", details: (error as Error).message },
      { status: 500 }
    );
  }
}
