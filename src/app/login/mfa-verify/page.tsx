"use client";

import { useState, useEffect, Suspense } from "react";
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
import { Loader2, ShieldAlert } from "lucide-react";

interface TotpFactor {
  id: string;
  friendly_name?: string;
  status: string;
}

function MfaVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";

  const [factors, setFactors] = useState<TotpFactor[]>([]);
  const [selectedFactorId, setSelectedFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingFactors, setLoadingFactors] = useState(true);

  useEffect(() => {
    const loadFactors = async () => {
      const supabase = createClient();

      try {
        const { data, error: factorsError } =
          await supabase.auth.mfa.listFactors();

        if (factorsError) {
          setError(factorsError.message);
          setLoadingFactors(false);
          return;
        }

        const verifiedTotpFactors =
          data?.totp?.filter((f) => f.status === "verified") ?? [];

        if (verifiedTotpFactors.length === 0) {
          // No verified factors, redirect to setup
          const params = redirectTo
            ? `?redirectTo=${encodeURIComponent(redirectTo)}`
            : "";
          router.push(`/login/mfa-setup${params}`);
          return;
        }

        setFactors(verifiedTotpFactors);
        setSelectedFactorId(verifiedTotpFactors[0].id);
      } catch (err) {
        console.error("Error loading factors:", err);
        setError("Error al cargar los factores de autenticacion.");
      } finally {
        setLoadingFactors(false);
      }
    };

    loadFactors();
  }, [router, redirectTo]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFactorId || !verifyCode) return;

    setError(null);
    setLoading(true);

    const supabase = createClient();

    try {
      // Challenge
      const { data: challengeData, error: challengeError } =
        await supabase.auth.mfa.challenge({
          factorId: selectedFactorId,
        });

      if (challengeError) {
        setError(challengeError.message);
        setLoading(false);
        return;
      }

      // Verify
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: selectedFactorId,
        challengeId: challengeData.id,
        code: verifyCode,
      });

      if (verifyError) {
        setError("Codigo incorrecto. Verificalo e intenta de nuevo.");
        setVerifyCode("");
        setLoading(false);
        return;
      }

      // Success - determine redirect based on role
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
        router.push(redirectTo);
        return;
      }

      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (
          roleData &&
          ["super_admin", "admin"].includes(roleData.role)
        ) {
          router.push("/dashboard");
          return;
        }
      }

      router.push("/vip");
    } catch (err) {
      console.error("MFA verify error:", err);
      setError("Error al verificar el codigo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black">
      <Card className="w-full max-w-md border-white/10 bg-white/[0.02] shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#4f5ea7]/20">
            <ShieldAlert className="h-6 w-6 text-[#4f5ea7]" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-white">
            Verificacion MFA
          </CardTitle>
          <CardDescription className="text-white/40 text-xs uppercase tracking-widest mt-2">
            Ingresa el codigo de tu aplicacion
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loadingFactors ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#4f5ea7]" />
              <p className="text-white/40 text-xs uppercase tracking-widest">
                Cargando...
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-5">
              {error && (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {factors.length > 1 && (
                <div className="flex flex-col gap-2">
                  <Label className="text-xs uppercase tracking-widest text-white/60 font-bold">
                    Dispositivo
                  </Label>
                  <div className="flex flex-col gap-2">
                    {factors.map((factor) => (
                      <button
                        key={factor.id}
                        type="button"
                        onClick={() => setSelectedFactorId(factor.id)}
                        className={`rounded-md border px-4 py-2 text-left text-sm transition-colors ${
                          selectedFactorId === factor.id
                            ? "border-[#4f5ea7] bg-[#4f5ea7]/10 text-white"
                            : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                        }`}
                      >
                        {factor.friendly_name || "Autenticador TOTP"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="code"
                  className="text-xs uppercase tracking-widest text-white/60 font-bold"
                >
                  Codigo de verificacion
                </Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) =>
                    setVerifyCode(e.target.value.replace(/\D/g, ""))
                  }
                  required
                  autoFocus
                  autoComplete="one-time-code"
                  className="text-center text-lg tracking-[0.5em] bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:border-[#4f5ea7] focus-visible:ring-[#4f5ea7]/30 font-mono"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || verifyCode.length !== 6}
                className="w-full h-11 bg-[#4f5ea7] hover:bg-[#4f5ea7]/80 text-white font-black uppercase tracking-widest text-xs mt-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Verificar"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function MfaVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-[#4f5ea7]" />
        </div>
      }
    >
      <MfaVerifyContent />
    </Suspense>
  );
}
