import { MetadataRoute } from 'next';

const BASE_URL = 'https://bharatgamingleague.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/tournaments', '/register'],
        disallow: ['/admin', '/dashboard', '/login', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
