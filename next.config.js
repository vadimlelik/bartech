/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['cvirko-vadim.ru', '*.cvirko-vadim.ru'], // Добавьте ваши домены
  },
};

export default nextConfig;
