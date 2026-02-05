import { NextResponse } from "next/server";
import { getChats, getAvatar, getLastIncomingMessages } from "@/lib/greenapi";



export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "10");
        const query = searchParams.get("query")?.toLowerCase() || "";

        // 1. Ambil pesan masuk terakhir (seperti dashboard) untuk tahu siapa yang baru chat
        const recentMessages = await getLastIncomingMessages(1440).catch(() => []);

        // 2. Ambil daftar chat lengkap
        const allChats = await getChats().catch(() => []);

        // MAP untuk menyimpan info terbaru per chatId
        const chatMap = new Map();

        // Masukkan data dari pesan terbaru dulu (biar akurat)
        recentMessages.forEach(msg => {
            if (!msg.chatId.endsWith("@c.us") || msg.chatId === "0@c.us") return;
            if (!chatMap.has(msg.chatId)) {
                chatMap.set(msg.chatId, {
                    id: msg.chatId,
                    name: msg.senderName || msg.senderId.split("@")[0],
                    lastMessage: msg.textMessage || (msg.typeMessage === "imageMessage" ? "📷 Gambar" : "📎 Media"),
                    timestamp: msg.timestamp,
                    avatarUrl: null // Akan diisi nanti
                });
            }
        });

        // Masukkan/Lengkapi dari daftar semua chat jika belum ada di map
        allChats.forEach(chat => {
            if (!chat.id.endsWith("@c.us") || chat.id === "0@c.us") return;
            if (!chatMap.has(chat.id)) {
                chatMap.set(chat.id, {
                    id: chat.id,
                    name: chat.name || chat.id.split("@")[0],
                    lastMessage: "Pesan terkirim/diterima",
                    timestamp: chat.timestamp || 0,
                    avatarUrl: null
                });
            } else if (chat.name && !chatMap.get(chat.id).name.includes("628")) {
                // Update nama jika di getChats lebih bagus (ada nama kontaknya)
                chatMap.get(chat.id).name = chat.name.split("@")[0];
            }
        });

        // 3. Convert Map ke Array dan Filter
        let activeChats = Array.from(chatMap.values());

        // 4. Sort by timestamp DESC (Pesan terbaru di atas) - INI YANG CRITICAL
        activeChats.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        // 5. Pencarian (Jika ada query)
        if (query) {
            activeChats = activeChats.filter(chat =>
                chat.name.toLowerCase().includes(query) ||
                chat.id.includes(query)
            );
        }

        // 6. Limit data
        const limitedChats = activeChats.slice(0, limit);

        // 7. Format final & ambil avatar (Paralel biar kenceng)
        const formattedChats = await Promise.all(limitedChats.map(async (chat) => {
            const avatarData = await getAvatar(chat.id);

            return {
                id: chat.id,
                number: chat.id.replace("@c.us", ""),
                avatarUrl: avatarData?.urlAvatar || null,
                lastMessage: {
                    body: chat.lastMessage,
                    date: chat.timestamp ? new Date(chat.timestamp * 1000).toISOString() : new Date().toISOString(),
                },
                name: chat.name,
            };
        }));

        return NextResponse.json(formattedChats, { status: 200 });


    } catch (error) {
        console.error("Green-API Route Error:", error);
        return NextResponse.json(
            { error: "Gagal mengambil daftar chat dari Green-API", details: error.message },
            { status: 500 }
        );
    }
}
