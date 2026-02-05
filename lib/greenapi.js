import axios from "axios";

const GREEN_API_ID = process.env.GREEN_API_ID_INSTANCE;
const GREEN_API_TOKEN = process.env.GREEN_API_API_TOKEN;
const GREEN_API_URL = "https://api.green-api.com";

/**
 * Mendapatkan daftar chat aktif
 */
export const getChats = async () => {
    try {
        const response = await axios.get(
            `${GREEN_API_URL}/waInstance${GREEN_API_ID}/getChats/${GREEN_API_TOKEN}`
        );
        return response.data;
    } catch (error) {
        console.error("Green-API getChats Error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Mendapatkan riwayat pesan untuk chat tertentu
 */
export const getChatHistory = async (chatId, count = 50) => {
    try {
        const response = await axios.post(
            `${GREEN_API_URL}/waInstance${GREEN_API_ID}/getChatHistory/${GREEN_API_TOKEN}`,
            {
                chatId: chatId,
                count: count,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Green-API getChatHistory Error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Mendapatkan avatar (profile picture) untuk chatId tertentu
 */
export const getAvatar = async (chatId) => {
    try {
        const response = await axios.post(
            `${GREEN_API_URL}/waInstance${GREEN_API_ID}/getAvatar/${GREEN_API_TOKEN}`,
            { chatId }
        );
        return response.data; // { urlAvatar, available }
    } catch (error) {
        console.error("Green-API getAvatar Error:", error.response?.data || error.message);
        return { urlAvatar: "", available: false };
    }
};

/**
 * Mendapatkan pesan masuk terakhir (untuk notifikasi dashboard)
 */
export const getLastIncomingMessages = async (minutes = 1440) => {
    try {
        const response = await axios.get(
            `${GREEN_API_URL}/waInstance${GREEN_API_ID}/lastIncomingMessages/${GREEN_API_TOKEN}?minutes=${minutes}`
        );
        return response.data;
    } catch (error) {
        console.error("Green-API lastIncomingMessages Error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Mengirim pesan teks
 */
export const sendWhatsApp = async (chatId, message) => {
    try {
        const response = await axios.post(
            `${GREEN_API_URL}/waInstance${GREEN_API_ID}/sendMessage/${GREEN_API_TOKEN}`,
            {
                chatId: chatId.includes("@") ? chatId : `${chatId}@c.us`,
                message: message,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Green-API sendMessage Error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Normalisasi nomor HP ke format chatId (628123456789@c.us)
 */
export const formatToChatId = (phone) => {
    if (!phone) return "";
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
        clean = "62" + clean.slice(1);
    } else if (clean.startsWith("8")) {
        clean = "62" + clean;
    }
    return clean.includes("@") ? clean : `${clean}@c.us`;
};

export default {
    getChats,
    getChatHistory,
    getAvatar,
    getLastIncomingMessages,
    sendWhatsApp,
    formatToChatId,
};
