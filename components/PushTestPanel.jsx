'use client';

import { useState } from 'react';
import {
  registerAndSubscribe,
  sendWebPush,
  notificationUnsupported,
  checkPermissionStateAndAct,
} from '@/app/Push';

export default function PushPanel({ userId }) {
  const [message, setMessage] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    await registerAndSubscribe(() => {}, 4); // ⬅ userId dikirim sebagai argumen
    setSubscribed(true);
  };

  const handleSend = async () => {
    await sendWebPush(message, userId);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleSubscribe}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {subscribed ? 'Subscribed!' : 'Subscribe to Notification'}
      </button>
      <input
        className="border px-3 py-2 w-full"
        placeholder="Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Send Notification
      </button>
    </div>
  );
}
