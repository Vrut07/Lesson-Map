"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { courseOutline } from "@/constants"
import { Menu, Share, Share2, User2Icon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import ThemeToggle from "../ThemeToggle"
const SingleOutline = ({ id }: { id: string }) => {
  const [activeModule, setActiveModule] = useState(courseOutline.modules[0])
  const [activeLesson, setActiveLesson] = useState<number | null>(null)
  const [search, setSearch] = useState("")

  const filteredModules = courseOutline.modules.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(search.toLowerCase())
  )

  console.log(id)

  return (
    <section className="container relative  mx-auto px-6 space-y-8">
      <div className="absolute top-10 right-6 space-x-2.5">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Menu className="opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Share2 /> Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User2Icon /> Ayush Khatri
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
      <div className="space-y-2 pt-20">
        <h1 className="text-3xl font-bold">
          {courseOutline.title}
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          {courseOutline.description}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          type="text"
          placeholder="Search modules or topics..."
          className="w-full border-border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col gap-2">
          {filteredModules.map((module, idx) => (
            <div
              key={module.id}
              onClick={() => {
                setActiveModule(module)
                setActiveLesson(null)
              }}
              className={cn(
                "rounded-lg border px-4 py-3 cursor-pointer transition-all",
                "hover:border-primary/60 hover:bg-primary/5",
                activeModule.id === module.id
                  ? "border-primary bg-primary/10"
                  : "border-muted bg-muted/40"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <Badge
                  variant={
                    activeModule.id === module.id ? "default" : "secondary"
                  }
                  className="text-xs font-medium"
                >
                  Module {idx + 1}
                </Badge>
              </div>
              <h1 className="font-semibold text-xl">
                {module.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {module.subtitle}
              </p>
            </div>
          ))}
        </div>

        <div className="col-span-2 rounded-lg border bg-muted/40 px-6 py-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="font-semibold text-xl">
                {activeModule.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {activeModule.subtitle}
              </p>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <Badge variant={"outline"} className="text-base">
                Total {activeModule.lessons.length} Lessons
              </Badge>
            </div>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeModule.lessons.map((lesson, i) => (
              <div
                key={i}
                onClick={() => setActiveLesson(i)}
                className={cn(
                  "border rounded-md px-3 py-2 text-sm cursor-pointer transition",
                  activeLesson === i
                    ? "bg-accent border-primary"
                    : "bg-background hover:bg-accent/60"
                )}
              >
                <span className="text-primary text-base font-medium mr-2">
                  {i + 1}.
                </span>
                <h1 className="text-lg inline-flex">
                  {lesson}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SingleOutline
