import { auth } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import FullCourseOutline from "@/components/FullCourseOutline";
import CreateLessonForm from '@/components/forms/CreateLessonForm';

export default async function CreateModulePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.session?.userId) {
    redirect('/sign-in');
  }

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

  const module = courses.flatMap((course) => course.Module);

  return (
    <section className="container px-5 py-20 grid md:grid-cols-2 grid-cols-1 gap-10 mx-auto">
      <div>
        <CreateLessonForm module={module} />
      </div>
      <div className="">
        <FullCourseOutline initialCourses={courses} />
      </div>
    </section>
  );
}
