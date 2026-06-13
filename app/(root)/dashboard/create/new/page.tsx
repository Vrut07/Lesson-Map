"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Eye,
  Save,
  GripVertical,
  ChevronDown,
  Plus,
  Paperclip,
  Code2,
  FileText,
  Link2,
  Video,
  StickyNote,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  SlidersHorizontal,
  LayoutList,
  Workflow,
  Globe,
  Copy,
  Check,
  AlertTriangle,
  Crown,
  Sparkles,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────
type ResourceType = "Code" | "PDF" | "Link" | "Video" | "Note" | "Image";

interface Resource {
  id: string;
  name: string;
  meta: string;
  type: ResourceType;
  lessonId: string;
}

interface Lesson {
  id: string;
  name: string;
  description: string;
}

interface Module {
  id: string;
  name: string;
  lessons: Lesson[];
}

// ─────────────────────────────────────────────────────────────────────────
// Resource type config (single source of truth)
// ─────────────────────────────────────────────────────────────────────────
const RESOURCE_TYPES: { value: ResourceType; icon: React.ElementType; badgeClass: string }[] = [
  { value: "Code", icon: Code2, badgeClass: "bg-chart-1/15 text-chart-1 border-chart-1/25" },
  { value: "PDF", icon: FileText, badgeClass: "bg-chart-2/15 text-chart-2 border-chart-2/25" },
  { value: "Link", icon: Link2, badgeClass: "bg-chart-3/15 text-chart-3 border-chart-3/25" },
  { value: "Video", icon: Video, badgeClass: "bg-destructive/15 text-destructive border-destructive/25" },
  { value: "Note", icon: StickyNote, badgeClass: "bg-chart-4/15 text-chart-4 border-chart-4/25" },
  { value: "Image", icon: ImageIcon, badgeClass: "bg-chart-5/15 text-chart-5 border-chart-5/25" },
];

function getTypeConfig(type: ResourceType) {
  return RESOURCE_TYPES.find((t) => t.value === type)!;
}

// ─────────────────────────────────────────────────────────────────────────
// Seed data
// ─────────────────────────────────────────────────────────────────────────
const initialModules: Module[] = [
  {
    id: "mod-1",
    name: "Module 1 — Foundations",
    lessons: [
      {
        id: "les-1",
        name: "How the Web Works",
        description: "HTTP, browsers, rendering pipelines.",
      },
      {
        id: "les-2",
        name: "HTML & Semantic Markup",
        description: "Document structure, accessibility primitives.",
      },
    ],
  },
  {
    id: "mod-2",
    name: "Module 2 — Interactivity with JavaScript",
    lessons: [
      {
        id: "les-3",
        name: "DOM Manipulation & Events",
        description: "Selecting elements, event listeners, delegation.",
      },
    ],
  },
  {
    id: "mod-3",
    name: "Module 3 — Building with React",
    lessons: [
      {
        id: "les-4",
        name: "Components & Props",
        description: "Composition, reusability, prop drilling.",
      },
      {
        id: "les-5",
        name: "State & Hooks",
        description: "useState, useEffect, custom hooks.",
      },
    ],
  },
];

const initialResources: Resource[] = [
  { id: "res-1", name: "fetch.js", meta: "2 KB · snippet", type: "Code", lessonId: "les-1" },
  { id: "res-2", name: "MDN: HTTP Overview", meta: "developer.mozilla.org", type: "Link", lessonId: "les-1" },
  { id: "res-3", name: "Intro to the Web", meta: "04:21 · mp4", type: "Video", lessonId: "les-1" },
  { id: "res-4", name: "html-cheatsheet.pdf", meta: "1.2 MB · 8 pages", type: "PDF", lessonId: "les-2" },
  { id: "res-5", name: "Teaching notes", meta: "Personal notes", type: "Note", lessonId: "les-2" },
  { id: "res-6", name: "dom-tree.png", meta: "320 KB · diagram", type: "Image", lessonId: "les-2" },
  { id: "res-7", name: "dom-events.js", meta: "3 KB · snippet", type: "Code", lessonId: "les-3" },
  { id: "res-8", name: "Event Delegation Guide", meta: "javascript.info", type: "Link", lessonId: "les-3" },
  { id: "res-9", name: "props-example.tsx", meta: "1 KB · snippet", type: "Code", lessonId: "les-4" },
  { id: "res-10", name: "Component Diagram", meta: "180 KB · diagram", type: "Image", lessonId: "les-4" },
  { id: "res-11", name: "hooks-cheatsheet.pdf", meta: "900 KB · 4 pages", type: "PDF", lessonId: "les-5" },
  { id: "res-12", name: "useEffect Deep Dive", meta: "12:08 · mp4", type: "Video", lessonId: "les-5" },
];

