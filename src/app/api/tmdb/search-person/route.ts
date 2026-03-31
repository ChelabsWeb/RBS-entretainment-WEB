import { NextRequest, NextResponse } from "next/server";

const TMDB_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  if (!TMDB_TOKEN) {
    return NextResponse.json([], { status: 500 });
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(query)}&language=es-UY`,
    {
      headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    return NextResponse.json([], { status: 502 });
  }

  const data = await res.json();
  const results = (data.results || []).slice(0, 8).map((p: Record<string, unknown>) => ({
    id: p.id,
    name: p.name as string,
    photo: p.profile_path
      ? `https://image.tmdb.org/t/p/w185${p.profile_path}`
      : null,
    department: p.known_for_department as string,
  }));

  return NextResponse.json(results);
}
