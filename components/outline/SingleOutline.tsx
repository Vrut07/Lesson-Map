"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { courseOutline } from "@/constants"
import { Fullscreen, FullscreenIcon, Menu, Share, Share2, User2Icon, CheckCircle2 } from "lucide-react"
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
import { MdOutlineFullscreen, MdFullscreenExit } from "react-icons/md";

const SingleOutline = ({ id }: { id: string }) => {
  const [activeModule, setActiveModule] = useState(courseOutline.modules[0])
  const [activeLesson, setActiveLesson] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<{ [moduleId: string]: number[] }>({})

  // Load completed lessons from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`course-progress-${id}`)
    if (stored) {
      setCompletedLessons(JSON.parse(stored))
    }
  }, [id])

  useEffect(() => {
    localStorage.setItem(`course-progress-${id}`, JSON.stringify(completedLessons))
  }, [completedLessons, id])

  const toggleLessonCompletion = (moduleId: string, lessonIndex: number) => {
    setCompletedLessons((prev) => {
      const moduleLessons = prev[moduleId] || []
      if (moduleLessons.includes(lessonIndex)) {
        return {
          ...prev,
          [moduleId]: moduleLessons.filter((i) => i !== lessonIndex),
        }
      } else {
        return {
          ...prev,
          [moduleId]: [...moduleLessons, lessonIndex],
        }
      }
    })
  }

  const filteredModules = courseOutline.modules.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(search.toLowerCase())
  )

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(err => {
        console.error("Error attempting to enable fullscreen:", err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      }).catch(err => {
        console.error("Error attempting to exit fullscreen:", err)
      })
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <section className="container relative mx-auto px-6 space-y-8 pb-10">
      <div className="absolute top-10 right-6 border rounded-full flex gap-2 py-0.5 px-2 items-center bg-popover">
        <ThemeToggle />
        <div
          className="h-5 w-5 cursor-pointer"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <MdFullscreenExit className="h-5 w-5" /> : <MdOutlineFullscreen className="h-5 w-5" />}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={"icon"} className="rounded-full">
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
      <div className="space-y-2 md:py-10 pt-28">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="flex flex-col gap-2 w-full">
          {filteredModules.map((module, idx) => (
            <div
              key={module.id}
              onClick={() => {
                setActiveModule(module)
                setActiveLesson(null)
              }}
              className={cn(
                "rounded-lg border px-4 py-3 cursor-pointer transition-all w-full",
                "hover:border-primary/60 hover:bg-primary/5",
                activeModule.id === module.id
                  ? "border-primary bg-primary/10"
                  : "border-muted bg-muted/40"
              )}
            >
              <div className="flex items-center w-full justify-between mb-1">
                <Badge
                  variant={
                    activeModule.id === module.id ? "default" : "secondary"
                  }
                  className="text-xs font-medium"
                >
                  Module {idx + 1}
                </Badge>
                <Badge variant="outline">
                  {completedLessons[module.id]?.length || 0}/{module.lessons.length} Completed
                </Badge>
              </div>
              <h1 className="font-semibold text-lg">
                {module.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {module.subtitle}
              </p>
            </div>
          ))}
        </div>
        <div className="col-span-2 rounded-lg border bg-muted/40 px-6 py-5 shadow-sm">
          <div className="flex md:flex-row flex-col gap-5 justify-between items-center mb-4">
            <div>
              <h1 className="font-semibold text-xl">
                {activeModule.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {activeModule.subtitle}
              </p>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <Badge variant={"outline"} className="text-sm">
                Total {activeModule.lessons.length} Lessons
              </Badge>
              <Badge variant={"outline"} className="text-sm bg-green-500/10 text-green-500">
                {completedLessons[activeModule.id]?.length || 0} Completed
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {activeModule.lessons.map((lesson, i) => (
              <div
                key={i}
                onClick={() => setActiveLesson(i)}
                className={cn(
                  "border rounded-md px-3 py-2 text-sm cursor-pointer transition flex items-center",
                  activeLesson === i
                    ? "bg-accent border-primary"
                    : "bg-background hover:bg-accent/60"
                )}
              >
                <span className="text-primary text-base font-medium mr-2">
                  {i + 1}.
                </span>
                <h1 className="text-base inline-flex flex-1">
                  {lesson}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLessonCompletion(activeModule.id, i)
                  }}
                >
                  <CheckCircle2
                    className={cn(
                      "h-6 w-6",
                      completedLessons[activeModule.id]?.includes(i)
                        ? "text-green-500"
                        : "text-gray-400"
                    )}
                  />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SingleOutline