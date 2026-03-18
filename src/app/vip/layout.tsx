"use client";

import { useAuth } from "@/hooks/useAuth";
import { LogOut, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VipLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Left: Logo + Label */}
          <Link href="/vip" className="flex items-center gap-3">
            <div className="relative h-7 w-24 flex-shrink-0">
              <Image
                src="/assets/Logos/RBS logo blanco footer.png"
                alt="RBS Entertainment"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block h-5 w-px bg-white/10" />
            <span className="hidden sm:block text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
              Portal de Exhibidores
            </span>
          </Link>

          {/* Right: User + Logout */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/50 tracking-wide hidden sm:block max-w-[200px] truncate">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors px-2 py-1.5 rounded hover:bg-white/5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
