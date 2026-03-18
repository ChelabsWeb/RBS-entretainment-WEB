# Lessons Learned — RBS Entertainment

## [2026-03-17] — Auditoría inicial del codebase

### Arquitectura y decisiones de datos

- **Migración TMDB → Supabase completada pero con deuda técnica:** El proyecto arrancó usando TMDB como fuente de datos de películas. Se migró a Supabase correctamente en `lib/movies.ts`, pero `lib/tmdb.ts` quedó en el repo sin uso. Esto genera confusión (dos implementaciones del mismo contrato de funciones) y mantiene una variable de entorno pública de TMDB innecesaria. Cuando se migra una capa de datos, eliminar el archivo anterior en el mismo commit.

- **Títulos de películas hardcodeados en el cliente:** Las páginas `app/page.tsx` y `app/peliculas/page.tsx` tienen arrays de strings con títulos de películas escritos a mano. El componente los busca uno a uno contra Supabase en paralelo. Si un título cambia en la DB, el array del cliente queda desincronizado silenciosamente. La fuente de verdad debería estar 100% en Supabase.

- **Stat cards del dashboard sin datos reales:** El `/dashboard` muestra tres métricas clave (películas, clientes VIP, acciones recientes) con valor "--" hardcodeado. No es un placeholder temporal — el componente usa `useAuth` pero no hace ningún fetch. Esto es deuda funcional que puede afectar la presentación al cliente.

### Patrones y convenciones

- **`lib/movies.ts` hace casting peligroso:** La función `toMovie()` hace `m.id as unknown as number` para convertir un UUID de Supabase al tipo `number` que espera la interfaz legacy `Movie`. Esto rompe type safety silenciosamente. El tipo `Movie` debería haber sido actualizado para aceptar `string | number` en `id` durante la migración.

- **Convención de animaciones documentada pero no aplicada:** `CLAUDE.md` especifica que las animaciones deben respetar `prefers-reduced-motion`. Ninguno de los componentes auditados (`CustomScrollbar`, `SmoothScroll`, `Hero`) implementa esta verificación.

- **Duplicación de reglas CSS:** `globals.css` tiene dos líneas idénticas de `@apply border-border outline-ring/50` y dos de `@apply bg-background text-foreground` en el bloque `@layer base`. No causa problemas funcionales pero indica copy-paste no revisado.

### Stack y dependencias

- **Framer Motion y GSAP coexisten:** El proyecto tiene `framer-motion` (usado en `CustomScrollbar`) y `gsap` (declarado como dependencia) instalados simultáneamente. Usar dos librerías de animación añade peso al bundle. `framer-motion` está en uso activo; verificar si `gsap` se usa en otros componentes no auditados como `Hero` o `MovieCarousel` antes de evaluar consolidar.

- **`next-themes` instalado pero no usado:** El paquete está en `dependencies` pero el theming se implementa con un `ThemeContext` custom (`context/ThemeContext.tsx`). Deuda de dependencia.

- **`framer-motion` en `CustomScrollbar` con patrón correcto:** El componente usa `useState` + `useEffect` para montar solo en cliente (evita hidratación mismatch). Buen patrón a replicar en otros componentes client-only.

### Auth y seguridad

- **MFA implementado correctamente:** El login verifica `aal2` antes de redirigir al dashboard. El middleware protege `/dashboard/:path*` y `/vip/:path*`. Arquitectura de seguridad sólida.

- **Roles con dos niveles (admin / super_admin):** El `useRole` hook diferencia correctamente. Las secciones de auditoría y roles del dashboard solo son visibles para `super_admin`. Patrón limpio.
