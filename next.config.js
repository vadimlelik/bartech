/** @type {import('next').NextConfig} */

const isPhoneSubdomain = process.env.NEXT_PUBLIC_PHONE === 'true';

const nextConfig = {
  assetPrefix: isPhoneSubdomain ? 'https://technobar.by' : '',
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
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
    ];
  },
};

export default nextConfig;
