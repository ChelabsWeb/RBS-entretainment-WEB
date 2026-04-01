# Manual de Administración — RBS Entertainment

## Acceso al Panel

1. Ir a la URL del sitio + `/login`
2. Ingresar con las credenciales de administrador
3. Se redirige automáticamente al **Dashboard**

---

## Dashboard

La pantalla principal muestra:
- **Total de películas** en el catálogo
- **Clientes VIP activos**
- **Acciones recientes** (últimas 24h)

### Navegación (Sidebar)

| Sección | Descripción |
|---------|-------------|
| **Dashboard** | Pantalla principal con estadísticas |
| **Películas** | Gestión del catálogo de películas |
| **Clientes VIP** | Gestión de exhibidores |
| **Portal VIP** | Vista previa del portal tal como lo ven los exhibidores |
| **Roles** | Gestión de roles de usuario (solo Super Admin) |
| **Auditoría** | Registro de todas las acciones (solo Super Admin) |
| **Ver Sitio Web** | Abre la landing pública en pestaña nueva |

---

## Películas

### Crear una película

1. Ir a **Películas** → click en **"Nueva Película"**
2. Completar los campos:

| Campo | Descripción | Obligatorio |
|-------|-------------|:-----------:|
| Título | Nombre de la película | Sí |
| Director | Buscar por nombre (autocompletado con fotos de TMDB) | No |
| Sinopsis | Descripción de la trama | No |
| Elenco | Buscar actores (multi-select con fotos de TMDB) | No |
| Género | Ej: Acción, Comedia, Drama | No |
| Año | Año de estreno | No |
| Duración | En minutos | No |
| Calificación | ATP, +13, +16, etc. | No |
| Formato | 2D, 3D, IMAX, Subtitulado | No |
| Estado | Borrador, Vista VIP, Publicado, Archivado | Sí |

3. **Fechas de exhibición:**
   - Fecha anuncio preventa
   - Fecha preventa
   - Fecha pre-estreno + hora
   - Fecha estreno

4. **Links de entradas** por cine:
   - Movie, Life Cinemas, Grupo Cine, Cines del Este

5. **Distribuidor:** Seleccionar de la lista (Disney, Universal, Paramount, Lucasfilm, etc.)

6. **Póster:** Subir imagen (JPG, PNG, WebP). Recomendado: 400x600px

7. **Imagen Hero:** Imagen panorámica para la portada. Recomendado: 1920x1080px

8. **Trailer:** Pegar link completo de YouTube

9. Click **"Crear Película"**

### Estados de publicación

| Estado | Dónde se ve |
|--------|-------------|
| **Borrador** | Solo en el dashboard (no visible al público ni VIP) |
| **Vista VIP** | Visible en el Portal VIP + dashboard |
| **Publicado** | Visible en el sitio público + Portal VIP + dashboard |
| **Archivado** | No visible en ningún lado (se puede recuperar) |

### Editar una película

1. Ir a **Películas** → click en **"Editar"** en la fila de la película
2. Modificar los campos necesarios
3. Click **"Guardar Cambios"**

### Documentos

En la edición de una película, la pestaña **"Documentos"** permite:
- Subir archivos (PDF, imágenes, etc.) de hasta **10 MB**
- Ver documentos existentes
- Eliminar documentos

Los documentos son visibles para los exhibidores en el Portal VIP.

### Archivar una película

1. En la lista de películas, click en **"Archivar"**
2. Confirmar en el diálogo
3. La película deja de aparecer en todos los portales

---

## Clientes VIP (Exhibidores)

### Crear un cliente VIP

1. Ir a **Clientes VIP** → click en **"Nuevo Cliente VIP"**
2. Completar: Nombre, Apellido, Email, Empresa, Cargo, Teléfono
3. Click **"Crear Cliente"**

**Al crear el cliente:**
- Se crea automáticamente una cuenta de acceso
- Se envía un **email de invitación** al exhibidor
- El exhibidor recibe el mail, hace click, y crea su contraseña
- Con esa contraseña accede al Portal VIP

### Suspender / Reactivar

- Click en el ícono de escudo en la fila del cliente
- Un cliente suspendido no puede acceder al Portal VIP

### Eliminar

- Click en el ícono de papelera → confirmar
- La eliminación es lógica (no se borra de la base de datos)

---

## Portal VIP (Vista Admin)

Desde **"Portal VIP"** en la sidebar, el admin puede ver exactamente lo que ven los exhibidores:
- Películas agrupadas por distribuidor en carruseles
- Click en una película para ver los detalles de exhibición
- Todo dentro del layout del dashboard (no se pierde la navegación)

---

## Búsqueda de Director y Elenco

Al crear o editar una película:
- **Director:** Escribir el nombre → aparece un dropdown con resultados de TMDB incluyendo foto y departamento. Click para seleccionar.
- **Elenco:** Mismo sistema pero multi-select. Cada actor aparece como un tag que se puede eliminar.

Las fotos del elenco se muestran automáticamente en:
- El popup de la película (sitio público)
- La página de detalle (Portal VIP)

---

## Gestión de Roles (Solo Super Admin)

- Ver todos los usuarios con roles asignados
- Cambiar el rol de un usuario (Admin ↔ Super Admin)
- Eliminar el rol de un usuario

**Nota:** Las cuentas de Chelabs no son visibles para los admins de RBS.

---

## Recuperación de Contraseña

Si un admin o VIP olvida su contraseña:
1. En la pantalla de login → click **"Problemas para ingresar?"**
2. Ingresar el email → click **"Enviar link de recuperación"**
3. Revisar el email (y spam)
4. Click en el link → crear nueva contraseña
5. Se redirige automáticamente al portal

---

## Preguntas Frecuentes

**¿Por qué no veo el logo del distribuidor en el hero?**
El distribuidor debe estar seleccionado de la lista al crear/editar la película. Si se escribe manualmente un nombre que no coincide con las opciones, no se muestra el logo.

**¿Cuánto tarda en reflejarse un cambio?**
Los cambios son inmediatos. Si no se ven, hacer Ctrl+Shift+R (hard refresh).

**¿Puedo subir cualquier formato de imagen?**
Sí: JPG, PNG, WebP. Tamaño máximo: 10 MB.

**¿Qué pasa si archivó una película por error?**
Contactar a Chelabs para recuperarla. Las películas archivadas no se eliminan.

**¿Cómo sé si un VIP aceptó la invitación?**
Verificar en Supabase Dashboard → Authentication → Users si el usuario confirmó su email.
