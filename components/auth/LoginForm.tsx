"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { AuroraText } from "../ui/aurora-text";
import { signIn } from "@/lib/auth-client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackUrl") || "/dashboard";

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "github",
        callbackURL,
        errorCallbackURL: "/auth-error",
        newUserCallbackURL: callbackURL,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-4xl flex items-center justify-center text-center">
            Sign in to{" "}
            <AuroraText className="mx-2 font-bold"> LessonMap</AuroraText>
          </h1>
          <p className="text-center text-lg md:text-xl my-3">
            Build beautiful course outlines in minutes
          </p>
          <div className="grid gap-6 sm:grid-cols-1 mt-5">
            <Button
              onClick={() => handleSignIn()}
              variant="outline"
              type="button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <FaGithub className="" />
                  GitHub
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
