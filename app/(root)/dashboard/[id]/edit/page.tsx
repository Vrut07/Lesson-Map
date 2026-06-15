import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CourseBuilder } from "@/components/CourseBuilder";
import type { CourseInitialData } from "@/components/CourseBuilder";

const EditCoursePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const selectedCourse = await db.course.findUnique({
    where: { id, userId: session.session.userId },
    include: {
      Module: {
        include: { Lesson: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!selectedCourse) {
    return (
      <div className="px-5 flex items-center justify-center text-center my-20">
        <h1 className="font-medium text-sm md:text-xl max-w-xs mx-auto md:w-full">
          Course with id <span className="text-primary px-2">{id}</span> not
          found!
        </h1>
      </div>
    );
  }

  const initialData: CourseInitialData = {
    courseId: selectedCourse.id,
    title: selectedCourse.courseName,
    description: selectedCourse.description,
    modules: selectedCourse.Module.map((mod) => ({
      id: mod.id,
      name: mod.moduleName,
      lessons: mod.Lesson.sort((a, b) => (a.order || 0) - (b.order || 0)).map(
        (lesson) => ({
          id: lesson.id,
          name: lesson.lessonName,
          description: "",
        }),
      ),
    })),
  };

  return <CourseBuilder initialData={initialData} />;
};

export default EditCoursePage;
