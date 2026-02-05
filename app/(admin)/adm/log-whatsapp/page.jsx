import WhatsAppLogsList from '@/features/whatsapp-logs';

export const metadata = {
  title: 'Log WhatsApp | Admin Panel',
  description: 'Melihat riwayat pesan WhatsApp melalui Green-API',
};

export default function WhatsAppLogPage() {
  return (
    <div className="p-4">
      <WhatsAppLogsList />
    </div>
  );
}
