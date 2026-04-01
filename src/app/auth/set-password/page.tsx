"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle } from "lucide-react";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo text */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-[4px] uppercase">
            <span className="text-[#4f5ea7]">RBS</span>
          </h1>
          <p className="text-[11px] font-bold tracking-[6px] uppercase text-white/30 mt-1">
            Entertainment
          </p>
        </div>

        <div className="border border-white/10 bg-white/[0.02] rounded-sm p-8">
          {success ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle className="h-10 w-10 text-green-400 mb-4" />
              <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                Contraseña creada
              </h2>
              <p className="text-sm text-white/40">
                Redirigiendo al portal VIP...
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                Creá tu contraseña
              </h2>
              <p className="text-[12px] text-white/40 mb-6">
                Elegí una contraseña segura para acceder al portal de exhibidores.
              </p>

              {error && (
                <div className="mb-4 rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full bg-black border border-white/10 rounded-sm pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#4f5ea7] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repetí la contraseña"
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
                    "Crear contraseña"
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center mt-8 text-[9px] text-white/15 uppercase tracking-[2px]">
          © 2026 RBS Entertainment Uruguay
        </p>
      </div>
    </div>
  );
}
