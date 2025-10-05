import { LoginForm } from "@/components/auth/LoginForm";
import { signIn, useSession } from "@/lib/auth-client"; //import the auth client

export default async function SignInPage() {

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
