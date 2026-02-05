'use client';

import { useState, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import {
  notificationUnsupported,
  registerAndSubscribe,
  checkPermissionStateAndAct,
} from '@/lib/webPushClient';

export default function NotificationPermissionBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if (notificationUnsupported()) {
      return;
    }

    // Check current permission state
    const permission = Notification.permission;

    if (permission === 'denied') {
      setPermissionDenied(true);
      return;
    }

    if (permission === 'granted') {
      // Already granted, auto-subscribe
      checkPermissionStateAndAct((subscription) => {
        setIsSubscribed(true);
      });
      return;
    }

    // Permission is 'default' - show banner
    // Check if user has dismissed the banner before (use localStorage)
    const dismissed = localStorage.getItem('notification-banner-dismissed');
    if (!dismissed) {
      // Show banner after 3 seconds
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleRequestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        setShowBanner(false);
        await registerAndSubscribe((subscription) => {
          setIsSubscribed(true);
          console.log('Successfully subscribed to push notifications');
        });
      } else if (permission === 'denied') {
        setPermissionDenied(true);
        setShowBanner(false);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Remember dismissal for 7 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    localStorage.setItem('notification-banner-dismissed', expiryDate.toISOString());
  };

  const handleEnableAgain = () => {
    localStorage.removeItem('notification-banner-dismissed');
    setShowBanner(true);
  };

  if (!showBanner && !isSubscribed && !permissionDenied) {
    return null;
  }

  if (permissionDenied) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg max-w-md z-50">
        <div className="flex items-start">
          <FaBell className="text-red-500 mt-1 mr-3" size={20} />
          <div className="flex-1">
            <p className="font-semibold text-sm">Notifikasi Diblokir</p>
            <p className="text-xs mt-1">
              Anda telah memblokir notifikasi. Untuk mengaktifkan, buka pengaturan browser Anda.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isSubscribed) {
    return null; // Don't show anything if already subscribed
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-blue-400 shadow-2xl rounded-lg max-w-md z-50 animate-slide-up">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 rounded-lg mr-3">
              <FaBell className="text-white" size={24} />
            </div>
            <h3 className="font-bold text-gray-800">Aktifkan Notifikasi</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Tutup"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4 ml-14">
          Dapatkan notifikasi real-time tentang status pengaduan, balasan pesan, dan update penting lainnya.
        </p>

        <div className="flex gap-2 ml-14">
          <button
            onClick={handleRequestPermission}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Aktifkan
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
