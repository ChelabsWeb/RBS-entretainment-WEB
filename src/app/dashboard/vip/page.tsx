"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ShieldBan,
  ShieldCheck,
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getVipClients,
  suspendVipClient,
  deleteVipClient,
} from "@/lib/actions/vip-clients";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface VipClient {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  empresa: string;
  cargo: string;
  telefono: string;
  is_suspended: boolean;
  is_deleted: boolean;
  created_at: string;
}

const LIMIT = 10;

export default function VipPage() {
  const router = useRouter();
  const [clients, setClients] = useState<VipClient[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(count / LIMIT));

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getVipClients({ page, limit: LIMIT, search });
      setClients(result.data);
      setCount(result.count);
    } catch (err) {
      console.error("Error loading VIP clients:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuspend = async (id: string) => {
    setActionLoading(id);
    try {
      await suspendVipClient(id);
      await fetchClients();
    } catch (err) {
      console.error("Error toggling suspend:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await deleteVipClient(id);
      await fetchClients();
    } catch (err) {
      console.error("Error deleting client:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white lg:text-4xl">
          Clientes VIP
        </h1>
        <Link href="/dashboard/vip/new">
          <Button
            className="bg-[#4f5ea7] hover:bg-[#4f5ea7]/80 text-white uppercase tracking-widest transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente VIP
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input
            placeholder="Buscar por nombre, email o empresa..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-white/10 bg-white/[0.03] pl-10 text-white placeholder:text-white/20 focus-visible:border-[#4f5ea7] focus-visible:ring-[#4f5ea7]/30"
          />
        </div>
        <Button
          variant="outline"
          onClick={handleSearch}
          className="border-white/10 uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          Buscar
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-white/10 bg-white/[0.02]">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-white/30" />
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Users className="h-8 w-8 text-white/20" />
            <p className="text-sm uppercase tracking-widest text-white/40">
              {search ? "No se encontraron resultados" : "No hay clientes VIP registrados"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-widest text-white/40">
                  Nombre
                </TableHead>
                <TableHead className="text-xs uppercase tracking-widest text-white/40">
                  Email
                </TableHead>
                <TableHead className="hidden text-xs uppercase tracking-widest text-white/40 md:table-cell">
                  Empresa
                </TableHead>
                <TableHead className="text-xs uppercase tracking-widest text-white/40">
                  Estado
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-widest text-white/40">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow
                  key={client.id}
                  className="border-white/5 hover:bg-white/[0.02]"
                >
                  <TableCell className="text-sm text-white">
                    {client.nombre} {client.apellido}
                  </TableCell>
                  <TableCell className="text-sm text-white/60">
                    {client.email}
                  </TableCell>
                  <TableCell className="hidden text-sm text-white/60 md:table-cell">
                    {client.empresa}
                  </TableCell>
                  <TableCell>
                    {client.is_suspended ? (
                      <Badge
                        variant="destructive"
                        className="text-[10px] uppercase tracking-widest"
                      >
                        Suspendido
                      </Badge>
                    ) : (
                      <Badge
                        className="text-[10px] uppercase tracking-widest"
                        style={{ backgroundColor: "#4f5ea7" }}
                      >
                        Activo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Edit */}
                      <Link href={`/dashboard/vip/${client.id}`}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>

                      {/* Suspend / Reactivate */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                        title={client.is_suspended ? "Reactivar" : "Suspender"}
                        disabled={actionLoading === client.id}
                        onClick={() => handleSuspend(client.id)}
                      >
                        {actionLoading === client.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : client.is_suspended ? (
                          <ShieldCheck className="h-4 w-4" />
                        ) : (
                          <ShieldBan className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Eliminar"
                            disabled={actionLoading === client.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-white/10 bg-zinc-950">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Eliminar Cliente VIP
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-white/50">
                              Esta accion eliminara a{" "}
                              <span className="font-medium text-white">
                                {client.nombre} {client.apellido}
                              </span>{" "}
                              de la lista de clientes VIP. Esta accion no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/10 text-white/60 hover:text-white">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => handleDelete(client.id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-white/30">
            Pagina {page} de {totalPages} &middot; {count} cliente{count !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="border-white/10 text-white/60 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="border-white/10 text-white/60 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
