"use server";

import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createModulesBulkSchema, moduleSchema } from "@/lib/validation";
import { Module } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
