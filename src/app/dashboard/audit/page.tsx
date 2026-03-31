"use client";

import { useCallback, useEffect, useState } from "react";
import { getAuditLog } from "@/lib/actions/audit";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ENTITY_TYPES = [
  { value: "todos", label: "Todos" },
  { value: "movie", label: "Pelicula" },
  { value: "user_role", label: "Rol de usuario" },
  { value: "vip_client", label: "Cliente VIP" },
  { value: "schedule", label: "Horario" },
];

interface AuditEntry {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 20;

  const totalPages = Math.max(1, Math.ceil(count / limit));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAuditLog({
        page,
        limit,
        entityType: entityType || undefined,
      });
      setEntries(result.data as AuditEntry[]);
      setCount(result.count);
    } catch (err) {
      console.error("Error cargando log de auditoria:", err);
    } finally {
      setLoading(false);
    }
  }, [page, entityType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("es-UY", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  function formatDetails(details: Record<string, unknown> | null) {
    if (!details) return "-";
    return JSON.stringify(details, null, 0).slice(0, 120);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Log de Auditoria</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/60">Tipo de entidad</label>
          <Select
            value={entityType || "todos"}
            onValueChange={(val) => {
              setEntityType(val === "todos" ? "" : val);
              setPage(1);
            }}
          >
            <SelectTrigger className="bg-black border-white/10 text-white w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              {ENTITY_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60">Fecha</TableHead>
              <TableHead className="text-white/60">Usuario</TableHead>
              <TableHead className="text-white/60">Accion</TableHead>
              <TableHead className="text-white/60">Tipo</TableHead>
              <TableHead className="text-white/60">ID Recurso</TableHead>
              <TableHead className="text-white/60">Detalles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10 hover:bg-white/[0.02]">
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-white/40" />
                  </div>
                </TableCell>
              </TableRow>
            ) : entries.length === 0 ? (
              <TableRow className="border-white/10 hover:bg-white/[0.02]">
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-white/40"
                >
                  No se encontraron registros.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow
                  key={entry.id}
                  className="border-white/10 hover:bg-white/[0.02]"
                >
                  <TableCell className="whitespace-nowrap">
                    {formatDate(entry.created_at)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-zinc-300">
                    {entry.user_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-amber-500/20 text-amber-400 border-0">
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {entry.entity_type}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-zinc-400">
                    {entry.entity_id.slice(0, 12)}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500 max-w-xs truncate">
                    {formatDetails(entry.details)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">
          Mostrando {entries.length} de {count} registros
        </p>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-white hover:bg-white/5"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <span className="text-sm text-white/40 px-3">
            Pagina {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-white hover:bg-white/5"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
