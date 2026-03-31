"use server";

import { createClient } from "@/lib/supabase/server";
import { logAction } from "./audit";

async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autenticado.");
  }

  const { data: role } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!role || role.role !== "super_admin") {
    throw new Error("No tienes permisos de super administrador.");
  }

  return user;
}

// Chelabs super admin is hidden from regular admins
const HIDDEN_EMAILS = ["superadmin@chelabs.com", "chelabsweb@gmail.com"];

export async function getRoles() {
  const supabase = await createClient();

  // Check if current user is super_admin
  const { data: { user } } = await supabase.auth.getUser();
  const { data: currentRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user?.id ?? "")
    .single();

  const isSuperAdmin = currentRole?.role === "super_admin";

  const { data, error } = await supabase
    .from("user_roles")
    .select("user_id, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching roles:", error);
    throw new Error("No se pudieron obtener los roles.");
  }

  const userIds = (data ?? []).map((r) => r.user_id);

  if (userIds.length === 0) {
    return [];
  }

  // Fetch emails via RPC (replaces old user_profiles view)
  const { data: profiles } = await supabase.rpc("get_user_profiles", {
    p_user_ids: userIds,
  });

  const emailMap = new Map<string, string>();
  if (profiles) {
    for (const p of profiles as { id: string; email: string }[]) {
      emailMap.set(p.id, p.email);
    }
  }

  return (data ?? []).map((r) => ({
    userId: r.user_id,
    role: r.role as "super_admin" | "admin",
    email: emailMap.get(r.user_id) ?? r.user_id,
    createdAt: r.created_at,
  })).filter((r) => {
    // Hide Chelabs super admins from regular admins
    if (!isSuperAdmin && HIDDEN_EMAILS.includes(r.email)) return false;
    return true;
  });
}

export async function assignRole(
  userId: string,
  role: "super_admin" | "admin"
) {
  const currentUser = await requireSuperAdmin();
  const supabase = await createClient();

  // Prevent modifying Chelabs super admin accounts
  const { data: targetProfile } = await supabase.rpc("get_user_profiles", {
    p_user_ids: [userId],
  });
  const targetEmail = (targetProfile as { id: string; email: string }[] | null)?.[0]?.email;
  if (targetEmail && HIDDEN_EMAILS.includes(targetEmail)) {
    throw new Error("No se puede modificar este usuario.");
  }

  const { error } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role }, { onConflict: "user_id" });

  if (error) {
    console.error("Error assigning role:", error);
    throw new Error("No se pudo asignar el rol.");
  }

  await logAction(currentUser.id, "assign_role", "user_role", userId, {
    role,
    assigned_by: currentUser.id,
  });
}

export async function removeRole(userId: string) {
  const currentUser = await requireSuperAdmin();
  const supabase = await createClient();

  // Prevent removing Chelabs super admin accounts
  const { data: targetProfile } = await supabase.rpc("get_user_profiles", {
    p_user_ids: [userId],
  });
  const targetEmail = (targetProfile as { id: string; email: string }[] | null)?.[0]?.email;
  if (targetEmail && HIDDEN_EMAILS.includes(targetEmail)) {
    throw new Error("No se puede eliminar este usuario.");
  }

  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Error removing role:", error);
    throw new Error("No se pudo eliminar el rol.");
  }

  await logAction(currentUser.id, "remove_role", "user_role", userId, {
    removed_by: currentUser.id,
  });
}
