/** @type {import('next').NextConfig} */

const isPhoneSubdomain = process.env.NEXT_PUBLIC_PHONE === 'true'

const nextConfig = {
	// assetPrefix: isPhoneSubdomain ? 'https://cvirko-vadim.ru/' : '',
	reactStrictMode: false,
}

module.exports = nextConfig
