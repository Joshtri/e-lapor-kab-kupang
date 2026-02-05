import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();

        // Log untuk memantau data yang masuk di terminal
        console.log("Incoming Message from Green-API:", JSON.stringify(body, null, 2));

        const typeWebhook = body.typeWebhook;

        // Jika ada pesan masuk
        if (typeWebhook === "incomingMessageReceived") {
            const senderData = body.senderData;
            const messageData = body.messageData;

            console.log(`Ada pesan baru dari ${senderData.senderName} (${senderData.sender}):`);
            console.log(`Isi: ${messageData.textMessageData?.textMessage || "[Media]"}`);

            // DISINI: Nantinya kita bisa tambahkan logika untuk simpan ke database 
            // atau kirim notifikasi real-time ke UI menggunakan Socket.io/Pusher
        }

        return NextResponse.json({ status: "success" }, { status: 200 });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
