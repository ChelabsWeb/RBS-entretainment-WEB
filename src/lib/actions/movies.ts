"use server";

import { createClient } from "@/lib/supabase/server";
import { logAction } from "@/lib/actions/audit";
import { movieSchema } from "@/lib/validations/movie";

export async function getMovies(options?: {
  page?: number;
  limit?: number;
  search?: string;
  estado?: string;
}) {
  const supabase = await createClient();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("movies")
    .select("*", { count: "exact" })
    .neq("estado_publicacion", "archivado")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (options?.search) {
    query = query.ilike("titulo", `%${options.search}%`);
  }

  if (options?.estado) {
    query = query.eq("estado_publicacion", options.estado);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching movies:", error);
    throw new Error("No se pudieron obtener las películas.");
  }

  return { data: data ?? [], count: count ?? 0 };
}

export async function getMovie(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching movie:", error);
    throw new Error("No se pudo obtener la película.");
  }

  return data;
}

export async function createMovie(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado.");

  // Parse fields from FormData
  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "poster" || key === "hero_image") continue;
    if (key === "duracion_minutos" || key === "anio") {
      raw[key] = value ? Number(value) : undefined;
    } else {
      raw[key] = value === "" ? undefined : value;
    }
  }

  const parsed = movieSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Upload poster if provided
  let posterUrl: string | undefined;
  const posterFile = formData.get("poster") as File | null;
  if (posterFile && posterFile.size > 0) {
    const ext = posterFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("movie-posters")
      .upload(fileName, posterFile, {
        contentType: posterFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading poster:", uploadError);
      throw new Error("No se pudo subir el póster.");
    }

    const { data: publicUrlData } = supabase.storage
      .from("movie-posters")
      .getPublicUrl(fileName);

    posterUrl = publicUrlData.publicUrl;
  }

  // Upload hero image if provided
  let heroImageUrl: string | undefined;
  const heroFile = formData.get("hero_image") as File | null;
  if (heroFile && heroFile.size > 0) {
    const ext = heroFile.name.split(".").pop();
    const fileName = `hero_${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("movie-posters")
      .upload(fileName, heroFile, {
        contentType: heroFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading hero image:", uploadError);
      throw new Error("No se pudo subir la imagen hero.");
    }

    const { data: publicUrlData } = supabase.storage
      .from("movie-posters")
      .getPublicUrl(fileName);

    heroImageUrl = publicUrlData.publicUrl;
  }

  const insertData = {
    ...parsed.data,
    poster_url: posterUrl ?? parsed.data.poster_url ?? null,
    hero_image_url: heroImageUrl ?? parsed.data.hero_image_url ?? null,
    created_by: user.id,
  };

  const { data, error } = await supabase
    .from("movies")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("Error creating movie:", error);
    throw new Error("No se pudo crear la película.");
  }

  await logAction(user.id, "crear", "movie", data.id, {
    titulo: data.titulo,
  });

  return { data };
}

export async function updateMovie(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado.");

  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "poster" || key === "hero_image") continue;
    if (key === "duracion_minutos" || key === "anio") {
      raw[key] = value ? Number(value) : undefined;
    } else {
      raw[key] = value === "" ? undefined : value;
    }
  }

  const parsed = movieSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Handle poster change
  let posterUrl: string | undefined;
  const posterFile = formData.get("poster") as File | null;
  if (posterFile && posterFile.size > 0) {
    const ext = posterFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("movie-posters")
      .upload(fileName, posterFile, {
        contentType: posterFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading poster:", uploadError);
      throw new Error("No se pudo subir el póster.");
    }

    const { data: publicUrlData } = supabase.storage
      .from("movie-posters")
      .getPublicUrl(fileName);

    posterUrl = publicUrlData.publicUrl;
  }

  // Handle hero image change
  let heroImageUrl: string | undefined;
  const heroFile = formData.get("hero_image") as File | null;
  if (heroFile && heroFile.size > 0) {
    const ext = heroFile.name.split(".").pop();
    const fileName = `hero_${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("movie-posters")
      .upload(fileName, heroFile, {
        contentType: heroFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading hero image:", uploadError);
      throw new Error("No se pudo subir la imagen hero.");
    }

    const { data: publicUrlData } = supabase.storage
      .from("movie-posters")
      .getPublicUrl(fileName);

    heroImageUrl = publicUrlData.publicUrl;
  }

  const updateData: Record<string, unknown> = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  };

  if (posterUrl) {
    updateData.poster_url = posterUrl;
  }

  if (heroImageUrl) {
    updateData.hero_image_url = heroImageUrl;
  }

  const { data, error } = await supabase
    .from("movies")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating movie:", error);
    throw new Error("No se pudo actualizar la película.");
  }

  await logAction(user.id, "actualizar", "movie", id, {
    titulo: data.titulo,
  });

  return { data };
}

export async function deleteMovie(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado.");

  const { data, error } = await supabase
    .from("movies")
    .update({
      estado_publicacion: "archivado",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error archiving movie:", error);
    throw new Error("No se pudo archivar la película.");
  }

  await logAction(user.id, "archivar", "movie", id, {
    titulo: data.titulo,
  });

  return { data };
}
