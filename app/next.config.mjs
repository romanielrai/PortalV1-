import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: '/api/auth/:path*',
          destination: '/api/auth/:path*'  // handled by NextAuth, don't proxy
        }
      ],
      fallback: [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/:path*`
        }
      ]
    };
  }
};

export default nextConfig;
