'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchWhatsAppNotifications } from '@/services/whatsappService';
import { HiOutlineChat, HiOutlineUser, HiRefresh } from 'react-icons/hi';
import { format, isToday, isYesterday } from 'date-fns';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DashboardWhatsApp = () => {
  const pathname = usePathname();
  const isBupati = pathname?.includes('bupati-portal');
  const logPath = isBupati
    ? '/bupati-portal/log-whatsapp'
    : '/adm/log-whatsapp';

  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['whatsapp-notifications-dashboard'],
    queryFn: fetchWhatsAppNotifications,
    refetchInterval: 60000, // Refresh every 1 minute to save resources
  });

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isToday(d)) return format(d, 'HH:mm');
    if (isYesterday(d)) return 'Kemarin';
    return format(d, 'dd/MM/yy');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <HiOutlineChat className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white leading-none">
              WhatsApp Terbaru
            </h3>
            <p className="text-[10px] text-gray-500 mt-1">
              Pesan masuk terakhir
            </p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          title="Refresh"
        >
          <HiRefresh
            className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && notifications.length === 0 ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3 opacity-20">
              <HiOutlineChat className="w-6 h-6" />
            </div>
            <p className="text-xs">Tidak ada pesan masuk terbaru</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-default border-l-4 border-l-transparent hover:border-l-green-500"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                    {notif.avatarUrl ? (
                      <img
                        src={notif.avatarUrl}
                        alt={notif.senderName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <HiOutlineUser className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {notif.senderName}
                      </p>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {formatTime(notif.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 italic">
                      &quot;{notif.text}&quot;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
        <Link
          href={logPath}
          className="flex items-center justify-center gap-2 py-2 w-full bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95"
        >
          Buka Semua Chat & Balas
        </Link>
      </div>
    </div>
  );
};

export default DashboardWhatsApp;
