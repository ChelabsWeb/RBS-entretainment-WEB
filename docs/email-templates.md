# Email Templates para Supabase

Ve a **Supabase Dashboard → Authentication → Email Templates** y pega estos templates.

---

## 1. Invite User (Invitación VIP)

**Subject:** Has sido invitado al Portal VIP de RBS Entertainment

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#0a0a0a;border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              <img src="https://rbsentertainment.com.uy/assets/Logos/RBS%20logo%20color.png" alt="RBS Entertainment" width="140" style="display:block;margin:0 auto;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">
                Bienvenido al Portal VIP
              </h1>
              <p style="margin:0 0 24px;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.6;">
                Has sido invitado como exhibidor al portal exclusivo de RBS Entertainment. Accedé a información de películas, fechas de exhibición y material de distribución.
              </p>

              <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 32px;background-color:#4f5ea7;color:#ffffff;text-decoration:none;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:3px;border-radius:50px;">
                Activar mi cuenta
              </a>

              <p style="margin:24px 0 0;font-size:11px;color:rgba(255,255,255,0.3);line-height:1.6;">
                Al hacer click, podrás crear tu contraseña y acceder al portal de exhibidores.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;font-size:9px;color:rgba(255,255,255,0.15);text-transform:uppercase;letter-spacing:2px;">
                © 2026 RBS Entertainment Uruguay
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 2. Confirm Signup (Confirmación de registro)

**Subject:** Confirmá tu cuenta en RBS Entertainment

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#0a0a0a;border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;">

          <tr>
            <td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              <img src="https://rbsentertainment.com.uy/assets/Logos/RBS%20logo%20color.png" alt="RBS Entertainment" width="140" style="display:block;margin:0 auto;">
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">
                Confirmá tu cuenta
              </h1>
              <p style="margin:0 0 24px;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.6;">
                Hacé click en el botón de abajo para confirmar tu dirección de email y activar tu cuenta.
              </p>

              <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 32px;background-color:#4f5ea7;color:#ffffff;text-decoration:none;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:3px;border-radius:50px;">
                Confirmar email
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;font-size:9px;color:rgba(255,255,255,0.15);text-transform:uppercase;letter-spacing:2px;">
                © 2026 RBS Entertainment Uruguay
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 3. Reset Password (Recuperar contraseña)

**Subject:** Restablecé tu contraseña - RBS Entertainment

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#0a0a0a;border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;">

          <tr>
            <td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              <img src="https://rbsentertainment.com.uy/assets/Logos/RBS%20logo%20color.png" alt="RBS Entertainment" width="140" style="display:block;margin:0 auto;">
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">
                Restablecer contraseña
              </h1>
              <p style="margin:0 0 24px;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.6;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta. Hacé click en el botón para crear una nueva.
              </p>

              <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 32px;background-color:#4f5ea7;color:#ffffff;text-decoration:none;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:3px;border-radius:50px;">
                Nueva contraseña
              </a>

              <p style="margin:24px 0 0;font-size:11px;color:rgba(255,255,255,0.3);line-height:1.6;">
                Si no solicitaste este cambio, podés ignorar este email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;font-size:9px;color:rgba(255,255,255,0.15);text-transform:uppercase;letter-spacing:2px;">
                © 2026 RBS Entertainment Uruguay
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Instrucciones

1. Ir a [app.supabase.com](https://app.supabase.com) → tu proyecto RBS
2. **Authentication** → **Email Templates**
3. Para cada template (Invite, Confirm, Reset Password):
   - Pegar el **Subject**
   - Pegar el **HTML** en el editor
   - Click **Save**

La variable `{{ .ConfirmationURL }}` es reemplazada automáticamente por Supabase con el link correcto.
