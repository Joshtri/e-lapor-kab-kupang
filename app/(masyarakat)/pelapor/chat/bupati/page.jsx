'use client';

import { useEffect, useState, useRef } from 'react';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import { Button, Card, Spinner, Textarea } from 'flowbite-react';
import axios from 'axios';
import clsx from 'clsx';

const ChatBupatiPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const [roomId, setRoomId] = useState(null);

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
    } catch (error) {
      console.error('Gagal mengirim pesan:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pt-24">
      <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
        Chat dengan Bupati
      </h1>

      <Card className="h-[60vh] overflow-y-auto flex flex-col space-y-4 p-4 bg-white dark:bg-gray-800">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Belum ada pesan
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                'flex flex-col max-w-sm w-fit',
                msg.fromMe ? 'ml-auto items-end' : 'mr-auto items-start',
              )}
            >
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {msg.fromMe ? 'Saya (Pelapor)' : msg.sender?.name || 'Bupati'}
              </span>
              <div
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm shadow-md',
                  msg.fromMe
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
                )}
              >
                {msg.content}
              </div>
              <span className="text-[11px] text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </Card>

      <div className="mt-4 flex gap-2">
        <Textarea
          placeholder="Tulis pesan..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
        />
        <Button onClick={handleSend} disabled={sending || !message.trim()}>
          <HiOutlinePaperAirplane className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatBupatiPage;
