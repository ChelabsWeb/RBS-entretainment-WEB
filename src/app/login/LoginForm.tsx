"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { Loader2, Lock, Mail } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    try {
      // Check lockout status before attempting login
      const { data: lockoutData, error: lockoutError } = await supabase.rpc(
        "check_login_attempt",
        { p_email: email }
      );

      if (lockoutError) {
        console.error("Lockout check error:", lockoutError);
        // Continue with login if RPC is not available
      } else if (lockoutData && typeof lockoutData === "object") {
        const lockout = lockoutData as {
          locked: boolean;
          remaining_minutes: number;
        };
        if (lockout.locked) {
          setError(
            `Cuenta bloqueada temporalmente. Intentá de nuevo en ${Math.ceil(
              lockout.remaining_minutes
            )} minuto${lockout.remaining_minutes !== 1 ? "s" : ""}.`
          );
          setLoading(false);
          return;
        }
      }

      // Attempt sign in
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        // Increment failed attempt counter
        await supabase.rpc("increment_login_attempt", {
          p_email: email,
        });

        if (signInError.message === "Invalid login credentials") {
          setError("Credenciales incorrectas. Verificá tu email y contraseña.");
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      // Success - reset login attempts
      await supabase.rpc("reset_login_attempts", {
        p_email: email,
      });

      // Redirect: middleware handles role-based routing via /login
      const safeRedirect = redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/login";
      window.location.href = safeRedirect;
    } catch (err) {
      console.error("Login error:", err);
      setError("Ocurrió un error inesperado. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black">
      <Card className="w-full max-w-md border-white/10 bg-white/[0.02] shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-white">
            Iniciar Sesion
          </CardTitle>
          <CardDescription className="text-white/40 text-xs uppercase tracking-widest mt-2">
            RBS Entertainment
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-widest text-white/60 font-bold"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:border-[#4f5ea7] focus-visible:ring-[#4f5ea7]/30"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className="text-xs uppercase tracking-widest text-white/60 font-bold"
              >
                Contrasena
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:border-[#4f5ea7] focus-visible:ring-[#4f5ea7]/30"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#4f5ea7] hover:bg-[#4f5ea7]/80 text-white font-black uppercase tracking-widest text-xs mt-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Ingresar"
              )}
            </Button>

            <div className="text-center mt-2">
              <Link
                href="/login/forgot-password"
                className="text-xs text-white/40 hover:text-[#4f5ea7] transition-colors uppercase tracking-widest"
              >
                Problemas para ingresar?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
