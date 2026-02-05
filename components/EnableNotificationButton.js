'use client';

import { useState, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import {
  notificationUnsupported,
  registerAndSubscribe,
} from '@/lib/webPushClient';

export default function EnableNotificationButton() {
  const [notificationStatus, setNotificationStatus] = useState('checking'); // checking | unsupported | default | granted | denied
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = () => {
    if (notificationUnsupported()) {
      setNotificationStatus('unsupported');
      return;
    }

    const permission = Notification.permission;
    setNotificationStatus(permission);
  };

  const handleEnableNotification = async () => {
    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);

      if (permission === 'granted') {
        await registerAndSubscribe((subscription) => {
          console.log('Successfully subscribed:', subscription);
        });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (notificationStatus === 'checking') {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
        <span className="text-sm">Memeriksa status notifikasi...</span>
      </div>
    );
  }

  if (notificationStatus === 'unsupported') {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-500 mt-1 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 text-sm">
              Notifikasi Tidak Didukung
            </h4>
            <p className="text-yellow-700 dark:text-yellow-500 text-xs mt-1">
              Browser Anda tidak mendukung push notification. Silakan gunakan browser modern seperti Chrome, Firefox, atau Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (notificationStatus === 'granted') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FaCheckCircle className="text-green-600 dark:text-green-500 mt-1 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-semibold text-green-800 dark:text-green-400 text-sm">
              Notifikasi Aktif
            </h4>
            <p className="text-green-700 dark:text-green-500 text-xs mt-1">
              Anda akan menerima notifikasi push untuk update penting.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (notificationStatus === 'denied') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="text-red-600 dark:text-red-500 mt-1 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-semibold text-red-800 dark:text-red-400 text-sm">
              Notifikasi Diblokir
            </h4>
            <p className="text-red-700 dark:text-red-500 text-xs mt-1">
              Anda telah memblokir notifikasi. Untuk mengaktifkan kembali:
            </p>
            <ol className="text-red-700 dark:text-red-500 text-xs mt-2 ml-4 list-decimal space-y-1">
              <li>Klik ikon gembok/info di address bar</li>
              <li>Cari pengaturan "Notifications"</li>
              <li>Ubah dari "Block" ke "Allow"</li>
              <li>Refresh halaman ini</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Status is 'default' - show enable button
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <FaBell className="text-blue-600 dark:text-blue-500 mt-1 flex-shrink-0" size={20} />
        <div className="flex-1">
          <h4 className="font-semibold text-blue-800 dark:text-blue-400 text-sm">
            Aktifkan Notifikasi Push
          </h4>
          <p className="text-blue-700 dark:text-blue-500 text-xs mt-1 mb-3">
            Dapatkan notifikasi real-time untuk update pengaduan, pesan baru, dan informasi penting lainnya.
          </p>
          <button
            onClick={handleEnableNotification}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Mengaktifkan...</span>
              </>
            ) : (
              <>
                <FaBell />
                <span>Aktifkan Notifikasi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
