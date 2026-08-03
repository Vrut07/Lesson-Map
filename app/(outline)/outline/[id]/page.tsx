import SingleOutline from "@/components/outline/SingleOutline";
import { db } from "@/lib/prisma";

export default async function Page({ params }: { params: { id: string } }) {
  const course = await db.course.findUnique({
    where: { id: params.id },
    include: {
      Module: {
        orderBy: { order: "asc" },
        include: {
          Lesson: {
            orderBy: { order: "asc" },
            include: {
              resources: true,
            },
          },
        },
      },
    },
  });

  if (!course) return <div>Course not found</div>;

  return <SingleOutline course={course} />;
}
