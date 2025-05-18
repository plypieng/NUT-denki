/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignoring ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
  // Next.js 15 handles minification automatically
  // Optimize image handling
  images: {
    formats: ['image/avif', 'image/webp'],
    // Add Cloudinary as a domain for images
    domains: ['res.cloudinary.com'],
  },
  // Optimize for production builds
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
};

module.exports = nextConfig;
