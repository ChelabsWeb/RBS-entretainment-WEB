"use server";

import { createClient } from "@/lib/supabase/server";

export async function logAction(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  details?: Record<string, unknown>
) {
  const supabase = await createClient();

  const { error } = await supabase.from("audit_log").insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details: details ?? null,
  });

  if (error) {
    console.error("Error logging audit action:", error);
    throw new Error("No se pudo registrar la acción en el log de auditoría.");
  }
}

export async function getAuditLog(
  options?: {
    page?: number;
    limit?: number;
    entityType?: string;
    userId?: string;
  }
) {
  const supabase = await createClient();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("audit_log")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (options?.entityType) {
    query = query.eq("entity_type", options.entityType);
  }

  if (options?.userId) {
    query = query.eq("user_id", options.userId);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching audit log:", error);
    throw new Error("No se pudo obtener el log de auditoría.");
  }

  return { data: data ?? [], count: count ?? 0 };
}
