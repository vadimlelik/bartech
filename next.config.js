/** @type {import('next').NextConfig} */

const isPhoneSubdomain = process.env.NEXT_PUBLIC_PHONE === 'true'

const nextConfig = {
	assetPrefix: isPhoneSubdomain ? 'https://cvirko-vadim.ru/' : '',
	reactStrictMode: false,
	async rewrites() {
		return [
			{
				source: '/phone/:path*',
				destination: '/:path*',
			},
			{
				source: '/tv1/:path*',
				destination: '/:path*',
			},
		]
	},
}

module.exports = nextConfig
