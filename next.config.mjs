const nextConfig = {
  output: "standalone", // Pastikan ini ada untuk mendukung Vercel deployment
  experimental: {
    serverActions: true, // Jika menggunakan Server Actions, aktifkan ini
  },
  eslint: {
    ignoreDuringBuilds: true, // Hindari error ESLint saat build di Vercel
  },
};

export default nextConfig;
