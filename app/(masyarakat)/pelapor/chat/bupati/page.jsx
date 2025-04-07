'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Card, Textarea, Button, Spinner } from 'flowbite-react';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import { AnimatePresence } from 'framer-motion';
import MessageBubble from '@/components/chat/message-bubble';

export default function ChatBupatiPage() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const [roomId, setRoomId] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    initRoom();
  }, []);

  useEffect(() => {
    if (roomId) fetchMessages();
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      console.error('Gagal inisialisasi room:', err);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/pelapor/chat/rooms/${roomId}/messages`);
      setMessages(res.data);

      // ✅ Setelah pesan berhasil dimuat, tandai sebagai read
      await axios.post('/api/pelapor/chat/bupati/mark-read', {
        roomId,
      });
    } catch (error) {
      console.error('Gagal memuat pesan:', error);
    } finally {
      setLoading(false);
    }
  };

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
        fromMe: true, // tandai sebagai pesan dari user
        sender: {
          name: 'Saya (Pelapor)',
          role: 'PELAPOR',
        },
      };

      setMessages((prev) => [...prev, newMsg]);
      setMessage('');

      // Focus back on textarea after sending
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    } catch (error) {
      console.error('Gagal mengirim pesan:', error);
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
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E\")",
            backgroundSize: '300px',
          }}
        >
          {loading ? (
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
