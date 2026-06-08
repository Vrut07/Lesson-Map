import CreateCourseForm from "@/components/forms/CreateCourseForm";
import FullCourseOutline from "@/components/FullCourseOutline";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateModuleForm from "@/components/forms/CreateModuleForm";
import CreateLessonForm from "@/components/forms/CreateLessonForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  GraduationCap,
  Layers,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Info,
} from "lucide-react";

const TAB_META = [
  {
    value: "course",
    label: "Course",
    icon: GraduationCap,
    step: "01",
    desc: "Name and describe your course",
  },
  {
    value: "module",
    label: "Module",
    icon: Layers,
    step: "02",
    desc: "Add topics and chapters",
  },
  {
    value: "lesson",
    label: "Lesson",
    icon: BookOpen,
    step: "03",
    desc: "Break modules into lessons",
  },
];

const CreateNewPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  const courses = await db.course.findMany({
    where: { userId: session?.session.userId },
    include: { Module: { include: { Lesson: true } } },
  });

  const modules = courses.flatMap((c: any) => c.Module);

  const totalModules = courses.reduce((a: number, c: any) => a + c.Module.length, 0);
  const totalLessons = courses.reduce(
    (a: number, c: any) =>
      a + c.Module.reduce((ma: number, m: any) => ma + m.Lesson.length, 0),
    0
  );

  return (
    <div className="min-h-screen mt-10 bg-background text-foreground">
      <div className="max-w-[90rem] mx-auto px-5 md:px-8 py-8">
        <div className="mb-8">
          {/* <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="rounded-full text-xs px-3 gap-1.5">
              <Sparkles className="w-3 h-3 text-violet-500" /> Course Builder
            </Badge>
          </div> */}
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Build Your Course Outline</h1>
          <p className="text-muted-foreground text-sm mt-1.5 max-w-xl">
            Create a course, add modules, then fill each module with lessons. Work through the three steps in order, or jump between them at any time.
          </p>
        </div>

        {/* ── Two-col layout ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-6 items-start">
          {/* ── LEFT: Builder panel ─────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            {/* Panel header */}
            <div className="px-6 pt-6 pb-4 border-b border-border">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Step by step
              </p>
              <h2 className="text-base font-semibold">Course Structure Builder</h2>
            </div>

            {/* Step indicators */}
            <div className="px-6 py-4 flex items-center gap-0 border-b border-border">
              {TAB_META.map((t, i) => (
                <div key={t.value} className="flex items-center gap-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <t.icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="hidden sm:block min-w-0">
                      <p className="text-[10px] font-mono text-muted-foreground">{t.step}</p>
                      <p className="text-xs font-semibold leading-tight">{t.label}</p>
                    </div>
                  </div>
                  {i < TAB_META.length - 1 && (
                    <div className="w-6 h-px bg-border mx-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="px-6 py-6">
              <Tabs defaultValue="course">
                <TabsList className="w-full mb-6 h-10 bg-muted/60 rounded-xl p-1">
                  {TAB_META.map((t) => (
                    <TabsTrigger
                      key={t.value}
                      value={t.value}
                      className="flex-1 text-xs font-medium gap-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <t.icon className="w-3.5 h-3.5" />
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Context hint per tab */}
                {TAB_META.map((t) => (
                  <TabsContent key={t.value} value={t.value} className="mt-0">
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-muted/40 border border-border mb-5">
                      <Info className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                    </div>
                    {t.value === "course" && <CreateCourseForm />}
                    {t.value === "module" && <CreateModuleForm courses={courses} />}
                    {t.value === "lesson" && <CreateLessonForm modules={modules} />}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>

          {/* ── RIGHT: Live preview panel ────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm lg:sticky lg:top-[4.5rem]">
            {/* Panel header */}
            <div className="px-5 pt-5 pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Live preview
                  </p>
                  <h2 className="text-base font-semibold">Course Outline</h2>
                </div>
                {/* Mini stats */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] tabular-nums gap-1">
                    <Layers className="w-2.5 h-2.5" /> {totalModules}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] tabular-nums gap-1">
                    <BookOpen className="w-2.5 h-2.5" /> {totalLessons}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Outline scroll area */}
            <div className="max-h-[calc(100vh-14rem)] overflow-y-auto">
              <FullCourseOutline courses={courses} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPage;