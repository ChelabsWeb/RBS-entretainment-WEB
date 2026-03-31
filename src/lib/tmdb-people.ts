const TMDB_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;
const TMDB_BASE = "https://api.themoviedb.org/3";

interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  gender: number;
}

export interface PersonWithPhoto {
  name: string;
  photo_url: string | null;
  gender: number;
}

async function searchPerson(name: string): Promise<TMDBPerson | null> {
  if (!TMDB_TOKEN) return null;
  try {
    const res = await fetch(
      `${TMDB_BASE}/search/person?query=${encodeURIComponent(name)}&language=es-UY`,
      {
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        next: { revalidate: 86400 }, // Cache 24h
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function fetchPeoplePhotos(names: string[]): Promise<PersonWithPhoto[]> {
  const results = await Promise.all(
    names.map(async (name) => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      const person = await searchPerson(trimmed);
      return {
        name: trimmed,
        photo_url: person?.profile_path
          ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
          : null,
        gender: person?.gender ?? 0,
      };
    })
  );
  return results.filter(Boolean) as PersonWithPhoto[];
}
