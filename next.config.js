/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    compiler: {
        styledComponents: true,
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '**.cvirko-vadim.ru',
            },
            {
                protocol: 'https',
                hostname: '**.cvirko-vadim.ru',
            }
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
    output: 'standalone',
    assetPrefix: process.env.NODE_ENV === 'production' ? 'https://phone.cvirko-vadim.ru' : '',
    async rewrites() {
        return [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'phone2.cvirko-vadim.ru',
                    },
                ],
                destination: '/phone2/:path*',
            },
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'tv1.cvirko-vadim.ru',
                    },
                ],
                destination: '/tv1/:path*',
            },
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: '1phonefree.cvirko-vadim.ru',
                    },
                ],
                destination: '/1phonefree/:path*',
            },
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: '50discount.cvirko-vadim.ru',
                    },
                ],
                destination: '/50discount/:path*',
            },
        ]
    },
}
