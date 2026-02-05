import webpush from 'web-push';

let vapidConfigured = false;

function ensureVapidConfigured() {
    if (!vapidConfigured) {
        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        const privateKey = process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY;
        const email = process.env.NEXT_PUBLIC_VAPID_EMAIL || 'admin@example.com';

        if (!publicKey || !privateKey) {
            throw new Error('VAPID keys are not configured. Please set NEXT_PUBLIC_VAPID_PUBLIC_KEY and NEXT_PUBLIC_VAPID_PRIVATE_KEY in .env');
        }

        webpush.setVapidDetails(
            `mailto:${email}`,
            publicKey,
            privateKey
        );
        vapidConfigured = true;
    }
}

/**
 * Send web push notification to a specific user
 * @param {string} userId - ID of the user to notify
 * @param {Object} payload - Notification payload { title, body, icon, url, etc }
 */
export async function sendNotificationToUser(userId, payload) {
    ensureVapidConfigured();

    try {
        const prisma = (await import('@/lib/prisma')).default;

        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId },
        });

        if (subscriptions.length === 0) {
            return;
        }

        const payloadString = JSON.stringify(payload);

        const sendPromises = subscriptions.map(async (sub) => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh,
                },
            };

            try {
                await webpush.sendNotification(pushConfig, payloadString);
            } catch (error) {
                if (error.statusCode === 410 || error.statusCode === 404) {
                    await prisma.pushSubscription.delete({
                        where: { id: sub.id },
                    });
                } else {
                    console.error(`Error sending push to subscription ${sub.id}:`, error);
                }
            }
        });

        await Promise.all(sendPromises);
    } catch (error) {
        console.error(`sendNotificationToUser Error for ${userId}:`, error);
    }
}


export default webpush;
