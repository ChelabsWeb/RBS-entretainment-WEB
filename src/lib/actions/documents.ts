"use server";

import { createClient } from "@/lib/supabase/server";
import { logAction } from "@/lib/actions/audit";

export async function getDocuments(movieId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("movie_documents")
    .select("*")
    .eq("movie_id", movieId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error);
    throw new Error("No se pudieron obtener los documentos.");
  }

  return data ?? [];
}

export async function uploadDocument(movieId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado.");

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    throw new Error("No se proporcionó un archivo.");
  }

  const ext = file.name.split(".").pop();
  const storagePath = `${movieId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("movie-documents")
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading document:", uploadError);
    throw new Error("No se pudo subir el documento.");
  }

  const { data, error } = await supabase
    .from("movie_documents")
    .insert({
      movie_id: movieId,
      file_name: file.name,
      file_url: storagePath,
      file_type: file.type,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving document metadata:", error);
    throw new Error("No se pudo guardar la información del documento.");
  }

  await logAction(user.id, "subir_documento", "movie_document", data.id, {
    movie_id: movieId,
    file_name: file.name,
  });

  return { data };
}

export async function deleteDocument(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado.");

  // Get document info first
  const { data: doc, error: fetchError } = await supabase
    .from("movie_documents")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !doc) {
    throw new Error("No se encontró el documento.");
  }

  // Remove file from storage
  const { error: storageError } = await supabase.storage
    .from("movie-documents")
    .remove([doc.file_url]);

  if (storageError) {
    console.error("Error removing file from storage:", storageError);
    throw new Error("No se pudo eliminar el archivo del almacenamiento.");
  }

  // Delete metadata row
  const { error: deleteError } = await supabase
    .from("movie_documents")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Error deleting document record:", deleteError);
    throw new Error("No se pudo eliminar el registro del documento.");
  }

  await logAction(user.id, "eliminar_documento", "movie_document", id, {
    movie_id: doc.movie_id,
    file_name: doc.file_name,
  });

  return { success: true };
}

export async function getDocumentDownloadUrl(id: string) {
  const supabase = await createClient();

  const { data: doc, error: fetchError } = await supabase
    .from("movie_documents")
    .select("file_url, file_name")
    .eq("id", id)
    .single();

  if (fetchError || !doc) {
    throw new Error("No se encontró el documento.");
  }

  const { data, error } = await supabase.storage
    .from("movie-documents")
    .createSignedUrl(doc.file_url, 60);

  if (error) {
    console.error("Error creating signed URL:", error);
    throw new Error("No se pudo generar el enlace de descarga.");
  }

  return { url: data.signedUrl, fileName: doc.file_name };
}
