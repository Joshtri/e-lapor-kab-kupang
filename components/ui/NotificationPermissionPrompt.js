'use client';

import { useEffect, useState } from 'react';

export default function NotificationPermissionPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (
      'Notification' in window &&
      Notification.permission === 'default' &&
      'serviceWorker' in navigator
    ) {
      setShowPrompt(true);
    }
  }, []);

  const handleAllow = async () => {
    const permission = await Notification.requestPermission();
    setShowPrompt(false);

    if (permission === 'granted') {
      console.log('🔔 Izin notifikasi diberikan!');
      // TODO: Tambahkan registerAndSubscribe() jika diinginkan
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white text-gray-800 shadow-xl border border-gray-200 rounded-lg p-4 z-50 max-w-sm dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 transition-colors">
      <p className="text-sm mb-3">
        Izinkan notifikasi untuk mendapatkan info terbaru dari sistem Lapor KK
        Bupati.
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleClose}
          className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition"
        >
          Nanti saja
        </button>
        <button
          onClick={handleAllow}
          className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Izinkan
        </button>
      </div>
    </div>
  );
}
