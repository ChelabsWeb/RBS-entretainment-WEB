"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  getDocumentDownloadUrl,
} from "@/lib/actions/documents";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { Badge } from "@/components/ui/badge";

interface Document {
  id: string;
  movie_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
  uploaded_by: string;
}

interface DocumentsSectionProps {
  movieId: string;
}

export default function DocumentsSection({ movieId }: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const docs = await getDocuments(movieId);
      setDocuments(docs as Document[]);
    } catch {
      setError("No se pudieron cargar los documentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        await uploadDocument(movieId, formData);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await fetchDocuments();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al subir el documento."
        );
      }
    });
  };

  const handleDelete = (id: string) => {
    setError(null);
    startTransition(async () => {
      try {
        await deleteDocument(id);
        await fetchDocuments();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al eliminar el documento."
        );
      }
    });
  };

  const handleDownload = (id: string) => {
    startTransition(async () => {
      try {
        const { url } = await getDocumentDownloadUrl(id);
        window.open(url, "_blank");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al descargar el documento."
        );
      }
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileTypeBadge = (fileType: string) => {
    if (fileType.startsWith("image/")) return "Imagen";
    if (fileType.includes("pdf")) return "PDF";
    if (fileType.includes("word") || fileType.includes("document"))
      return "Word";
    if (fileType.includes("sheet") || fileType.includes("excel"))
      return "Excel";
    if (fileType.includes("video")) return "Video";
    return "Archivo";
  };

  return (
    <Card className="bg-black border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-xl">Documentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Upload section */}
        <div className="space-y-3">
          <Label className="text-white/80 text-sm font-medium">
            Subir nuevo documento
          </Label>
          <div className="flex items-center gap-3">
            <Input
              type="file"
              ref={fileInputRef}
              className="bg-black border-white/10 text-white file:bg-[#4f5ea7] file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:cursor-pointer flex-1"
            />
            <Button
              onClick={handleUpload}
              disabled={isPending}
              className="bg-[#4f5ea7] hover:bg-[#4f5ea7]/80 text-white"
            >
              {isPending ? "Subiendo..." : "Subir"}
            </Button>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Documents list */}
        {loading ? (
          <p className="text-white/40 text-sm">Cargando documentos...</p>
        ) : documents.length === 0 ? (
          <p className="text-white/40 text-sm">
            No hay documentos asociados a esta pel&iacute;cula.
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-md border border-white/10 bg-white/[0.02]"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Badge
                    variant="secondary"
                    className="bg-[#4f5ea7]/20 text-[#8b9ae0] border-0 shrink-0"
                  >
                    {getFileTypeBadge(doc.file_type)}
                  </Badge>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {doc.file_name}
                    </p>
                    <p className="text-white/40 text-xs">
                      {formatDate(doc.uploaded_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc.id)}
                    disabled={isPending}
                    className="border-white/10 text-white hover:bg-white/5 text-xs"
                  >
                    Descargar
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                      >
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-black border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          Eliminar documento
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-white/60">
                          &iquest;Est&aacute;s seguro de que quer&eacute;s eliminar &quot;{doc.file_name}
                          &quot;? Esta acci&oacute;n no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/10 text-white hover:bg-white/5">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(doc.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
