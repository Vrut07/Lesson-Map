"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toggleCoursePublicAction } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ToggleCoursePublicButton({
  courseId,
  isPublic,
}: {
  courseId: string;
  isPublic: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await toggleCoursePublicAction(courseId);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update visibility.");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={loading}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isPublic ? "Make Private" : "Make Public"}
    </Button>
  );
}
