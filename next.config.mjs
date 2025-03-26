// next.config.js
import nextPWA from 'next-pwa'

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  eslint: {
    dirs: ['pages', 'components', 'lib'],
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['placehold.co'],
  },
  trailingSlash: true,
}

export default withPWA(nextConfig)