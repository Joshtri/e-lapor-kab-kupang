"use client"

import { useRef, useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Textarea, Button, Spinner } from "flowbite-react"
import { HiOutlinePaperAirplane, HiArrowLeft } from "react-icons/hi"
import MessageBubble from "./message-bubble"

export default function ChatWindow({ room, messages, loading, sending, onSendMessage, onBack, emptyStateMessage }) {
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = () => {
    if (!message.trim()) return
    onSendMessage(message)
    setMessage("")

    // Focus back on textarea after sending
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 0)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>{emptyStateMessage}</p>
      </div>
    )
  }

  const name = room.user?.name || room.opd?.name || "Chat"

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-green-600 text-white flex items-center">
        <Button
          color="gray"
          pill
          size="sm"
          onClick={onBack}
          className="mr-2 md:hidden bg-green-700 hover:bg-green-800 text-white"
        >
          <HiArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="font-semibold">{name}</h2>
          {room.isOnline && <p className="text-xs text-green-100">Online</p>}
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={{
          backgroundColor: "#e5ded8",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E\")",
          backgroundSize: "300px",
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="lg" color="success" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 bg-white p-3 rounded-lg shadow-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id || index}
                  message={msg}
                  isConsecutive={index > 0 && messages[index - 1].fromMe === msg.fromMe}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Type a message..."
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
            {sending ? <Spinner size="sm" light /> : <HiOutlinePaperAirplane className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

