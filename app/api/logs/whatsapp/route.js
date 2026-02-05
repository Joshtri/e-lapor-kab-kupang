import { NextResponse } from "next/server";
import { getChats, getAvatar } from "@/lib/greenapi";


export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "10");

        // Mengambil daftar chat aktif dari Green-API
        const chats = await getChats();

        // Filter: Hanya ambil chat personal (@c.us) dan bukan nomor sistem '0@c.us'
        const personalChats = chats.filter(chat =>
            chat.id.endsWith("@c.us") && chat.id !== "0@c.us"
        );

        // Limit data sesuai permintaan
        const limitedChats = personalChats.slice(0, limit);

        // Format data untuk sidebar UI dengan avatar
        const formattedChats = await Promise.all(limitedChats.map(async (chat) => {
            const avatarData = await getAvatar(chat.id);

            return {
                id: chat.id,
                number: chat.id.replace("@c.us", ""),
                avatarUrl: avatarData?.urlAvatar || null,
                lastMessage: {
                    // Gunakan teks pesan terakhir, jika kosong gunakan indikator status
                    body: chat.lastMessage && chat.lastMessage.trim() !== ""
                        ? chat.lastMessage
                        : "Pesan terkirim/diterima",
                    date: chat.timestamp ? new Date(chat.timestamp * 1000).toISOString() : new Date().toISOString(),
                },
                // Bersihkan nama dari embel-embel ID WhatsApp
                name: chat.name ? chat.name.split("@")[0] : chat.id.replace("@c.us", ""),
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
