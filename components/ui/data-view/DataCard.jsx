'use client';

import { Card, Avatar, Badge } from 'flowbite-react';

export default function DataCard({
  avatar = '',
  title = '',
  subtitle = '',
  meta = '',
  badges = [],
  onClick,
  className = '',

  highlight = false,
}) {
  return (
    <Card
      onClick={onClick}
      className={`p-5 rounded-xl shadow-lg transition hover:shadow-xl hover:scale-[1.02]
        ${highlight ? 'bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400' : 'bg-white dark:bg-gray-900'}
      `}
    >
      {/* Header: Avatar + Meta */}
      <div className="flex items-center gap-3">
        {avatar && (
          <Avatar
            img={`https://ui-avatars.com/api/?name=${avatar}&background=random`}
            rounded
            size="sm"
          />
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {avatar || 'Anonim'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{meta}</p>
        </div>
      </div>

      {/* Title & Subtitle */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>

      {/* Badges */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {badges.map((badge, idx) => (
          <Badge
            key={idx}
            color={badge.color || 'gray'}
            className="text-xs font-semibold px-3 py-1"
          >
            {badge.label}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
