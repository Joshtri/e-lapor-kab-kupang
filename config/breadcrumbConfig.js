/**
 * Breadcrumb Configuration
 * Maps URL segments to display labels for automatic breadcrumb generation
 */

export const breadcrumbConfig = {
  // Admin routes
  adm: 'Admin',
  users: 'Pengguna',
  'org-perangkat-daerah': 'OPD',
  'kelola-pengaduan': 'Kelola Pengaduan',
  'riwayat-pengaduan': 'Riwayat Pengaduan',
  jurnal: 'Jurnal',
  notifikasi: 'Notifikasi',
  kirim: 'Kirim',
  list: 'Daftar',
  bugs: 'Laporan Bug',
  dashboard: 'Beranda',
  profile: 'Profil',
  mail: 'Email',
  create: 'Buat Baru',
  edit: 'Edit',

  // Bupati routes
  'bupati-portal': 'Portal Bupati',
  'laporan-warga': 'Pengaduan Warga',

  // Pelapor routes
  pelapor: 'Pelapor',
  'riwayat-pengaduan': 'Riwayat Pengaduan',
  statistik: 'Statistik',
  'lapor-bug': 'Laporan Bug',
  'buat-laporan': 'Buat Pengaduan',

  // Chat routes
  chat: 'Chat',
  bupati: 'Bupati',
  opd: 'OPD',

  // Common segments
  auth: 'Autentikasi',
  login: 'Masuk',
  register: 'Daftar',
  'forgot-password': 'Lupa Password',
  'reset-password': 'Reset Password',

  // OPD routes
  // opd: 'OPD',
};

/**
 * Get display label for a URL segment
 * @param {string} segment - URL segment
 * @returns {string} Display label
 */
export const getSegmentLabel = (segment) => {
  if (!segment) return '';

  // Check if it's a number or UUID (likely an ID)
  if (
    /^[0-9a-f-]+$/.test(segment) &&
    (segment.length > 10 || /^\d+$/.test(segment))
  ) {
    return 'Detail';
  }

  // Look up in config
  const label = breadcrumbConfig[segment];
  if (label) {
    return label;
  }

  // Fallback: convert kebab-case to Title Case
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get role-specific home config
 * @param {string} role - User role (adm, bupati, opd, pelapor)
 * @returns {object} Home config with href and label
 */
export const getRoleHomePath = (role) => {
  const roleConfig = {
    adm: { href: '/adm/dashboard', label: 'Beranda' },
    bupati: { href: '/bupati-portal/dashboard', label: 'Beranda' },
    opd: { href: '/opd/dashboard', label: 'Beranda' },
    pelapor: { href: '/pelapor/dashboard', label: 'Beranda' },
  };

  return roleConfig[role] || roleConfig.adm;
};
