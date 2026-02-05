import { NextResponse } from "next/server";
import { sendWhatsApp } from "@/lib/greenapi";

export async function POST(req) {
    try {
        const { to, message } = await req.json();

        if (!to || !message) {
            return NextResponse.json(
                { error: "Tujuan (to) dan pesan (message) wajib diisi" },
                { status: 400 }
            );
        }

        // Mengirim pesan menggunakan Green-API
        // Green-API butuh chatId (e.g. 628123456789@c.us)
        const result = await sendWhatsApp(to, message);

        return NextResponse.json({ success: true, result }, { status: 200 });
    } catch (error) {
        console.error("Green-API Send Message Error:", error);
        return NextResponse.json(
            { error: "Gagal mengirim pesan melalui Green-API", details: error.message },
            { status: 500 }
        );
    }
}
