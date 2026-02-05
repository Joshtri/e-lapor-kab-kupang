import { NextResponse } from 'next/server';
import { sendNotificationToUser } from '@/lib/webPushServer';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, body, icon, url, targetUserId } = await req.json();

        const payload = {
            title: title || 'Notifikasi Baru',
            body: body || 'Anda menerima pesan baru.',
            icon: icon || '/icons/icon-192.png',
            data: {
                url: url || '/',
            },
        };

        // If targetUserId is provided, send to that user, otherwise send to current user
        const recipientId = targetUserId || user.id;

        await sendNotificationToUser(recipientId, payload);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Send push error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
