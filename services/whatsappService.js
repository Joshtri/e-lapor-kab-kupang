import axios from 'axios';

/**
 * Mengambil daftar percakapan (Sidebar)
 */
export const fetchWhatsAppLogs = async (limit = 10) => {
    const response = await axios.get(`/api/logs/whatsapp?limit=${limit}`);
    return response.data;
};


/**
 * Mengambil riwayat pesan untuk satu nomor (Bubble Chat)
 */
export const fetchChatHistory = async (chatId, limit = 10) => {
    const response = await axios.get(`/api/logs/whatsapp/history?chatId=${chatId}&limit=${limit}`);
    return response.data;
};

/**
 * Mengambil notifikasi pesan terbaru (untuk dashboard feed)
 */
export const fetchWhatsAppNotifications = async () => {
    const response = await axios.get('/api/logs/whatsapp/notifications');
    return response.data;
};

/**
 * Mengirim pesan WhatsApp
 */
export const sendWhatsAppMessage = async (chatId, message) => {
    const response = await axios.post('/api/logs/whatsapp/send', {
        to: chatId,
        message: message
    });
    return response.data;
};
