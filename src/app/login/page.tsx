import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const params = await searchParams;
    const raw = params.redirectTo || "/dashboard";
    // Sanitize redirect to prevent open redirect attacks
    const destination = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
    redirect(destination);
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
