'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from 'flowbite-react';
import { cn } from '@/utils/cn';
import ChatSidebar from './chat-sidebar';
import ChatWindow from './chat-window';

export default function ChatLayout({
  title,
  fetchRooms,
  fetchMessages,
  sendMessage,
  markAsRead,
  emptyStateMessage = 'Select a conversation to start chatting',
  sidebarTitle = 'Conversations',
}) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
      if (markAsRead) markAsRead(selectedRoom.id);
    }
  }, [selectedRoom]);

  const loadRooms = async () => {
    try {
      const data = await fetchRooms();
      setRooms(data);
      if (data.length > 0 && !selectedRoom) {
        setSelectedRoom(data[0]);
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  };

  const loadMessages = async (roomId) => {
    setLoading(true);
    try {
      const data = await fetchMessages(roomId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || !selectedRoom) return;

    setSending(true);
    try {
      const newMessage = await sendMessage(selectedRoom.id, content);

      // Add the new message to the messages list
      setMessages((prev) => [...prev, { ...newMessage, fromMe: true }]);

      // Update the room's last message in the sidebar
      setRooms((prev) =>
        prev.map((room) =>
          room.id === selectedRoom.id
            ? {
                ...room,
                messages: [
                  { content, createdAt: new Date().toISOString() },
                  ...(room.messages || []),
                ],
              }
            : room,
        ),
      );
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-0 h-[85vh] max-w-7xl mx-auto overflow-hidden"
    >
      <div
        className={cn('md:col-span-1', selectedRoom ? 'hidden md:block' : '')}
      >
        <Card className="h-full rounded-none md:rounded-l-lg">
          <ChatSidebar
            rooms={rooms}
            selectedRoom={selectedRoom}
            onSelectRoom={handleSelectRoom}
            title={sidebarTitle}
          />
        </Card>
      </div>

      <div
        className={cn(
          'md:col-span-3 flex flex-col',
          selectedRoom ? '' : 'hidden md:flex',
        )}
      >
        <Card className="h-full rounded-none md:rounded-r-lg">
          <ChatWindow
            room={selectedRoom}
            messages={messages}
            loading={loading}
            sending={sending}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedRoom(null)}
            emptyStateMessage={emptyStateMessage}
          />
        </Card>
      </div>
    </motion.div>
  );
}
