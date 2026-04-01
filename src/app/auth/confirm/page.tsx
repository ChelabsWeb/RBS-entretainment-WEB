"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthConfirmPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Supabase puts tokens in the URL hash after email verification
    // The client auto-detects and exchanges them via onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "USER_UPDATED") {
        router.replace("/auth/set-password");
      } else if (event === "SIGNED_IN") {
        // Check if this is a new invite (user has no password yet)
        // For invites, Supabase signs in with a temporary session
        // We send them to set-password
        const hash = window.location.hash;
        if (hash.includes("type=invite") || hash.includes("type=recovery")) {
          router.replace("/auth/set-password");
        } else {
          router.replace("/vip");
        }
      }
    });

    // Fallback: if no event fires after 5s, check current session
    const timeout = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/auth/set-password");
      } else {
        setError("El link ha expirado o es inválido. Solicitá uno nuevo.");
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-[4px] uppercase">
            <span className="text-[#4f5ea7]">RBS</span>
          </h1>
          <p className="text-[11px] font-bold tracking-[6px] uppercase text-white/30 mt-1">
            Entertainment
          </p>
        </div>

        {error ? (
          <div className="space-y-4">
            <p className="text-red-400 text-sm">{error}</p>
            <a href="/login" className="text-[#4f5ea7] text-sm hover:underline">
              Ir al inicio de sesión
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#4f5ea7] mx-auto" />
            <p className="text-white/40 text-sm">Verificando tu cuenta...</p>
          </div>
        )}
      </div>
    </div>
  );
}
