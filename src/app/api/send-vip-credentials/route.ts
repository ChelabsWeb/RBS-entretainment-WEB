import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  // Verify the user is authenticated and is an admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!roleData?.role) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { email, nombre, password, pdfBase64 } = await request.json();

  if (!email || !nombre || !password || !pdfBase64) {
    return NextResponse.json(
      { error: "Faltan datos requeridos" },
      { status: 400 }
    );
  }

  try {
    const { error } = await resend.emails.send({
      from: "RBS Entertainment <onboarding@resend.dev>",
      to: email,
      subject: "Tus credenciales de acceso — RBS Entertainment",
      html: `
        <div style="background-color:#0a0a0a;color:#ffffff;font-family:Helvetica,Arial,sans-serif;padding:40px 20px;max-width:500px;margin:0 auto;">
          <div style="text-align:center;margin-bottom:30px;">
            <h1 style="color:#c8aa50;font-size:24px;margin:0;">RBS ENTERTAINMENT</h1>
            <p style="color:#666;font-size:12px;letter-spacing:2px;margin-top:4px;">PORTAL DE EXHIBIDORES</p>
          </div>

          <div style="border-top:1px solid #333;padding-top:24px;">
            <p style="color:#999;font-size:14px;margin-bottom:20px;">
              Hola <strong style="color:#fff;">${nombre}</strong>, te damos la bienvenida al portal de exhibidores de RBS Entertainment.
            </p>

            <div style="background:#111;border:1px solid #222;border-radius:8px;padding:20px;margin:20px 0;">
              <p style="color:#888;font-size:11px;letter-spacing:1px;margin:0 0 6px;">USUARIO</p>
              <p style="color:#fff;font-size:16px;font-weight:bold;margin:0 0 16px;">${email}</p>

              <p style="color:#888;font-size:11px;letter-spacing:1px;margin:0 0 6px;">CONTRASEÑA</p>
              <p style="color:#c8aa50;font-size:18px;font-weight:bold;margin:0;">${password}</p>
            </div>

            <div style="text-align:center;margin:30px 0;">
              <a href="https://rbs-entretainment-web.vercel.app/login"
                 style="background:#c8aa50;color:#000;text-decoration:none;padding:12px 32px;border-radius:6px;font-weight:bold;font-size:14px;display:inline-block;">
                Ingresar al Portal
              </a>
            </div>

            <p style="color:#555;font-size:11px;margin-top:24px;">
              También encontrarás tus credenciales en el ticket PDF adjunto a este email.
            </p>
          </div>

          <div style="border-top:1px solid #222;margin-top:30px;padding-top:16px;text-align:center;">
            <p style="color:#444;font-size:10px;margin:0;">
              RBS Entertainment Uruguay — Portal de Exhibidores
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `VIP-${nombre.replace(/\s+/g, "-")}.pdf`,
          content: pdfBase64,
          contentType: "application/pdf",
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: `Error al enviar email: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email send failed:", err);
    return NextResponse.json(
      { error: "Error al enviar el email" },
      { status: 500 }
    );
  }
}
