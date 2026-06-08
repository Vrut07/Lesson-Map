"use client";

import { useCallback, useEffect, useState } from "react";

const storageKey = (courseId: string) => `lessonmap-progress-${courseId}`;

export function useLessonProgress(courseId: string, seedLessonIds: string[] = []) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const seedKey = seedLessonIds.join(",");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(courseId));
      if (raw) {
        setCompleted(new Set(JSON.parse(raw) as string[]));
      } else if (seedKey) {
        setCompleted(new Set(seedKey.split(",")));
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, [courseId, seedKey]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      storageKey(courseId),
      JSON.stringify([...completed]),
    );
  }, [completed, courseId, hydrated]);

  const toggle = useCallback((lessonId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  }, []);

  const isDone = useCallback(
    (lessonId: string) => completed.has(lessonId),
    [completed],
  );

  const reset = useCallback(() => {
    setCompleted(new Set());
    localStorage.removeItem(storageKey(courseId));
  }, [courseId]);

  return { completed, toggle, isDone, hydrated, reset, completedCount: completed.size };
}
