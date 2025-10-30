import CreateModuleForm from "@/components/forms/CreateModuleForm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { Course, Module } from "@prisma/client";
import { headers } from "next/headers";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import CreateLessonForm from "@/components/forms/CreateLessonPage";

export default async function CreateLessonPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.session.userId) {
    redirect('/sign-in');
  }
  const modules = await db.module.findMany({}) as Module[];

  return (
    <section className="max-w-5xl mx-auto md:px-10 px-5 py-20">
      <CreateLessonForm modules={modules} />
    </section>
  );
}
