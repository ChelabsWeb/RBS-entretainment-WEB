"use client";

import { useCallback, useEffect, useState } from "react";
import { getRoles, assignRole, removeRole } from "@/lib/actions/roles";

type Role = "super_admin" | "admin";

interface UserRole {
  userId: string;
  role: Role;
  email: string;
  createdAt: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  async function handleAssignRole(userId: string, role: Role) {
    setActionLoading(userId);
    setError(null);
    try {
      await assignRole(userId, role);
      await fetchRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al asignar rol.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRemoveRole(userId: string) {
    if (!confirm("¿Estás seguro de que deseas eliminar el rol de este usuario?")) {
      return;
    }
    setActionLoading(userId);
    setError(null);
    try {
      await removeRole(userId);
      await fetchRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar rol.");
    } finally {
      setActionLoading(null);
    }
  }

  function roleBadge(role: Role) {
    const styles =
      role === "super_admin"
        ? "bg-red-500/10 text-red-400 border-red-500/20"
        : "bg-blue-500/10 text-blue-400 border-blue-500/20";
    const label = role === "super_admin" ? "Super Admin" : "Admin";
    return (
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}
      >
        {label}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-2">Gestión de Roles</h1>
      <p className="text-zinc-400 text-sm mb-6">
        Administra los roles de los usuarios del sistema. Solo los super
        administradores pueden modificar roles.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900 text-zinc-400 text-left">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Fecha de asignación</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  Cargando...
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  No hay usuarios con roles asignados.
                </td>
              </tr>
            ) : (
              roles.map((ur) => (
                <tr
                  key={ur.userId}
                  className="border-t border-zinc-800 hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-4 py-3 text-zinc-200">{ur.email}</td>
                  <td className="px-4 py-3">{roleBadge(ur.role)}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(ur.createdAt).toLocaleDateString("es-UY")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Role selector */}
                      <select
                        value={ur.role}
                        disabled={actionLoading === ur.userId}
                        onChange={(e) =>
                          handleAssignRole(ur.userId, e.target.value as Role)
                        }
                        className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-40"
                      >
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveRole(ur.userId)}
                        disabled={actionLoading === ur.userId}
                        className="px-3 py-1 text-xs rounded-md border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {actionLoading === ur.userId
                          ? "..."
                          : "Eliminar rol"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
