/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Enable middleware
    experimental: {
      middleware: true
    },
    images: {
      domains: ['firebasestorage.googleapis.com'],
    },
  }

export default nextConfig;