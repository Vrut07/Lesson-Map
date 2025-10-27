"use server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createCourseSchema } from "@/lib/validation";

// Get all courses with their modules
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userID = session?.session.userId;
  console.log(userID);
  if (!userID) {
    return NextResponse.json(
      { error: "Unauthorized! Please login to continue" },
      { status: 401 }
    );
  }
  try {
    const courses = await db.course.findMany({
      where: { userId: userID },
      include: { Module: true },
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

// Create a new course
export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    const body = await req.json();
    const result = createCourseSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return NextResponse.json(
        {
          error: "Validation failed",
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const data = result.data;
    const userID = session?.session.userId;

    if (!userID) {
      return NextResponse.json(
        { error: "User Does not exist" },
        { status: 401 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized! Please login to continue" },
        { status: 401 }
      );
    }
    const course = await db.course.create({
      data: {
        courseName: data.courseName,
        description: data.description,
        userId: userID,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create course", details: (error as Error).message },
      { status: 500 }
    );
  }
}
