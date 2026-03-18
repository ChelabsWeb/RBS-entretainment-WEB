"use client";

import { useCallback, useEffect, useState } from "react";
import { getAuditLog } from "@/lib/actions/audit";

const ENTITY_TYPES = [
  { value: "", label: "Todos" },
  { value: "movie", label: "Película" },
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
      console.error("Error cargando log de auditoría:", err);
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
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-6">Log de Auditoría</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Tipo de entidad</label>
          <select
            value={entityType}
            onChange={(e) => {
              setEntityType(e.target.value);
              setPage(1);
            }}
            className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {ENTITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900 text-zinc-400 text-left">
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Acción</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">ID Recurso</th>
              <th className="px-4 py-3 font-medium">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Cargando...
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No se encontraron registros.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-t border-zinc-800 hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDate(entry.created_at)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-300">
                    {entry.user_id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-xs font-medium">
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{entry.entity_type}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                    {entry.entity_id.slice(0, 12)}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500 max-w-xs truncate">
                    {formatDetails(entry.details)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-zinc-500">
          Mostrando {entries.length} de {count} registros
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 text-sm rounded-md border border-zinc-700 bg-zinc-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
          >
            Anterior
          </button>
          <span className="flex items-center px-3 text-sm text-zinc-400">
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 text-sm rounded-md border border-zinc-700 bg-zinc-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
