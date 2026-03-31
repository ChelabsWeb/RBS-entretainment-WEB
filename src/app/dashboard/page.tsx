"use client";

import { useEffect, useState } from "react";
import { Film, Users, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const { user } = useAuth();
  const [movieCount, setMovieCount] = useState<number | null>(null);
  const [vipCount, setVipCount] = useState<number | null>(null);
  const [auditCount, setAuditCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient();

      const [moviesRes, vipRes, auditRes] = await Promise.all([
        supabase
          .from("movies")
          .select("*", { count: "exact", head: true })
          .neq("estado_publicacion", "archivado"),
        supabase
          .from("vip_clients")
          .select("*", { count: "exact", head: true })
          .eq("is_deleted", false)
          .eq("is_suspended", false),
        supabase
          .from("audit_log")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      ]);

      setMovieCount(moviesRes.count ?? 0);
      setVipCount(vipRes.count ?? 0);
      setAuditCount(auditRes.count ?? 0);
    }

    loadStats();
  }, []);

  const statCards = [
    {
      title: "Total Peliculas",
      value: movieCount !== null ? String(movieCount) : "...",
      description: "Peliculas en catalogo",
      icon: <Film className="h-5 w-5" />,
    },
    {
      title: "Clientes VIP Activos",
      value: vipCount !== null ? String(vipCount) : "...",
      description: "Clientes registrados",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Acciones Recientes",
      value: auditCount !== null ? String(auditCount) : "...",
      description: "Ultimas 24 horas",
      icon: <ClipboardList className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Panel de Administracion
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Bienvenido, {user?.email ?? "administrador"}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card
            key={card.title}
            className="border border-white/10 bg-white/[0.02] shadow-none"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-white/50">
                {card.title}
              </CardTitle>
              <span className="text-white/30">{card.icon}</span>
            </CardHeader>
            <CardContent>
              <p
                className="text-4xl font-black tracking-tighter"
                style={{ color: "#4f5ea7" }}
              >
                {card.value}
              </p>
              <p className="mt-1 text-xs text-white/30">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
