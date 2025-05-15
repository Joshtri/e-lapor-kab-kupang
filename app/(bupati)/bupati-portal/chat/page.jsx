'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Card, Textarea, Button, Spinner } from 'flowbite-react';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import clsx from 'clsx';
import useSWR from 'swr';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function ChatBupatiPage() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Fetch daftar rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('/api/bupati/chat/rooms');
        setRooms(res.data);
        if (res.data.length > 0) {
          setSelectedRoom(res.data[0]);
        }
      } catch (err) {
        'Gagal memuat daftar chat:', err;
      }
    };

    fetchRooms();
  }, []);

  // Fetch messages pakai SWR
  const {
    data: messages = [],
    isLoading,
    mutate,
  } = useSWR(
    selectedRoom ? `/api/pelapor/chat/rooms/${selectedRoom.id}/messages` : null,
    fetcher,
    {
      refreshInterval: 5000, // optional: fetch ulang setiap 5 detik
    },
  );

  // Scroll ke bawah setiap pesan update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read saat buka room
  const handleSelectRoom = async (room) => {
    setSelectedRoom(room);
    await axios.post('/api/bupati/chat/mark-read', { roomId: room.id });
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedRoom) return;
    setSending(true);
    try {
      const res = await axios.post('/api/bupati/chat/send-message', {
        roomId: selectedRoom.id,
        content: message,
      });

      setMessage('');
      mutate(); // fetch ulang pesan dari server
    } catch (err) {
      'Gagal kirim pesan:', err;
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-24 px-4 max-w-6xl mx-auto">
      {/* Kontak Pelapor */}
      <div className="col-span-1">
        <Card className="h-[75vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Daftar Pelapor</h2>
          {rooms.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada chat masuk.</p>
          ) : (
            <ul className="space-y-2">
              {rooms.map((room) => {
                const lastMsg = room.messages?.[0];
                return (
                  <li
                    key={room.id}
                    onClick={() => handleSelectRoom(room)}
                    className={clsx(
                      'p-2 rounded cursor-pointer hover:bg-green-100 dark:hover:bg-green-900',
                      selectedRoom?.id === room.id &&
                        'bg-green-200 dark:bg-green-800',
                    )}
                  >
                    <p className="font-medium">{room.user.name}</p>
                    <p className="text-xs text-gray-500">
                      {lastMsg
                        ? lastMsg.content.slice(0, 40)
                        : 'Belum ada pesan'}
                    </p>
                  </li>
                );
              })}
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
                Chat dengan{' '}
                <span className="text-green-600">{selectedRoom.user.name}</span>
              </h2>

              <div className="flex-1 overflow-y-auto space-y-3 p-2">
                {isLoading ? (
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
                          'ml-auto bg-green-600 text-white':
                            msg.sender?.role === 'BUPATI', // tampilkan kanan jika dari Bupati
                          'mr-auto bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white':
                            msg.sender?.role !== 'BUPATI', // tampilkan kiri jika bukan dari Bupati
                        },
                      )}
                    >
                      <p className="mb-1">{msg.content}</p>
                      <span className="text-[10px] text-gray-500 block text-right">
                        {new Date(msg.createdAt).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
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
              Pilih pelapor untuk memulai percakapan.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
