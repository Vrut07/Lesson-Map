"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { MdOutlineDragIndicator } from "react-icons/md";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Module = {
  id: string;
  name: string;
  order?: number;
};
function SortableItem({ id, name, order }: Module) {
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
      className="border p-3 my-2 rounded-md cursor-grab active:cursor-grabbing flex items-center gap-4 "
    >
      <MdOutlineDragIndicator className="text-foreground/40" />
      <Button variant={"outline"} className="rounded-full">{order}</Button>
      <span>{name}</span>
    </div>
  );
}

export default function ModuleList() {
  const [modules, setModules] = useState<Module[]>([
    { id: "1", order: 1, name: "Introduction to DevOps" },
    { id: "2", order: 2, name: "Docker & Containers" },
    { id: "3", order: 3, name: "CI/CD with Jenkins" },
    { id: "4", order: 4, name: "Infrastructure as Code (Terraform)" },
  ]);

  const [module, setModule] = useState("");

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setModules((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  const handleAddModule = () => {
    if (module.trim() === "") return;

    const newModule: Module = {
      id: Date.now().toString(),
      name: module.trim(),
    };

    setModules((prev) => [...prev, newModule]);
    setModule("");
  };

  return (
    <>
      <div className="w-full flex md:flex-row flex-col items-center gap-3 pb-5 justify-end">
        <Input
          value={module}
          onChange={(e) => setModule(e.target.value)}
          className="w-full"
          placeholder="Enter module name"
        />
        <Button onClick={handleAddModule} className="justify-end">Add Module</Button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={modules} strategy={verticalListSortingStrategy}>
          {modules.map((m) => (
            <SortableItem key={m.id} id={m.id} name={m.name} order={m.order} />
          ))}
        </SortableContext>
      </DndContext>

      <Button className="w-full my-5">Save Module</Button>
    </>
  );
}
