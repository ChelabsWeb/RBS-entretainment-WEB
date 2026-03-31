"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Film, Users, Shield, ClipboardList, LogOut, Menu, X, Loader2,
  Eye, LayoutDashboard, ChevronRight, ExternalLink,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Peliculas", href: "/dashboard/movies", icon: <Film className="h-4 w-4" /> },
  { label: "Clientes VIP", href: "/dashboard/vip", icon: <Users className="h-4 w-4" /> },
  { label: "Portal VIP", href: "/dashboard/vip-portal", icon: <Eye className="h-4 w-4" /> },
];

const SUPER_ADMIN_ITEMS: NavItem[] = [
  { label: "Roles", href: "/dashboard/roles", icon: <Shield className="h-4 w-4" /> },
  { label: "Auditoria", href: "/dashboard/audit", icon: <ClipboardList className="h-4 w-4" /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { role, loading: roleLoading, isSuperAdmin } = useRole();

  const isLoading = authLoading || roleLoading;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    // Exact match for /dashboard/vip to avoid conflict with /dashboard/vip-portal
    if (href === "/dashboard/vip") return pathname === "/dashboard/vip" || pathname.startsWith("/dashboard/vip/");
    return pathname.startsWith(href);
  };

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "??";

  const roleLabel = role === "super_admin" ? "Super Admin" : role === "admin" ? "Admin" : "Usuario";

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
      </div>
    );
  }

  function NavLink({ item }: { item: NavItem }) {
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        onClick={() => setSidebarOpen(false)}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
          active
            ? "bg-[#4f5ea7]/15 text-white"
            : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
        }`}
      >
        <span className={`flex-shrink-0 transition-colors ${active ? "text-[#4f5ea7]" : "text-white/40 group-hover:text-white/60"}`}>
          {item.icon}
        </span>
        <span className="flex-1">{item.label}</span>
        {active && <ChevronRight className="h-3 w-3 text-[#4f5ea7]" />}
      </Link>
    );
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center px-5">
        <Link href="/" className="relative h-8 w-28">
          <Image
            src="/assets/Logos/RBS logo blanco footer.png"
            alt="RBS Entertainment"
            fill
            sizes="112px"
            className="object-contain object-left"
            priority
          />
        </Link>
      </div>

      <div className="px-4">
        <Separator className="bg-white/[0.06]" />
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
          Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {isSuperAdmin && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
                Administracion
              </p>
            </div>
            {SUPER_ADMIN_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </>
        )}
        {/* Landing link */}
        <div className="pt-4 pb-2">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
            Sitio
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-white/50 hover:bg-white/[0.04] hover:text-white/80 transition-all"
        >
          <ExternalLink className="h-4 w-4 text-white/40" />
          <span className="flex-1">Ver Sitio Web</span>
        </Link>
      </nav>

      {/* User section */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/[0.03] transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#4f5ea7]/20 text-[11px] font-bold text-[#4f5ea7]">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[12px] font-medium text-white/70">{user?.email}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#4f5ea7]">
              {roleLabel}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="h-7 w-7 text-white/30 hover:text-white/70 hover:bg-white/5"
            title="Cerrar sesion"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-zinc-950/95 backdrop-blur-xl border-r border-white/[0.06] transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-5 rounded-lg p-1.5 text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        {sidebarContent}
      </aside>

      {/* Sidebar - desktop */}
      <aside className="hidden w-[260px] flex-shrink-0 border-r border-white/[0.06] bg-zinc-950/80 lg:block">
        {sidebarContent}
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-white/[0.06] bg-zinc-950/50 px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/5 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            {pathname !== "/dashboard" ? (
              <Link
                href="/dashboard"
                className="hidden lg:flex items-center gap-2 text-[12px] text-white/40 hover:text-white transition-colors"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span className="font-medium">← Dashboard</span>
              </Link>
            ) : (
              <div className="hidden lg:flex items-center gap-2 text-[12px] text-white/30">
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span className="font-medium">Panel de Control</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-[12px] text-white/40 sm:inline">{user?.email}</span>
            <Badge className="bg-[#4f5ea7]/15 text-[#4f5ea7] border-0 text-[10px] font-semibold uppercase tracking-wider">
              {roleLabel}
            </Badge>
          </div>
        </header>

        {/* Page content */}
        <main data-lenis-prevent className="flex-1 overflow-y-auto bg-black p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
