'use client';

import { Card } from 'flowbite-react';
import {
  HiOutlineDocumentText,
  HiOutlineChatAlt2,
  HiOutlineMailOpen,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineUser,
} from 'react-icons/hi';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CornerDot from '@/components/CornerDot';

const OpdQuickActions = ({ user }) => {
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
      title: 'Laporan Masuk',
      description: 'Lihat laporan yang diarahkan ke OPD Anda',
      icon: HiOutlineDocumentText,
      href: '/opd/laporan-warga',
      color: 'blue',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Chat dengan Pelapor',
      description: 'Berkomunikasi dengan pelapor pengaduan',
      icon: HiOutlineChatAlt2,
      href: '/opd/chat',
      color: 'green',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Laporan Diproses',
      description: 'Lihat laporan yang sedang Anda proses',
      icon: HiOutlineExclamationCircle,
      href: '/opd/laporan-warga?status=PROSES',
      color: 'orange',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Laporan Selesai',
      description: 'Lihat laporan yang sudah diselesaikan',
      icon: HiOutlineCheckCircle,
      href: '/opd/laporan-warga?status=SELESAI',
      color: 'teal',
      borderColor: 'border-teal-500',
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
      iconColor: 'text-teal-600 dark:text-teal-400',
    },
    {
      title: 'Profil OPD',
      description: 'Kelola data dan informasi OPD Anda',
      icon: HiOutlineUser,
      href: '/opd/profile',
      color: 'purple',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  const opdName = user?.opd?.name || 'OPD Anda';

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
        <HiOutlineDocumentText className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
        Aksi Cepat {opdName}
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

export default OpdQuickActions;
