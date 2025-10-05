"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { AuroraText } from "../ui/aurora-text";
import { signIn } from "@/lib/auth-client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const handleSignIn = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: "/",
      errorCallbackURL: "/auth-error",
      newUserCallbackURL: "/",
    });
  }
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
            <Button variant="outline" type="button" className="w-full">
              <FaGoogle />
              Continue with Google
            </Button>
            <Button
              onClick={
                () => handleSignIn()
              }
              variant="outline" type="button">
              <FaGithub className="" />
              GitHub
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
