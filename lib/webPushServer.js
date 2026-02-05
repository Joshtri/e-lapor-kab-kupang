import webpush from 'web-push';

const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    privateKey: process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
    `mailto:${process.env.NEXT_PUBLIC_VAPID_EMAIL || 'admin@example.com'}`,
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

/**
 * Send web push notification to a specific user
 * @param {string} userId - ID of the user to notify
 * @param {Object} payload - Notification payload { title, body, icon, url, etc }
 */
export async function sendNotificationToUser(userId, payload) {
    try {
        const prisma = (await import('@/lib/prisma')).default;

        // Get all subscriptions for this user
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId },
        });

        if (subscriptions.length === 0) {
            console.log(`No push subscriptions found for user ${userId}`);
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
                    // Subscription has expired or is no longer valid, delete it
                    await prisma.pushSubscription.delete({
                        where: { id: sub.id },
                    });
                    console.log(`Deleted expired subscription for user ${userId}`);
                } else {
                    console.error(`Error sending push to subscription ${sub.id}:`, error);
                }
            }
        });

        await Promise.all(sendPromises);
    } catch (error) {
        console.error('sendNotificationToUser Error:', error);
    }
}

export default webpush;
