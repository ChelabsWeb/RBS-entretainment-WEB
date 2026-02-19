const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Licensed Distributor IDs
export const DISTRIBUTOR_IDS = {
  DISNEY: [2, 3, 1, 420], // Disney, Pixar, Lucasfilm, Marvel
  UNIVERSAL: [33, 521, 6704] // Universal, DreamWorks, Illumination
};

const ALL_DISTRIBUTOR_IDS = [...DISTRIBUTOR_IDS.DISNEY, ...DISTRIBUTOR_IDS.UNIVERSAL];

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

export const getImageUrl = (path: string, size: 'w92' | 'w185' | 'w500' | 'original' = 'w500') => {
  if (!path) return '';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export async function fetchTrendingMovies(): Promise<Movie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}&language=es-ES`
  );
  const data = await response.json() as { results: Movie[] };
  return data.results;
}

export async function fetchPopularMovies(): Promise<Movie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES`
  );
  const data = await response.json() as { results: Movie[] };
  return data.results;
}

export async function fetchNowPlayingMovies(): Promise<Movie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=es-ES`
  );
  const data = await response.json() as { results: Movie[] };
  return data.results;
}

export async function fetchUpcomingMovies(): Promise<Movie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=es-ES`
  );
  const data = await response.json() as { results: Movie[] };
  return data.results;
}

export async function fetchMovieDetails(movieId: number): Promise<Record<string, unknown>> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits&language=es-ES`
  );
  return response.json() as Promise<Record<string, unknown>>;
}

export async function fetchMovieTrailers(movieId: number): Promise<{ type: string; site: string; key: string }[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=es-ES`
  );
  const data = await response.json() as { results: { type: string; site: string; key: string }[] };
  return data.results.filter((v) => v.type === "Trailer" && v.site === "YouTube");
}

export async function fetchMovieCredits(movieId: number): Promise<Record<string, unknown>> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=es-ES`
  );
  return response.json() as Promise<Record<string, unknown>>;
}
export async function searchMovie(query: string): Promise<Movie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`
  );
  const data = await response.json() as { results: Movie[] };
  return data.results;
}

export async function searchLicensedMovies(query: string): Promise<Movie[]> {
  const basicResults = await searchMovie(query);
  
  // Filter only top results to avoid excessive API calls
  const topResults = basicResults.slice(0, 10);
  
  const detailedResults = await Promise.all(
    topResults.map(async (movie) => {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`
        );
        const details = await response.json() as { production_companies: { id: number }[] };
        
        const isFromLicensedDistributor = details.production_companies?.some(
          (company) => ALL_DISTRIBUTOR_IDS.includes(company.id)
        );
        
        return isFromLicensedDistributor ? movie : null;
      } catch (error) {
        return null;
      }
    })
  );
  
  return detailedResults.filter(Boolean) as Movie[];
}
