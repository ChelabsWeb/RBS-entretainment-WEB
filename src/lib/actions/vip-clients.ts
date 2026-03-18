"use server";

import { createClient } from "@/lib/supabase/server";
import { logAction } from "@/lib/actions/audit";
import { vipClientSchema } from "@/lib/validations/vip-client";
import type { VipClientFormValues } from "@/lib/validations/vip-client";

export async function getVipClients(options?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const supabase = await createClient();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("vip_clients")
    .select("*", { count: "exact" })
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (options?.search) {
    const search = `%${options.search}%`;
    query = query.or(
      `nombre.ilike.${search},apellido.ilike.${search},email.ilike.${search},empresa.ilike.${search}`
    );
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching VIP clients:", error);
    throw new Error("No se pudieron obtener los clientes VIP.");
  }

  return { data: data ?? [], count: count ?? 0 };
}

export async function getVipClient(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vip_clients")
    .select("*")
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (error) {
    console.error("Error fetching VIP client:", error);
    throw new Error("No se pudo obtener el cliente VIP.");
  }

  return data;
}

export async function createVipClient(formData: VipClientFormValues) {
  const parsed = vipClientSchema.safeParse(formData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado.");

  const { data, error } = await supabase
    .from("vip_clients")
    .insert({
      ...parsed.data,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating VIP client:", error);
    if (error.code === "23505") {
      throw new Error("Ya existe un cliente VIP con ese email.");
    }
    throw new Error("No se pudo crear el cliente VIP.");
  }

  await logAction(user.id, "CREATE", "vip_client", data.id, {
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
  });

  return data;
}

export async function updateVipClient(
  id: string,
  formData: VipClientFormValues
) {
  const parsed = vipClientSchema.safeParse(formData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado.");

  const { data, error } = await supabase
    .from("vip_clients")
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("is_deleted", false)
    .select()
    .single();

  if (error) {
    console.error("Error updating VIP client:", error);
    if (error.code === "23505") {
      throw new Error("Ya existe un cliente VIP con ese email.");
    }
    throw new Error("No se pudo actualizar el cliente VIP.");
  }

  await logAction(user.id, "UPDATE", "vip_client", id, {
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
  });

  return data;
}

export async function suspendVipClient(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado.");

  // Get current state to toggle
  const { data: current, error: fetchError } = await supabase
    .from("vip_clients")
    .select("is_suspended, nombre, apellido")
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (fetchError || !current) {
    throw new Error("No se pudo obtener el estado del cliente VIP.");
  }

  const newState = !current.is_suspended;

  const { error } = await supabase
    .from("vip_clients")
    .update({
      is_suspended: newState,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error toggling VIP client suspension:", error);
    throw new Error("No se pudo cambiar el estado del cliente VIP.");
  }

  await logAction(
    user.id,
    newState ? "SUSPEND" : "REACTIVATE",
    "vip_client",
    id,
    {
      nombre: current.nombre,
      apellido: current.apellido,
      is_suspended: newState,
    }
  );

  return { is_suspended: newState };
}

export async function deleteVipClient(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado.");

  const { data: current, error: fetchError } = await supabase
    .from("vip_clients")
    .select("nombre, apellido, email")
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (fetchError || !current) {
    throw new Error("No se pudo encontrar el cliente VIP.");
  }

  const { error } = await supabase
    .from("vip_clients")
    .update({
      is_deleted: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error deleting VIP client:", error);
    throw new Error("No se pudo eliminar el cliente VIP.");
  }

  await logAction(user.id, "DELETE", "vip_client", id, {
    nombre: current.nombre,
    apellido: current.apellido,
    email: current.email,
  });

  return { success: true };
}
