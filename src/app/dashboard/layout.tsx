"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Film, Users, Shield, ClipboardList, LogOut, Menu, X, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  superAdminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Peliculas", href: "/dashboard/movies", icon: <Film className="h-4 w-4" /> },
  { label: "Clientes VIP", href: "/dashboard/vip", icon: <Users className="h-4 w-4" /> },
];

const SUPER_ADMIN_ITEMS: NavItem[] = [
  { label: "Gestion de Roles", href: "/dashboard/roles", icon: <Shield className="h-4 w-4" />, superAdminOnly: true },
  { label: "Registro de Auditoria", href: "/dashboard/audit", icon: <ClipboardList className="h-4 w-4" />, superAdminOnly: true },
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

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Sidebar header */}
      <div className="flex h-16 items-center gap-3 px-6">
        <Link href="/" className="relative h-8 w-28">
          <Image
            src="/assets/Logos/RBS logo blanco footer.png"
            alt="RBS Entertainment"
            fill
            className="object-contain"
            priority
          />
        </Link>
      </div>

      <Separator className="bg-white/10" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm tracking-widest uppercase transition-colors ${
              isActive(item.href)
                ? "border-l-2 text-white"
                : "border-l-2 border-transparent text-white/50 hover:text-white/80"
            }`}
            style={isActive(item.href) ? { borderLeftColor: "#4f5ea7" } : undefined}
          >
            <span className={isActive(item.href) ? "text-white" : "text-white/50"}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

        {isSuperAdmin && (
          <>
            <div className="py-3 px-3">
              <Separator className="bg-white/10" />
            </div>
            {SUPER_ADMIN_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm tracking-widest uppercase transition-colors ${
                  isActive(item.href)
                    ? "border-l-2 text-white"
                    : "border-l-2 border-transparent text-white/50 hover:text-white/80"
                }`}
                style={isActive(item.href) ? { borderLeftColor: "#4f5ea7" } : undefined}
              >
                <span className={isActive(item.href) ? "text-white" : "text-white/50"}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback className="bg-white/10 text-xs text-white/70">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs text-white/70">{user?.email}</p>
            <Badge variant="outline" className="mt-1 border-white/20 text-[10px] text-white/50 uppercase tracking-widest">
              {roleLabel}
            </Badge>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-md p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
            title="Cerrar sesion"
          >
            <LogOut className="h-4 w-4" />
          </button>
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-5 rounded-md p-1 text-white/40 hover:text-white/70"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Sidebar - desktop */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-white/5 bg-zinc-950 lg:block">
        {sidebarContent}
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950/50 px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 text-white/50 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-xs font-medium uppercase tracking-widest text-white/40">
              Panel de Control
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-white/40 sm:inline">{user?.email}</span>
            <Badge
              variant="outline"
              className="border-white/20 text-[10px] uppercase tracking-widest"
              style={{ color: "#4f5ea7" }}
            >
              {roleLabel}
            </Badge>
            <button
              onClick={handleSignOut}
              className="rounded-md p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
              title="Cerrar sesion"
            >
              <LogOut className="h-4 w-4" />
            </button>
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
