// app/api/courses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { exampleCourses } from "@/constants";

// GET /api/courses - Fetch all courses
export async function GET() {
  try {
    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      { success: true, data: exampleCourses },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

// POST /api/courses - Create new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 },
      );
    }

    const newCourse = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      outline: body.outline || [],
      createdAt: new Date().toISOString(),
    };

    // Here you would typically save to database
    // await db.courses.create(newCourse)

    return NextResponse.json(
      { success: true, data: newCourse },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create course" },
      { status: 500 },
    );
  }
}
