"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { getVipClient } from "@/lib/actions/vip-clients";
import VipClientForm from "@/components/dashboard/VipClientForm";
import type { VipClientFormValues } from "@/lib/validations/vip-client";

export default function EditVipPage() {
  const params = useParams();
  const id = params.id as string;

  const [client, setClient] = useState<
    (VipClientFormValues & { id: string }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getVipClient(id);
        setClient({
          id: data.id,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          empresa: data.empresa,
          cargo: data.cargo,
          telefono: data.telefono,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo cargar el cliente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white lg:text-4xl">
          Editar Cliente VIP
        </h1>
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error ?? "No se encontro el cliente."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/vip"
        className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Clientes VIP
      </Link>
      <VipClientForm mode="edit" defaultValues={client} />
    </div>
  );
}
