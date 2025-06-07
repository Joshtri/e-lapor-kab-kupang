// /app/push-subscribe.js

// 1. Register service worker
const registration = await navigator.serviceWorker.register('/sw.js');

// 2. Subscribe push manager
const sub = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  ),
});

console.log('✅ Subscription:', sub.toJSON());

// 3. Kirim ke server (jika perlu)
await fetch('/api/web-push/subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 4, // <- ubah sesuai ID user login
    subscription: {
      endpoint: sub.endpoint,
      keys: sub.toJSON().keys,
    },
  }),
});

// Utility
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}
