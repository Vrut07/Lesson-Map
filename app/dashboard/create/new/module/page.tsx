import CreateModuleForm from '@/components/forms/CreateModuleForm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import FullCourseOutline from "@/components/FullCourseOutline";

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

  return (
    <section className="container px-5 py-20 grid md:grid-cols-2 grid-cols-1 gap-10 mx-auto">
      <div>
        <CreateModuleForm courses={courses} />
      </div>
      <div className="">
        <FullCourseOutline initialCourses={courses} />
      </div>
    </section>
  );
}
