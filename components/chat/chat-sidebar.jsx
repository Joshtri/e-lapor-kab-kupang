"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TextInput, Spinner } from "flowbite-react"
import { HiSearch } from "react-icons/hi"
import { cn } from "@/utils/cn"

export default function ChatSidebar({ rooms, selectedRoom, onSelectRoom, title }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const filteredRooms = rooms.filter((room) => {
    const name = room.user?.name || room.opd?.name || ""
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-green-600 text-white">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="p-3 border-b">
        <TextInput
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={HiSearch}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <Spinner size="md" />
            </div>
          ) : filteredRooms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 text-center text-gray-500"
            >
              No conversations found
            </motion.div>
          ) : (
            filteredRooms.map((room) => {
              const name = room.user?.name || room.opd?.name || "Unknown"
              const lastMessage = room.messages?.[0]
              const lastMessageTime = lastMessage?.createdAt
                ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : ""
              const isSelected = selectedRoom?.id === room.id
              const hasUnread = room.unreadCount > 0

              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileHover={{ backgroundColor: "rgba(236, 253, 245, 0.4)" }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onSelectRoom(room)}
                  className={cn(
                    "p-3 cursor-pointer border-b",
                    isSelected ? "bg-green-50" : "",
                    hasUnread ? "font-medium" : "",
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{name}</p>
                      <p className="text-sm text-gray-500 truncate mt-1">{lastMessage?.content || "No messages yet"}</p>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      {lastMessageTime && <span className="text-xs text-gray-500">{lastMessageTime}</span>}
                      {hasUnread && (
                        <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center mt-1">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

