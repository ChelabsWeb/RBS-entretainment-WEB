import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RBS Entertainment',
    short_name: 'RBS',
    description: 'Distribuidora y licenciataria de contenido cinematográfico en Uruguay',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#4f5ea7',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
