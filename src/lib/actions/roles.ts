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

export async function getRoles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_roles")
    .select("user_id, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching roles:", error);
    throw new Error("No se pudieron obtener los roles.");
  }

  // Fetch user emails from auth.users via admin or a profiles view
  const userIds = (data ?? []).map((r) => r.user_id);

  if (userIds.length === 0) {
    return [];
  }

  // Try to get emails from a profiles/users view that exposes email
  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("id, email")
    .in("id", userIds);

  const emailMap = new Map<string, string>();
  if (profiles) {
    for (const p of profiles) {
      emailMap.set(p.id, p.email);
    }
  }

  return (data ?? []).map((r) => ({
    userId: r.user_id,
    role: r.role as "super_admin" | "admin",
    email: emailMap.get(r.user_id) ?? r.user_id,
    createdAt: r.created_at,
  }));
}

export async function assignRole(
  userId: string,
  role: "super_admin" | "admin"
) {
  const currentUser = await requireSuperAdmin();
  const supabase = await createClient();

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
