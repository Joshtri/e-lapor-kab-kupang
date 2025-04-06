'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, Spinner, Textarea, Button } from 'flowbite-react';
import axios from 'axios';
import clsx from 'clsx';
import { HiOutlinePaperAirplane } from 'react-icons/hi';

export default function ChatOpdPage() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Ambil semua room OPD
  useEffect(() => {
    fetchRooms();
  }, []);

  // Scroll otomatis saat messages berubah
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('/api/pelapor/chat/rooms');
      const opdRooms = res.data.filter((r) => r.opdId); // hanya yang ke OPD
      setRooms(opdRooms);
    } catch (err) {
      console.error('Gagal mengambil daftar OPD:', err);
    }
  };

  const fetchMessages = async (roomId) => {
    setLoadingMessages(true);
    try {
      const res = await axios.get(`/api/pelapor/chat/rooms/${roomId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error('Gagal mengambil pesan:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    fetchMessages(room.id);
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedRoom) return;
    setSending(true);
    try {
      const res = await axios.post('/api/pelapor/chat/send-message', {
        roomId: selectedRoom.id,
        content: message,
      });
      setMessages((prev) => [...prev, { ...res.data, fromMe: true }]);
      setMessage('');
    } catch (err) {
      console.error('Gagal kirim pesan:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-24 px-4 max-w-6xl mx-auto">
      {/* Sidebar Kontak */}
      <div className="col-span-1">
        <Card className="h-[75vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Kontak OPD</h2>
          {rooms.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada kontak OPD</p>
          ) : (
            <ul className="space-y-2">
              {rooms.map((room) => (
                <li
                  key={room.id}
                  className={clsx(
                    'p-2 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900',
                    selectedRoom?.id === room.id &&
                      'bg-blue-200 dark:bg-blue-800',
                  )}
                  onClick={() => handleRoomSelect(room)}
                >
                  <p className="font-medium">{room.opd?.name}</p>
                  <p className="text-xs text-gray-500">
                    {room.messages?.[0]?.content?.slice(0, 40) ||
                      'Belum ada pesan'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Chat Box */}
      <div className="col-span-2">
        <Card className="h-[75vh] flex flex-col">
          {selectedRoom ? (
            <>
              <h2 className="text-lg font-semibold mb-4">
                Chat dengan {selectedRoom.opd?.name}
              </h2>

              <div className="flex-1 overflow-y-auto space-y-3 p-2">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-gray-500">Belum ada pesan</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={clsx(
                        'max-w-sm px-4 py-2 rounded-lg text-sm shadow w-fit',
                        {
                          'ml-auto bg-blue-600 text-white': msg.fromMe,
                          'mr-auto bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white':
                            !msg.fromMe,
                        },
                      )}
                    >
                      <p className="mb-1">{msg.content}</p>
                      <span className="text-[10px] text-gray-500 block text-right">
                        {new Date(msg.createdAt).toLocaleTimeString('id-ID')}
                      </span>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              <div className="mt-4 flex gap-2">
                <Textarea
                  placeholder="Tulis pesan..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={1}
                  className="flex-1"
                  onKeyDown={(e) =>
                    e.key === 'Enter' && !e.shiftKey && handleSend()
                  }
                />
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || sending}
                >
                  <HiOutlinePaperAirplane className="w-5 h-5" />
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 my-auto">
              Pilih OPD untuk memulai percakapan.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
