/** @type {import('next').NextConfig} */

const isPhoneSubdomain = process.env.NEXT_PUBLIC_PHONE === 'true';

const nextConfig = {
  assetPrefix: isPhoneSubdomain ? 'https://cvirko-vadim.ru' : '',
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
    ];
  },
};

export default nextConfig;
