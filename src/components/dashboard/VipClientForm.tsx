"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  vipClientSchema,
  type VipClientFormValues,
} from "@/lib/validations/vip-client";
import { createVipClient, updateVipClient } from "@/lib/actions/vip-clients";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VipClientFormProps {
  mode: "create" | "edit";
  defaultValues?: VipClientFormValues & { id?: string };
}

export default function VipClientForm({
  mode,
  defaultValues,
}: VipClientFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VipClientFormValues>({
    resolver: zodResolver(vipClientSchema),
    defaultValues: defaultValues ?? {
      nombre: "",
      apellido: "",
      email: "",
      empresa: "",
      cargo: "",
      telefono: "",
    },
  });

  const onSubmit = async (data: VipClientFormValues) => {
    setLoading(true);
    setError(null);

    try {
      if (mode === "create") {
        await createVipClient(data);
      } else {
        if (!defaultValues?.id) throw new Error("ID de cliente no encontrado.");
        await updateVipClient(defaultValues.id, data);
      }
      router.push("/dashboard/vip");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
    } finally {
      setLoading(false);
    }
  };

  const fields: {
    name: keyof VipClientFormValues;
    label: string;
    type?: string;
    placeholder: string;
  }[] = [
    { name: "nombre", label: "Nombre", placeholder: "Ej: Juan" },
    { name: "apellido", label: "Apellido", placeholder: "Ej: Pérez" },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Ej: juan@empresa.com",
    },
    { name: "empresa", label: "Empresa", placeholder: "Ej: Acme Corp" },
    { name: "cargo", label: "Cargo", placeholder: "Ej: Director Comercial" },
    {
      name: "telefono",
      label: "Teléfono",
      type: "tel",
      placeholder: "Ej: +598 99 123 456",
    },
  ];

  return (
    <Card className="mx-auto max-w-2xl border-zinc-800 bg-zinc-950">
      <CardHeader>
        <CardTitle className="text-xl text-white">
          {mode === "create"
            ? "Nuevo Cliente VIP"
            : "Editar Cliente VIP"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md border border-red-800 bg-red-950/50 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-zinc-300">
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600"
                  {...register(field.name)}
                />
                {errors[field.name] && (
                  <p className="text-sm text-red-400">
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-white text-black hover:bg-zinc-200"
            >
              {loading
                ? "Guardando..."
                : mode === "create"
                  ? "Crear Cliente"
                  : "Guardar Cambios"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              onClick={() => router.push("/dashboard/vip")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
