"use client";

import { useCallback, useEffect, useState } from "react";
import { getRoles, assignRole, removeRole } from "@/lib/actions/roles";
import { Loader2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestión de Roles</h1>
        <p className="text-white/40 text-sm mt-1">
          Administra los roles de los usuarios del sistema. Solo los super
          administradores pueden modificar roles.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="border border-white/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60">Email</TableHead>
              <TableHead className="text-white/60">Rol</TableHead>
              <TableHead className="text-white/60">Fecha de asignación</TableHead>
              <TableHead className="text-white/60 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-white/40" />
                  </div>
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={4} className="text-center py-8 text-white/40">
                  No hay usuarios con roles asignados.
                </TableCell>
              </TableRow>
            ) : (
              roles.map((ur) => (
                <TableRow
                  key={ur.userId}
                  className="border-white/10 hover:bg-white/[0.02]"
                >
                  <TableCell className="text-white">{ur.email}</TableCell>
                  <TableCell>
                    {ur.role === "super_admin" ? (
                      <Badge className="bg-red-500/20 text-red-400 border-0">
                        Super Admin
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500/20 text-blue-400 border-0">
                        Admin
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-white/40">
                    {new Date(ur.createdAt).toLocaleDateString("es-UY")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Select
                        value={ur.role}
                        disabled={actionLoading === ur.userId}
                        onValueChange={(value) =>
                          handleAssignRole(ur.userId, value as Role)
                        }
                      >
                        <SelectTrigger className="bg-black border-white/10 text-white w-[140px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10">
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={actionLoading === ur.userId}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                          >
                            {actionLoading === ur.userId ? "..." : "Eliminar rol"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black border-white/10">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Eliminar rol
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-white/60">
                              ¿Estás seguro de que deseas eliminar el rol de{" "}
                              {ur.email}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/10 text-white hover:bg-white/5">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleRemoveRole(ur.userId)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
