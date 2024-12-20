/** @type {import('next').NextConfig} */

const nextConfig = {
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
            // Правила для лендингов
            {
                source: '/1phonefree',
                destination: '/(landing)/1phonefree'
            },
            {
                source: '/1phonefree/:path*',
                destination: '/(landing)/1phonefree/:path*'
            },
            {
                source: '/phone2',
                destination: '/(landing)/phone2'
            },
            {
                source: '/phone2/:path*',
                destination: '/(landing)/phone2/:path*'
            },
            {
                source: '/tv1',
                destination: '/(landing)/tv1'
            },
            {
                source: '/tv1/:path*',
                destination: '/(landing)/tv1/:path*'
            },
            {
                source: '/50discount',
                destination: '/(landing)/50discount'
            },
            {
                source: '/50discount/:path*',
                destination: '/(landing)/50discount/:path*'
            }
        ]
    }
}

export default nextConfig
