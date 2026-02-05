import { NextResponse } from "next/server";
import { getLastIncomingMessages, getAvatar } from "@/lib/greenapi";

export async function GET() {
    try {
        // Mengambil pesan masuk terakhir dari Green-API (default 24 jam)
        const messages = await getLastIncomingMessages(1440);

        // Filter: Hanya ambil chat personal, urutkan terbaru, dan batasi ke 10 pesan
        const personalMessages = messages
            .filter(msg => msg.chatId.endsWith("@c.us") && msg.chatId !== "10000000000@c.us")
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)) // Urutkan terbaru paling atas
            .slice(0, 10);


        // Format untuk dashboard feed dengan avatar
        const formattedNotifications = await Promise.all(personalMessages.map(async (msg) => {
            const avatarData = await getAvatar(msg.chatId);

            return {
                id: msg.idMessage,
                chatId: msg.chatId,
                senderName: msg.senderName || msg.senderId.split("@")[0],
                avatarUrl: avatarData?.urlAvatar || null,
                text: msg.textMessage || (msg.typeMessage === "imageMessage" ? "📷 Gambar" : "📎 Media"),
                timestamp: msg.timestamp ? new Date(msg.timestamp * 1000).toISOString() : new Date().toISOString(),
            };
        }));


        return NextResponse.json(formattedNotifications, { status: 200 });
    } catch (error) {
        console.error("WhatsApp Notifications Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
