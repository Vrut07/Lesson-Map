import CreateCourseForm from "@/components/forms/CreateCourseForm";
import FullCourseOutline from "@/components/FullCourseOutline";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const CoursePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const courses = await db.course.findMany({
    where: { userId: session?.session.userId },
    include: {
      Module: {
        include: {
          Lesson: true,
        },
      },
    },
  });
  return (
    <section className="container px-5 py-20 grid md:grid-cols-3 grid-cols-1 gap-10 mx-auto">
      <div className="c">
        <CreateCourseForm />
      </div>
      <div className="col-span-2">
        <FullCourseOutline initialCourses={courses} />
      </div>
    </section>
  );
};

export default CoursePage;
