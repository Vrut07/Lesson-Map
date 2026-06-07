import LessonMapPublicPage from "@/components/CoursePreview";

const course = {
  id: "nextjs-15-masterclass",
  title: "Next.js 15 Masterclass: From Zero to Production",
  description:
    "A complete course covering Server Actions, Server Components, and scalable full-stack development using Next.js 15.",
  creator: {
    name: "Alex Rivera",
    avatar: null,
    role: "Senior Full-Stack Engineer",
    bio: "10+ years building scalable web apps. I teach what I ship.",
  },
  stats: {
    modules: 8,
    lessons: 42,
    hours: "12.5",
    students: "3.2k",
  },
  modules: [
    {
      id: "m1",
      label: "Module 1",
      title: "Intro to Next.js 15",
      description: "Overview of new features and the App Router paradigm.",
      lessons: [
        { id: "l1", title: "What is Next.js?", done: true },
        { id: "l2", title: "App Router vs Pages Router", done: true },
        { id: "l3", title: "Server Components Explained", done: true },
        { id: "l4", title: "Client Components Explained", done: true },
        { id: "l5", title: "Deploying Your Next.js App", done: true },
        { id: "l6", title: "Next.js 15 New APIs", done: true },
      ],
    },
    {
      id: "m2",
      label: "Module 2",
      title: "Routing & Layouts",
      description:
        "Deep dive into nested layouts, route groups, and parallel routes.",
      lessons: [
        { id: "l7", title: "File-Based Routing", done: true },
        { id: "l8", title: "Nested Layouts", done: true },
        { id: "l9", title: "Route Groups", done: true },
        { id: "l10", title: "Parallel & Intercepting Routes", done: false },
        { id: "l11", title: "Loading & Error States", done: false },
      ],
    },
    {
      id: "m3",
      label: "Module 3",
      title: "Server Components",
      description: "Understanding SSR, hydration, and data fetching patterns.",
      lessons: [
        { id: "l12", title: "RSC Architecture", done: false },
        { id: "l13", title: "fetch() with caching", done: false },
        { id: "l14", title: "Streaming with Suspense", done: false },
        { id: "l15", title: "Server-Only Code", done: false },
        { id: "l16", title: "Third-party Libraries", done: false },
        { id: "l17", title: "Patterns & Best Practices", done: false },
      ],
    },
    {
      id: "m4",
      label: "Module 4",
      title: "Server Actions",
      description: "Mutations, forms, and the new action paradigm.",
      lessons: [
        { id: "l18", title: "Defining Server Actions", done: false },
        { id: "l19", title: "Forms & useFormState", done: false },
        { id: "l20", title: "Optimistic Updates", done: false },
        { id: "l21", title: "Revalidation Strategies", done: false },
        { id: "l22", title: "Error Handling", done: false },
      ],
    },
    {
      id: "m5",
      label: "Module 5",
      title: "Database Integration",
      description: "Prisma, Drizzle ORM, and edge-compatible databases.",
      lessons: [
        { id: "l23", title: "Setting up Prisma", done: false },
        { id: "l24", title: "Schema Design", done: false },
        { id: "l25", title: "Edge Databases (Turso)", done: false },
        { id: "l26", title: "Migrations & Seeding", done: false },
        { id: "l27", title: "Query Optimization", done: false },
      ],
    },
    {
      id: "m6",
      label: "Module 6",
      title: "Authentication",
      description: "NextAuth v5, middleware, and protected routes.",
      lessons: [
        { id: "l28", title: "NextAuth v5 Setup", done: false },
        { id: "l29", title: "OAuth Providers", done: false },
        { id: "l30", title: "Middleware Guards", done: false },
        { id: "l31", title: "Session Management", done: false },
      ],
    },
    {
      id: "m7",
      label: "Module 7",
      title: "Performance & Optimization",
      description: "Core Web Vitals, Image optimization, and bundle analysis.",
      lessons: [
        { id: "l32", title: "Image & Font Optimization", done: false },
        { id: "l33", title: "Bundle Analysis", done: false },
        { id: "l34", title: "Core Web Vitals", done: false },
        { id: "l35", title: "Edge & Middleware Perf", done: false },
        { id: "l36", title: "Caching Deep Dive", done: false },
      ],
    },
    {
      id: "m8",
      label: "Module 8",
      title: "Production Deployment",
      description: "Vercel, self-hosting, CI/CD, and monitoring.",
      lessons: [
        { id: "l37", title: "Vercel Deployment", done: false },
        { id: "l38", title: "Self-Hosting with Docker", done: false },
        { id: "l39", title: "Environment Variables", done: false },
        { id: "l40", title: "CI/CD with GitHub Actions", done: false },
        { id: "l41", title: "Monitoring & Logging", done: false },
        { id: "l42", title: "Scaling Strategies", done: false },
      ],
    },
  ],
};

export default async function CoursePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <LessonMapPublicPage course={{ ...course, id: slug }} slug={slug} />
  );
}
