"use client";
import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BookOpen, FileText, Loader2, AlertCircle, Library } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MdRoute } from "react-icons/md";

// Types
interface Lesson {
  id: string;
  lessonName?: string;
  description?: string;
  order?: number;
}

interface Module {
  id: string;
  moduleName: string;
  description: string;
  order: number;
  courseId: string;
  Lesson: Lesson[];
}

interface Course {
  id: string;
  courseName: string;
  description: string;
  userId: string;
  Module: Module[];
}

interface CourseOutlineViewerProps {
  apiEndpoint?: string;
  className?: string;
  courses?: Course[];
}

export default function FullCourseOutline({
  courses,
  className = ''
}: CourseOutlineViewerProps) {

  if (courses?.length === 0) {
    return (
      <Alert className="m-4">
        <BookOpen className="h-4 w-4" />
        <AlertDescription>No courses found. Start creating your first course!</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`w-full px-5 mx-auto ${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-2">
          <MdRoute className="h-8 w-8" />
          Course Outline Preview
        </h1>
        <p className="text-muted-foreground">
          {courses?.length} {courses?.length === 1 ? 'course' : 'courses'} Total
        </p>
      </div>

      <Accordion type="multiple" className="flex flex-col items-center gap-4">
        {courses?.map((course) => (
          <AccordionItem
            key={course.id}
            value={course.id}
            className="rounded-xl w-full border backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline text-left rounded-xl">
              <div className="flex items-start gap-4 text-left w-full">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-foreground mb-1">
                    {course.courseName}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {course.Module.length} modules
                    </span>
                    <span>•</span>
                    <span>
                      {course.Module.reduce((acc, mod) => acc + mod.Lesson.length, 0)} lessons
                    </span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-5 pb-5">
              {course.Module.length > 0 ? (
                <Accordion type="multiple" className="space-y-3 mt-2">
                  {course.Module
                    .sort((a, b) => a.order - b.order)
                    .map((module, idx) => (
                      <AccordionItem
                        key={module.id}
                        value={module.id}
                        className="border rounded-lg bg-muted/30"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                          <div className="flex items-start gap-3 text-left w-full">
                            <div className="flex-shrink-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-md flex items-center justify-center text-sm font-semibold">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground mb-1">
                                {module.moduleName}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {module.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {module.Lesson.length} {module.Lesson.length === 1 ? 'lesson' : 'lessons'}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-4 pb-3">
                          {module.Lesson.length > 0 ? (
                            <div className="space-y-2 mt-2">
                              {module.Lesson
                                .sort((a, b) => (a.order || 0) - (b.order || 0))
                                .map((lesson, lessonIdx) => (
                                  <div
                                    key={lesson.id}
                                    className="flex items-start gap-3 p-3 bg-card rounded-md border"
                                  >
                                    <div className="flex-shrink-0 w-7 h-7 bg-accent text-accent-foreground rounded flex items-center justify-center text-sm font-medium">
                                      {lessonIdx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-foreground text-sm">
                                        {lesson.lessonName || `Lesson ${lessonIdx + 1}`}
                                      </h4>
                                      {lesson.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {lesson.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-muted-foreground">
                              <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No lessons added yet</p>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No modules created yet</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}