/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'standalone',
    poweredByHeader: false,
    compress: true,

    // Asset configuration
    assetPrefix: process.env.NODE_ENV === 'production' ? 'https://phone.cvirko-vadim.ru' : '',
    
    // Image configuration
    images: {
        unoptimized: true,
        domains: ['phone.cvirko-vadim.ru', 'phone2.cvirko-vadim.ru'],
    },

    // Rewrite rules for subdomains
    async rewrites() {
        return [
            {
                source: '/_next/static/:path*',
                has: [
                    {
                        type: 'host',
                        value: '(.*).cvirko-vadim.ru',
                    },
                ],
                destination: '/_next/static/:path*',
            },
            {
                source: '/images/:path*',
                has: [
                    {
                        type: 'host',
                        value: '(.*).cvirko-vadim.ru',
                    },
                ],
                destination: '/images/:path*',
            },
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
