"use server";

import {
  createCourseSchema,
  createLessonsBulkSchema,
  createModulesBulkSchema,
} from "@/lib/validation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import z from "zod";

async function createCourseAction(data: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session?.userId) {
    throw new Error("Unauthorized");
  }

  const result = createCourseSchema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path.join(".");
      errors[field] = issue.message;
    });
    return { success: false, errors };
  }

  const course = await db.course.create({
    data: {
      courseName: result.data.courseName,
      description: result.data.description,
      userId: session.session.userId,
    },
  });

  revalidatePath("/dashboard/create/new");

  return { success: true, data: course };
}

// createModulesAction
async function createModulesAction(data: unknown) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.session.userId;

    if (!userId) {
      throw new Error("Unauthorized: Please log in to continue.");
    }
    const result = createModulesBulkSchema.safeParse(data);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        errors[field] = issue.message;
      });
      return { success: false, errors };
    }

    const { courseId, modules } = result.data;
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      throw new Error("Invalid course. You do not own this course.");
    }

    const created = await db.module.createMany({
      data: modules.map((m) => ({
        moduleName: m.moduleName,
        description: m.description,
        order: m.order,
        courseId: courseId,
      })),
    });

    revalidatePath("/dashboard/create/new");
    revalidatePath("/");

    return {
      success: true,
      message: "Modules created successfully!",
      count: created.count,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        errors[field] = issue.message;
      });
      return { success: false, errors };
    }
    return {
      success: false,
      error:
        (error as Error).message ||
        "Something went wrong while creating modules.",
    };
  }
}

// ccreateLessonsAction
async function createLessonsAction(data: unknown) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.session.userId;

    if (!userId) {
      throw new Error("Unauthorized: Please log in to continue.");
    }

    const result = createLessonsBulkSchema.safeParse(data);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        errors[field] = issue.message;
      });
      return { success: false, errors };
    }

    const { moduleId, lessons } = result.data;

    const module = await db.module.findFirst({
      where: {
        id: moduleId,
        course: { userId },
      },
    });

    if (!module) {
      throw new Error("Module not found or not owned by user.");
    }

    const createdLessons = await db.lesson.createMany({
      data: lessons.map((l) => ({
        moduleId,
        lessonName: l.lessonName,
        order: l.order,
      })),
    });

    revalidatePath("/dashboard/create/new");
    revalidatePath("/");
    return {
      success: true,
      message: "Lessons created successfully!",
      count: createdLessons.count,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        errors[field] = issue.message;
      });
      return { success: false, errors };
    }
    return {
      success: false,
      error:
        (error as Error).message ||
        "Something went wrong while creating lessons.",
    };
  }
}
export { createCourseAction, createModulesAction, createLessonsAction };
