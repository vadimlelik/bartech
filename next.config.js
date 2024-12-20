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
			// Правила для продакшн домена
			{
				source: '/1phonefree',
				destination: '/(pages)/(landing)/1phonefree',
			},
			{
				source: '/1phonefree/:path*',
				destination: '/(pages)/(landing)/1phonefree/:path*',
			},
			{
				source: '/phone2',
				destination: '/(pages)/(landing)/phone2',
			},
			{
				source: '/phone2/:path*',
				destination: '/(pages)/(landing)/phone2/:path*',
			},
			{
				source: '/tv1',
				destination: '/(pages)/(landing)/tv1',
			},
			{
				source: '/tv1/:path*',
				destination: '/(pages)/(landing)/tv1/:path*',
			},
			{
				source: '/50discount',
				destination: '/(pages)/(landing)/50discount',
			},
			{
				source: '/50discount/:path*',
				destination: '/(pages)/(landing)/50discount/:path*',
			},
		]
	},
}

export default nextConfig
