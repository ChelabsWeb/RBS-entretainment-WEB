import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/*', '/vip/*', '/login/*'],
      },
    ],
    sitemap: 'https://rbs-entretainment-web.vercel.app/sitemap.xml',
  }
}
