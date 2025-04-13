'use client';

export default function CornerDot({ color = 'blue', animate = false }) {
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500',
  };

  return (
    <div
      className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${
        colorMap[color] || colorMap.blue
      } ${animate ? 'twinkle-dot' : ''}`}
    />
  );
}
