"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle } from "lucide-react";

export function ContactSection() {
  const { theme } = useTheme();
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Open mailto with pre-filled data
    const subject = encodeURIComponent(`Contacto desde web - ${form.nombre}`);
    const body = encodeURIComponent(
      `Nombre: ${form.nombre}\nEmail: ${form.email}\n\nMensaje:\n${form.mensaje}`
    );
    window.location.href = `mailto:contacto@rbs.com.uy?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 1000);
  };

  return (
    <section id="contacto" className="py-24 md:py-32 px-6 md:px-12 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left: Info */}
          <div className="space-y-10">
            <div>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4 transition-colors duration-1000"
                style={{ color: theme.primary }}
              >
                Contacto
              </h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-md">
                ¿Tenés consultas sobre distribución, licencias o exhibición? Escribinos y te respondemos a la brevedad.
              </p>
            </div>

            <div className="space-y-5">
              <a
                href="mailto:contacto@rbs.com.uy"
                className="flex items-center gap-4 group"
              >
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-500"
                  style={{ backgroundColor: theme.primary + "15" }}
                >
                  <Mail className="h-4 w-4" style={{ color: theme.primary }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Email</p>
                  <p className="text-sm text-white/70 group-hover:text-white transition-colors">contacto@rbs.com.uy</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.primary + "15" }}
                >
                  <Phone className="h-4 w-4" style={{ color: theme.primary }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Teléfono</p>
                  <p className="text-sm text-white/70">+598 2622 2222</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.primary + "15" }}
                >
                  <MapPin className="h-4 w-4" style={{ color: theme.primary }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Dirección</p>
                  <p className="text-sm text-white/70">Luis A. De Herrera 1284 – WTC Torre 2 of. 1706</p>
                  <p className="text-xs text-white/40">Montevideo, Uruguay</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div
            className="rounded-sm p-8 md:p-10 transition-all duration-500"
            style={{ backgroundColor: theme.primary + "08", border: `1px solid ${theme.primary}15` }}
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle className="h-10 w-10 mb-4" style={{ color: theme.primary }} />
                <p className="text-lg font-bold text-white">¡Mensaje preparado!</p>
                <p className="text-sm text-white/40 mt-2">Se abrió tu cliente de email para enviar el mensaje.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#4f5ea7] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#4f5ea7] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Mensaje
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.mensaje}
                    onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                    placeholder="¿En qué podemos ayudarte?"
                    className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#4f5ea7] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-sm font-black text-[11px] uppercase tracking-[0.3em] text-white transition-all duration-500 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                  style={{ backgroundColor: theme.primary }}
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Enviar mensaje
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
