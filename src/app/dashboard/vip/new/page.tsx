"use client";

import VipClientForm from "@/components/dashboard/VipClientForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewVipPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/vip"
        className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Clientes VIP
      </Link>
      <VipClientForm mode="create" />
    </div>
  );
}
