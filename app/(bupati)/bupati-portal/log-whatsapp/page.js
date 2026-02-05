import WhatsAppLogsList from '@/features/whatsapp-logs';

export const metadata = {
    title: 'Log WhatsApp | Bupati Portal',
    description: 'Melihat riwayat pesan WhatsApp warga',
};

export default function WhatsAppLogBupatiPage() {
    return (
        <div className="p-4">
            <WhatsAppLogsList />
        </div>
    );
}
