import * as z from "zod";

// Schema for creating a course
export const createCourseSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  description: z.string().min(1, "Description is required"),
});

// Schema for updating a course (includes optional id)
export const updateCourseSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  description: z.string().min(1, "Description is required"),
});

export const moduleSchema = z.object({
  moduleName: z.string().min(1, "Module name is required"),
  description: z.string().min(1, "Description is required"),
  order: z.number().int().min(1, "Order is required"),
  courseId: z.string().uuid("Valid course ID is required"),
});

export const lessonSchema = z.object({
  lessonName: z.string().min(1, "Lesson name is required"),
  order: z.number().int().min(1, "Order is required"),
  moduleId: z.string().uuid("Valid module ID is required"),
});

// Bulk create modules schema (for creating multiple modules at once)
export const createModulesBulkSchema = z.object({
  courseId: z.string("Valid course ID is required"),
  modules: z
    .array(
      z.object({
        moduleName: z.string().min(1, "Module name is required"),
        description: z.string().min(1, "Description is required"),
        order: z.number().int().min(1, "Order must be at least 1"),
      })
    )
    .min(1, "At least one module is required"),
});

// Bulk create lessons schema (for creating multiple lessons at once)
export const createLessonsBulkSchema = z.object({
  moduleId: z.string("Valid Module ID is required"),
  lessons: z
    .array(
      z.object({
        lessonName: z.string().min(1, "Lesson name is required"),
        order: z.number().int().min(1, "Order must be at least 1"),
      })
    )
    .min(1, "At least one lesson is required"),
});

// Module update schema (for updating a single module)
export const updateModuleSchema = z.object({
  moduleName: z.string().min(1, "Module name is required"),
  description: z.string().min(1, "Description is required"),
  order: z.number().int().min(1, "Order must be at least 1"),
});
