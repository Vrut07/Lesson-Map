"use server";

import { createCourseSchema } from "@/lib/validation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Create Course Action
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

  revalidatePath("/dashboard/create/new/course");

  return { success: true, data: course };
}

export { createCourseAction };
