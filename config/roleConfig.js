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
} from 'react-icons/hi';
import { FaBug } from 'react-icons/fa';

export const roleConfig = {
  admin: {
    title: 'Mail Admin',
    color: 'blue',
    routes: [
      {
        path: '/adm/dashboard',
        name: 'Dashboard',
        icon: HiOutlineMail,
      },

      {
        path: '/adm/report-warga',
        name: 'Kelola Pengaduan',
        icon: HiMailOpen,
      },
      {
        path: '/adm/users',
        name: 'Manajemen Pengguna',
        icon: HiOutlineUserGroup,
      },
      {
        path: '/adm/org-perangkat-daerah',
        name: 'Manajemen OPD',
        icon: HiOutlineOfficeBuilding,
      },
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
        name: 'Jurnal Pengaduan',
        icon: HiDocumentReport,
      },
      {
        type: 'expandable',
        name: 'Notification',
        icon: HiOutlineBell,
        subRoutes: [
          {
            path: '/adm/notifications/send-notifications',
            name: 'Send Notification',
            icon: HiOutlinePencilAlt,
          },
          {
            path: '/adm/notifications/list-notifications',
            name: 'List Notification',
            icon: HiOutlineMail,
          },
        ],
      },
      {
        path: '/adm/bugs',
        name: 'Bug Report',
        icon: FaBug,
        motion: {
          whileHover: { y: [0, -3, 0], x: [0, 3, 0] },
          transition: { duration: 0.5 },
        },
      },
    ],
  },
  opd: {
    title: 'OPD Mail',
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
    title: 'Bupati Mail',
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
        path: '/bupati-portal/laporan-warga',
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
    ],
  },
};
