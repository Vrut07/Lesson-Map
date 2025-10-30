// File: components/FullModulePreview.tsx
"use client";
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FileText, Library } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Types (kept simple and local so component is portable)
interface Lesson {
  id: string;
  lessonName?: string;
  description?: string;
  order?: number;
}

interface ModuleType {
  id: string;
  moduleName: string;
  description?: string;
  order?: number;
  courseId?: string;
  Lesson?: Lesson[];
}

interface FullModulePreviewProps {
  initialModules?: ModuleType[];
  className?: string;
}

export default function FullModulePreview({
  initialModules = [],
  className = '',
}: FullModulePreviewProps) {
  if (!initialModules || initialModules.length === 0) {
    return (
      <Alert className="m-4">
        <FileText className="h-4 w-4" />
        <AlertDescription>No modules found. Create a module to see the preview!</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`w-full my-10 mx-auto ${className}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2 mb-2">
          <Library className="h-8 w-8" />
          Module Outline Preview
        </h1>
        <p className="text-muted-foreground">
          {initialModules.length} {initialModules.length === 1 ? 'module' : 'modules'} available
        </p>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {initialModules
          .slice() // avoid mutating original
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((module, idx) => (
            <AccordionItem key={module.id} value={module.id} className="">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-start gap-4 text-left w-full">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-foreground mb-1">{module.moduleName}</h2>
                    {module.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{module.description}</p>
                    )}
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {module.Lesson ? module.Lesson.length : 0} lessons
                      </span>
                      <span>•</span>
                      <span>Order: {module.order ?? idx + 1}</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="">
                {module.Lesson && module.Lesson.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {module.Lesson
                      .slice()
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((lesson, lessonIdx) => (
                        <div key={lesson.id} className="flex items-start gap-3 p-3 bg-card rounded-md border">
                          <div className="flex-shrink-0 w-7 h-7 bg-accent text-accent-foreground rounded flex items-center justify-center text-sm font-medium">
                            {lessonIdx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground text-sm">
                              {lesson.lessonName || `Lesson ${lessonIdx + 1}`}
                            </h4>
                            {lesson.description && (
                              <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
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
    </div>
  );
}


