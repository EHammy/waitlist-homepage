// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'plannosaur.com',
      },
      {
        protocol: 'https',
        hostname: '*.plannosaur.com',
      }
    ],
  },
  async redirects() {
    return [
      // Redirect common app paths to waitlist
      {
        source: '/app/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/dashboard/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/account/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/login/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/signup/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/quiz/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/products/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/cart/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/checkout/:path*',
        destination: '/',
        permanent: false,
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://plannosaur.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
};

export default nextConfig;
