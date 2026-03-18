"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { movieSchema, type MovieFormValues } from "@/lib/validations/movie";
import { createMovie, updateMovie } from "@/lib/actions/movies";
import { useRouter } from "next/navigation";
import { useState, useRef, useTransition } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DISTRIBUTOR_LOGOS, DISTRIBUTOR_LABELS } from "@/lib/movies";

interface MovieFormProps {
  movie?: Record<string, unknown>;
  mode: "create" | "edit";
}

export default function MovieForm({ movie, mode }: MovieFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [posterPreview, setPosterPreview] = useState<string | null>(
    (movie?.poster_url as string) ?? null
  );
  const [heroPreview, setHeroPreview] = useState<string | null>(
    (movie?.hero_image_url as string) ?? null
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      titulo: (movie?.titulo as string) ?? "",
      sinopsis: (movie?.sinopsis as string) ?? "",
      poster_url: (movie?.poster_url as string) ?? "",
      estado_publicacion:
        (movie?.estado_publicacion as "borrador" | "publicado" | "archivado") ??
        "borrador",
      fecha_anuncio_preventa:
        (movie?.fecha_anuncio_preventa as string) ?? undefined,
      fecha_preventa: (movie?.fecha_preventa as string) ?? undefined,
      fecha_pre_estreno: (movie?.fecha_pre_estreno as string) ?? undefined,
      hora_pre_estreno: (movie?.hora_pre_estreno as string) ?? undefined,
      fecha_estreno: (movie?.fecha_estreno as string) ?? undefined,
      calificacion: (movie?.calificacion as string) ?? "",
      formato_version: (movie?.formato_version as string) ?? "",
      duracion_minutos: (movie?.duracion_minutos as number) ?? undefined,
      genero: (movie?.genero as string) ?? "",
      anio: (movie?.anio as number) ?? undefined,
      director: (movie?.director as string) ?? "",
      link_movie: (movie?.link_movie as string) ?? "",
      link_life_cinemas: (movie?.link_life_cinemas as string) ?? "",
      link_grupo_cine: (movie?.link_grupo_cine as string) ?? "",
      link_cines_del_este: (movie?.link_cines_del_este as string) ?? "",
      distributor: (movie?.distributor as string) ?? "",
      trailer_url: (movie?.trailer_url as string) ?? "",
      hero_image_url: (movie?.hero_image_url as string) ?? "",
    },
  });

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPosterPreview(url);
    }
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setHeroPreview(url);
    }
  };

  const onSubmit = (values: MovieFormValues) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();

        // Append all text fields
        for (const [key, value] of Object.entries(values)) {
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, String(value));
          }
        }

        // Append poster file if selected
        const posterFile = fileInputRef.current?.files?.[0];
        if (posterFile) {
          formData.append("poster", posterFile);
        }

        // Append hero image file if selected
        const heroFile = heroFileInputRef.current?.files?.[0];
        if (heroFile) {
          formData.append("hero_image", heroFile);
        }

        let result;
        if (mode === "create") {
          result = await createMovie(formData);
        } else {
          result = await updateMovie(movie?.id as string, formData);
        }

        if (result && "error" in result) {
          setServerError("Error de validaci\u00f3n. Revis\u00e1 los campos.");
          return;
        }

        router.push("/dashboard/movies");
        router.refresh();
      } catch (err) {
        setServerError(
          err instanceof Error ? err.message : "Ocurri\u00f3 un error inesperado."
        );
      }
    });
  };

  // Helper to strip time for date inputs
  const toDateInputValue = (isoString?: string) => {
    if (!isoString) return "";
    return isoString.slice(0, 10);
  };

  const inputClass =
    "bg-black border-white/10 text-white placeholder:text-white/40 focus:border-[#4f5ea7] focus:ring-[#4f5ea7]";
  const labelClass = "text-white/80 text-sm font-medium";

  return (
    <Card className="bg-black border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-xl">
          {mode === "create" ? "Nueva Pel\u00edcula" : "Editar Pel\u00edcula"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-md text-sm">
              {serverError}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider">
              Informaci&oacute;n b&aacute;sica
            </h3>
            <Separator className="bg-white/10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo" className={labelClass}>
                  T&iacute;tulo *
                </Label>
                <Input
                  id="titulo"
                  {...form.register("titulo")}
                  className={inputClass}
                  placeholder="T&iacute;tulo de la pel&iacute;cula"
                />
                {form.formState.errors.titulo && (
                  <p className="text-red-400 text-xs">
                    {form.formState.errors.titulo.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="director" className={labelClass}>
                  Director
                </Label>
                <Input
                  id="director"
                  {...form.register("director")}
                  className={inputClass}
                  placeholder="Nombre del director"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sinopsis" className={labelClass}>
                Sinopsis
              </Label>
              <Textarea
                id="sinopsis"
                {...form.register("sinopsis")}
                className={`${inputClass} min-h-[100px]`}
                placeholder="Descripci&oacute;n de la pel&iacute;cula..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genero" className={labelClass}>
                  G&eacute;nero
                </Label>
                <Input
                  id="genero"
                  {...form.register("genero")}
                  className={inputClass}
                  placeholder="Acci&oacute;n, Drama..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anio" className={labelClass}>
                  A&ntilde;o
                </Label>
                <Input
                  id="anio"
                  type="number"
                  {...form.register("anio", { valueAsNumber: true })}
                  className={inputClass}
                  placeholder="2026"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracion_minutos" className={labelClass}>
                  Duraci&oacute;n (minutos)
                </Label>
                <Input
                  id="duracion_minutos"
                  type="number"
                  {...form.register("duracion_minutos", {
                    valueAsNumber: true,
                  })}
                  className={inputClass}
                  placeholder="120"
                />
                {form.formState.errors.duracion_minutos && (
                  <p className="text-red-400 text-xs">
                    {form.formState.errors.duracion_minutos.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calificacion" className={labelClass}>
                  Calificaci&oacute;n
                </Label>
                <Input
                  id="calificacion"
                  {...form.register("calificacion")}
                  className={inputClass}
                  placeholder="ATP, +13, +16..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="formato_version" className={labelClass}>
                  Formato / Versi&oacute;n
                </Label>
                <Input
                  id="formato_version"
                  {...form.register("formato_version")}
                  className={inputClass}
                  placeholder="2D, 3D, IMAX..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado_publicacion" className={labelClass}>
                  Estado de publicaci&oacute;n *
                </Label>
                <Select
                  value={form.watch("estado_publicacion")}
                  onValueChange={(val) =>
                    form.setValue(
                      "estado_publicacion",
                      val as "borrador" | "vip" | "publicado" | "archivado"
                    )
                  }
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="borrador">Borrador</SelectItem>
                    <SelectItem value="vip">Vista VIP</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                    <SelectItem value="archivado">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider">
              Fechas
            </h3>
            <Separator className="bg-white/10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_anuncio_preventa" className={labelClass}>
                  Fecha anuncio preventa
                </Label>
                <Input
                  id="fecha_anuncio_preventa"
                  type="date"
                  defaultValue={toDateInputValue(
                    form.getValues("fecha_anuncio_preventa")
                  )}
                  onChange={(e) =>
                    form.setValue(
                      "fecha_anuncio_preventa",
                      e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_preventa" className={labelClass}>
                  Fecha preventa
                </Label>
                <Input
                  id="fecha_preventa"
                  type="date"
                  defaultValue={toDateInputValue(
                    form.getValues("fecha_preventa")
                  )}
                  onChange={(e) =>
                    form.setValue(
                      "fecha_preventa",
                      e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_pre_estreno" className={labelClass}>
                  Fecha pre-estreno
                </Label>
                <Input
                  id="fecha_pre_estreno"
                  type="date"
                  defaultValue={toDateInputValue(
                    form.getValues("fecha_pre_estreno")
                  )}
                  onChange={(e) =>
                    form.setValue(
                      "fecha_pre_estreno",
                      e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_pre_estreno" className={labelClass}>
                  Hora pre-estreno
                </Label>
                <Input
                  id="hora_pre_estreno"
                  type="time"
                  {...form.register("hora_pre_estreno")}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_estreno" className={labelClass}>
                  Fecha estreno
                </Label>
                <Input
                  id="fecha_estreno"
                  type="date"
                  defaultValue={toDateInputValue(
                    form.getValues("fecha_estreno")
                  )}
                  onChange={(e) =>
                    form.setValue(
                      "fecha_estreno",
                      e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined
                    )
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Cinema Ticket Links */}
          <div className="space-y-4">
            <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider">
              Links de entradas por cine
            </h3>
            <Separator className="bg-white/10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link_movie" className={labelClass}>
                  Movie
                </Label>
                <Input
                  id="link_movie"
                  {...form.register("link_movie")}
                  className={inputClass}
                  placeholder="https://movie.com.uy/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_life_cinemas" className={labelClass}>
                  Life Cinemas
                </Label>
                <Input
                  id="link_life_cinemas"
                  {...form.register("link_life_cinemas")}
                  className={inputClass}
                  placeholder="https://lifecinemas.com.uy/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_grupo_cine" className={labelClass}>
                  Grupo Cine
                </Label>
                <Input
                  id="link_grupo_cine"
                  {...form.register("link_grupo_cine")}
                  className={inputClass}
                  placeholder="https://grupocine.com.uy/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_cines_del_este" className={labelClass}>
                  Cines del Este
                </Label>
                <Input
                  id="link_cines_del_este"
                  {...form.register("link_cines_del_este")}
                  className={inputClass}
                  placeholder="https://cinesdel este.com.uy/..."
                />
              </div>
            </div>
          </div>

          {/* Distributor */}
          <div className="space-y-4">
            <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider">
              Distribuidor
            </h3>
            <Separator className="bg-white/10" />

            <div className="flex items-center gap-6">
              <div className="space-y-2 flex-1">
                <Label htmlFor="distributor" className={labelClass}>
                  Distribuidora
                </Label>
                <Select
                  value={form.watch("distributor") ?? ""}
                  onValueChange={(val) =>
                    form.setValue("distributor", val === "none" ? "" : val)
                  }
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Seleccionar distribuidora" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="none">Sin distribuidora</SelectItem>
                    {Object.entries(DISTRIBUTOR_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.watch("distributor") && DISTRIBUTOR_LOGOS[form.watch("distributor")!] && (
                <div className="flex-shrink-0 flex items-center justify-center w-32 h-16 rounded-md border border-white/10 bg-white/5 p-3">
                  <Image
                    src={DISTRIBUTOR_LOGOS[form.watch("distributor")!]}
                    alt="Logo distribuidora"
                    width={100}
                    height={50}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Poster */}
          <div className="space-y-4">
            <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider">
              P&oacute;ster
            </h3>
            <Separator className="bg-white/10" />

            <div className="flex items-start gap-6">
              {posterPreview && (
                <div className="relative w-32 h-48 rounded-md overflow-hidden border border-white/10 flex-shrink-0">
                  <Image
                    src={posterPreview}
                    alt="Vista previa del p&oacute;ster"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-2 flex-1">
                <Label htmlFor="poster" className={labelClass}>
                  {mode === "create"
                    ? "Subir p\u00f3ster"
                    : "Cambiar p\u00f3ster (opcional)"}
                </Label>
                <Input
                  id="poster"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePosterChange}
                  className={`${inputClass} file:bg-[#4f5ea7] file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:cursor-pointer`}
                />
                <p className="text-white/40 text-xs">
                  Formatos aceptados: JPG, PNG, WebP. Tama&ntilde;o recomendado:
                  400x600px.
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="space-y-4">
            <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider">
              Imagen Hero (banner)
            </h3>
            <Separator className="bg-white/10" />

            <div className="flex items-start gap-6">
              {heroPreview && (
                <div className="relative w-48 h-28 rounded-md overflow-hidden border border-white/10 flex-shrink-0">
                  <Image
                    src={heroPreview}
                    alt="Vista previa del hero"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-2 flex-1">
                <Label htmlFor="hero_image" className={labelClass}>
                  {mode === "create"
                    ? "Subir imagen hero"
                    : "Cambiar imagen hero (opcional)"}
                </Label>
                <Input
                  id="hero_image"
                  type="file"
                  accept="image/*"
                  ref={heroFileInputRef}
                  onChange={handleHeroImageChange}
                  className={`${inputClass} file:bg-[#4f5ea7] file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:cursor-pointer`}
                />
                <p className="text-white/40 text-xs">
                  Imagen panorámica para la portada. Tamaño recomendado:
                  1920x1080px.
                </p>
              </div>
            </div>
          </div>

          {/* Trailer */}
          <div className="space-y-4">
            <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider">
              Trailer
            </h3>
            <Separator className="bg-white/10" />

            <div className="space-y-2">
              <Label htmlFor="trailer_url" className={labelClass}>
                Link de YouTube
              </Label>
              <Input
                id="trailer_url"
                {...form.register("trailer_url")}
                className={inputClass}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-white/40 text-xs">
                Pegá el link completo del trailer en YouTube.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#4f5ea7] hover:bg-[#4f5ea7]/80 text-white"
            >
              {isPending
                ? "Guardando..."
                : mode === "create"
                  ? "Crear Pel\u00edcula"
                  : "Guardar Cambios"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
              onClick={() => router.push("/dashboard/movies")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
