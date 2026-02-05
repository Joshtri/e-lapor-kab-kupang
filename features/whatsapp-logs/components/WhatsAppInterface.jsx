'use client';

import { format, isToday, isYesterday } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  HiCheck,
  HiOutlineUser,
  HiSearch,
  HiRefresh,
  HiChevronLeft,
  HiPaperAirplane,
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchChatHistory,
  sendWhatsAppMessage,
} from '@/services/whatsappService';
import { toast } from 'sonner';
import PropTypes from 'prop-types';

export function WhatsAppChatListItem({ chat, isActive, onClick }) {
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isToday(d)) return format(d, 'HH:mm');
    if (isYesterday(d)) return 'Kemarin';
    return format(d, 'dd/MM/yy');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => onClick(chat.id)}
      className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
        isActive
          ? 'bg-gray-100 dark:bg-gray-800 border-l-4 border-l-green-500'
          : ''
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 shadow-sm transition-transform active:scale-90">
          {chat.avatarUrl ? (
            <img
              src={chat.avatarUrl}
              alt={chat.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <HiOutlineUser className="w-7 h-7" />
          )}
        </div>
      </div>

      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-baseline">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {chat.name || chat.number}
          </h3>
          <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
            {formatTime(chat.lastMessage.date)}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
          {chat.lastMessage.body}
        </p>
      </div>
    </motion.div>
  );
}

