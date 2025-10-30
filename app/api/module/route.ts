"use server";

import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.session.userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { courseId, modules } = body;

    // Validate input
    if (!courseId || !modules || !Array.isArray(modules)) {
      return NextResponse.json(
        { error: { message: "Invalid input data" } },
        { status: 400 }
      );
    }

    // Create modules in database
    const createdModules = await db.module.createMany({
      data: modules.map((m) => ({
        moduleName: m.moduleName,
        description: m.description,
        order: m.order,
        courseId: courseId,
      })),
    });

    return NextResponse.json({ success: true, data: createdModules });
  } catch (error) {
    console.error("Error creating modules:", error);
    return NextResponse.json(
      { error: { message: "Failed to create modules" } },
      { status: 500 }
    );
  }
}
