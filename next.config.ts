import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['10.228.0.186', 'localhost'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  async redirects() {
    return [
      // Redirect www → non-www (canonical)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.bharatgamingleague.vercel.app' }],
        destination: 'https://bharatgamingleague.vercel.app/:path*',
        permanent: true,
      },
      // Redirect old domain → new domain (if someone visits old URL)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'tournament-web.vercel.app' }],
        destination: 'https://bharatgamingleague.vercel.app/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;

