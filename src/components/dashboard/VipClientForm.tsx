"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { CheckCircle, Download, Loader2, Eye, EyeOff } from "lucide-react";

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

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function generateCredentialsPDF(email: string, password: string, nombre: string) {
  const { jsPDF } = await import("jspdf");

  const W = 130;
  const H = 80;
  const pad = 12;
  // jsPDF format takes [height, width] in portrait — we use landscape to get W > H
  const doc = new jsPDF({ unit: "mm", format: [H, W], orientation: "landscape" });

  // Full black background
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, W, H, "F");

  // Load logo — natural ratio is ~2.5:1, so 28x11 keeps proportions
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      logoImg.onload = () => resolve();
      logoImg.onerror = () => reject();
      logoImg.src = "/assets/Logos/RBS logo color.png";
    });
    const logoW = 28;
    const logoH = logoW * (logoImg.naturalHeight / logoImg.naturalWidth);
    doc.addImage(logoImg, "PNG", pad, 7, logoW, logoH);
  } catch {
    doc.setTextColor(200, 170, 80);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("RBS", pad, 14);
  }

  // "Portal VIP" label — top right
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "normal");
  doc.text("PORTAL DE EXHIBIDORES", W - pad, 11, { align: "right" });

  // Divider
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.15);
  doc.line(pad, 24, W - pad, 24);

  // Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(nombre, pad, 32);

  // Email
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "normal");
  doc.text("USUARIO", pad, 40);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(email, pad, 45);

  // Password
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "normal");
  doc.text("CONTRASEÑA", pad, 54);
  doc.setTextColor(200, 170, 80);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(password, pad, 60);

  // Footer divider
  doc.setDrawColor(40, 40, 40);
  doc.line(pad, 68, W - pad, 68);

  // Footer URL
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.text("rbs-entretainment-web.vercel.app/login", pad, 73);

  doc.save(`VIP-${nombre.replace(/\s+/g, "-")}.pdf`);
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
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(generatePassword());
  const createdEmailRef = useRef("");
  const createdNameRef = useRef("");

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
        createdNameRef.current = `${data.nombre} ${data.apellido}`;
        const result = await createVipClient({ ...data, password });
        if (result?._warning) {
          setWarning(result._warning);
        }
        setLoading(false);
        setSuccess(true);
        // Auto-download PDF
        if (!result?._warning) {
          generateCredentialsPDF(data.email, password, createdNameRef.current);
        }
        setTimeout(() => {
          router.push("/dashboard/vip");
          router.refresh();
        }, 5000);
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
              <p className="text-sm text-yellow-400 mb-4">{warning}</p>
            ) : (
              <>
                <p className="text-sm text-white/50 mb-1">
                  Credenciales generadas para:
                </p>
                <p className="text-sm text-[#4f5ea7] font-bold mb-4">{createdEmailRef.current}</p>
                <Button
                  type="button"
                  onClick={() =>
                    generateCredentialsPDF(
                      createdEmailRef.current,
                      password,
                      createdNameRef.current
                    )
                  }
                  className="bg-white text-black hover:bg-zinc-200 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Descargar ticket PDF
                </Button>
              </>
            )}
            <p className="text-[11px] text-white/30 mt-4">
              Redirigiendo a la lista de clientes...
            </p>
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

          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                Contraseña de acceso
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-zinc-700 bg-zinc-900 text-white font-mono pr-10 focus-visible:ring-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  onClick={() => setPassword(generatePassword())}
                >
                  Generar
                </Button>
              </div>
              <p className="text-[11px] text-white/30">
                Se generará un ticket PDF con estas credenciales para enviar al cliente.
              </p>
            </div>
          )}

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