WhatsAppChatListItem.propTypes = {
  chat: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default function WhatsAppChatInterface({
  chats,
  isLoading,
  onRefresh,
  limit: chatsLimit,
  onLoadMore,
  search,
  onSearchChange,
}) {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [limit, setLimit] = useState(10);
  const scrollRef = useRef(null);

  // Reset limit when chat changes
  useEffect(() => {
    setLimit(10);
  }, [selectedChatId]);

  // Fetch history for selected chat
  const {
    data: messages = [],
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['whatsapp-history', selectedChatId, limit],
    queryFn: () => fetchChatHistory(selectedChatId, limit),
    enabled: !!selectedChatId,
  });

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedChatId, isLoadingHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedChatId || isSending) return;

    setIsSending(true);
    try {
      await sendWhatsAppMessage(selectedChatId, replyMessage);
      setReplyMessage('');
      toast.success('Pesan terkirim');
      refetchHistory();
    } catch (error) {
      toast.error(
        'Gagal mengirim: ' + (error.response?.data?.error || error.message),
      );
    } finally {
      setIsSending(false);
    }
  };

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  return (
    <div className="flex h-[calc(100vh-160px)] bg-[#f0f2f5] dark:bg-gray-950 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Sidebar - Chat List */}
      <div
        className={`w-full md:w-1/3 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 ${selectedChatId ? 'hidden md:flex' : 'flex'}`}
      >
        <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            WhatsApp Log
          </h2>
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all active:rotate-180"
          >
            <HiRefresh
              className={`w-5 h-5 ${isLoading ? 'animate-spin text-green-500' : ''}`}
            />
          </button>
        </div>

        <div className="px-3 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="relative group">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-green-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari chat..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 dark:text-white transition-all shadow-inner"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading && chats.length === 0 ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 animate-pulse"
                >
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {chats.map((chat) => (
                  <WhatsAppChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={selectedChatId === chat.id}
                    onClick={setSelectedChatId}
                  />
                ))}
              </AnimatePresence>

              {chats.length >= chatsLimit && (
                <div className="p-4 text-center bg-gray-50/30 dark:bg-gray-800/30">
                  <button
                    onClick={onLoadMore}
                    className="text-xs font-bold text-green-600 hover:text-green-700 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all active:scale-95"
                  >
                    Tampilkan Lebih Banyak
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Chat View */}
      <div
        className={`flex-1 flex flex-col bg-[#e5ddd5] dark:bg-gray-800 relative ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}
      >
        {selectedChat ? (
          <>
            <div className="p-3 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center shadow-sm z-10 border-b border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setSelectedChatId(null)}
                className="md:hidden mr-2 p-2 text-gray-600 hover:bg-gray-200 rounded-full"
              >
                <HiChevronLeft className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white mr-3 shadow-sm">
                {selectedChat.avatarUrl ? (
                  <img
                    src={selectedChat.avatarUrl}
                    alt={selectedChat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <HiOutlineUser className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-gray-900 dark:text-white truncate">
                  {selectedChat.name || selectedChat.number}
                </h3>
                <p className="text-[10px] text-green-500 font-medium">Online</p>
              </div>
            </div>

            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://res.cloudinary.com/dfst6m7ue/image/upload/v1700000000/wa-bg_gzkqjx.png')] bg-repeat"></div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col space-y-4 z-0 custom-scrollbar"
            >
              {isLoadingHistory && messages.length === 0 ? (
                <div className="flex justify-center p-4">
                  <HiRefresh className="w-8 h-8 animate-spin text-green-600 opacity-20" />
                </div>
              ) : (
                <>
                  {messages.length >= limit && (
                    <div className="flex justify-center pb-4">
                      <button
                        onClick={() => setLimit((prev) => prev + 10)}
                        className="text-[10px] font-bold text-gray-500 hover:text-green-600 bg-white dark:bg-gray-700 px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-600 transition-all active:scale-95"
                      >
                        {isLoadingHistory
                          ? 'Memuat...'
                          : 'Lihat pesan sebelumnya'}
                      </button>
                    </div>
                  )}
                  {messages.map((msg, idx) => {
                    const isOutbound = msg.direction === 'outbound';
                    const prevMsg = messages[idx - 1];
                    const showDate =
                      !prevMsg ||
                      format(new Date(msg.dateSent), 'yyyy-MM-dd') !==
                        format(new Date(prevMsg.dateSent), 'yyyy-MM-dd');

                    return (
                      <div key={msg.sid} className="space-y-4">
                        {showDate && (
                          <div className="flex justify-center my-6">
                            <span className="px-3 py-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg text-[10px] uppercase font-bold text-gray-500 shadow-sm border border-gray-100 dark:border-gray-700">
                              {isToday(new Date(msg.dateSent))
                                ? 'Hari Ini'
                                : isYesterday(new Date(msg.dateSent))
                                  ? 'Kemarin'
                                  : format(
                                      new Date(msg.dateSent),
                                      'd MMMM yyyy',
                                      { locale: id },
                                    )}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                        >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`max-w-[85%] md:max-w-[70%] p-2.5 px-3.5 rounded-2xl shadow-md relative ${
                              isOutbound
                                ? 'bg-[#dcf8c6] dark:bg-emerald-800 text-gray-800 dark:text-gray-100 rounded-tr-none border-t border-r border-green-200 dark:border-emerald-700'
                                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none border-t border-l border-gray-100 dark:border-gray-600'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                              {msg.body}
                            </p>
                            <div className="flex items-center justify-end space-x-1 mt-1.5 opacity-60">
                              <span className="text-[9px] uppercase font-semibold">
                                {format(new Date(msg.dateSent), 'HH:mm')}
                              </span>
                              {isOutbound && (
                                <HiCheck
                                  className={`w-3 h-3 ${msg.status === 'read' ? 'text-blue-500' : 'text-gray-400'}`}
                                />
                              )}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            <div className="p-4 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-10">
              <form onSubmit={handleSend} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Tulis pesan..."
                  className="flex-1 py-3 px-5 bg-white dark:bg-gray-800 border-none rounded-2xl text-sm shadow-inner focus:ring-2 focus:ring-green-500/30 dark:text-white"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={!replyMessage.trim() || isSending}
                  className={`p-3.5 rounded-2xl shadow-lg transition-all active:scale-95 ${
                    !replyMessage.trim() || isSending
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 transform hover:-translate-y-0.5'
                  }`}
                >
                  {isSending ? (
                    <HiRefresh className="w-5 h-5 animate-spin" />
                  ) : (
                    <HiPaperAirplane className="w-5 h-5 rotate-90" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <div className="w-24 h-24 bg-white/50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-6 shadow-inner animate-bounce duration-[3s]">
              <HiOutlineUser className="w-12 h-12 opacity-20" />
            </div>
            <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-2">
              WhatsApp Admin e-Lapor
            </h3>
            <p className="max-w-xs text-sm opacity-60">
              Pilih salah satu percakapan di samping untuk melihat riwayat pesan
              dan membalas pengaduan warga.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

WhatsAppChatInterface.propTypes = {
  chats: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  limit: PropTypes.number,
  onLoadMore: PropTypes.func,
  search: PropTypes.string,
  onSearchChange: PropTypes.func,
};
