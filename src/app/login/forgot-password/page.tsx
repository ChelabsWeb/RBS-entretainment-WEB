import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black">
      <Card className="w-full max-w-md border-white/10 bg-white/[0.02] shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-white">
            Recuperar Acceso
          </CardTitle>
          <CardDescription className="text-white/40 text-xs uppercase tracking-widest mt-2">
            Soporte RBS Entertainment
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="rounded-md border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-white/70 text-sm leading-relaxed">
              Para restablecer tu contrasena, contacta al equipo de soporte de
              RBS Entertainment. Por razones de seguridad, el restablecimiento
              de credenciales se realiza de forma manual.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-white/40 font-bold">
              Canales de contacto
            </p>

            <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-4 py-3">
              <Mail className="h-4 w-4 text-[#4f5ea7] shrink-0" />
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  Email
                </p>
                <p className="text-sm text-white">
                  soporte@rbsentertainment.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-4 py-3">
              <Phone className="h-4 w-4 text-[#4f5ea7] shrink-0" />
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  Telefono
                </p>
                <p className="text-sm text-white">+598 2XXX XXXX</p>
              </div>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="w-full h-11 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white font-black uppercase tracking-widest text-xs"
          >
            <Link href="/login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio de sesion
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
