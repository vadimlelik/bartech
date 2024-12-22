/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    compiler: {
        styledComponents: true,
    },
    images: {
        unoptimized: true,
        domains: ['phone.cvirko-vadim.ru', 'phone2.cvirko-vadim.ru'],
    },
    output: 'standalone',
    basePath: '',
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
                source: '/_next/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'phone2.cvirko-vadim.ru',
                    },
                ],
                destination: '/_next/:path*',
            },
            {
                source: '/images/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'phone2.cvirko-vadim.ru',
                    },
                ],
                destination: '/images/:path*',
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