const TABS = [
  { value: "outline", label: "Outline", icon: LayoutList },
  { value: "resources", label: "Resources", icon: Paperclip },
  { value: "settings", label: "Settings", icon: SlidersHorizontal },
  { value: "share", label: "Share", icon: Globe },
] as const;

type TabValue = (typeof TABS)[number]["value"];

// ─────────────────────────────────────────────────────────────────────────
// Add Lesson dialog (used inside Outline)
// ─────────────────────────────────────────────────────────────────────────
function AddLessonDialog({ onAdd }: { onAdd: (name: string, description: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), description.trim());
    setName("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-muted/40 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Lesson
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add lesson</DialogTitle>
          <DialogDescription>Give your lesson a name and a short description.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="lesson-name">Lesson name</Label>
            <Input
              id="lesson-name"
              placeholder="e.g. Async/Await Patterns"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lesson-desc">Description</Label>
            <Textarea
              id="lesson-desc"
              placeholder="What will learners take away from this lesson?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-20"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Add lesson
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Add Module dialog
// ─────────────────────────────────────────────────────────────────────────
function AddModuleDialog({ onAdd }: { onAdd: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim());
    setName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-muted/40 transition-colors">
          <Plus className="w-4 h-4" />
          Add Module
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add module</DialogTitle>
          <DialogDescription>Modules group related lessons together.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="module-name">Module name</Label>
            <Input
              id="module-name"
              placeholder="e.g. Module 4 — Working with APIs"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Add module
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Resource row (shared between Outline lesson resources & Resources tab)
// ─────────────────────────────────────────────────────────────────────────
function ResourceRow({
  resource,
  onTypeChange,
  onDelete,
  linkedToLabel,
}: {
  resource: Resource;
  onTypeChange: (id: string, type: ResourceType) => void;
  onDelete: (id: string) => void;
  linkedToLabel?: string;
}) {
  const config = getTypeConfig(resource.type);
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-background border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
      <div className="flex-shrink-0 w-9 h-9 rounded-md bg-muted flex items-center justify-center">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug truncate">{resource.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {resource.meta}
          {linkedToLabel && (
            <>
              {" "}
              <span className="text-muted-foreground/50">·</span>{" "}
              <Paperclip className="w-2.5 h-2.5 inline-block mb-0.5 mr-0.5 opacity-60" />
              Linked to <span className="font-semibold text-foreground">{linkedToLabel}</span>
            </>
          )}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex-shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs font-semibold transition-colors ${config.badgeClass}`}
          >
            <Icon className="w-3 h-3" />
            {resource.type}
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {RESOURCE_TYPES.map((t) => {
            const TIcon = t.icon;
            return (
              <DropdownMenuItem
                key={t.value}
                onClick={() => onTypeChange(resource.id, t.value)}
                className="gap-2"
              >
                <TIcon className="w-3.5 h-3.5" />
                {t.value}
                {resource.type === t.value && <Check className="w-3.5 h-3.5 ml-auto" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Settings"
        onClick={() => alert(`Editing "${resource.name}" (settings not wired up)`)}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
      </button>
      <button
        className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Open"
        onClick={() => alert(`Opening "${resource.name}" (preview not wired up)`)}
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </button>
      <button
        className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        title="Delete"
        onClick={() => onDelete(resource.id)}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Add Resource dialog
// ─────────────────────────────────────────────────────────────────────────
function AddResourceDialog({
  lessonName,
  onAdd,
}: {
  lessonName: string;
  onAdd: (name: string, meta: string, type: ResourceType) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [meta, setMeta] = useState("");
  const [type, setType] = useState<ResourceType>("Link");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), meta.trim() || "Untitled resource", type);
    setName("");
    setMeta("");
    setType("Link");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex-shrink-0 inline-flex items-center gap-1 h-6 px-2 rounded-md border border-border text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Plus className="w-3 h-3" />
          Add Resource
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add resource</DialogTitle>
          <DialogDescription>
            Attach a resource to <span className="font-medium text-foreground">{lessonName}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="res-name">Name</Label>
            <Input
              id="res-name"
              placeholder="e.g. async-await.js"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="res-meta">Details</Label>
            <Input
              id="res-meta"
              placeholder="e.g. 3 KB · snippet"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <div className="flex flex-wrap gap-2">
              {RESOURCE_TYPES.map((t) => {
                const TIcon = t.icon;
                const active = type === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border text-[11px] font-medium transition-colors ${
                      active ? t.badgeClass : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <TIcon className="w-3 h-3" />
                    {t.value}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Add resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Outline Tab
// ─────────────────────────────────────────────────────────────────────────
function OutlineTab({
  modules,
  resources,
  setModules,
  setResources,
}: {
  modules: Module[];
  resources: Resource[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
}) {
  const resourcesForLesson = (lessonId: string) =>
    resources.filter((r) => r.lessonId === lessonId);

  const handleAddLesson = (moduleId: string, name: string, description: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                { id: `les-${Date.now()}`, name, description },
              ],
            }
          : m
      )
    );
  };

  const handleAddModule = (name: string) => {
    setModules((prev) => [...prev, { id: `mod-${Date.now()}`, name, lessons: [] }]);
  };

  const handleAddResource = (lessonId: string, name: string, meta: string, type: ResourceType) => {
    setResources((prev) => [
      ...prev,
      { id: `res-${Date.now()}`, name, meta, type, lessonId },
    ]);
  };

  const handleTypeChange = (id: string, type: ResourceType) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, type } : r)));
  };

  const handleDeleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-3">
      {modules.map((module) => {
        const moduleResourceCount = module.lessons.reduce(
          (acc, l) => acc + resourcesForLesson(l.id).length,
          0
        );

        return (
          <Accordion key={module.id} type="single" collapsible defaultValue={module.id}>
            <AccordionItem
              value={module.id}
              className="border border-border rounded-2xl bg-background overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/30 transition-colors [&>svg]:hidden group">
                <div className="flex items-center gap-3 w-full">
                  <GripVertical className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                  <p className="text-sm font-semibold flex-1 text-left truncate">{module.name}</p>
                  <Badge variant="secondary" className="text-[10px] font-medium flex-shrink-0">
                    {module.lessons.length} {module.lessons.length === 1 ? "lesson" : "lessons"}
                  </Badge>
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2.5 mt-1">
                  {module.lessons.map((lesson) => {
                    const lessonResources = resourcesForLesson(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        className="rounded-xl border border-border bg-background overflow-hidden"
                      >
                        <div className="flex items-start gap-3 px-3.5 py-3">
                          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold leading-snug">{lesson.name}</p>
                            {lesson.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                          <AddResourceDialog
                            lessonName={lesson.name}
                            onAdd={(name, meta, type) =>
                              handleAddResource(lesson.id, name, meta, type)
                            }
                          />
                        </div>

                        {lessonResources.length > 0 && (
                          <Accordion type="single" collapsible className="border-t border-border">
                            <AccordionItem value={`res-${lesson.id}`} className="border-none">
                              <AccordionTrigger className="px-3.5 py-2 hover:no-underline [&>svg]:hidden group">
                                <div className="flex items-center gap-2 w-full">
                                  <Paperclip className="w-3 h-3 text-primary" />
                                  <span className="text-[11px] font-semibold text-primary tracking-wide uppercase">
                                    Lesson Resources ({lessonResources.length})
                                  </span>
                                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-3.5 pb-3">
                                <div className="rounded-lg border border-border overflow-hidden bg-background">
                                  {lessonResources.map((res) => (
                                    <ResourceRow
                                      key={res.id}
                                      resource={res}
                                      onTypeChange={handleTypeChange}
                                      onDelete={handleDeleteResource}
                                    />
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </div>
                    );
                  })}

                  <AddLessonDialog
                    onAdd={(name, description) => handleAddLesson(module.id, name, description)}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}

      <AddModuleDialog onAdd={handleAddModule} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Resources Tab
// ─────────────────────────────────────────────────────────────────────────
function ResourcesTab({
  modules,
  resources,
  setResources,
}: {
  modules: Module[];
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
}) {
  const [filter, setFilter] = useState<ResourceType | "All">("All");

  const handleTypeChange = (id: string, type: ResourceType) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, type } : r)));
  };

  const handleDeleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const lessonNameById = (lessonId: string) => {
    for (const m of modules) {
      const l = m.lessons.find((l) => l.id === lessonId);
      if (l) return l.name;
    }
    return "Unknown lesson";
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Resource Library</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {resources.length} resources across {modules.reduce((a, m) => a + m.lessons.length, 0)} lessons. Grouped by module — click any to edit.
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["All", ...RESOURCE_TYPES.map((t) => t.value)] as const).map((t) => {
            const isAll = t === "All";
            const config = !isAll ? getTypeConfig(t as ResourceType) : null;
            const active = filter === t;
            return (
              <button
                key={t}
                onClick={() => setFilter(t as ResourceType | "All")}
                className={`inline-flex items-center gap-1 h-6 px-2.5 rounded-full border text-[10px] font-semibold transition-colors ${
                  active
                    ? config
                      ? config.badgeClass
                      : "bg-primary/10 text-primary border-primary/20"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped by module */}
      <div className="space-y-3">
        {modules.map((module) => {
          const moduleLessonIds = new Set(module.lessons.map((l) => l.id));
          const moduleResources = resources.filter(
            (r) => moduleLessonIds.has(r.lessonId) && (filter === "All" || r.type === filter)
          );

          return (
            <Accordion key={module.id} type="single" collapsible defaultValue={module.id}>
              <AccordionItem value={module.id} className="border border-border rounded-2xl bg-background overflow-hidden">
                <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/30 transition-colors [&>svg]:hidden group">
                  <div className="flex items-center gap-2.5 w-full">
                    <Layers3 />
                    <p className="text-sm font-semibold flex-1 text-left truncate">{module.name}</p>
                    <Badge variant="secondary" className="text-[10px] font-medium flex-shrink-0">
                      {moduleResources.length} resources
                    </Badge>
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  {moduleResources.length > 0 ? (
                    <div className="border-t border-border">
                      {moduleResources.map((res) => (
                        <ResourceRow
                          key={res.id}
                          resource={res}
                          onTypeChange={handleTypeChange}
                          onDelete={handleDeleteResource}
                          linkedToLabel={lessonNameById(res.lessonId)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border-t border-border">
                      <p className="text-xs text-muted-foreground">No resources match this filter.</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}

// Small inline icon helper to avoid importing Layers separately twice
function Layers3() {
  return (
    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
      <Paperclip className="w-3.5 h-3.5 text-primary" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Settings Tab
// ─────────────────────────────────────────────────────────────────────────
function SettingsRow({
  icon: Icon,
  title,
  description,
  control,
  destructive = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  control: React.ReactNode;
  destructive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4 rounded-2xl border border-border bg-background">
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
            destructive ? "bg-destructive/10" : "bg-muted"
          }`}
        >
          <Icon className={`w-4 h-4 ${destructive ? "text-destructive" : "text-muted-foreground"}`} />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${destructive ? "text-destructive" : ""}`}>{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex-shrink-0">{control}</div>
    </div>
  );
}

function SettingsTab() {
  const [visibility, setVisibility] = useState(false);
  const [aiRegen, setAiRegen] = useState(true);
  const [comments, setComments] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="space-y-3">
      <SettingsRow
        icon={Eye}
        title="Visibility"
        description={visibility ? "Anyone with the link can view this course" : "Only you can view this course"}
        control={<Switch checked={visibility} onCheckedChange={setVisibility} />}
      />
      <SettingsRow
        icon={FileText}
        title="Export Options"
        description="Download as Markdown, PDF, or push to Notion"
        control={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert("Exporting as Markdown…")}>
                Export as Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Exporting as PDF…")}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Pushing to Notion…")}>
                Push to Notion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <SettingsRow
        icon={Check}
        title="AI Regeneration"
        description="Allow AI to refine modules based on feedback"
        control={<Switch checked={aiRegen} onCheckedChange={setAiRegen} />}
      />
      <SettingsRow
        icon={StickyNote}
        title="Learner Comments"
        description="Allow learners to leave inline comments on lessons"
        control={<Switch checked={comments} onCheckedChange={setComments} />}
      />
      <SettingsRow
        icon={Trash2}
        title="Delete Course"
        description="Permanently remove this draft and all its resources"
        destructive
        control={
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  </div>
                  <DialogTitle>Delete this course?</DialogTitle>
                </div>
                <DialogDescription>
                  This permanently removes the draft, every module, lesson, and all 12 attached
                  resources. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDeleteOpen(false);
                    alert("Course deleted (demo only — nothing was actually removed).");
                  }}
                >
                  Delete course
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Share Tab
// ─────────────────────────────────────────────────────────────────────────
function ShareTab() {
  const [publicSharing, setPublicSharing] = useState(true);
  const [copied, setCopied] = useState(false);
  const shareLink = "https://lessonmap.app/p/course-xyz123";

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-3">
      <SettingsRow
        icon={Globe}
        title="Allow public sharing"
        description="Anyone with the link below can view this course outline."
        control={<Switch checked={publicSharing} onCheckedChange={setPublicSharing} />}
      />

      <div
        className={`px-4 py-4 rounded-2xl border border-border bg-background transition-opacity ${
          publicSharing ? "" : "opacity-50 pointer-events-none"
        }`}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <Link2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">Public share link</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Share a beautiful, mobile-optimized version of your course outline.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input readOnly value={shareLink} className="text-xs font-mono" />
          <Button size="sm" onClick={handleCopy} className="flex-shrink-0 gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Preview Dialog
// ─────────────────────────────────────────────────────────────────────────
function PreviewDialog({
  title,
  description,
  modules,
  resources,
}: {
  title: string;
  description: string;
  modules: Module[];
  resources: Resource[];
}) {
  const [open, setOpen] = useState(false);
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{title || "Untitled course"}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-[10px]">
            {modules.length} modules
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {totalLessons} lessons
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {resources.length} resources
          </Badge>
        </div>
        <Separator />
        <div className="space-y-4">
          {modules.map((module, mi) => (
            <div key={module.id}>
              <p className="text-sm font-semibold mb-2">{module.name}</p>
              <div className="space-y-1.5 pl-3 border-l border-border">
                {module.lessons.map((lesson, li) => (
                  <div key={lesson.id} className="text-xs">
                    <span className="font-medium">
                      {mi + 1}.{li + 1} {lesson.name}
                    </span>
                    {lesson.description && (
                      <p className="text-muted-foreground mt-0.5">{lesson.description}</p>
                    )}
                  </div>
                ))}
                {module.lessons.length === 0 && (
                  <p className="text-xs text-muted-foreground">No lessons yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Upgrade Dialog (Flow Map → Creator Plan)
// ─────────────────────────────────────────────────────────────────────────
function UpgradeDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle>Flow Map is a Creator Plan feature</DialogTitle>
          <DialogDescription>
            Visualize your course as an interactive flow diagram, with branching paths and module
            connections — available on the Creator plan.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {[
            "Visual flow map of modules & lessons",
            "Unlimited courses and resources",
            "AI-powered course regeneration",
            "Priority support",
          ].map((perk) => (
            <div key={perk} className="flex items-center gap-2.5 text-sm">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              {perk}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Maybe later
          </Button>
          <Button className="gap-1.5" onClick={() => setOpen(false)}>
            <Sparkles className="w-3.5 h-3.5" />
            Upgrade to Creator
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-tight">LessonMap</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Home</a>
          <a href="#" className="hover:text-foreground transition-colors">Examples</a>
          <a href="#" className="text-foreground">Dashboard</a>
          <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            Dashboard
          </Button>
          <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold flex-shrink-0">
            A
          </div>
        </div>
      </div>
    </header>
  );
}


export default function CourseBuilderPage() {
  const [title, setTitle] = useState("Mastering Modern Web Development");
  const [description, setDescription] = useState(
    "An AI-generated blueprint covering the fundamentals through advanced patterns of building production-ready web apps."
  );
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [activeTab, setActiveTab] = useState<TabValue>("outline");
  const [saved, setSaved] = useState(false);

  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Navbar />
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ── Top bar ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Workflow className="w-3.5 h-3.5 text-primary" />
            </div>
            <h1 className="text-base sm:text-lg font-bold">Course Builder</h1>
            <span className="text-muted-foreground/40">·</span>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {modules.length} modules · {totalLessons} lessons · {resources.length} resources
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PreviewDialog title={title} description={description} modules={modules} resources={resources} />
            <Button size="sm" onClick={handleSave} className="gap-1.5">
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        {/* ── Title & description ──────────────────────────────────── */}
        <div className="space-y-4 mb-6">
          <div className="space-y-1.5">
            <Label htmlFor="course-title" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Course Title
            </Label>
            <Input
              id="course-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm font-medium h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="course-desc" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="course-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm min-h-20 resize-none"
            />
          </div>
        </div>

        <Separator className="mb-5" />

        {/* ── Tab nav + view toggle ─────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "outline" && (
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-background text-foreground shadow-sm">
                <LayoutList className="w-3.5 h-3.5" />
                Accordion
              </button>
              <UpgradeDialog>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <Workflow className="w-3.5 h-3.5" />
                  Flow Map
                  <Crown className="w-3 h-3 text-primary" />
                </button>
              </UpgradeDialog>
            </div>
          )}
        </div>

        {/* ── Tab content ───────────────────────────────────────────── */}
        <div>
          {activeTab === "outline" && (
            <OutlineTab
              modules={modules}
              resources={resources}
              setModules={setModules}
              setResources={setResources}
            />
          )}
          {activeTab === "resources" && (
            <ResourcesTab modules={modules} resources={resources} setResources={setResources} />
          )}
          {activeTab === "settings" && <SettingsTab />}
          {activeTab === "share" && <ShareTab />}
        </div>
      </div>
    </div>
  );
}
