import { NextResponse } from "next/server";
import { getChatHistory } from "@/lib/greenapi";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!chatId) {
        return NextResponse.json({ error: "chatId is required" }, { status: 400 });
    }

    try {
        const history = await getChatHistory(chatId, limit);


        // Format history Green-API ke format UI kita
        const formattedMessages = history.map((msg) => ({
            sid: msg.idMessage,
            body: msg.textMessage || msg.caption || "[Media]",
            direction: msg.type === "outgoing" ? "outbound" : "inbound", // Green-API: outgoing/incoming
            dateSent: msg.timestamp ? new Date(msg.timestamp * 1000).toISOString() : new Date().toISOString(),
            status: msg.statusMessage, // delivered, read, etc
        })).reverse(); // Green-API biasanya mengembalikan yang terbaru dulu, kita butuh urutan waktu

        return NextResponse.json(formattedMessages, { status: 200 });
    } catch (error) {
        console.error("Green-API History Error:", error);
        return NextResponse.json(
            { error: "Gagal mengambil riwayat pesan", details: error.message },
            { status: 500 }
        );
    }
}
