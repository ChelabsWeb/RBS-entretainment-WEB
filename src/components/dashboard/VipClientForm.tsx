"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

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
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const createdEmailRef = useRef("");

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
        createdEmailRef.current = data.email;
        const result = await createVipClient(data);
        if (result?._warning) {
          setWarning(result._warning);
        }
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/vip");
          router.refresh();
        }, 3000);
        return;
      } else {
        if (!defaultValues?.id) throw new Error("ID de cliente no encontrado.");
        await updateVipClient(defaultValues.id, data);
        router.push("/dashboard/vip");
        router.refresh();
      }
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
        {success && (
          <div className="flex flex-col items-center py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mb-4" />
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">
              Cliente VIP creado
            </h2>
            {warning ? (
              <>
                <p className="text-sm text-yellow-400 mb-1">{warning}</p>
                <p className="text-[11px] text-white/30 mt-4">
                  Redirigiendo a la lista de clientes...
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-white/50 mb-1">
                  Se envió una invitación a:
                </p>
                <p className="text-sm text-[#4f5ea7] font-bold">{createdEmailRef.current}</p>
                <p className="text-[11px] text-white/30 mt-4">
                  Redirigiendo a la lista de clientes...
                </p>
              </>
            )}
          </div>
        )}
        {!success && error && (
          <div className="mb-4 rounded-md border border-red-800 bg-red-950/50 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {!success && <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              className="bg-white text-black hover:bg-zinc-200 flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading
                ? "Creando..."
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
        </form>}
      </CardContent>
    </Card>
  );
}
