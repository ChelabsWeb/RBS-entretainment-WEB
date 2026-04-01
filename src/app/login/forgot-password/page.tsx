"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    setLoading(false);

    if (error) {
      setError("No se pudo enviar el email. Verificá la dirección.");
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-[4px] uppercase">
            <span className="text-[#4f5ea7]">RBS</span>
          </h1>
          <p className="text-[11px] font-bold tracking-[6px] uppercase text-white/30 mt-1">
            Entertainment
          </p>
        </div>

        <div className="border border-white/10 bg-white/[0.02] rounded-sm p-8">
          {sent ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle className="h-10 w-10 text-green-400 mb-4" />
              <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                Revisá tu email
              </h2>
              <p className="text-sm text-white/40 mb-2">
                Enviamos un link de recuperación a:
              </p>
              <p className="text-sm text-[#4f5ea7] font-bold">{email}</p>
              <p className="text-[11px] text-white/30 mt-4">
                Si no lo ves, revisá la carpeta de spam.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                Recuperar contraseña
              </h2>
              <p className="text-[12px] text-white/40 mb-6">
                Ingresá tu email y te enviamos un link para crear una nueva contraseña.
              </p>

              {error && (
                <div className="mb-4 rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full bg-black border border-white/10 rounded-sm pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#4f5ea7] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-sm bg-[#4f5ea7] hover:bg-[#4f5ea7]/80 text-white font-black text-[11px] uppercase tracking-[0.3em] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Enviar link de recuperación"
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 pt-4 border-t border-white/5">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
