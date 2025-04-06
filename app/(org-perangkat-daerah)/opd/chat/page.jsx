'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Card, Textarea, Button } from 'flowbite-react';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import clsx from 'clsx';

export default function ChatOpdPage() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) fetchMessages(selectedRoom.id);
  }, [selectedRoom]);

  const fetchRooms = async () => {
    const res = await axios.get('/api/opd/chat/rooms');
    setRooms(res.data);
    if (res.data.length > 0) setSelectedRoom(res.data[0]);
  };

  const fetchMessages = async (roomId) => {
    const res = await axios.get(`/api/opd/chat/rooms/${roomId}/messages`);
    setMessages(res.data);
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }),
      100,
    );
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedRoom) return;
    setSending(true);
    try {
      const res = await axios.post('/api/opd/chat/send-message', {
        roomId: selectedRoom.id,
        content: message,
      });
      setMessages((prev) => [...prev, { ...res.data, fromMe: true }]);
      setMessage('');
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }),
        100,
      );
    } catch (err) {
      console.error('Gagal kirim pesan:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-24 px-4 max-w-6xl mx-auto">
      {/* Daftar Pelapor */}
      <div className="col-span-1">
        <Card className="h-[75vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Daftar Pelapor</h2>
          {rooms.map((room) => {
            const lastMsg = room.messages?.[0];
            const lastTime = lastMsg?.createdAt
              ? new Date(lastMsg.createdAt).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';
            return (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className="p-2 cursor-pointer hover:bg-gray-100 rounded"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{room.user.name}</p>
                  <p className="text-xs text-gray-400">{lastTime}</p>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {lastMsg?.content || 'Belum ada pesan'}
                </p>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Chat Box */}
      <div className="col-span-2">
        <Card className="h-[75vh] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 p-3">
            {messages.map((msg) => {
              const isMe = msg.fromMe;
              return (
                <div
                  key={msg.id}
                  className={clsx(
                    'max-w-sm px-4 py-2 rounded text-sm shadow',
                    isMe
                      ? 'ml-auto bg-green-600 text-white'
                      : 'mr-auto bg-gray-100 text-gray-800',
                  )}
                >
                  {!isMe && (
                    <p className="text-xs text-gray-500 mb-1 font-semibold">
                      Dari: {selectedRoom?.user.name}
                    </p>
                  )}
                  {msg.content}
                  <p className="text-[10px] text-gray-300 mt-1 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
          <div className="mt-4 flex gap-2 px-2 pb-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={1}
              className="flex-1"
              placeholder="Tulis pesan..."
            />
            <Button onClick={handleSend} disabled={sending}>
              <HiOutlinePaperAirplane className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
