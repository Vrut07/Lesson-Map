import CreateCourseForm from "@/components/forms/CreateCourseForm";
import FullCourseOutline from "@/components/FullCourseOutline";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateModuleForm from "@/components/forms/CreateModuleForm";
import CreateLessonForm from "@/components/forms/CreateLessonForm";

const CreateNewPage = async () => {
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
  const modules = courses.flatMap((module) => module.Module);
  return (
    <section className="max-w-[90rem] mx-auto my-32 w-full grid md:grid-cols-2 items-start gap-10">
      <div className="order-2 px-4">
        <FullCourseOutline courses={courses} />
      </div>

      <div className="order-1">
        <Tabs defaultValue="course" className=" px-5">
          <TabsList className="max-w-2xl">
            <TabsTrigger className="cursor-pointer border" value="course">Course</TabsTrigger>
            <TabsTrigger className="cursor-pointer border" value="module">Module</TabsTrigger>
            <TabsTrigger className="cursor-pointer border" value="lesson">Lesson</TabsTrigger>
          </TabsList>
          <TabsContent value="course">
            <CreateCourseForm />
          </TabsContent>
          <TabsContent value="module">
            <CreateModuleForm courses={courses} />
          </TabsContent>
          <TabsContent value="lesson">
            <CreateLessonForm modules={modules} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default CreateNewPage;