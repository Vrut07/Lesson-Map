"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Loader2, Sparkles, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { Course } from "@prisma/client";

type LessonItem = {
  id: string;
  name: string;
  description?: string;
  duration?: string;
  order: number;
};

type Module = {
  id: string;
  moduleName: string;
};


function SortableLessonItem({
  id,
  name,
  order,
  onDelete,
}: {
  id: string;
  name: string;
  description?: string;
  duration?: string;
  order: number;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border border-border bg-card p-4 my-2 rounded-lg cursor-grab active:cursor-grabbing flex items-start justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4 w-full">
        <span className="text-muted-foreground font-medium w-6 text-center pt-1">
          {order}
        </span>
        <div className="flex flex-col items-start w-full">
          <span className="font-medium text-base">{name}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(id)}
        className="text-destructive hover:text-destructive"
      >
        <Trash className="h-4 w-4" /> Delete
      </Button>
    </div>
  );
}

export default function CreateLessonForm({ module }: { module: Module[] }) {
  const [selectedModule, setSelectedModule] = useState("");
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [newLesson, setNewLesson] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  function handleAddLesson() {
    if (!newLesson.trim()) {
      toast.error("Lesson name cannot be empty");
      return;
    }

    const nextOrder = lessons.length + 1;
    setLessons((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newLesson.trim(),
        order: nextOrder,
      },
    ]);

    setNewLesson("");
  }

  function handleDeleteLesson(id: string) {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLessons((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(items, oldIndex, newIndex).map((l, i) => ({
        ...l,
        order: i + 1,
      }));
      return reordered;
    });
  }

  async function handleSubmit() {
    if (!selectedModule) {
      toast.error("Please select a module first");
      return;
    }

    if (lessons.length === 0) {
      toast.error("Add at least one lesson before saving");
      return;
    }

    setLoading(true);

    const payload = {
      moduleId: selectedModule,
      lessons: lessons.map((l) => ({
        lessonName: l.name,
        description: l.description,
        duration: l.duration,
        order: l.order,
      })),
    };

    try {
      const res = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        console.error("Server error:", responseData);
        toast.error(responseData?.error?.message || "Failed to create lessons");
      } else {
        toast.success("Lessons created successfully!");
        setLessons([]);
        setSelectedModule("");
      }
    } catch (error) {
      console.error("Lesson creation failed:", error);
      toast.error("Error saving lessons");
    } finally {
      setLoading(false);
    }
  }

  function handleAIAssist() {
    setAiLoading(true);
    setTimeout(() => {
      setLessons([
        {
          id: "1",
          name: "What is Next.js?",
          description: "Introduction to Next.js fundamentals and project setup.",
          duration: "10 mins",
          order: 1,
        },
        {
          id: "2",
          name: "Server Components Explained",
          description: "Learn how server components simplify data fetching.",
          duration: "15 mins",
          order: 2,
        },
        {
          id: "3",
          name: "Deploying Your Next.js App",
          description: "Walkthrough of Vercel deployment and optimization.",
          duration: "8 mins",
          order: 3,
        },
      ]);
      setAiLoading(false);
      toast.success("AI generated lesson outline ✨");
    }, 1500);
  }

  return (
    <div className="w-full mx-auto mt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Lessons
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
              <Sparkles className="h-4 w-4 text-primary" /> AI Suggest
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={selectedModule} onValueChange={setSelectedModule}>
          <SelectTrigger>
            <SelectValue placeholder="Select module for lessons" />
          </SelectTrigger>
          <SelectContent>
            {module.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.moduleName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <Input
          value={newLesson}
          onChange={(e) => setNewLesson(e.target.value)}
          placeholder="Enter lesson name"
        />

        <Button
          variant="secondary"
          onClick={handleAddLesson}
          className="gap-2 w-fit"
        >
          <Plus className="h-4 w-4" /> Add Lesson
        </Button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={lessons} strategy={verticalListSortingStrategy}>
          {lessons.map((l) => (
            <SortableLessonItem
              key={l.id}
              id={l.id}
              name={l.name}
              description={l.description}
              duration={l.duration}
              order={l.order}
              onDelete={handleDeleteLesson}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
            </>
          ) : (
            "Save Lessons"
          )}
        </Button>
      </div>
    </div>
  );
}
