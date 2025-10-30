"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCourseAction } from "@/lib/actions";
import { createCourseSchema } from "@/lib/validation";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


interface CourseFormProps {
  errors?: Record<string, string>;
}

export default function CreateCourseForm({ errors }: CourseFormProps) {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const router = useRouter();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setFormErrors({});

    const form = event.currentTarget;


    const formData = new FormData(event.currentTarget);
    const data = {
      courseName: formData.get("courseName") as string,
      description: formData.get("description") as string,
    };

    const result = createCourseSchema.safeParse(data);
    if (!result.success) {
      const zodErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        zodErrors[field] = issue.message;
      });
      setFormErrors(zodErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await createCourseAction(result.data);
      if (res.success) toast.success("Course created successfully!");
      form.reset();
      router.refresh();
    } catch (err) {
      setFormErrors({ global: (err as Error).message });
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAIAssist = async () => {
    // mock AI assist functionality
    setAiLoading(true);
    setTimeout(() => {
      const titleInput = document.getElementById("courseName") as HTMLInputElement;
      const descInput = document.getElementById("description") as HTMLTextAreaElement;
      if (titleInput && descInput) {
        titleInput.value = "Next.js 15 Masterclass: From Zero to Production";
        descInput.value =
          "A comprehensive course covering Server Actions, Server Components, and scalable full-stack development using Next.js 15.";
      }
      setAiLoading(false);
    }, 1500);
  };

  const mergedErrors = { ...errors, ...formErrors };

  return (
    <div className=" text-card-foreground  rounded-2xl shadow-lg mt-10">
      <div className="flex  gap-5 justify-end flex-col md:flex-row md:justify-between items-center mb-8">
        <h1 className="text-xl md:text-3xl font-semibold tracking-tight">
          Create Your Course
        </h1>
        <Button
          type="button"
          variant="secondary"
          onClick={handleAIAssist}
          disabled={aiLoading}
          className="gap-2"
        >
          {aiLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-primary" />
              AI Assist
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="">
        <FieldSet>
          <FieldGroup className="">
            <Field>
              <FieldLabel htmlFor="courseName" className="text-lg font-medium">
                Title
              </FieldLabel>
              <Input
                id="courseName"
                name="courseName"
                autoComplete="off"
                placeholder="e.g., Mastering TypeScript for React Developers"
              />
              {mergedErrors?.courseName && (
                <p className="text-sm text-destructive mt-1">
                  {mergedErrors.courseName}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="description" className="text-lg font-medium">
                Description
              </FieldLabel>
              <Textarea
                id="description"
                name="description"
                autoComplete="off"
                className="text-base min-h-[120px]"
                placeholder="Briefly describe what this course is about..."
              />
              {mergedErrors?.description && (
                <p className="text-sm text-destructive mt-1">
                  {mergedErrors.description}
                </p>
              )}
            </Field>

            {mergedErrors?.global && (
              <p className="text-sm text-destructive mb-2">
                {mergedErrors.global}
              </p>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
