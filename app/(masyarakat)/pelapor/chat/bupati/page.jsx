'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Card, Textarea, Button, Spinner } from 'flowbite-react';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import { AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import MessageBubble from '@/features/chat/MessageBubble';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function ChatBupatiPage() {
  const [roomId, setRoomId] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Init room only once
  useEffect(() => {
    const initRoom = async () => {
      try {
        const res = await axios.get('/api/pelapor/chat/rooms');
        let room = res.data.find((r) => r.isToBupati);

        if (!room) {
          const newRoom = await axios.post('/api/pelapor/chat/create-room', {
            isToBupati: true,
          });
          room = newRoom.data;
        }

        setRoomId(room.id);
      } catch (err) {
        'Gagal inisialisasi room:', err;
      }
    };

    initRoom();
  }, []);

  // SWR untuk ambil pesan berdasarkan roomId
  const {
    data: messages = [],
    isLoading,
    mutate,
  } = useSWR(
    roomId ? `/api/pelapor/chat/rooms/${roomId}/messages` : null,
    fetcher,
    {
      refreshInterval: 2000, // refresh otomatis setiap 5 detik
    },
  );

  // Tandai sebagai sudah dibaca setiap kali data pesan berubah
  useEffect(() => {
    if (roomId && messages.length) {
      axios.post('/api/pelapor/chat/bupati/mark-read', { roomId });
    }
  }, [roomId, messages]);

  // Scroll ke bawah setiap kali pesan berubah
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      const res = await axios.post('/api/pelapor/chat/send-message', {
        roomId,
        content: message,
      });

      const newMsg = {
        ...res.data,
        fromMe: true,
        sender: {
          name: 'Saya (Pelapor)',
          role: 'PELAPOR',
        },
      };

      // Tambahkan ke lokal state SWR agar langsung muncul
      mutate((prev = []) => [...prev, newMsg], false);

      setMessage('');

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    } catch (err) {
      'Gagal mengirim pesan:', err;
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pt-24">
      <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
        Chat dengan Bupati
      </h1>

      <Card className="h-[60vh] overflow-hidden flex flex-col bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="p-4 bg-green-600 text-white">
          <h2 className="font-semibold">Bupati</h2>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{
            backgroundColor: '#e5ded8',
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' ... svg pattern ...%3E\")",
            backgroundSize: '300px',
          }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="lg" color="success" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                Belum ada pesan. Mulai percakapan dengan Bupati!
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <MessageBubble
                    key={msg.id || index}
                    message={msg}
                    isConsecutive={
                      index > 0 && messages[index - 1].fromMe === msg.fromMe
                    }
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="Tulis pesan..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[50px] max-h-[150px] resize-none flex-1"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              color="success"
              pill
              className="h-[50px] w-[50px] p-0 flex items-center justify-center"
            >
              {sending ? (
                <Spinner size="sm" light />
              ) : (
                <HiOutlinePaperAirplane className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
