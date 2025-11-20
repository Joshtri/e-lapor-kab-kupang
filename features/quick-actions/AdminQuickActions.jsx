'use client';

import { Card } from 'flowbite-react';
import {
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineMailOpen,
  HiOutlineBell,
  HiOutlineClipboardList,
  HiOutlineBookOpen,
  HiOutlineExclamationCircle,
  HiOutlineGlobeAlt,
} from 'react-icons/hi';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CornerDot from '@/components/CornerDot';

const AdminQuickActions = ({ user }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const quickActions = [
    {
      title: 'Kelola Pengaduan',
      description: 'Lihat dan kelola semua pengaduan yang masuk',
      icon: HiOutlineDocumentText,
      href: '/adm/kelola-pengaduan',
      color: 'blue',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Kelola Pengguna',
      description: 'Atur akun pengguna dan permissions',
      icon: HiOutlineUserGroup,
      href: '/adm/users',
      color: 'green',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Kelola OPD',
      description: 'Atur organisasi perangkat daerah',
      icon: HiOutlineGlobeAlt,
      href: '/adm/org-perangkat-daerah',
      color: 'purple',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Kirim Notifikasi',
      description: 'Kirim notifikasi ke pengguna',
      icon: HiOutlineBell,
      href: '/adm/notifikasi',
      color: 'orange',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Jurnal Pengaduan',
      description: 'Lihat log dan riwayat perubahan pengaduan',
      icon: HiOutlineBookOpen,
      href: '/adm/jurnal',
      color: 'indigo',
      borderColor: 'border-indigo-500',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Riwayat Pengaduan',
      description: 'Lihat riwayat lengkap semua pengaduan',
      icon: HiOutlineClipboardList,
      href: '/adm/riwayat-pengaduan',
      color: 'cyan',
      borderColor: 'border-cyan-500',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      title: 'Laporan Bug',
      description: 'Kelola laporan bug dari pengguna',
      icon: HiOutlineExclamationCircle,
      href: '/adm/bugs',
      color: 'red',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Email',
      description: 'Kelola pesan email ke pengguna',
      icon: HiOutlineMailOpen,
      href: '/adm/mail',
      color: 'pink',
      borderColor: 'border-pink-500',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
      iconColor: 'text-pink-600 dark:text-pink-400',
    },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
        <HiOutlineClipboardList className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
        Aksi Cepat Admin
      </h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <motion.div key={index} variants={item}>
              <Link href={action.href} passHref>
                <Card className={`${action.borderColor} border-l-4 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden h-full`}>
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-${action.color}-500`}></div>
                  <div className="flex items-start">
                    <div className={`${action.bgColor} p-3 rounded-full mr-4 relative flex-shrink-0`}>
                      <IconComponent className={`${action.iconColor} h-6 w-6`} />
                      <CornerDot color={action.color} animate={false} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {action.description}
                      </p>
                      <div className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center hover:text-gray-700 dark:hover:text-gray-200">
                        Buka →
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default AdminQuickActions;
