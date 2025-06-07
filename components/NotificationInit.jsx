'use client';

import { useEffect, useState } from 'react';
import { notificationUnsupported, registerAndSubscribe } from '@/app/Push';
import { getUserIdFromCookie } from '@/lib/auth-client';

export default function NotificationInit() {
  const [hasSubscribed, setHasSubscribed] = useState(false);

  useEffect(() => {
    const userId = getUserIdFromCookie();
    if (!userId || notificationUnsupported()) return;

    const permission = Notification.permission;

    if (permission === 'granted') {
      registerAndSubscribe(async (subscription) => {
        const res = await fetch('/api/web-push/subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            subscription: {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
              },
            },
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setHasSubscribed(true);
          console.log('✅ Subscription saved');
        } else {
          console.error('❌ Failed to save subscription', data);
        }
      });
    }
  }, []);

  return null;
}
