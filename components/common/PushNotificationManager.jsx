'use client';

import { useEffect } from 'react';

const PushNotificationManager = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        'serviceWorker' in navigator
      ) {
        if (Notification.permission === 'granted') {
          await registerAndSubscribe();
        } else if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            await registerAndSubscribe();
          }
        }
      }
    };

    const registerAndSubscribe = async () => {
      try {
        const { registerAndSubscribe: subscribe } = await import(
          '@/lib/webPushClient'
        );
        subscribe();
      } catch (error) {
        // Silently fail in production
      }
    };

    // Jalankan delay sedikit agar tidak memblokir render utama
    const timer = setTimeout(setupNotifications, 3000);
    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default PushNotificationManager;
