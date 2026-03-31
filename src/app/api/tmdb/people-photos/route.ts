import { NextRequest, NextResponse } from "next/server";

const TMDB_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
  if (!TMDB_TOKEN) return NextResponse.json([]);

  const { names } = (await request.json()) as { names: string[] };
  if (!names || names.length === 0) return NextResponse.json([]);

  const results = await Promise.all(
    names.slice(0, 10).map(async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return { name: trimmed, photo: null };
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(trimmed)}&language=es-UY`,
          {
            headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
            next: { revalidate: 86400 },
          }
        );
        if (!res.ok) return { name: trimmed, photo: null };
        const data = await res.json();
        const person = data.results?.[0];
        return {
          name: trimmed,
          photo: person?.profile_path
            ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
            : null,
        };
      } catch {
        return { name: trimmed, photo: null };
      }
    })
  );

  return NextResponse.json(results);
}
