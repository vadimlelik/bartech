/** @type {import('next').NextConfig} */

const isPhoneSubdomain = process.env.NEXT_PUBLIC_PHONE === 'true';

const nextConfig = {
  assetPrefix: isPhoneSubdomain ? 'https://technobar.by' : '',
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // compiler: {
  //   removeConsole:
  //     process.env.NODE_ENV === 'production'
  //       ? {
  //           exclude: ['error', 'warn'],
  //         }
  //       : false,
  // },
  async rewrites() {
    return [
      {
        source: '/phone/:path*',
        destination: '/:path*',
      },
      {
        source: '/phone',
        destination: '/',
      },
      {
        source: '/tv1/:path*',
        destination: '/:path*',
      },
      {
        source: '/phone2/:path*',
        destination: '/:path*',
      },
      {
        source: '/phone3/:path*',
        destination: '/:path*',
      },
      {
        source: '/phone4/:path*',
        destination: '/:path*',
      },
      {
        source: '/phone5/:path*',
        destination: '/:path*',
      },
      {
        source: '/1phonefree/:path*',
        destination: '/:path*',
      },
      {
        source: '/50discount/:path*',
        destination: '/:path*',
      },
      {
        source: '/phone6/:path*',
        destination: '/:path*',
      },
      {
        source: '/shockproof_phone/:path*',
        destination: '/:path*',
      },
      {
        source: '/laptop/:path*',
        destination: '/:path*',
      },
      {
        source: '/bicycles/:path*',
        destination: '/:path*',
      },
      {
        source: '/pc/:path*',
        destination: '/:path*',
      },
      {
        source: '/scooter/:path*',
        destination: '/:path*',
      },
      {
        source: '/motoblok/:path*',
        destination: '/:path*',
      },
      {
        source: '/motoblok_1/:path*',
        destination: '/:path*',
      },
      {
        source: '/motoblok_2/:path*',
        destination: '/:path*',
      },
      {
        source: '/laptop_2/:path*',
        destination: '/:path*',
      },
      {
        source: '/tv2/:path*',
        destination: '/:path*',
      },
      {
        source: '/tv3/:path*',
        destination: '/:path*',
      },
    ];
  },
};

export default nextConfig;
