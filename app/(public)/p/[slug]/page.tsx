import { db } from "@/lib/prisma";
import LessonMapPublicPage from "@/components/CoursePreview";
import type { Course } from "@/components/CoursePreview";
import { notFound } from "next/navigation";

export default async function CoursePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await db.course.findFirst({
    where: {
      shareSlug: slug,
      isPublic: true,
    },
    include: {
      user: {
        select: { name: true, image: true },
      },
      Module: {
        orderBy: { order: "asc" },
        include: {
          Lesson: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!course) notFound();

  const totalLessons = course.Module.reduce(
    (acc, m) => acc + m.Lesson.length,
    0,
  );

  const previewCourse: Course = {
    id: course.shareSlug ?? course.id,
    title: course.courseName,
    description: course.description,
    creator: {
      name: course.user.name,
      avatar: course.user.image,
      role: "Course Creator",
      bio: "Shared on Lesson Map",
    },
    stats: {
      modules: course.Module.length,
      lessons: totalLessons,
      hours: String(Math.max(1, Math.round(totalLessons * 0.5))),
      students: "—",
    },
    modules: course.Module.map((mod, idx) => ({
      id: mod.id,
      label: `Module ${idx + 1}`,
      title: mod.moduleName,
      description: mod.description,
      lessons: mod.Lesson.map((lesson) => ({
        id: lesson.id,
        title: lesson.lessonName,
        done: false,
      })),
    })),
  };

  return (
    <LessonMapPublicPage course={previewCourse} slug={slug} />
  );
}
