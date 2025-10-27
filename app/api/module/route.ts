"use server";

import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createModulesBulkSchema, moduleSchema } from "@/lib/validation";
import { Module } from "@prisma/client";

//  GET — Fetch all modules (for the logged-in user)
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
    const modules = await db.module.findMany({
      where: {
        course: { userId },
      },
      include: {
        course: {
          select: { id: true, courseName: true },
        },
        Lesson: true,
      },
    });

    if (modules.length === 0) {
      return NextResponse.json(
        { message: "No modules found" },
        { status: 404 }
      );
    }

    return NextResponse.json(modules, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch modules", details: (error as Error).message },
      { status: 500 }
    );
  }
}

//  POST — Create a new module
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.session.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = createModulesBulkSchema.safeParse(body);

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

    const { courseId, modules } = result.data;

    const course = await db.course.findFirst({
      where: { id: courseId, userId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found or not owned by user" },
        { status: 404 }
      );
    }

    const createdModules = await db.module.createManyAndReturn({
      data: modules.map((m) => ({
        courseId,
        moduleName: m.moduleName,
        description: m.description,
        order: m.order,
      })),
    });

    return NextResponse.json(createdModules, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create modules", details: (error as Error).message },
      { status: 500 }
    );
  }
}
