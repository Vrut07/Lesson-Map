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

  type ModuleItem = {
    id: string;
    name: string;
    description?: string;
    order: number;
  };

  type Course = {
    id: string;
    courseName: string;
  };

  function SortableItem({
    id,
    name,
    order,
    description,
    onDelete,
  }: {
    id: string;
    name: string;
    description?: string;
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
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  export default function CreateModuleForm({
    courses,
  }: {
    courses: Course[];
  }) {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [modules, setModules] = useState<ModuleItem[]>([]);
    const [newModule, setNewModule] = useState("");
    const [newModuleDescription, setNewModuleDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    function handleAddModule() {
      if (!newModule.trim()) {
        toast.error("Module name cannot be empty");
        return;
      }

      const nextOrder = modules.length + 1;
      setModules((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: newModule.trim(),
          description: newModuleDescription.trim(),
          order: nextOrder,
        },
      ]);

      setNewModule("");
      setNewModuleDescription("");
    }

    function handleDeleteModule(id: string) {
      setModules((prev) => prev.filter((m) => m.id !== id));
    }

    function handleDragEnd(event: any) {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setModules((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex).map((m, i) => ({
          ...m,
          order: i + 1,
        }));
        return reordered;
      });
    }

    async function handleSubmit() {
      if (!selectedCourse) {
        toast.error("Please select a course first");
        return;
      }

      if (modules.length === 0) {
        toast.error("Add at least one module before saving");
        return;
      }

      setLoading(true);

      const payload = {
        courseId: selectedCourse,
        modules: modules.map((m) => ({
          moduleName: m.name,
          description: m.description,
          order: m.order,
        })),
      };

      try {
        const res = await fetch("/api/module", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const responseData = await res.json();

        if (!res.ok) {
          console.error("Server error:", responseData);
          toast.error(responseData?.error?.message || "Failed to create modules");
        } else {
          toast.success("Modules created successfully!");
          setModules([]);
          setSelectedCourse("");
        }
      } catch (error) {
        console.error("Module creation failed:", error);
        toast.error("Error saving modules");
      } finally {
        setLoading(false);
      }
    }

    function handleAIAssist() {
      setAiLoading(true);
      setTimeout(() => {
        setModules([
          {
            id: "1",
            name: "Introduction to Next.js 15",
            description: "Overview of new features, server actions, and routing.",
            order: 1,
          },
          {
            id: "2",
            name: "Server Components Deep Dive",
            description: "Understanding how server and client components work together.",
            order: 2,
          },
          {
            id: "3",
            name: "Building a Fullstack App with Prisma",
            description: "Integrating Prisma with Next.js for robust backend handling.",
            order: 3,
          },
        ]);
        setAiLoading(false);
        toast.success("AI generated module outline ✨");
      }, 1500);
    }

    return (
      <div className="w-full mx-auto mt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Modules
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

        {/* Select course */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Select course for modules" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add new module */}
        <div className="flex flex-col gap-3 mb-6">
          <Input
            value={newModule}
            onChange={(e) => setNewModule(e.target.value)}
            placeholder="Enter module name"
          />
          <Textarea
            value={newModuleDescription}
            onChange={(e) => setNewModuleDescription(e.target.value)}
            placeholder="Enter module description"
          />
          <Button
            variant="secondary"
            onClick={handleAddModule}
            className="gap-2 w-fit"
          >
            <Plus className="h-4 w-4" /> Add Module
          </Button>
        </div>

        {/* Draggable list */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={modules} strategy={verticalListSortingStrategy}>
            {modules.map((m) => (
              <SortableItem
                key={m.id}
                id={m.id}
                name={m.name}
                description={m.description}
                order={m.order}
                onDelete={handleDeleteModule}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Submit */}
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
              "Save Modules"
            )}
          </Button>
        </div>
      </div>
    );
  }