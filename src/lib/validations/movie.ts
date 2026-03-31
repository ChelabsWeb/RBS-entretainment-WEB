import { z } from "zod";

export const movieSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio."),
  sinopsis: z.string().optional(),
  poster_url: z.string().optional(),
  estado_publicacion: z.enum(["borrador", "vip", "publicado", "archivado"], {
    message: "El estado de publicación es obligatorio.",
  }),
  fecha_anuncio_preventa: z.string().datetime({ offset: true }).optional(),
  fecha_preventa: z.string().datetime({ offset: true }).optional(),
  fecha_pre_estreno: z.string().datetime({ offset: true }).optional(),
  hora_pre_estreno: z.string().optional(),
  fecha_estreno: z.string().datetime({ offset: true }).optional(),
  calificacion: z.string().optional(),
  formato_version: z.string().optional(),
  duracion_minutos: z.number().positive("La duración debe ser positiva.").optional(),
  genero: z.string().optional(),
  anio: z.number().optional(),
  director: z.string().optional(),
  elenco: z.string().optional(),
  link_movie: z.string().optional(),
  link_life_cinemas: z.string().optional(),
  link_grupo_cine: z.string().optional(),
  link_cines_del_este: z.string().optional(),
  distributor: z.string().optional(),
  trailer_url: z.string().optional(),
  hero_image_url: z.string().optional(),
});

export type MovieFormValues = z.infer<typeof movieSchema>;
