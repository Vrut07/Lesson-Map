import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  BookOpen,
  FileText,
  Layers,
  Plus,
  Sparkles,
  GraduationCap,
  ChevronRight,
  BarChart3,
  Clock,
  Edit3,
  Trash2,
  Eye,
  PenLine,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
type Lesson = {
  id: string;
  lessonName: string;
  order: number;
  moduleId: string;
  createdAt: Date;
  updatedAt: Date;
};

type Module = {
  id: string;
  description: string;
  moduleName: string;
  order: number;
  courseId: string;
  Lesson: Lesson[];
  createdAt: Date;
  updatedAt: Date;
};

type CourseWithRelations = {
  id: string;
  courseName: string;
  description: string;
  userId: string;
  Module: Module[];
  createdAt: Date;
  updatedAt: Date;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
          <Icon className="h-4 w-4 text-amber-400" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold leading-none text-white">{value}</p>
          <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            {label}
          </p>
          {sub && (
            <p className="mt-0.5 truncate text-[10px] text-zinc-600">{sub}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Course card row in accordion ─────────────────────────────────────────────
function CourseAccordionItem({
  course,
  index,
}: {
  course: CourseWithRelations;
  index: number;
}) {
  const totalLessons = course.Module.reduce((acc, m) => acc + m.Lesson.length, 0);
  const completionPct =
    course.Module.length > 0
      ? Math.round((totalLessons / Math.max(course.Module.length * 3, 1)) * 100)
      : 0;

  return (
    <AccordionItem
      value={course.id}
      className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 transition-all duration-300 data-[state=open]:border-amber-500/30"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Course header trigger */}
      <AccordionTrigger className="w-full px-6 py-5 text-left transition-colors hover:bg-white/[0.02] hover:no-underline [&>svg]:hidden [&[data-state=open]]:bg-amber-500/[0.03]">
        <div className="flex items-center gap-4 w-full">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-sm font-bold text-zinc-400">
            {course.courseName.charAt(0).toUpperCase()}
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="max-w-xs truncate text-base font-semibold leading-snug text-white">
                {course.courseName}
              </h2>
              {course.Module.length === 0 && (
                <Badge
                  variant="outline"
                  className="border-zinc-700 text-[10px] text-zinc-500"
                >
                  Draft
                </Badge>
              )}
            </div>
            <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
              {course.description || "No description"}
            </p>
          </div>

          {/* Right meta chips */}
          <div className="hidden sm:flex items-center gap-3 flex-shrink-0 mr-2">
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Layers className="w-3.5 h-3.5" />
              {course.Module.length} modules
            </span>
            <span className="text-zinc-700">·</span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <BookOpen className="w-3.5 h-3.5" />
              {totalLessons} lessons
            </span>
            <span className="text-zinc-700">·</span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(course.updatedAt)}
            </span>
          </div>

          <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 group-data-[state=open]:rotate-90" />
        </div>
      </AccordionTrigger>

      {/* Expanded body */}
      <AccordionContent className="px-6 pb-6">
        {/* Thin progress bar */}
        <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-700"
            style={{ width: `${Math.min(completionPct, 100)}%` }}
          />
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <Button
            size="sm"
            className="h-8 gap-1.5 bg-amber-500 text-xs font-semibold text-black hover:bg-amber-400"
            asChild
          >
            <Link href={`/dashboard/${course.id}/edit`}>
              <Edit3 className="w-3.5 h-3.5" /> Edit Course
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-zinc-700 bg-transparent text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
            asChild
          >
            <Link href={`/outline/${course.id}`}>
              <Eye className="w-3.5 h-3.5" /> View Outline
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300"
            asChild
          >
            <Link href={`/dashboard/${course.id}/edit`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Assist
            </Link>
          </Button>

          <div className="ml-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-zinc-500 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete "{course.courseName}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this course outline and all its modules
                    and lessons. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                    Delete Course
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Modules */}
        {course.Module.length > 0 ? (
          <Accordion type="multiple" className="space-y-2.5">
            {course.Module.sort((a, b) => a.order - b.order).map((module, idx) => (
              <AccordionItem
                key={module.id}
                value={module.id}
                className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50"
              >
                <AccordionTrigger className="px-4 py-3 transition-colors hover:bg-white/[0.02] hover:no-underline [&>svg]:hidden">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-bold text-zinc-500">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium leading-snug text-zinc-200">
                        {module.moduleName}
                      </p>
                      {module.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                          {module.description}
                        </p>
                      )}
                    </div>

                    <div className="mr-1 flex shrink-0 items-center gap-2">
                      <Badge
                        variant="outline"
                        className="h-5 border-zinc-700 text-[10px] text-zinc-500"
                      >
                        {module.Lesson.length}{" "}
                        {module.Lesson.length === 1 ? "lesson" : "lessons"}
                      </Badge>
                      <ChevronRight className="h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4">
                  <Separator className="mb-3 bg-white/[0.05]" />
                  {module.Lesson.length > 0 ? (
                    <div className="space-y-1.5">
                      {module.Lesson.sort(
                        (a, b) => (a.order || 0) - (b.order || 0)
                      ).map((lesson, lessonIdx) => (
                        <div
                          key={lesson.id}
                          className="group/lesson flex items-center gap-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40 px-3 py-2.5 transition-all hover:border-zinc-700"
                        >
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-zinc-700 text-[10px] font-semibold text-zinc-500">
                            {lessonIdx + 1}
                          </div>

                          <p className="flex-1 text-sm font-medium leading-snug text-zinc-200">
                            {lesson.lessonName || `Lesson ${lessonIdx + 1}`}
                          </p>

                          <PenLine className="h-3.5 w-3.5 text-transparent transition-colors group-hover/lesson:text-zinc-500" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-5 text-center text-zinc-500">
                      <FileText className="mx-auto mb-1.5 h-5 w-5 opacity-40" />
                      <p className="text-xs">No lessons added yet</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 gap-1 text-xs text-zinc-400 hover:text-zinc-200"
                        asChild
                      >
                        <Link href={`/dashboard/${course.id}/edit`}>
                          <Plus className="w-3 h-3" /> Add lessons
                        </Link>
                      </Button>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-800 py-10 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/60">
              <Layers className="h-5 w-5 text-zinc-500 opacity-60" />
            </div>
            <p className="text-sm font-medium text-zinc-400">No modules yet</p>
            <p className="mb-3 text-xs text-zinc-600">
              Start building your course structure
            </p>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 border-zinc-700 text-xs text-zinc-300 hover:bg-zinc-800"
              asChild
            >
              <Link href={`/dashboard/${course.id}/edit`}>
                <Plus className="w-3.5 h-3.5" /> Add First Module
              </Link>
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="relative mb-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
          <GraduationCap className="h-10 w-10 text-amber-400 opacity-80" />
        </div>
        <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        </div>
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">No courses yet</h3>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-zinc-500">
        Create your first course outline and start mapping lessons with AI-assisted structuring.
      </p>
      <Button className="gap-2 bg-amber-500 font-semibold text-black hover:bg-amber-400" asChild>
        <Link href="/dashboard/create/new">
          <Plus className="w-4 h-4" /> Create Your First Course
        </Link>
      </Button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const initialCourses: CourseWithRelations[] = await db.course.findMany({
    where: { userId: session.session.userId },
    orderBy: { createdAt: "desc" },
    include: {
      Module: {
        include: { Lesson: true },
      },
    },
  });

  const totalModules = initialCourses.reduce((a, c) => a + c.Module.length, 0);
  const totalLessons = initialCourses.reduce(
    (a, c) => a + c.Module.reduce((ma, m) => ma + m.Lesson.length, 0),
    0
  );
  const recentCourse = initialCourses[0];
  const firstName = session.user?.name?.split(" ")[0] ?? "there";
  const initials = session.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-5 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500">
              <Layers className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              LessonMap
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="hidden gap-1.5 bg-amber-500 font-semibold text-black hover:bg-amber-400 sm:flex"
              asChild
            >
              <Link href="/dashboard/create/new">
                <Plus className="w-3.5 h-3.5" /> New Course
              </Link>
            </Button>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-amber-500 text-xs font-bold text-black">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 md:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 px-6 py-8 md:px-10">
          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
                Welcome back
              </p>
              <h1 className="mb-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
                Hey, {firstName} 👋
              </h1>
              <p className="max-w-sm text-sm text-zinc-400">
                {initialCourses.length === 0
                  ? "Start mapping your first course and build structured learning journeys."
                  : `You have ${initialCourses.length} ${initialCourses.length === 1 ? "course" : "courses"} in your workspace. Keep building!`}
              </p>
              {recentCourse && (
                <div className="mt-3 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs text-zinc-500">
                    Last edited{" "}
                    <span className="font-medium text-zinc-300">
                      {recentCourse.courseName}
                    </span>{" "}
                    {timeAgo(recentCourse.updatedAt)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-zinc-700 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
                asChild
              >
                <Link href="/dashboard/create/new">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> AI Generate
                </Link>
              </Button>
              <Button
                size="sm"
                className="gap-1.5 bg-amber-500 text-xs font-semibold text-black hover:bg-amber-400"
                asChild
              >
                <Link href="/dashboard/create/new">
                  <Plus className="w-3.5 h-3.5" /> New Course
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Stat cards ────────────────────────────────────────────────── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Total Courses"
            value={initialCourses.length}
            icon={GraduationCap}
            sub="In your workspace"
          />
          <StatCard
            label="Total Modules"
            value={totalModules}
            icon={Layers}
            sub="Across all courses"
          />
          <StatCard
            label="Total Lessons"
            value={totalLessons}
            icon={BookOpen}
            sub="Mapped so far"
          />
          <StatCard
            label="Avg. Lessons/Module"
            value={totalModules > 0 ? (totalLessons / totalModules).toFixed(1) : "—"}
            icon={BarChart3}
            sub="Depth indicator"
          />
        </section>

        {/* ── Course list ───────────────────────────────────────────────── */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">Your Courses</h2>
              <Badge
                variant="outline"
                className="border-zinc-700 text-xs text-zinc-500"
              >
                {initialCourses.length}
              </Badge>
            </div>

            {initialCourses.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-zinc-700 text-xs text-zinc-300 hover:bg-zinc-800"
                asChild
              >
                <Link href="/dashboard/create/new">
                  <Plus className="w-3.5 h-3.5" /> New Course
                </Link>
              </Button>
            )}
          </div>

          {initialCourses.length === 0 ? (
            <EmptyState />
          ) : (
            <Accordion type="multiple" className="space-y-3">
              {initialCourses.map((course, index) => (
                <CourseAccordionItem
                  key={course.id}
                  course={course}
                  index={index}
                />
              ))}
            </Accordion>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;