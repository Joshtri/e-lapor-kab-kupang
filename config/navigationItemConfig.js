import {
  HiOutlineMail,
  HiMailOpen,
  HiOutlineDocumentReport,
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlinePencilAlt,
  HiOutlineBell,
  HiChat,
  HiDocumentReport,
  HiOutlineCog,
} from 'react-icons/hi';
import { FaBug } from 'react-icons/fa';

export const navigationItemConfig = {
  admin: {
    title: 'Admin Panel',
    color: 'blue',
    routes: [
      {
        path: '/adm/dashboard',
        name: 'Dashboard',
        icon: HiOutlineMail,
      },

      {
        type: 'expandable',
        name: 'Manajemen Pengguna',
        icon: HiOutlineUserGroup,
        subRoutes: [
          {
            path: '/adm/users/pelapor',
            name: 'Kelola Akun Pelapor',
            icon: HiOutlineUserGroup,
          },
          {
            path: '/adm/users/admin',
            name: 'Kelola Akun Admin',
            icon: HiOutlineUserGroup,
          },
          {
            path: '/adm/users/bupati',
            name: 'Kelola Akun Bupati',
            icon: HiOutlineUserGroup,
          },
          {
            path: '/adm/users/staff-opd',
            name: 'Kelola Akun Staff OPD',
            icon: HiOutlineUserGroup,
          },
        ],
      },
      // {
      //   path: '/adm/org-perangkat-daerah',
      //   name: 'Manajemen OPD',
      //   icon: HiOutlineOfficeBuilding,
      // },
      {
        path: '/adm/organisasi-perangkat-daerah',
        name: 'Manajemen OPD',
        icon: HiOutlineOfficeBuilding,
      },
      // {
      //   path: '/adm/staff-organisasi-perangkat-daerah',
      //   name: 'Manajemen Staff OPD',
      //   icon: HiOutlineUserGroup,
      // },

      {
        path: '/adm/kelola-pengaduan',
        name: 'Kelola Pengaduan',
        icon: HiMailOpen,
      },

      // {
      //   path: '/adm/kelola-opd',
      //   name: 'Kelola OPD',
      //   icon: HiOutlineOfficeBuilding,
      // },

      {
        path: '/adm/riwayat-pengaduan',
        name: 'Riwayat Pengaduan',
        icon: HiOutlineDocumentReport,
        motion: {
          whileHover: { y: [0, -2, 0] },
          transition: { repeat: 2, duration: 0.3 },
        },
      },

      {
        path: '/adm/jurnal',
        name: 'Rekapitulasi Pengaduan',
        icon: HiDocumentReport,
      },
      {
        type: 'expandable',
        name: 'Notifikasi',
        icon: HiOutlineBell,
        subRoutes: [
          {
            path: '/adm/notifikasi/kirim-',
            name: 'Kirim Notifikasi',
            icon: HiOutlinePencilAlt,
          },
          {
            path: '/adm/notifikasi/list',
            name: 'Daftar Notifikasi',
            icon: HiOutlineMail,
          },
        ],
      },
      {
        path: '/adm/bugs',
        name: 'Laporan Error',
        icon: FaBug,
        motion: {
          whileHover: { y: [0, -3, 0], x: [0, 3, 0] },
          transition: { duration: 0.5 },
        },
      },

      {
        path: '/adm/log-whatsapp',
        name: 'Log WhatsApp',
        icon: HiOutlineMail,
      },

      {
        type: 'expandable',
        name: 'Master Data',
        icon: HiOutlineUserGroup,
        subRoutes: [
          {
            path: '/adm/master-data/categories',
            name: 'Kategori',
            icon: HiOutlineUserGroup,
          },
          {
            path: '/adm/master-data/subcategories',
            name: 'Subkategori',
            icon: HiOutlineUserGroup,
          },

        ]
      },
      {
        path: '/adm/settings',
        name: 'Pengaturan',
        icon: HiOutlineCog,
      },
    ],
  },
  opd: {
    title: 'OPD Panel',
    color: 'purple',
    routes: [
      {
        path: '/opd/dashboard',
        name: 'Dashboard',
        icon: HiOutlineMail,
        motion: {
          whileHover: { rotate: [0, -10, 0] },
          transition: { duration: 0.5 },
        },
      },
      {
        path: '/opd/laporan-warga',
        name: 'Kelola Pengaduan',
        icon: HiMailOpen,
        motion: {
          whileHover: { rotate: [0, -10, 0] },
          transition: { duration: 0.5 },
        },
      },
      {
        path: '/opd/chat',
        name: 'Chat',
        icon: HiChat,
        badge: 'chat',
        motion: { whileHover: { scale: 1.1 }, transition: { duration: 0.3 } },
      },
    ],
  },
  bupati: {
    title: 'Bupati Panel',
    color: 'green',
    routes: [
      {
        path: '/bupati-portal/dashboard',
        name: 'Dashboard',
        icon: HiOutlineMail,
        motion: {
          whileHover: { rotate: [0, -10, 0] },
          transition: { duration: 0.5 },
        },
      },
      {
        path: '/bupati-portal/kelola-pengaduan',
        name: 'Kelola Pengaduan',
        icon: HiMailOpen,
        badge: 'reports',
        motion: {
          whileHover: { rotate: [0, -10, 0] },
          transition: { duration: 0.5 },
        },
      },
      {
        path: '/bupati-portal/riwayat-pengaduan',
        name: 'Riwayat Pengaduan',
        icon: HiOutlineDocumentReport,
        motion: {
          whileHover: { y: [0, -2, 0] },
          transition: { repeat: 2, duration: 0.3 },
        },
      },
      {
        path: '/bupati-portal/chat',
        name: 'Pesan Masuk',
        icon: HiOutlineMail,
        badge: 'chat',
        motion: {
          whileHover: { rotate: [0, -10, 0] },
          transition: { duration: 0.5 },
        },
      },
      {
        path: '/bupati-portal/log-whatsapp',
        name: 'Log WhatsApp',
        icon: HiOutlineMail,
      },
      {
        path: '/bupati-portal/kinerja-opd',
        name: 'Kinerja OPD',
        icon: HiOutlineOfficeBuilding,
        // badge: 'chat',
        motion: {
          whileHover: { rotate: [0, -10, 0] },
          transition: { duration: 0.5 },
        },
      },
    ],
  },
};

