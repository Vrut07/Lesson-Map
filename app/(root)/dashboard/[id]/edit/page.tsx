import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateCourseForm from "@/components/forms/CreateCourseForm";
import CreateModuleForm from "@/components/forms/CreateModuleForm";
import CreateLessonForm from "@/components/forms/CreateLessonForm";
import SortableModuleList from "@/components/outline/SortableModuleList";
import EditCourseForm from "@/components/forms/EditCourseForm";

const page = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { id } = await params;
  // fetching selected course
  const selectedCourse = await db.course.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      Module: {
        include: {
          Lesson: true,
        },
      },
    },
  });

  // fetching all courses for editing
  const courses = await db.course.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      Module: {
        include: {
          Lesson: true,
        },
      },
    },
  });

  const modules = courses.flatMap((module: any) => module.Module);

  if (!selectedCourse) {
    return (
      <div className=" px-5 flex items-center justify-center text-center my-20">
        <h1 className="my-5font-medium text-sm md:text-xl max-w-xs mx-auto md:w-full">
          Course with id
          <span className="text-primary px-2">{id}</span>
          not found!
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background my-10 text-foreground px-4 md:px-10 py-20">
      <h1 className="text-2xl font-semibold mb-2">
        {selectedCourse.courseName}
      </h1>
      <div className="grid gridcols-1 gap-10 md:grid-cols-2 mt-6">
        <div>
          <div className="order-1">
            <Tabs defaultValue="course" className="">
              <TabsList className="max-w-2xl grid grid-cols-4">
                <TabsTrigger className="cursor-pointer border" value="course">
                  Course
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer border" value="module">
                  Module
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer border" value="lesson">
                  Lesson
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer border" value="reorder">
                  Reorder
                </TabsTrigger>
              </TabsList>
              <TabsContent value="course">
                <EditCourseForm courseData={selectedCourse} />
              </TabsContent>
              <TabsContent value="module">
                <CreateModuleForm courses={courses} />
              </TabsContent>
              <TabsContent value="lesson">
                <CreateLessonForm modules={modules} />
              </TabsContent>
              <TabsContent value="reorder">
                <SortableModuleList
                  courseId={selectedCourse.id}
                  initialModules={selectedCourse.Module}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Accordion type="multiple" className="space-y-4">
          <AccordionItem
            key={selectedCourse.id}
            value={selectedCourse.id}
            className="rounded-xl w-full border backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline text-left rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full gap-3">
                <div>
                  <h2 className="text-lg font-semibold mb-1 flex items-center justify-between gap-2">
                    {selectedCourse.courseName}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {selectedCourse.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    {selectedCourse.Module.length} modules
                  </span>
                  <span>•</span>
                  <span>
                    {selectedCourse.Module.reduce(
                      (acc: number, mod: any) => acc + mod.Lesson.length,
                      0,
                    )}{" "}
                    lessons
                  </span>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-5 pb-5">
              {selectedCourse.Module.length > 0 ? (
                <Accordion type="multiple" className="space-y-3 mt-2">
                  {selectedCourse.Module.sort(
                    (a: any, b: any) => a.order - b.order,
                  ).map((module: any, idx: number) => (
                    <AccordionItem
                      key={module.id}
                      value={module.id}
                      className="border rounded-lg bg-muted/30"
                    >
                      <AccordionTrigger className="px-4 py-3 text-left hover:no-underline">
                        <div className="flex items-start justify-between w-full">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-7 h-7 bg-primary/10 text-primary rounded-md flex items-center justify-center text-sm font-semibold">
                              {idx + 1}
                            </div>
                            <div>
                              <h3 className="font-medium text-base mb-1">
                                {module.moduleName}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {module.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {module.Lesson.length}{" "}
                                {module.Lesson.length === 1
                                  ? "lesson"
                                  : "lessons"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-4 pb-3 space-y-2">
                        {module.Lesson.length > 0 ? (
                          module.Lesson.sort(
                            (a: any, b: any) => (a.order || 0) - (b.order || 0),
                          ).map((lesson: any, lessonIdx: number) => (
                            <div
                              key={lesson.id}
                              className="flex items-start gap-3 p-3 rounded-md bg-card shadow-sm border transition-colors"
                            >
                              <div className="flex-shrink-0 w-6 h-6 border rounded flex items-center justify-center text-xs font-medium">
                                {lessonIdx + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm leading-tight">
                                  {lesson.lessonName ||
                                    `Lesson ${lessonIdx + 1}`}
                                </h4>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            <FileText className="h-6 w-6 mx-auto mb-2 opacity-60" />
                            <p className="text-xs">No lessons added yet</p>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No modules created yet</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default page;
