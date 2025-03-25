const nextConfig = {
  output: 'standalone', // Pastikan ini ada untuk mendukung Vercel deployment
  experimental: {
    serverActions: true, // Jika menggunakan Server Actions, aktifkan ini
  },
  eslint: {
    dirs: ['pages', 'components', 'lib'], // Direktori yang akan diperiksa ESLint
    ignoreDuringBuilds: false, // Set ke true jika ingin mengabaikan error ESLint saat build
  },
  images: {
    domains: ['placehold.co'], // Tambahkan domain eksternal yang digunakan
  },
};

export default nextConfig;
