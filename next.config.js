/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com'],
    unoptimized: true,
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;