# Backlog — RBS Entertainment

## Alta prioridad

- [ ] Commitear todos los cambios pendientes antes de continuar desarrollo (CLAUDE.md confirma uncommitted changes)
- [ ] Conectar stat cards del `/dashboard` a queries reales de Supabase (Total Películas, Clientes VIP Activos, Acciones Recientes)
- [ ] Verificar que el formulario de ContactSection funcione end-to-end (no auditado)
- [ ] QA completo de responsividad mobile en todas las páginas públicas
- [ ] Configurar variables de entorno en Vercel y hacer deploy de staging

## Media prioridad

- [ ] Completar la página `/about` con contenido real o removerla del navbar
- [ ] Eliminar `lib/tmdb.ts` — ya no se usa, fue reemplazado por `lib/movies.ts`; también evaluar si `NEXT_PUBLIC_TMDB_API_KEY` puede eliminarse del `.env.local`
- [ ] Implementar respeto a `prefers-reduced-motion` en animaciones GSAP y Framer Motion (convención documentada en CLAUDE.md pero no aplicada)
- [ ] Auditar la página `/vip/movies/[id]` en detalle — existe pero no fue revisada en esta auditoría
- [ ] Revisar `/dashboard/vip/[id]` y `/dashboard/vip/new` — confirmar que flujo completo de alta/edición de clientes VIP funciona
- [ ] Auditar `/app/login/mfa-setup` y `/app/login/mfa-verify` — rutas de MFA existen pero no fueron inspeccionadas
- [ ] Revisar si `lib/supabase/middleware.ts` protege correctamente las rutas `/vip` y `/dashboard` contra usuarios no autenticados o sin rol
- [ ] Confirmar que `CustomScrollbar` (Framer Motion) y `SmoothScroll` (Lenis) no generan conflictos de scroll en mobile

## Baja prioridad

- [ ] Agregar metadata SEO real a páginas individuales (actualmente solo hay metadata global en `layout.tsx`)
- [ ] Reemplazar títulos hardcodeados en arrays de `page.tsx` por datos dinámicos de Supabase — actualmente los títulos de "En Cartel" y "Próximos Estrenos" están hardcodeados en el cliente
- [ ] Agregar favicon/icon real — `layout.tsx` referencia `/icon.png` pero no se verificó si el archivo existe en `public/`
- [ ] Revisar duplicación de reglas CSS en `globals.css` (líneas 158-159 y 162-163 tienen `@apply` duplicado)
- [ ] Agregar error boundaries en `/peliculas` para manejo de fallos de Supabase
- [ ] Revisar accesibilidad (aria labels, focus management) en modales y componentes interactivos
- [ ] Documentar el schema de Supabase (tablas: `movies`, `user_roles`, `vip_clients`, audit log) en el repo
