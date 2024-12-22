/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'standalone',
    poweredByHeader: false,
    compress: true,

    // Image configuration
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.cvirko-vadim.ru',
            }
        ],
        domains: ['cvirko-vadim.ru'],
    },

    // Rewrite rules for subdomains
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

module.exports = nextConfig
