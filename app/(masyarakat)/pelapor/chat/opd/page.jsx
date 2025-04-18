'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, Spinner, Textarea, Button, Modal, Select } from 'flowbite-react';
import axios from 'axios';
import clsx from 'clsx';
import {
  HiOutlinePaperAirplane,
  HiArrowLeft,
  HiSearch,
  HiPlus,
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from '@/components/chat/message-bubble';

export default function ChatOpdPage() {
  const [rooms, setRooms] = useState([]);
  const [allOpds, setAllOpds] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedOpd, setSelectedOpd] = useState('');
  const [creatingChat, setCreatingChat] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Fetch all OPDs and existing chat rooms
  useEffect(() => {
    fetchOpds();
    fetchRooms();
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchOpds = async () => {
    try {
      const res = await axios.get('/api/opd');
      setAllOpds(res.data);
    } catch (err) {
      console.error('Gagal mengambil daftar OPD:', err);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get('/api/pelapor/chat/rooms');
      const opdRooms = res.data.filter((r) => r.opdId); // hanya yang ke OPD
      setRooms(opdRooms);
    } catch (err) {
      console.error('Gagal mengambil daftar chat:', err);
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

      // Focus back on textarea after sending
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    } catch (err) {
      console.error('Gagal kirim pesan:', err);
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

  const handleCreateNewChat = async () => {
    if (!selectedOpd) return;
    setCreatingChat(true);
    try {
      // Check if room already exists
      const existingRoom = rooms.find((r) => r.opdId === Number(selectedOpd));

      if (existingRoom) {
        handleRoomSelect(existingRoom);
        setShowNewChatModal(false);
        return;
      }

      // Create new room
      const res = await axios.post('/api/pelapor/chat/create-room', {
        opdId: Number(selectedOpd),
      });

      // Add to rooms list and select it
      const newRoom = res.data;
      setRooms((prev) => [newRoom, ...prev]);
      handleRoomSelect(newRoom);
      setShowNewChatModal(false);
    } catch (err) {
      console.error('Gagal membuat chat baru:', err);
    } finally {
      setCreatingChat(false);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const name = room.opd?.name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const availableOpds = allOpds.filter(
    (opd) => !rooms.some((room) => room.opdId === opd.id),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-0 pt-24 px-4 max-w-7xl mx-auto h-[85vh]">
      {/* Sidebar Kontak */}
      <div
        className={clsx('md:col-span-1', selectedRoom ? 'hidden md:block' : '')}
      >
        <Card className="h-full rounded-none md:rounded-l-lg">
          <div className="flex flex-col h-full">
            <div className="p-4 bg-green-600 text-white flex justify-between items-center">
              <h2 className="text-lg font-semibold">Kontak OPD</h2>
              <Button
                color="light"
                size="xs"
                pill
                onClick={() => setShowNewChatModal(true)}
                className="bg-green-700 hover:bg-green-800 text-white"
              >
                <HiPlus className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-3 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari OPD..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <HiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {filteredRooms.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 text-center text-gray-500"
                  >
                    {rooms.length === 0 ? (
                      <div>
                        <p>Belum ada chat dengan OPD</p>
                        <Button
                          color="success"
                          size="sm"
                          className="mt-2"
                          onClick={() => setShowNewChatModal(true)}
                        >
                          Mulai Chat Baru
                        </Button>
                      </div>
                    ) : (
                      'Tidak ditemukan OPD yang sesuai'
                    )}
                  </motion.div>
                ) : (
                  filteredRooms.map((room) => {
                    const isSelected = selectedRoom?.id === room.id;

                    return (
                      <motion.div
                        key={room.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{
                          backgroundColor: 'rgba(236, 253, 245, 0.4)',
                        }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleRoomSelect(room)}
                        className={clsx(
                          'p-3 cursor-pointer border-b',
                          isSelected ? 'bg-green-50 dark:bg-green-900/20' : '',
                        )}
                      >
                        <p className="font-medium">{room.opd?.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {room.messages?.[0]?.content?.slice(0, 40) ||
                            'Belum ada pesan'}
                        </p>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </div>

      {/* Chat Box */}
      <div
        className={clsx('md:col-span-3', selectedRoom ? '' : 'hidden md:block')}
      >
        <Card className="h-full rounded-none md:rounded-r-lg">
          {selectedRoom ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 bg-green-600 text-white flex items-center">
                <Button
                  color="gray"
                  pill
                  size="sm"
                  onClick={() => setSelectedRoom(null)}
                  className="mr-2 md:hidden bg-green-700 hover:bg-green-800 text-white"
                >
                  <HiArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="font-semibold">
                    Chat dengan {selectedRoom.opd?.name}
                  </h2>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4"
                style={{
                  backgroundColor: '#e5ded8',
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E\")",
                  backgroundSize: '300px',
                }}
              >
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner size="lg" color="success" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-center text-gray-500 bg-white p-3 rounded-lg shadow-sm">
                      Mulai percakapan dengan {selectedRoom.opd?.name}!
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
                            index > 0 &&
                            messages[index - 1].fromMe === msg.fromMe
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
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <p className="mb-4">Pilih OPD untuk memulai percakapan</p>
              <Button
                color="success"
                onClick={() => setShowNewChatModal(true)}
                className="flex items-center gap-2"
              >
                <HiPlus className="h-4 w-4" />
                Mulai Chat Baru
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Modal untuk memulai chat baru */}
      <Modal
        show={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        size="md"
      >
        <Modal.Header>Mulai Chat Baru</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p>Pilih OPD yang ingin Anda hubungi:</p>
            <Select
              value={selectedOpd}
              onChange={(e) => setSelectedOpd(e.target.value)}
              required
            >
              <option value="">-- Pilih OPD --</option>
              {allOpds.map((opd) => (
                <option key={opd.id} value={opd.id}>
                  {opd.name}
                </option>
              ))}
            </Select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="gray"
            onClick={() => setShowNewChatModal(false)}
            disabled={creatingChat}
          >
            Batal
          </Button>
          <Button
            color="success"
            onClick={handleCreateNewChat}
            disabled={!selectedOpd || creatingChat}
          >
            {creatingChat ? <Spinner size="sm" /> : 'Mulai Chat'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
