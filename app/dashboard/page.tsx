import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  FileText,
  Library,
  PlusIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const initialCourses = await db.course.findMany({
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
    <>
      <div className="border-b/50 bg-background w-full mx-auto pt-32 h-[calc(100vh-20rem)] text-center">
        <div className="flex flex-col items-center mb-4">
          <Library className="h-12 w-12 text-primary mb-2 border p-2.5 rounded-full" />
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
            Course Outline Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage and explore your course outlines easily with a structured,
          modern interface.
        </p>
      </div>

      <div className="min-h-screen bg-background text-foreground px-4 md:px-10 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="flex flex-col md:flex-row items-start my-3 md:my-0md:items-center justify-start gap-3">
              <h2 className="text-xl md:text-3xl font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Your All Courses Outlines
              </h2>
              <div className="flex flex-wrap md:items-center gap-2">
                <Badge variant="outline" className="text-xs md:text-sm">
                  {initialCourses.length}{" "}
                  {initialCourses.length === 1 ? "Course" : "Courses"}
                </Badge>
                <Badge variant="outline" className="text-xs md:text-sm">
                  {initialCourses.reduce(
                    (acc, c) => acc + c.Module.length,
                    0
                  )}{" "}
                  Modules
                </Badge>
                <Badge variant="outline" className="text-xs md:text-sm">
                  {initialCourses.reduce(
                    (acc, c) =>
                      acc +
                      c.Module.reduce((mAcc, m) => mAcc + m.Lesson.length, 0),
                    0
                  )}{" "}
                  Lessons
                </Badge>
              </div>
            </div>
            <Button className="gap-2" size="sm" asChild>
              <Link href="/dashboard/create/new/course">
                <PlusIcon className="mr-2 h-4 w-4" /> Create Course
              </Link>
            </Button>
          </div>

          <Accordion type="multiple" className="space-y-4">
            {initialCourses.map((course) => (
              <AccordionItem
                key={course.id}
                value={course.id}
                className="rounded-xl w-full border backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline text-left rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full gap-3">
                    <div>
                      <h2 className="text-lg font-semibold mb-1 flex items-center justify-between gap-2">
                        {course.courseName}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {course.Module.length} modules
                      </span>
                      <span>•</span>
                      <span>
                        {course.Module.reduce(
                          (acc, mod) => acc + mod.Lesson.length,
                          0
                        )}{" "}
                        lessons
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-5 pb-5">
                  <div className="flex flex-wrap items-center gap-2 py-3">
                    <Button variant="secondary" size="xs" asChild>
                      <Link href={`#`}>Edit Course</Link>
                    </Button>
                    <Button variant="destructive" size="xs">
                      Delete Course
                    </Button>
                    <Button variant="link" size="xs" asChild>
                      <Link href={`#`}>View Course</Link>
                    </Button>
                  </div>

                  {course.Module.length > 0 ? (
                    <Accordion type="multiple" className="space-y-3 mt-2">
                      {course.Module.sort((a, b) => a.order - b.order).map(
                        (module, idx) => (
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
                                  (a, b) => (a.order || 0) - (b.order || 0)
                                ).map((lesson, lessonIdx) => (
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
                        )
                      )}
                    </Accordion>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No modules created yet</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
