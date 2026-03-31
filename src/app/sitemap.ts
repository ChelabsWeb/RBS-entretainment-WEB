import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://rbsentertainment.com.uy'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/peliculas`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/licensing`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Fetch published movies from Supabase
  let movieRoutes: MetadataRoute.Sitemap = []
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data: movies } = await supabase
      .from('movies')
      .select('id, updated_at')
      .eq('estado_publicacion', 'publicado')

    if (movies) {
      movieRoutes = movies.map((movie) => ({
        url: `${BASE_URL}/vip/movies/${movie.id}`,
        lastModified: movie.updated_at ? new Date(movie.updated_at) : lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Sitemap: failed to fetch movies', error)
  }

  return [...staticRoutes, ...movieRoutes]
}
