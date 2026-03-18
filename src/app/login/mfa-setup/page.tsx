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
import { Loader2, ShieldCheck } from "lucide-react";

function MfaSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(true);

  useEffect(() => {
    const enrollMfa = async () => {
      const supabase = createClient();

      try {
        const { data, error: enrollError } = await supabase.auth.mfa.enroll({
          factorType: "totp",
          friendlyName: "RBS Authenticator",
        });

        if (enrollError) {
          setError(enrollError.message);
          setEnrolling(false);
          return;
        }

        if (data) {
          setFactorId(data.id);
          if (data.type === "totp") {
            setQrCode(data.totp.qr_code);
            setSecret(data.totp.secret);
          }
        }
      } catch (err) {
        console.error("MFA enroll error:", err);
        setError("Error al configurar la autenticacion de dos factores.");
      } finally {
        setEnrolling(false);
      }
    };

    enrollMfa();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId || !verifyCode) return;

    setError(null);
    setLoading(true);

    const supabase = createClient();

    try {
      // Challenge
      const { data: challengeData, error: challengeError } =
        await supabase.auth.mfa.challenge({
          factorId,
        });

      if (challengeError) {
        setError(challengeError.message);
        setLoading(false);
        return;
      }

      // Verify
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verifyCode,
      });

      if (verifyError) {
        setError("Codigo incorrecto. Verificalo e intenta de nuevo.");
        setLoading(false);
        return;
      }

      // Success - redirect (sanitize to prevent open redirect)
      const safeRedirect = redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/dashboard";
      router.push(safeRedirect);
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
            <ShieldCheck className="h-6 w-6 text-[#4f5ea7]" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-white">
            Configurar MFA
          </CardTitle>
          <CardDescription className="text-white/40 text-xs uppercase tracking-widest mt-2">
            Autenticacion de dos factores
          </CardDescription>
        </CardHeader>

        <CardContent>
          {enrolling ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#4f5ea7]" />
              <p className="text-white/40 text-xs uppercase tracking-widest">
                Generando codigo QR...
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {error && (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {qrCode && (
                <>
                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-4">
                      Escaneá este codigo QR con tu aplicacion de autenticacion
                      (Google Authenticator, Authy, etc.)
                    </p>
                    <div className="mx-auto w-fit rounded-xl bg-white p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrCode}
                        alt="Codigo QR para MFA"
                        width={200}
                        height={200}
                      />
                    </div>
                  </div>

                  {secret && (
                    <div className="text-center">
                      <p className="text-white/40 text-xs uppercase tracking-widest mb-2">
                        O ingresá este codigo manualmente
                      </p>
                      <code className="block rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white font-mono select-all break-all">
                        {secret}
                      </code>
                    </div>
                  )}

                  <form onSubmit={handleVerify} className="flex flex-col gap-4">
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
                        autoComplete="one-time-code"
                        className="text-center text-lg tracking-[0.5em] bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:border-[#4f5ea7] focus-visible:ring-[#4f5ea7]/30 font-mono"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || verifyCode.length !== 6}
                      className="w-full h-11 bg-[#4f5ea7] hover:bg-[#4f5ea7]/80 text-white font-black uppercase tracking-widest text-xs"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Verificar y activar"
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function MfaSetupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-[#4f5ea7]" />
        </div>
      }
    >
      <MfaSetupContent />
    </Suspense>
  );
}
