'use client';

import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';
import clsx from 'clsx';

export default function MessageBubble({ message, isConsecutive = false }) {
  const isFromMe = message.fromMe;
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        'flex',
        isFromMe ? 'justify-end' : 'justify-start',
        isConsecutive ? 'mt-1' : 'mt-3',
      )}
    >
      <div
        className={clsx(
          'max-w-[80%] md:max-w-[70%] px-3 py-2 rounded-lg relative group',
          isFromMe
            ? 'bg-green-500 text-white mr-2'
            : 'bg-white text-gray-800 ml-2',
          !isConsecutive && (isFromMe ? 'rounded-tr-none' : 'rounded-tl-none'),
        )}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {/* Time and status */}
        <div
          className={clsx(
            'flex items-center text-[10px] mt-1',
            isFromMe
              ? 'justify-end text-green-100'
              : 'justify-end text-gray-500',
          )}
        >
          <span>{timestamp}</span>

          {isFromMe && (
            <span className="ml-1">
              <HiCheck className="h-3 w-3" />
            </span>
          )}
        </div>

        {/* Chat bubble tail */}
        {!isConsecutive && (
          <div
            className={clsx(
              'absolute top-0 w-3 h-3 overflow-hidden',
              isFromMe ? 'right-[-6px] bg-green-500' : 'left-[-6px] bg-white',
            )}
            style={{
              clipPath: isFromMe
                ? 'polygon(0 0, 0% 100%, 100% 0)'
                : 'polygon(0 0, 100% 0, 100% 100%)',
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
