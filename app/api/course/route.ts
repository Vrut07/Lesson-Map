"use server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createCourseSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

// Get all courses with their modules
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userID = session?.session.userId;
  if (!userID) {
    return NextResponse.json(
      { error: "Unauthorized! Please login to continue" },
      { status: 401 }
    );
  }
  try {
    const courses = await db.course.findMany({
      where: { userId: userID },
      include: {
        Module: {
          include: {
            Lesson: true,
          },
        },
      },
    });
    if (!courses || courses.length === 0) {
      return NextResponse.json({ error: "No courses found" }, { status: 404 });
    }

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses", details: error },
      { status: 500 }
    );
  }
}
