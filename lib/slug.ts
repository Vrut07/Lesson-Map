import { db } from "./prisma";
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export async function generateUniqueShareSlug(
  title: string,
  courseId: string,
): Promise<string> {
  const base = slugifyTitle(title) || "course";
  let slug = base;
  let suffix = 0;

  while (true) {
    const existing = await db.course.findFirst({
      where: { shareSlug: slug, NOT: { id: courseId } },
      select: { id: true },
    });
    if (!existing) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}
