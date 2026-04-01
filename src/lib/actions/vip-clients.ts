"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
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

  // Check if a soft-deleted record exists with this email — reactivate it
  const { data: deletedRecord } = await supabase
    .from("vip_clients")
    .select("id")
    .eq("email", parsed.data.email)
    .eq("is_deleted", true)
    .single();

  let data;

  if (deletedRecord) {
    const { data: reactivated, error: reactivateError } = await supabase
      .from("vip_clients")
      .update({
        ...parsed.data,
        is_deleted: false,
        is_suspended: false,
        created_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deletedRecord.id)
      .select()
      .single();

    if (reactivateError) {
      console.error("Error reactivating VIP client:", reactivateError);
      throw new Error("No se pudo reactivar el cliente VIP.");
    }
    data = reactivated;
  } else {
    const { data: created, error } = await supabase
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
    data = created;
  }

  await logAction(user.id, "CREATE", "vip_client", data.id, {
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
  });

  // Create auth account and send invite email via service role
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const serviceSupabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rbs-entretainment-web.vercel.app";
      const inviteOpts = {
        data: { nombre: data.nombre, apellido: data.apellido },
        redirectTo: `${siteUrl}/auth/callback?type=invite`,
      };

      let { error: inviteError } = await serviceSupabase.auth.admin.inviteUserByEmail(
        data.email,
        inviteOpts
      );

      // If user already exists in auth (e.g. previously deleted VIP), remove and retry
      if (inviteError?.message?.includes("already been registered")) {
        const { data: { users } } = await serviceSupabase.auth.admin.listUsers();
        const existing = users?.find((u) => u.email === data.email);
        if (existing) {
          await serviceSupabase.auth.admin.deleteUser(existing.id);
          const retry = await serviceSupabase.auth.admin.inviteUserByEmail(
            data.email,
            inviteOpts
          );
          inviteError = retry.error;
        }
      }

      if (inviteError) {
        console.error("VIP invite error:", inviteError.message, inviteError);
        throw new Error(`Cliente VIP creado, pero falló el envío de invitación: ${inviteError.message}`);
      }
    } catch (err) {
      console.error("VIP invite failed:", err);
      if (err instanceof Error && err.message.startsWith("Cliente VIP creado")) {
        throw err;
      }
      throw new Error("Cliente VIP creado, pero falló el envío de invitación.");
    }
  }

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

  // Also delete the auth user so the email can be re-used
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const serviceSupabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      const { data: { users } } = await serviceSupabase.auth.admin.listUsers();
      const existing = users?.find((u) => u.email === current.email);
      if (existing) {
        await serviceSupabase.auth.admin.deleteUser(existing.id);
      }
    } catch (err) {
      console.error("Failed to delete auth user (non-blocking):", err);
    }
  }

  await logAction(user.id, "DELETE", "vip_client", id, {
    nombre: current.nombre,
    apellido: current.apellido,
    email: current.email,
  });

  return { success: true };
}
