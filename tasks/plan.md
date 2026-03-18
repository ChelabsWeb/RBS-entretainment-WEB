# Plan — RBS Entertainment
_Última actualización: 2026-03-17_

## Estado actual

El proyecto está en fase de polish final. La arquitectura está completa: landing pública, sección de películas con carrusel, portal VIP para exhibidores (autenticado vía Supabase + MFA), y dashboard de administración con CRUD de películas, gestión de clientes VIP, roles, y log de auditoría.

**Páginas públicas:**
- `/` — Home completo: Hero, MovieGrid, CinesSection, PartnerMarquee, ContactSection, Footer
- `/peliculas` — Página de películas con carrusel, búsqueda y modal de detalle (funcional)
- `/licensing` — Página de licencias con LicensesSection (funcional)
- `/about` — Placeholder "En Construcción" (incompleto)
- `/contact` — Existe la ruta, no auditada en detalle

**Portal autenticado:**
- `/login` — Login con MFA (aal2) implementado, incluye forgot-password, mfa-setup, mfa-verify
- `/vip` — Catálogo de películas para exhibidores, conectado a Supabase (funcional)
- `/vip/movies/[id]` — Detalle de película VIP (existe, no auditado en detalle)
- `/dashboard` — Panel con stat cards hardcodeadas en "--" (sin datos reales conectados)
- `/dashboard/movies` — CRUD completo: listado, nuevo, editar, archivar
- `/dashboard/vip` — Gestión de clientes VIP con formulario
- `/dashboard/roles` — Gestión de roles (super_admin only)
- `/dashboard/audit` — Log de auditoría paginado (super_admin only)

**Datos de películas:**
- La landing y `/peliculas` usan títulos hardcodeados en arrays dentro de los componentes, buscándolos contra Supabase por nombre. Si un título no está en la DB, el componente lo ignora silenciosamente.
- El portal VIP lee directamente de Supabase (correcto).
- `lib/tmdb.ts` existe pero ya no se usa — fue reemplazado por `lib/movies.ts` que apunta a Supabase.

**Cambios sin commitear:** Confirmado por CLAUDE.md. Estado de Git desconocido sin ejecutar comandos.

## Próximos pasos (ordenados por prioridad)

1. **Revisar y commitear cambios pendientes** — Hacer `git status` + `git diff` y crear un commit limpio antes de cualquier toque adicional.
2. **Conectar stat cards del dashboard a datos reales** — Las 3 tarjetas del `/dashboard` muestran "--". Requiere queries a Supabase para contar películas, clientes VIP y acciones de auditoría recientes.
3. **Completar o eliminar la página `/about`** — Actualmente muestra "En Construcción". Definir con el cliente si va con contenido real o se elimina del nav.
4. **Auditar `/contact`** — La página existe como ruta pero no fue inspeccionada. Verificar que el formulario de ContactSection funcione y envíe correctamente.
5. **Eliminar o desacoplar `lib/tmdb.ts`** — El archivo existe con la API key de TMDB como variable de entorno pública (`NEXT_PUBLIC_TMDB_API_KEY`), pero ya no se usa. Riesgo de confusión y posible variable de entorno innecesaria.
6. **QA de responsividad mobile** — Pasar por todas las páginas en móvil, especialmente el Hero, MovieCarousel, y el dashboard.
7. **Configurar `prefers-reduced-motion`** — Convención en CLAUDE.md no implementada: las animaciones GSAP/Framer Motion no respetan esta preferencia de accesibilidad.
8. **Deployment a Vercel** — Configurar variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) y hacer deploy.
9. **Sign-off del cliente** — Presentación final y aprobación antes de publicar.
