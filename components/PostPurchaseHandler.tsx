"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

export default function PostPurchaseHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const activatedRef = useRef(false);

  const subscriptionId = searchParams.get("subscription_id");
  const status = searchParams.get("status");
  const email = searchParams.get("email");
  const isPurchaseReturn =
    !!subscriptionId && status === "active" && !!email;

  useEffect(() => {
    if (!isPurchaseReturn || isPending || activatedRef.current) return;

    if (!session?.user) {
      const returnUrl = `/?${searchParams.toString()}`;
      router.replace(
        `/sign-in?callbackUrl=${encodeURIComponent(returnUrl)}`,
      );
      return;
    }

    activatedRef.current = true;

    async function activatePlan() {
      try {
        const response = await fetch("/api/subscription/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscriptionId,
            status,
            email: decodeURIComponent(email!),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to activate your plan.");
        }

        toast.success("Welcome to Creator!", {
          description:
            "Your plan is active. Redirecting you to your dashboard…",
        });

        router.replace("/dashboard");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not activate your plan. Please contact support.",
        );
        router.replace("/");
      }
    }

    activatePlan();
  }, [
    isPurchaseReturn,
    isPending,
    session?.user,
    subscriptionId,
    status,
    email,
    searchParams,
    router,
  ]);

  if (!isPurchaseReturn) return null;

  return (
    <div className="fixed inset-x-0 top-16 z-[1000] flex justify-center px-4 pointer-events-none">
      <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-background/95 px-5 py-3 shadow-lg backdrop-blur">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          {isPending || session?.user ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Sparkles className="h-4 w-4 text-primary" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold">Activating your Creator plan</p>
          <p className="text-xs text-muted-foreground">
            {isPending
              ? "Checking your account…"
              : session?.user
                ? "Upgrading your account…"
                : "Sign in to finish activation…"}
          </p>
        </div>
      </div>
    </div>
  );
}
