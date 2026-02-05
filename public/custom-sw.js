/* global importScripts, clients */
try {
    importScripts('./sw.js');
} catch (e) {
    console.warn('⚠️ sw.js (next-pwa caching) not found or failed to load. Push functionality still works.');
}



self.addEventListener('push', (event) => {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    try {
        const data = event.data.json();
        const title = data.title || 'Notifikasi E-Lapor';
        const options = {
            body: data.body || 'Ada pesan baru untuk Anda',
            icon: data.icon || '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            vibrate: [100, 50, 100],
            data: {
                url: data.data?.url || '/',
            },
        };

        event.waitUntil(self.registration.showNotification(title, options));
    } catch (error) {
        console.error('Error handling push event:', error);
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
