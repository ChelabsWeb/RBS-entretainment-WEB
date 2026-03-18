"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getMovies, deleteMovie } from "@/lib/actions/movies";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

interface Movie {
  id: string;
  titulo: string;
  genero: string | null;
  anio: number | null;
  estado_publicacion: "borrador" | "vip" | "publicado" | "archivado";
  director: string | null;
  fecha_estreno: string | null;
  created_at: string;
}

const LIMIT = 10;

export default function MoviesPage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(count / LIMIT);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getMovies({
        page,
        limit: LIMIT,
        search: search || undefined,
        estado: estado || undefined,
      });
      setMovies(result.data as Movie[]);
      setCount(result.count);
    } catch {
      console.error("Error fetching movies");
    } finally {
      setLoading(false);
    }
  }, [page, search, estado]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleArchive = (id: string) => {
    startTransition(async () => {
      try {
        await deleteMovie(id);
        await fetchMovies();
      } catch {
        console.error("Error archiving movie");
      }
    });
  };

  const estadoBadge = (estado: string) => {
    switch (estado) {
      case "publicado":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-0">
            Publicado
          </Badge>
        );
      case "borrador":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
            Borrador
          </Badge>
        );
      case "vip":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-0">
            Vista VIP
          </Badge>
        );
      case "archivado":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-0">
            Archivado
          </Badge>
        );
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Pel&iacute;culas</h1>
        <Button
          onClick={() => router.push("/dashboard/movies/new")}
          className="bg-[#4f5ea7] hover:bg-[#4f5ea7]/80 text-white"
        >
          Nueva Pel&iacute;cula
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar por t&iacute;tulo..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="bg-black border-white/10 text-white placeholder:text-white/40 focus:border-[#4f5ea7] max-w-sm"
        />
        <Select
          value={estado}
          onValueChange={(val) => {
            setEstado(val === "todos" ? "" : val);
            setPage(1);
          }}
        >
          <SelectTrigger className="bg-black border-white/10 text-white w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/10">
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="borrador">Borrador</SelectItem>
            <SelectItem value="vip">Vista VIP</SelectItem>
            <SelectItem value="publicado">Publicado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60">T&iacute;tulo</TableHead>
              <TableHead className="text-white/60">Director</TableHead>
              <TableHead className="text-white/60">G&eacute;nero</TableHead>
              <TableHead className="text-white/60">A&ntilde;o</TableHead>
              <TableHead className="text-white/60">Estado</TableHead>
              <TableHead className="text-white/60 text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10">
                <TableCell
                  colSpan={6}
                  className="text-center text-white/40 py-8"
                >
                  Cargando...
                </TableCell>
              </TableRow>
            ) : movies.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell
                  colSpan={6}
                  className="text-center text-white/40 py-8"
                >
                  No se encontraron pel&iacute;culas.
                </TableCell>
              </TableRow>
            ) : (
              movies.map((movie) => (
                <TableRow
                  key={movie.id}
                  className="border-white/10 hover:bg-white/[0.02]"
                >
                  <TableCell className="text-white font-medium">
                    {movie.titulo}
                  </TableCell>
                  <TableCell className="text-white/70">
                    {movie.director ?? "-"}
                  </TableCell>
                  <TableCell className="text-white/70">
                    {movie.genero ?? "-"}
                  </TableCell>
                  <TableCell className="text-white/70">
                    {movie.anio ?? "-"}
                  </TableCell>
                  <TableCell>{estadoBadge(movie.estado_publicacion)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/movies/${movie.id}`)
                        }
                        className="border-white/10 text-white hover:bg-white/5 text-xs"
                      >
                        Editar
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                          >
                            Archivar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black border-white/10">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Archivar pel&iacute;cula
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-white/60">
                              &iquest;Est&aacute;s seguro de que quer&eacute;s archivar &quot;
                              {movie.titulo}&quot;? La pel&iacute;cula dejar&aacute; de
                              aparecer en el listado.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/10 text-white hover:bg-white/5">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleArchive(movie.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Archivar
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-white/40 text-sm">
            Mostrando {(page - 1) * LIMIT + 1}-
            {Math.min(page * LIMIT, count)} de {count} pel&iacute;culas
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Anterior
            </Button>
            <span className="text-white/60 text-sm px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
