'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWhatsAppLogs } from '@/services/whatsappService';
import WhatsAppChatInterface from './components/WhatsAppInterface';

export default function WhatsAppLogsList() {
  const [chatsLimit, setChatsLimit] = useState(10);

  const {
    data: chats = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['whatsapp-logs', chatsLimit],
    queryFn: () => fetchWhatsAppLogs(chatsLimit),
    refetchInterval: 30000,
  });

  return (
    <div className="p-4">
      <WhatsAppChatInterface
        chats={chats}
        isLoading={isLoading}
        onRefresh={refetch}
        limit={chatsLimit}
        onLoadMore={() => setChatsLimit((prev) => prev + 10)}
      />
    </div>
  );
}
