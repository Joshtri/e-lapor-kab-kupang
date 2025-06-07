// const SERVICE_WORKER_FILE_PATH = './sw.js';

// export function notificationUnsupported() {
//   let unsupported = false;
//   if (
//     !('serviceWorker' in navigator) ||
//     !('PushManager' in window) ||
//     !('showNotification' in ServiceWorkerRegistration.prototype)
//   ) {
//     unsupported = true;
//   }
//   return unsupported;
// }

// export function checkPermissionStateAndAct(onSubscribe) {
//   const state = Notification.permission;
//   switch (state) {
//     case 'denied':
//       break;
//     case 'granted':
//       registerAndSubscribe(onSubscribe);
//       break;
//     case 'default':
//       break;
//   }
// }

// async function subscribe(onSubscribe) {
//   navigator.serviceWorker.ready
//     .then((registration) => {
//       return registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array(
//           process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BBO8z1b2Z3k5f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0',
//         ),
//       });
//     })
//     .then((subscription) => {
//       console.info('Created subscription Object: ', subscription.toJSON());
//       submitSubscription(subscription).then(() => {
//         onSubscribe(subscription);
//       });
//     })
//     .catch((e) => {
//       console.error('Failed to subscribe cause of: ', e);
//     });
// }

// async function submitSubscription(subscription) {
//   const endpointUrl = '/api/web-push/subscription';
//   const res = await fetch(endpointUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ subscription }),
//   });
//   const result = await res.json();
//   console.log(result);
// }

// export async function registerAndSubscribe(onSubscribe) {
//   try {
//     await navigator.serviceWorker.register(SERVICE_WORKER_FILE_PATH);
//     await subscribe(onSubscribe);
//   } catch (e) {
//     console.error('Failed to register service-worker: ', e);
//   }
// }

// export async function sendWebPush(message) {
//   const endPointUrl = '/api/web-push/send';
//   const pushBody = {
//     title: 'Test Push',
//     body: message ?? 'This is a test push message',
//     image: '/next.png',
//     icon: 'nextjs.png',
//     url: 'https://google.com',
//   };
//   const res = await fetch(endPointUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(pushBody),
//   });
//   const result = await res.json();
//   console.log(result);
// }

// // Optional: jika kamu perlu gunakan public key dalam bentuk Uint8Array
// function urlBase64ToUint8Array(base64String) {
//   const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

//   const rawData = atob(base64);
//   const outputArray = new Uint8Array(rawData.length);

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }

//   return outputArray;
// }


const SERVICE_WORKER_FILE_PATH = '/sw.js'; // Gunakan path root public

export function notificationUnsupported() {
  return !('serviceWorker' in navigator) ||
         !('PushManager' in window) ||
         !('showNotification' in ServiceWorkerRegistration.prototype);
}

export async function checkPermissionStateAndAct(onSubscribe, userId) {
  const state = Notification.permission;
  if (state === 'granted') {
    await registerAndSubscribe(onSubscribe, userId);
  }
}

export async function registerAndSubscribe(onSubscribe, userId) {
  try {
    await navigator.serviceWorker.register(SERVICE_WORKER_FILE_PATH);
    await subscribe(onSubscribe, userId);
  } catch (e) {
    console.error('❌ Failed to register service-worker:', e);
  }
}

async function subscribe(onSubscribe, userId) {
  try {
    const registration = await navigator.serviceWorker.ready;

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      console.error('❌ VAPID key is missing in .env');
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    console.info('✅ Subscription created:', subscription.toJSON());

    await submitSubscription(subscription, userId);
    onSubscribe(subscription);
  } catch (e) {
    console.error('❌ Subscription failed:', e);
  }
}

async function submitSubscription(subscription, userId) {
  try {
    const res = await fetch('/api/web-push/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        subscription: {
          endpoint: subscription.endpoint,
          keys: subscription.toJSON().keys,
        },
      }),
    });

    const result = await res.json();
    console.log('📩 Subscription result:', result);
  } catch (e) {
    console.error('❌ Failed to send subscription:', e);
  }
}

export async function sendWebPush(message, userId) {
  const payload = {
    title: 'Test Push',
    body: message ?? 'This is a test push message',
    image: '/next.png',
    icon: 'nextjs.png',
    url: 'https://google.com',
    userId,
  };

  try {
    const res = await fetch('/api/web-push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log('📨 Push sent result:', result);
  } catch (e) {
    console.error('❌ Failed to send push:', e);
  }
}

// Utility
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}
