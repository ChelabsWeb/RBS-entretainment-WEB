import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/*', '/vip/*', '/login', '/login/*', '/api/*'],
      },
    ],
    sitemap: 'https://rbsentertainment.com.uy/sitemap.xml',
  }
}
